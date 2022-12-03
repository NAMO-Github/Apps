import { Colors } from '@namo-workspace/themes';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface Props extends ViewProps {
  tabs: { key: string; title: string }[];
  activeIndex: number;
  onChangeActiveTab: (index: number) => void;
  animatedIndex?: Animated.AnimatedInterpolation;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

const ScrollTabBar: FC<Props> = ({
  tabs,
  activeIndex,
  onChangeActiveTab,
  animatedIndex,
  style,
}) => {
  const tabItemWidth = useRef({});
  const scrollRef = useRef<ScrollView>(null);
  const scrollViewWidth = useRef(0);
  const currentScrollPosition = useRef(0);
  const [tabItemsWidthState, setTabItemsWidthState] = useState<{
    [key: string]: number;
  }>({});
  const [indicator, setIndicator] = useState({
    indicatorWidth: 0,
    indicatorTranslate: 0,
  });

  const animatedTranslate = useRef(
    new Animated.Value(indicator.indicatorTranslate || 0)
  ).current;

  const scrollIfNeeded = useCallback(() => {
    const x =
      indicator.indicatorTranslate -
      (scrollViewWidth.current - indicator.indicatorWidth) / 2;
    scrollRef?.current?.scrollTo({ x });
  }, [indicator]);
  useEffect(() => {
    scrollIfNeeded();
  }, [scrollIfNeeded]);
  useEffect(() => {
    if (tabs[activeIndex]) {
      const { key } = tabs[activeIndex];
      const translate = tabs
        .slice(0, activeIndex)
        .reduce((acc, item) => acc + tabItemsWidthState[item.key] || 0, 0);
      if (tabItemsWidthState[key]) {
        setIndicator({
          indicatorWidth: 30,
          indicatorTranslate:
            translate + (Math.round(tabItemsWidthState[key]) - 30) / 2,
        });
      }
    }
  }, [activeIndex, tabItemsWidthState, tabs]);

  const animatedTranslation = useMemo(() => {
    const input = tabs.map((_, i) => i);
    const output = tabs.reduce((acc, item, index) => {
      const prev = tabs
        .slice(0, index)
        .reduce((ccc, i) => ccc + tabItemsWidthState[i.key] || 0, 0);
      return [
        ...acc,
        prev + (Math.round(tabItemsWidthState[item.key]) - 30) / 2 || 0,
      ];
    }, []);
    return animatedIndex?.interpolate({
      inputRange: input,
      outputRange: output,
    });
  }, [animatedIndex, tabItemsWidthState, tabs]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedTranslate, {
        toValue: indicator.indicatorTranslate,
        useNativeDriver: false,
        duration: 150,
        easing: Easing.in(Easing.linear),
      }),
    ]).start();
  }, [animatedTranslate, indicator]);
  return (
    <Animated.View style={[scrollStyle.tab, style]}>
      <ScrollView
        style={{ height: 50 }}
        horizontal={true}
        ref={scrollRef}
        onLayout={(e) => {
          scrollViewWidth.current = e.nativeEvent.layout.width;
        }}
        onScroll={(e) => {
          currentScrollPosition.current = e.nativeEvent.contentOffset.x;
        }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {tabs.map((i, index) => {
          const colorStyle = animatedIndex
            ? {
                opacity: animatedIndex.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: 'clamp',
                }),
                color: Colors.textLevel1,
              }
            : {
                color:
                  activeIndex === index ? Colors.textLevel1 : Colors.textLevel3,
              };
          return (
            <TouchableOpacity
              key={i.key}
              onPress={() => onChangeActiveTab(index)}
            >
              <View
                onLayout={(e) => {
                  // @ts-ignore
                  tabItemWidth.current[i.key] = e.nativeEvent.layout.width;
                  // @ts-ignore
                  if (
                    tabs.every(
                      // @ts-ignore
                      ({ key }) => typeof tabItemWidth.current[key] === 'number'
                    )
                  ) {
                    // only set state of tab width when all of measurement is complete
                    setTabItemsWidthState({ ...tabItemWidth.current });
                  }
                }}
                style={scrollStyle.labelWrapper}
              >
                <AnimatedText style={[colorStyle]}>{i.title}</AnimatedText>
              </View>
            </TouchableOpacity>
          );
        })}
        <Animated.View
          style={[
            scrollStyle.indicator,
            {
              width: 30,
              transform: [
                {
                  translateX: animatedIndex
                    ? animatedTranslation
                    : animatedTranslate,
                },
              ],
            },
          ]}
        />
      </ScrollView>
    </Animated.View>
  );
};

const scrollStyle = StyleSheet.create({
  tab: { height: 50 },
  label: {
    color: '#fff',
  },
  labelWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    borderBottomColor: Colors.secondary,
    borderBottomWidth: 3,
  },
});

export default ScrollTabBar;

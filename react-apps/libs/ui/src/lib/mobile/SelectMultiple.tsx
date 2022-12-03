import { Popover } from 'react-native-popper';
import React, { ReactElement, useCallback, useState, forwardRef } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import Images from '../../assets/images';
import { Colors } from '@namo-workspace/themes';
import View from './view/View';
import { Body2 } from './Typography';

const { IcDropDown, IcCheck } = Images;

interface Props<OptionType> {
  placeholder?: string;
  type?: 'full' | 'auto';
  options: OptionType[];
  value: OptionType[];
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  dropdownIcon?: ReactElement;
  disabled?: boolean;
  closeOnSelect?: boolean;
  label?: string;
  isRequired?: boolean;

  onChange(option: OptionType[]): void;
  getLabel?(option: OptionType): string | number;
  getValue?(option: OptionType): string | number;
}
interface TriggerProps<OptionType> {
  type?: 'full' | 'auto';
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  dropdownIcon?: ReactElement;
  disabled?: boolean;
  label?: string;
  isRequired?: boolean;
  value: OptionType[];
  focused?: boolean;
  onLayout?: (e: any) => void;
  getLabel?(option: OptionType): string | number;
}

const Trigger = forwardRef<TouchableOpacity, TriggerProps<any>>(
  (
    {
      type = 'auto',
      placeholder = 'Select an option',
      style,
      labelStyle,
      dropdownIcon,
      disabled,
      label = '',
      isRequired,
      value,
      focused = false,

      onLayout = (e: any) => {},
      getLabel = (v: any) => v.map((ele: any) => ele.label).join(', '),
      ...rest
    },
    ref
  ) => {
    return (
      <View>
        {!!label && (
          <WrapLabel>
            <LabelTitle fontWeight="600">{label}</LabelTitle>
            {!!isRequired && <Require> *</Require>}
          </WrapLabel>
        )}
        <TriggerElement
          ref={ref}
          $type={type}
          style={style}
          $focused={focused}
          disabled={disabled}
          onLayout={onLayout}
          {...rest}
        >
          <Label style={labelStyle} numberOfLines={1}>
            {getLabel(value) ? getLabel(value) : placeholder}
          </Label>
          {dropdownIcon ?? <IcDropDown />}
        </TriggerElement>
      </View>
    );
  }
);

function SelectMultiple<OptionsType = any>({
  type = 'auto',
  options,
  onChange,
  value,
  placeholder = 'Select an option',
  getLabel = (v: any) => v.label,
  getValue = (v: any) => v.value,
  style,
  labelStyle,
  dropdownIcon,
  disabled,
  closeOnSelect = true,
  label = '',
  isRequired = false,
}: Props<OptionsType>) {
  const [focused, setFocused] = useState(false);
  const [menuWidth, setMenuWidth] = useState(150);

  const renderItem = useCallback<ListRenderItem<OptionsType>>(
    ({ item, index }) => {
      const isCheck = value.some(
        (ele: any) => getValue(item) === getValue(ele)
      );
      const handleChooseItem = () => {
        if (value.filter((ele: any) => ele.value === item.value).length > 0) {
          onChange(value.filter((ele: any) => ele.value !== item.value));
        } else {
          value.push(item);
          onChange(value);
        }
      };

      return (
        <OptionItem
          last={index === options.length - 1}
          onPress={handleChooseItem}
        >
          <OptionText fontWeight="600">{getLabel(item)}</OptionText>

          <View center style={{ width: 24 }}>
            {value && isCheck ? <IcCheck /> : null}
          </View>
        </OptionItem>
      );
    },
    [options.length, getLabel, value, getValue, onChange, closeOnSelect]
  );

  const keyExtractor = useCallback(
    (item: OptionsType, index: number) => String(index),
    []
  );

  return (
    <Popover
      animationExitDuration={0}
      onOpenChange={setFocused}
      isOpen={focused}
      shouldCloseOnOutsideClick={true}
      placement={'bottom right'}
      onRequestClose={() => setFocused(false)}
      trigger={
        <Trigger
          type={type}
          placeholder={placeholder}
          style={style}
          labelStyle={labelStyle}
          dropdownIcon={dropdownIcon}
          disabled={disabled}
          label={label}
          isRequired={isRequired}
          value={value}
          focused={focused}
          onLayout={(e: any) => {
            setMenuWidth(e.nativeEvent.layout.width);
          }}
        />
      }
    >
      <Popover.Backdrop />
      <Popover.Content>
        <View
          style={{
            maxHeight: 200,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.13)',
            marginTop: 5,
            borderRadius: 16,
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
          }}
        >
          <FlatList<OptionsType>
            bounces={false}
            style={{
              width: menuWidth,
            }}
            contentContainerStyle={{ backgroundColor: Colors.white }}
            data={options}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </View>
      </Popover.Content>
    </Popover>
  );
}

const WrapLabel = styled.View`
  flex-direction: row;
  text-align: center;
  margin-bottom: 4px;
`;

const LabelTitle = styled(Body2)``;

const Require = styled(Body2)`
  color: ${Colors.primaryRed};
  font-size: 16px;
`;

const TriggerElement = styled.TouchableOpacity<{
  $type: 'full' | 'auto';
  $focused: boolean;
}>`
  padding: 12px 15px;
  background-color: transparent; // TODO not in style guide;
  border-radius: 8px;
  min-height: 33px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${Colors.strokeLevel3};
  ${(props) =>
    props.$type === 'full'
      ? css`
          width: 100%;
        `
      : ''}
`;

const Label = styled(Body2)`
  color: ${Colors.textLevel1};
`;

const OptionItem = styled.TouchableOpacity<{ last: boolean }>`
  padding: 7px 10px;
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
    props.last
      ? css`
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        `
      : ''}
`;

const OptionText = styled(Body2)`
  color: ${Colors.strokeLevel1};
`;

export default SelectMultiple;

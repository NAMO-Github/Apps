import React, { FC, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import {
  buttonPrefixStyle,
  ButtonSize,
  ButtonColor,
  buttonStyle,
  buttonSuffixStyle,
  textButtonStyle,
} from '../shared/style/button.style';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { Colors } from '@namo-workspace/themes';

interface Props {
  loading?: boolean;
  prefix?: ReactElement;
  suffix?: ReactElement;
  size?: ButtonSize;
  color?: ButtonColor;
  full?: boolean;
}

const Button: FC<Props & TouchableOpacityProps> = ({
  children,
  loading,
  prefix,
  suffix,
  size = 'medium',
  color,
  full,
  style,
  ...other
}) => {
  const renderChild = (child: ReactNode, key?: number) =>
    typeof child === 'string' ? (
      <ButtonText key={String(key)} color={color}>
        {child}
      </ButtonText>
    ) : (
      child
    );

  return (
    <ButtonContainer
      size={size}
      color={color}
      style={[
        style,
        full && { width: '100%' },
        (other.disabled || loading) && {
          backgroundColor: color ?? Colors.primaryOrangeMinus5,
        },
        loading && {
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      disabled={other.disabled || loading}
      {...other}
      onPress={other.disabled || loading ? undefined : other.onPress}
    >
      {!loading && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          {!!prefix && <PrefixStyled>{prefix}</PrefixStyled>}
          {Array.isArray(children)
            ? children.map(renderChild)
            : renderChild(children)}
          {!!suffix && <SuffixStyled>{suffix}</SuffixStyled>}
        </View>
      )}

      {loading && (
        <ActivityIndicator
          style={styles.activityIndicator}
          color={'#fff'}
          size={'small'}
        />
      )}
    </ButtonContainer>
  );
};

const ButtonContainer = styled(TouchableOpacity)<{
  size?: ButtonSize;
  color?: ButtonColor;
}>`
  ${buttonStyle};
`;

const ButtonText = styled(Text)`
  ${textButtonStyle};
`;

const styles = StyleSheet.create({
  activityIndicator: {
    marginLeft: 12,
  },
});

const PrefixStyled = styled(View)`
  ${buttonPrefixStyle}
`;
const SuffixStyled = styled(View)`
  ${buttonSuffixStyle}
`;
export default Button;

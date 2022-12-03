/* eslint-disable @typescript-eslint/no-explicit-any */
import { Colors } from '@namo-workspace/themes';
import React, { forwardRef, ReactElement, useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Popover } from 'react-native-popper';
import styled, { css } from 'styled-components/native';
import Images from '../../assets/images';
import { Body2 } from './Typography';
import View from './view/View';

const { IcDropDown, IcCheck } = Images;

export interface SelectProps<OptionType> {
  placeholder?: string;
  type?: 'full' | 'auto';
  options: OptionType[];
  value: OptionType;
  error?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  dropdownIcon?: ReactElement;
  disabled?: boolean;
  closeOnSelect?: boolean;
  label?: string;
  isRequired?: boolean;
  disabledOptions: string[];

  onChange(option: OptionType): void;
  getLabel?(option: OptionType): string | number;
  getValue?(option: OptionType): string | number;
}
export interface TriggerProps<OptionType> {
  type?: 'full' | 'auto';
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  dropdownIcon?: ReactElement;
  disabled?: boolean;
  label?: string;
  isRequired?: boolean;
  value: OptionType;
  error?: string;
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
      error,
      focused = false,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onLayout = (e: any) => {
        // do nothing
      },
      getLabel = (v: any) => v?.label,
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
          // disabled={disabled}
          onLayout={onLayout}
          activeOpacity={1}
          {...rest}
        >
          <Label style={labelStyle}>
            {getLabel(value) ? getLabel(value) : placeholder}
          </Label>
          {dropdownIcon ?? <IcDropDown />}
        </TriggerElement>
        {!!error && <Error>{error}</Error>}
      </View>
    );
  }
);

function Select<OptionsType = any>({
  type = 'auto',
  options,
  onChange,
  value,
  error,
  placeholder = 'Select an option',
  getLabel = (v: any) => v?.label,
  getValue = (v: any) => v?.value,
  style,
  labelStyle,
  dropdownIcon,
  disabled,
  closeOnSelect = true,
  label = '',
  isRequired = false,
  disabledOptions = [],
}: SelectProps<OptionsType>) {
  const [focused, setFocused] = useState(false);
  const [menuWidth, setMenuWidth] = useState(150);

  const renderItem = useCallback<ListRenderItem<OptionsType>>(
    ({ item, index }) => {
      return disabledOptions.filter(Boolean).length < options.length &&
        !disabledOptions.includes(getValue(item).toString()) ? (
        <OptionItem
          last={index === options.length - 1}
          onPress={() => {
            onChange(item);
            if (closeOnSelect) {
              setFocused(false);
            }
          }}
        >
          <OptionText fontWeight="600">{getLabel(item)}</OptionText>

          <View center style={{ width: 24 }}>
            {value && getValue(item) === getValue(value) ? <IcCheck /> : null}
          </View>
        </OptionItem>
      ) : null;
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
          error={error}
          focused={focused}
          onLayout={(e: any) => {
            setMenuWidth(e.nativeEvent.layout.width);
          }}
        />
      }
    >
      <Popover.Backdrop />
      <Popover.Content>
        {disabledOptions.filter(Boolean).length < options.length && (
          <View
            style={{
              maxHeight: 225,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.13)',
              marginTop: 5,
              borderRadius: 8,
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
        )}
      </Popover.Content>
    </Popover>
  );
}

const WrapLabel = styled(View)`
  flex-direction: row;
  text-align: center;
  margin-bottom: 4px;
`;

const LabelTitle = styled(Body2)`
  font-weight: 600;
  font-style: normal;
  color: ${Colors.foreground1};
`;

const Require = styled(Body2)`
  color: ${Colors.primaryRed};
  font-weight: 600;
  font-size: 16px;
`;

const TriggerElement = styled(TouchableOpacity)<{
  $type: 'full' | 'auto';
  $focused: boolean;
}>`
  padding: 12px 15px;
  background-color: ${Colors.background};
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

const OptionItem = styled(TouchableOpacity)<{ last: boolean }>`
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

const Error = styled(Body2)`
  color: ${Colors.primaryRed};
  font-weight: 400;
`;

export default Select;

import { MenuRouter } from '@routes/routes.constants';
import React, { FC } from 'react';
import { Container, MenuItem, MenuText } from './Menu.style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuStackParams } from '@routes/routes.model';
import Images from '@images';

const { IcArrowRight } = Images;

const menuOptions = [
  { label: 'About Us', route: MenuRouter.ABOUT_US },
  { label: 'Terms & Conditions', route: MenuRouter.TERM_POLICY },
  { label: 'FAQ', route: MenuRouter.FAQ },
  { label: 'Help Centre', route: MenuRouter.HELP_CENTER },
];

export type MenuProp = NativeStackNavigationProp<MenuStackParams, 'MENU_STACK'>;

const Menu: FC = () => {
  const navigation = useNavigation<MenuProp>();
  return (
    <Container>
      {menuOptions.map((item, index) => {
        return (
          <MenuItem key={index} onPress={() => navigation.navigate(item.route)}>
            <MenuText fontWeight="600">{item.label}</MenuText>
            <IcArrowRight />
          </MenuItem>
        );
      })}
    </Container>
  );
};
export default Menu;

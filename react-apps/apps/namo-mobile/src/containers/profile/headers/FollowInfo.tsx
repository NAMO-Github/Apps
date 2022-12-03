import { useAuth } from '@context/auth';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import Popup from '@namo-workspace/ui/Popup';
import { Body3, Sub } from '@namo-workspace/ui/Typography';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTab, ProfileRouter } from '@routes/routes.constants';
import { ProfileStackParams } from '@routes/routes.model';
import React, {
  FC,
  useRef,
  // useRef
} from 'react';
import styled from 'styled-components/native';
// import ActionSheet from 'react-native-actions-sheet';
// import EditProfileContainer from '../EditProfile';

interface Props {
  buttonName: string;
  buttonColor?: 'main' | 'white';
  follower?: number;
  following?: number;
  isPublic?: boolean;
}

export type EditProfileProp = NativeStackNavigationProp<
  ProfileStackParams,
  'EDIT_PROFILE'
>;

const FollowInfo: FC<Props> = ({
  buttonName,
  buttonColor,
  follower,
  following,
  isPublic,
}) => {
  // const actionSheetRef = useRef(null);
  const navigation = useNavigation<EditProfileProp>();
  const popUpRef = useRef(null);
  const { isLoggedIn } = useAuth();
  const handleEdit = () => {
    if (isPublic) {
      if (isLoggedIn) {
        //doNothing, handle later
      } else {
        //doNothing, handle later
      }
    } else navigation.navigate(ProfileRouter.EDIT_PROFILE);
  };

  return (
    <Container pointerEvents="box-none">
      <FollowContainer pointerEvents="box-none">
        <Follower pointerEvents="box-none">
          <Count fontWeight="700">{follower || 0}</Count>
          <Text
            fontSize={10}
            fontWeight="400"
            fontStyle="normal"
            color={Colors.textLevel3}
          >
            Followers
          </Text>
        </Follower>
        <Following pointerEvents="box-none">
          <Count fontWeight="700">{following || 0}</Count>
          <Text
            fontSize={10}
            fontWeight="400"
            fontStyle="normal"
            color={Colors.textLevel3}
          >
            Following
          </Text>
        </Following>
      </FollowContainer>
      <Button color={buttonColor} disabled={false} onPress={handleEdit}>
        {buttonName}
      </Button>
      <Popup
        ref={popUpRef}
        title={'Connect Wallet'}
        description={
          'You have not connected your MetaMask wallet. Please connect to proceed.'
        }
        buttonCancel={'Cancel'}
        buttonHandle={'Continue'}
        handleFunction={() =>
          navigation.navigate(MainTab.PROFILE_STACK, {
            screen: ProfileRouter.PROFILE,
          })
        }
      />
    </Container>
  );
};
export default FollowInfo;

const Container = styled.View`
  flex: 1;
  margin-top: 24px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
`;
const FollowContainer = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

const Follower = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-right-width: 1px;
  border-right-color: ${Colors.strokeLevel3};
`;

const Following = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Count = styled(Body3)`
  align-items: center;
  justify-content: center;
  color: ${Colors.textLevel2};
`;

const Text = styled(Sub)``;

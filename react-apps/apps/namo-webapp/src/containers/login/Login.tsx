import { ReactComponent as Metamask } from '@assets/images/common/ic-metamask.svg';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/auth';
import { useWalletAuth } from '@context/wallet-auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import useTypeLocation from '@hooks/useTypeLocation';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

type LocationType = {
  from?: string;
};
export default function Login() {
  const { connect, isLoading } = useWalletAuth();
  const { login } = useAuth();
  const isMobile = useMediaQuery(QUERY.ONLY_MOBILE);
  const navigate = useNavigate();
  const { state } = useTypeLocation<LocationType>();

  const handleConnect = async () => {
    if (connect) {
      try {
        const address = await connect();
        if (state?.from) {
          await login(address, false, () => {
            if (state.from) navigate(state.from);
          });
        } else {
          navigate(ROUTES.PROFILE, {
            state: {
              from: ROUTES.LOGIN,
            },
          });
        }
      } catch (error) {
        // do nothing
      }
    }
  };

  return (
    <LoginContainerS>
      <Metamask width={isMobile ? 80 : 180} height={isMobile ? 80 : 180} />
      <TitleS>Connect with wallet</TitleS>
      <DescriptionS>
        Your crypto wallet securely stores your digital goods and
        cryptocurrencies.
        <br />
        Connect to one of your accounts or create a new one.
      </DescriptionS>
      <ButtonS size="large" onClick={handleConnect} isLoading={isLoading}>
        Connect with MetaMask
      </ButtonS>
    </LoginContainerS>
  );
}
const LoginContainerS = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 65px);
  padding: 0 1rem;
`;
const TitleS = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: ${Colors.textLevel1};
  margin-bottom: 1rem;

  @media (max-width: 575.98px) {
    font-size: 14px;
    margin-top: 1rem;
    margin-bottom: 0rem;
  }
`;

const DescriptionS = styled.div`
  max-width: 580px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 2rem;
  color: ${Colors.textLevel3};
  @media (max-width: 575.98px) {
    font-size: 14px;
  }
`;

const ButtonS = styled(Button)`
  max-width: 380px;
  width: 100%;
`;

import NoResult from '@components/NoResult';
import { useAuth } from '@context/auth';
import { orderApi } from '@namo-workspace/services';
import { FC, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { USER_DATA_TABS } from '../constants';
import TabContent, { TabProps } from './TabContent';

const Rentals: FC = () => {
  const { statusPublic, address } = useOutletContext<TabProps>();
  const [proxyAddress, setProxyAddress] = useState<string>('');
  const { userInfo, isLoggedIn } = useAuth();

  useEffect(() => {
    address &&
      isLoggedIn &&
      orderApi.getProxyWalletPublic(address).then(({ data }) => {
        setProxyAddress(data.proxyAddress);
      });
  }, [address, isLoggedIn]);

  if (!isLoggedIn) {
    return <NoResult title="No data" subTitle="You are not renting any NFTs" />;
  } else if (!proxyAddress) {
    return <NoResult title="No data" subTitle="You are not renting any NFTs" />;
  }

  return (
    <TabContent
      address={userInfo?.address}
      proxyWallet={
        statusPublic ? proxyAddress : userInfo?.proxyWallet?.proxyAddress
      }
      tab={USER_DATA_TABS.RENTALS}
      statusPublic={statusPublic}
    />
  );
};

export default Rentals;

import { FC } from 'react';
import { useOutletContext } from 'react-router';
import { USER_DATA_TABS } from '../constants';
import TabContent, { TabProps } from './TabContent';

const ForRent: FC = () => {
  const { address, statusPublic } = useOutletContext<TabProps>();
  return (
    <TabContent
      address={address}
      tab={USER_DATA_TABS.FOR_RENT}
      statusPublic={statusPublic}
    />
  );
};

export default ForRent;

import React from 'react';
import { use3box } from 'utils/use-3box';
import Comments from '3box-comments-react';
import { SecondaryButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useAppStatus } from 'modules/app/store/app-status-hooks';

interface ThreeBoxCommentsProps {
  adminEthAddr: string;
  provider: any;
  marketId: string;
}

const ThreeBoxComments = ({
  adminEthAddr,
  provider,
  marketId,
}: ThreeBoxCommentsProps) => {
  const { initialized3box } = useAppStatusStore();
  const { setInitialized3Box } = useAppStatus();
  const { activate, setActivate, address, box, isReady, profile } = use3box(
    provider,
    setInitialized3Box,
    initialized3box,
    'comments',
    initialized3box?.openComments
  );

  return isReady ? (
    <Comments
      // required
      spaceName="augur"
      threadName={marketId}
      adminEthAddr={adminEthAddr}
      // Required props for context A) & B)
      box={box}
      currentUserAddr={address}
      // optional
      currentUser3BoxProfile={profile}
    />
  ) : (
    <SecondaryButton
      action={() => setActivate(true)}
      text={
        activate ? 'Loading comments...' : 'Click here to activate comments'
      }
      disabled={activate}
    />
  );
};

export default ThreeBoxComments;

import React from 'react';
import { use3box } from 'utils/use-3box';
import Comments from '3box-comments-react';
import { SecondaryButton } from 'modules/common/buttons';
import { Initialized3box } from 'modules/types';

interface ThreeBoxCommentsProps {
  adminEthAddr: string;
  provider: any;
  initialize3box: Function;
  initialized3box: Initialized3box;
  marketId: string;
}

const ThreeBoxComments = ({
  adminEthAddr,
  provider,
  initialize3box,
  initialized3box,
  marketId,
}: ThreeBoxCommentsProps) => {
  const { activate, setActivate, address, box, isReady, profile } = use3box(
    provider,
    initialize3box,
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

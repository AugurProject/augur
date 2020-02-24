import React from 'react';

import { FacebookButton, TwitterButton } from 'modules/common/icons';

interface SocialMediaButtonsProps {
  address?: string;
  marketDescription: string;
  marketAddress: string;
  sendFacebookShare: Function;
  sendTwitterShare: Function;
  listView?: boolean;
}

export const SocialMediaButtons = ({
  address,
  marketDescription,
  marketAddress,
  sendFacebookShare,
  sendTwitterShare,
  listView,
}: SocialMediaButtonsProps) => {
  const showFacebookShare = (encodedMarketUrl, encodedMarketDescription) => {
    const url = `https://www.facebook.com/sharer/sharer.php?t=${encodedMarketDescription}&u=${encodedMarketUrl}&affiliate=${address}`;
    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    );
    return false;
  };

  const showTwitterShare = (encodedMarketUrl, encodedMarketDescription) => {
    const url = `https://twitter.com/intent/tweet?text=${encodedMarketDescription}&url=${encodedMarketUrl}&affiliate=${address}`;
    window.open(url, '', 'width=600,height=300');
    return false;
  };

  const encodedMarketUrl = encodeURIComponent(
    `${window.location.origin}/#!/market?id=${marketAddress}`
  );
  const encodedMarketDescription = encodeURI(marketDescription);

  const handleFacebookClick = () => {
    sendFacebookShare(marketAddress, marketDescription);
    showFacebookShare(encodedMarketUrl, encodedMarketDescription);
  };

  const handleTwitterClick = () => {
    sendTwitterShare(marketAddress, marketDescription);
    showTwitterShare(encodedMarketUrl, encodedMarketDescription);
  };

  const listViewRender = (
    <>
      <div
        onClick={() => {
          handleFacebookClick();
        }}
      >
        {FacebookButton} <span>Facebook</span>
      </div>
      <div
        onClick={() => {
          handleTwitterClick();
        }}
      >
        {TwitterButton} <span>Twitter</span>
      </div>
    </>
  );

  if (listView) {
    return listViewRender;
  }

  return (
    <>
      <button
        id='facebookButton'
        onClick={() => {
          handleFacebookClick();
        }}
      >
        {FacebookButton}
      </button>
      <button
        id='twitterButton'
        onClick={() => {
          handleTwitterClick();
        }}
      >
        {TwitterButton}
      </button>
    </>
  );
};

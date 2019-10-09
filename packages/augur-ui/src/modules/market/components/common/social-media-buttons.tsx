import React from 'react';

import { FacebookButton, TwitterButton } from 'modules/common/icons';

interface SocialMediaButtonsProps {
  marketDescription: string;
  marketAddress: string;
}

export const SocialMediaButtons = (props: SocialMediaButtonsProps) => {
  const showFacebookShare = (encodedMarketUrl, encodedMarketDescription) => {
    const url = `https://www.facebook.com/sharer/sharer.php?t=${encodedMarketDescription}&u=${encodedMarketUrl}`;
    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    );
    return false;
  };

  const showTwitterShare = (encodedMarketUrl, encodedMarketDescription) => {
    const url = `https://twitter.com/intent/tweet?text=${encodedMarketDescription}&url=${encodedMarketUrl}`;
    window.open(url, '', 'width=600,height=300');
    return false;
  };

  const encodedMarketUrl = encodeURIComponent(
    `${window.location.origin}/#!/market?id=${props.marketAddress}`
  );
  const encodedMarketDescription = encodeURI(props.marketDescription);
  return (
    <>
      <button
        id="facebookButton"
        onClick={() =>
          showFacebookShare(encodedMarketUrl, encodedMarketDescription)
        }
      >
        {FacebookButton}
      </button>
      <button
        id="twitterButton"
        onClick={() =>
          showTwitterShare(encodedMarketUrl, encodedMarketDescription)
        }
      >
        {TwitterButton}
      </button>
    </>
  );
};

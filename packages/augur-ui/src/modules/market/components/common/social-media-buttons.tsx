import React from 'react';

import { FacebookButton, TwitterButton } from 'modules/common/icons';
import { AFFILIATE_NAME } from 'modules/routes/constants/param-names';

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
    const url = `https://www.facebook.com/sharer/sharer.php?t=${encodedMarketDescription}&u=${encodedMarketUrl}&${AFFILIATE_NAME}=${address}`;
    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    );
    return false;
  };

  const sanitizeURLs = marketDescription => {
    return marketDescription.replace(
      /(([a-zA-Z\-_]+)\.)+?\/?/g,
      "$2(dot)"
    ).replace(/\(dot\)(\s|$)/, ".$1");
  };

  const showTwitterShare = (encodedMarketUrl, encodedMarketDescription) => {
    const url = `https://twitter.com/intent/tweet?text=${sanitizeURLs(encodedMarketDescription)}&url=${encodedMarketUrl}&${AFFILIATE_NAME}=${address}`;
    window.open(url, '', 'width=600,height=300');
    return false;
  };

  const encodedMarketUrl = encodeURIComponent(
    `${window.location.origin}/#!/market?id=${marketAddress}&${AFFILIATE_NAME}=${address}`
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
        title="Share on Facebook"
        onClick={() => {
          handleFacebookClick();
        }}
      >
        {FacebookButton}
      </button>
      <button
        id='twitterButton'
        title="Share on Twitter"
        onClick={() => {
          handleTwitterClick();
        }}
      >
        {TwitterButton}
      </button>
    </>
  );
};

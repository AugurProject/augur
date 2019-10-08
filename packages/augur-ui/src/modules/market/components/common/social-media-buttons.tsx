import React, { Component } from 'react';

import {
  FacebookButton,
  TwitterButton
} from 'modules/common/icons';

import Styles from 'modules/market/components/common/market-common.styles.less';

interface SocialMediaButtonsProps {
  marketDescription: string;
  marketAddress: string;
}

export class SocialMediaButtons extends Component<SocialMediaButtonsProps> {
  showFacebookShare(encodedMarketUrl, encodedMarketDescription) {
    const url = `https://www.facebook.com/sharer/sharer.php?t=${encodedMarketDescription}&u=${encodedMarketUrl}`;
    window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false;
  }

  showTwitterShare(encodedMarketUrl, encodedMarketDescription) {
    const url = `https://twitter.com/intent/tweet?text=${encodedMarketDescription}&url=${encodedMarketUrl}`;
    window.open(url, '', 'width=600,height=300');
    return false;
  }

  render() {
    const encodedMarketUrl = encodeURIComponent(`${window.location.origin}/#!/market?id=${this.props.marketAddress}`);
    const encodedMarketDescription = encodeURI(this.props.marketDescription);
    return (
      <div>
        <button
          className={Styles.facebookButton}
          id='facebookButton'
          onClick={() => this.showFacebookShare(encodedMarketUrl, encodedMarketDescription)}
        >
          {FacebookButton}
        </button>
        <button
          className={Styles.twitterButton}
          id='twitterButton'
          onClick={() => this.showTwitterShare(encodedMarketUrl, encodedMarketDescription)}
        >
          {TwitterButton}
        </button>
      </div>
    );
  }
}

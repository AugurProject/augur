import React, { Component } from 'react';

import Styles from 'modules/market/components/market-view/market-view.styles.less';

interface MarketCommentsProps {
  marketId: string;
  colorScheme: string;
  numPosts: number;
  networkId: string;
}

export class MarketComments extends Component<MarketCommentsProps> {
  static defaultProps = {
    colorScheme: 'dark',
    numPosts: 10,
  };

  render() {
    const {
      marketId,
      colorScheme,
      numPosts,
      networkId,
    } = this.props;

    const fbCommentsUrl = `www.augur.net/comments/${networkId}/${marketId}`;

    let content = null;

    content = (
      <section className={Styles.MarketView__comments}>
        <div id='fb-root'></div>
        <div id='fb-comments' className='fb-comments' data-colorscheme={colorScheme} data-href={fbCommentsUrl} data-width='100%' data-numposts={numPosts.toString()}></div>
      </section>
    );

    // This is a hack that is required because putting the JS script in index.ejs does not work
    if (!window.document.getElementById('fb-jssdk')) {
      const js = window.document.createElement('script');
      js.id = 'fb-jssdk';
      js.async = true;
      js.defer = true;
      js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v4.0';
      window.document.body.appendChild(js);
    }

    return (
      <>
      {content}
      </>
    );
  }
}

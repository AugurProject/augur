import React, { Component } from 'react';

import Styles from 'modules/market/components/market-view/market-view.styles.less';

interface MarketCommentsProps {
  marketId: string;
  colorScheme: string;
  numPosts: number;
  networkId: string;
}

export class MarketComments extends Component<MarketCommentsProps> {
  componentDidMount() {
    // facebook sdk needs to be parsed, not sure why for each comments component
    window.FB.XFBML.parse();
  }

  render() {
    const {
      marketId,
      colorScheme,
      numPosts,
      networkId,
    } = this.props;

    const fbCommentsUrl = `www.augur.net/comments/${networkId}/${marketId}`;

    return (
      <section className={Styles.MarketView__comments}>
        <div id='fb-root'></div>
        <div id='fb-comments' className='fb-comments' data-colorscheme={colorScheme} data-href={fbCommentsUrl} data-width='100%' data-numposts={numPosts.toString()}></div>
      </section>
    );
  }
}

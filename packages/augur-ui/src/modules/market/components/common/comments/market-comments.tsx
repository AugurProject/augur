import React, { useEffect, useState } from 'react';

import Styles from 'modules/market/components/market-view/market-view.styles.less';

interface MarketCommentsProps {
  marketId: string;
  colorScheme: string;
  numPosts: number;
  networkId: string;
}

export const MarketComments = (props: MarketCommentsProps) => {
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    try {
      // facebook sdk needs to be parsed, not sure why for each comments component
      window.FB.XFBML.parse();
    } catch (error) {
      console.error(error);
      setDidError(true);
    }
  }, []);

  if (didError) {
    return null
  };

  const { marketId, colorScheme, numPosts, networkId } = props;

  const fbCommentsUrl = `www.augur.net/comments/${networkId}/${marketId}`;

  return (
    <section className={Styles.MarketView__comments}>
      <div
        id='fb-comments'
        className='fb-comments'
        data-colorscheme={colorScheme}
        data-href={fbCommentsUrl}
        data-width='100%'
        data-numposts={numPosts.toString()}
      ></div>
    </section>
  );
};

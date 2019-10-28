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
  const { FB } = window;

  useEffect(() => {
    try {
      // XFBML enables you to incorporate FBML into your websites and IFrame applications.
      // https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse/
      if (FB) {
        FB.XFBML.parse();
      }
    } catch (error) {
      console.error(error);
      setDidError(true);
    }
  }, []);

  if (didError) {
    return null
  };

  const { marketId, colorScheme, numPosts, networkId } = props;

  const fbCommentsUrl = `http://www.augur.net/comments/${networkId}/${marketId}`;

  return (
    <section className={Styles.MarketView__comments}>
      <div
        id='fb-comments'
        className='fb-comments'
        data-colorscheme={colorScheme}
        data-href={fbCommentsUrl}
        data-width='100%'
        data-numposts={numPosts.toString()}
        data-order-by='social' // social is seen as "Top" in the select input
      />
    </section>
  );
};

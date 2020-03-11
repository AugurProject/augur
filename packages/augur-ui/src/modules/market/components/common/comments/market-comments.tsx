import React from 'react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';

interface MarketCommentsProps {
  marketId: string;
  colorScheme: string;
  numPosts: number;
  networkId: string;
  whichCommentPlugin?: string;
}

export const MarketComments = ({
  marketId,
  colorScheme,
  numPosts,
  networkId,
  whichCommentPlugin,
}: MarketCommentsProps) => {
  return (
    whichCommentPlugin === 'facebook' && (
      <FacebookComments
        marketId={marketId}
        colorScheme={colorScheme}
        numPosts={numPosts}
        networkId={networkId}
      />
    )
  );
};

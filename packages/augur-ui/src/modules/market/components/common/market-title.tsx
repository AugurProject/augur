import React from 'react';
import MarketLink from 'modules/market/components/market-link/market-link';

interface MarketTitleProps {
  id: string;
  description: string;
  isWrapped?: boolean;
}

const wrapMarketName = (marketName: string) => <span>{`"${marketName}"`}</span>;

const MarketTitle: React.FC<MarketTitleProps> = ({
  description,
  id,
  isWrapped,
}) => (
    <MarketLink id={id}>
      {isWrapped ? wrapMarketName(description) : description}
    </MarketLink>
);

export default MarketTitle;

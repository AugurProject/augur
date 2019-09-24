import React from "react";

import MarketHeaderReporting from "modules/market/containers/market-header-reporting";

import Styles from "modules/market/components/market-header/market-header-collapsed.styles";

interface MarketHeaderCollapsedProps {
  description: string;
  market: object;
}

export const MarketHeaderCollapsed = ({ description, market }: MarketHeaderCollapsedProps) => (
  <div className={Styles.HeaderCollapsed}>
    <div>
      {description}
    </div>
    <div>
      <MarketHeaderReporting marketId={market.id} />
    </div>
  </div>
);
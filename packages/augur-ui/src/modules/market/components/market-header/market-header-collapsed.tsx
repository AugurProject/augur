import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketHeaderReporting from "modules/market/containers/market-header-reporting";

import Styles from "modules/market/components/market-header/market-header-collapsed.styles";

export const MarketHeaderCollapsed = ({ description, market }) => (
  <div className={Styles.HeaderCollapsed}>
    <div>
      {description}
    </div>
    <div>
      <MarketHeaderReporting marketId={market.id} />
    </div>
  </div>
);

MarketHeaderCollapsed.propTypes = {
  description: PropTypes.string.isRequired,
  market: PropTypes.object.isRequired
};

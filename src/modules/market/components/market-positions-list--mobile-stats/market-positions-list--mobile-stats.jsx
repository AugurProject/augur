/* eslint-disable react/no-array-index-key */

import React from "react";
import PropTypes from "prop-types";

import ValueDenomination from "modules/common/components/value-denomination/value-denomination";
import getValue from "utils/get-value";

import Styles from "modules/market/components/market-positions-list--mobile-stats/market-positions-list--mobile-stats.styles";
import CommonStyles from "modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles";

const MobileStats = ({ outcome }) => {
  const topBidShares = getValue(outcome, "topBid.shares.formatted");
  const topAskShares = getValue(outcome, "topAsk.shares.formatted");

  const topBidPrice = getValue(outcome, "topBid.price.formatted");
  const topAskPrice = getValue(outcome, "topAsk.price.formatted");

  return (
    <div className={CommonStyles.MarketPositionsListMobile__wrapper}>
      <h2 className={CommonStyles.MarketPositionsListMobile__heading}>Stats</h2>
      <ul className={Styles.MobileStats}>
        <li>
          <span>Best Bid</span> <ValueDenomination formatted={topBidPrice} />
        </li>
        <li>
          <span>Bid QTY</span> <ValueDenomination formatted={topBidShares} />
        </li>
        <li>
          <span>Best Ask</span> <ValueDenomination formatted={topAskPrice} />
        </li>
        <li>
          <span>Ask QTY</span> <ValueDenomination formatted={topAskShares} />
        </li>
      </ul>
    </div>
  );
};

MobileStats.propTypes = {
  outcome: PropTypes.shape({
    topBid: PropTypes.shape({
      shares: PropTypes.object.isRequired,
      price: PropTypes.object.isRequired
    }),
    topAsk: PropTypes.shape({
      shares: PropTypes.object.isRequired,
      price: PropTypes.object.isRequired
    })
  }).isRequired
};

export default MobileStats;

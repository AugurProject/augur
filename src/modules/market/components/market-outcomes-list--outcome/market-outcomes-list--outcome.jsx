/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ValueDenomination from "modules/common/components/value-denomination/value-denomination";

import getValue from "utils/get-value";
import MarketOutcomeTradingTypeIndicator from "modules/market/containers/market-outcome-trading-type-indicator";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/market/components/market-outcomes-list--outcome/market-outcomes-list--outcome.styles";

const Outcome = ({ outcome, selectedOutcome, updateSelectedOutcome }) => {
  const outcomeName = getValue(outcome, "name");

  const topBidShares = getValue(outcome, "topBid.shares.formatted");
  const topAskShares = getValue(outcome, "topAsk.shares.formatted");

  const topBidPrice = getValue(outcome, "topBid.price.formatted");
  const topAskPrice = getValue(outcome, "topAsk.price.formatted");

  const lastPrice = getValue(outcome, "lastPrice.formatted");
  const lastPricePercent = getValue(outcome, "lastPricePercent.full");

  return (
    <ul
      className={classNames(Styles.Outcome, {
        [`${Styles.active}`]: selectedOutcome === outcome.id
      })}
      onClick={e => updateSelectedOutcome(outcome.id)}
      role="menu"
    >
      <li>
        {outcomeName}{" "}
        <span className={Styles.Outcome__percent}>{lastPricePercent}</span>
      </li>
      <li>
        <ValueDenomination formatted={topBidShares} />
      </li>
      <li>
        <ValueDenomination formatted={topBidPrice} />
      </li>
      <li>
        <ValueDenomination formatted={topAskPrice} />
      </li>
      <li>
        <ValueDenomination formatted={topAskShares} />
      </li>
      <li style={{ position: "relative" }}>
        <MarketOutcomeTradingTypeIndicator outcome={outcome}>
          <ValueDenomination formatted={lastPrice} />
        </MarketOutcomeTradingTypeIndicator>
        <MarketOutcomeTradingIndicator outcome={outcome} location="outcomes" />
      </li>
    </ul>
  );
};

Outcome.propTypes = {
  outcome: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    topBid: PropTypes.shape({
      shares: PropTypes.object,
      price: PropTypes.object
    }),
    topAsk: PropTypes.shape({
      shares: PropTypes.object,
      price: PropTypes.object
    }),
    lastPrice: PropTypes.object,
    lastPricePercent: PropTypes.object
  }).isRequired,
  selectedOutcome: PropTypes.string,
  updateSelectedOutcome: PropTypes.func.isRequired
};

Outcome.defaultProps = {
  selectedOutcome: null
};

export default Outcome;

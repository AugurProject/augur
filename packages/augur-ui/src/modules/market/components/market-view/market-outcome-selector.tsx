/* eslint-disable jsx-a11y/no-static-element-interaction */

import React from "react";
import PropTypes from "prop-types";

import { twoArrows } from "modules/common/components/icons";

import Styles from "modules/market/components/market-view/market-outcome-selector.styles";

const MarketOutcomeSelector = ({ outcomeName, outcome, selectOutcome }) => (
  <div
    role="button"
    tabIndex="-1"
    className={Styles.MarketOutcomeSelector}
    onClick={selectOutcome}
  >
    <div>{outcome ? outcomeName : "Select an Outcome"}</div>
    <span>{twoArrows}</span>
  </div>
);

MarketOutcomeSelector.propTypes = {
  outcome: PropTypes.any,
  outcomeName: PropTypes.string,
  selectOutcome: PropTypes.func.isRequired
};

MarketOutcomeSelector.defaultProps = {
  outcome: null,
  outcomeName: ""
};

export default MarketOutcomeSelector;

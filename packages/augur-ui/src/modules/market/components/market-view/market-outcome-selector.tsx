/* eslint-disable jsx-a11y/no-static-element-interaction */

import React from "react";
import PropTypes from "prop-types";

import { TwoArrows } from "modules/common/icons";

import Styles from "modules/market/components/market-view/market-outcome-selector.styles.less";

interface MarketOutcomeSelectorProps {
  outcome?: any | null;
  outcomeName?: string;
  selectOutcome: Function;
}

const MarketOutcomeSelector = ({
  outcomeName,
  outcome,
  selectOutcome,
}: MarketOutcomeSelectorProps) => (
  <button
    tabIndex={-1}
    className={Styles.MarketOutcomeSelector}
    onClick={e => selectOutcome()}
  >
    <div>{outcome ? outcomeName : "Select an Outcome"}</div>
    <span>{TwoArrows}</span>
  </button>
);

MarketOutcomeSelector.propTypes = {
  outcome: PropTypes.any,
  outcomeName: PropTypes.string,
  selectOutcome: PropTypes.func.isRequired,
};

MarketOutcomeSelector.defaultProps = {
  outcome: null,
  outcomeName: "",
};

export default MarketOutcomeSelector;

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import getValue from "utils/get-value";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/market/components/market-outcomes-categorical/market-outcomes-categorical.styles";

const fontSize = winWidth => (winWidth < 590 ? "0.875rem" : "1.25rem");

const CategoricalOutcome = ({ className, outcome }) => (
  <div
    className={className || Styles.MarketOutcomesCategorical__outcome}
    style={{
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    <span
      className={Styles["MarketOutcomesCategorical__outcome-name"]}
      style={{ fontSize: fontSize(window.outerWidth) }}
    >
      {window.outerWidth >= 590 ? outcome.name : outcome.name[0] + "... "}
    </span>
    <span
      className={Styles["MarketOutcomesCategorical__outcome-value"]}
      style={{ fontSize: fontSize(window.outerWidth) }}
    >
      {getValue(outcome, "lastPricePercent.full")}
    </span>
    <span>&nbsp;&nbsp;</span>
    <MarketOutcomeTradingIndicator outcome={outcome} location="categorical" />
  </div>
);

class MarketOutcomesCategorical extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outcomeWrapperHeight: 0,
      isOpen: false
    };

    this.showMore = this.showMore.bind(this);
  }

  showMore() {
    const outcomeWrapperHeight = this.state.isOpen
      ? 0
      : `${this.outcomeTable.clientHeight}px`;

    this.setState({
      outcomeWrapperHeight,
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { outcomes } = this.props;
    const totalOutcomes = outcomes.length;

    const displayShowMore = totalOutcomes > 3;
    const showMoreText = this.state.isOpen
      ? `- ${totalOutcomes - 3} less`
      : `+ ${totalOutcomes - 3} more`;

    const outcomeWrapperStyle = {
      minHeight: this.state.outcomeWrapperHeight
    };

    return (
      <div
        className={Styles.MarketOutcomesCategorical}
        style={outcomeWrapperStyle}
      >
        {outcomes.length > 0 && (
          <CategoricalOutcome
            className={Styles["MarketOutcomesCategorical__height-sentinel"]}
            outcome={outcomes[0]}
          />
        )}
        <div
          className={classNames(
            Styles["MarketOutcomesCategorical__outcomes-container"],
            {
              [`${Styles["show-more"]}`]: displayShowMore
            }
          )}
        >
          {displayShowMore && (
            <button
              className={Styles["MarketOutcomesCategorical__show-more"]}
              onClick={this.showMore}
            >
              {showMoreText}
            </button>
          )}
          <div
            ref={outcomeTable => {
              this.outcomeTable = outcomeTable;
            }}
            className={Styles.MarketOutcomesCategorical__outcomes}
          >
            {outcomes.length > 0 &&
              outcomes.map(outcome => (
                <CategoricalOutcome key={outcome.id} outcome={outcome} />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

MarketOutcomesCategorical.propTypes = {
  outcomes: PropTypes.array.isRequired
};

CategoricalOutcome.propTypes = {
  outcome: PropTypes.object.isRequired,
  className: PropTypes.string
};

CategoricalOutcome.defaultProps = {
  className: null
};

export default MarketOutcomesCategorical;

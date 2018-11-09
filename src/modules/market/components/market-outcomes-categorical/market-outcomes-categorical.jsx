import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketOutcomeTradingTypeIndicator from "modules/market/containers/market-outcome-trading-type-indicator";
import getValue from "utils/get-value";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/market/components/market-outcomes-categorical/market-outcomes-categorical.styles";

const CategoricalOutcome = ({ className, outcome, isMobileSmall }) => (
  <div
    className={className || Styles.MarketOutcomesCategorical__outcome}
    style={{
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    {isMobileSmall ? (
      <div className={Styles.MarketOutcomesCategorical__container}>
        <div>
          <span className={Styles["MarketOutcomesCategorical__outcome-value"]}>
            <MarketOutcomeTradingTypeIndicator outcome={outcome}>
              {getValue(outcome, "lastPricePercent.full")}
            </MarketOutcomeTradingTypeIndicator>
          </span>
          <MarketOutcomeTradingIndicator
            style={{ marginLeft: "10px" }}
            outcome={outcome}
            location="categorical"
          />
        </div>
        <span className={Styles["MarketOutcomesCategorical__outcome-name"]}>
          {outcome.name}
        </span>
      </div>
    ) : (
      <div className={Styles.MarketOutcomesCategorical__container}>
        <span className={Styles["MarketOutcomesCategorical__outcome-name"]}>
          {outcome.name}
        </span>
        <span className={Styles["MarketOutcomesCategorical__outcome-value"]}>
          <MarketOutcomeTradingTypeIndicator outcome={outcome}>
            {getValue(outcome, "lastPricePercent.full")}
          </MarketOutcomeTradingTypeIndicator>
        </span>
        <MarketOutcomeTradingIndicator
          style={{ marginLeft: "10px" }}
          outcome={outcome}
          location="categorical"
        />
      </div>
    )}
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
    const { outcomes, isMobileSmall } = this.props;
    const totalOutcomes = outcomes.length;

    const numOutcomesToShow = isMobileSmall ? 2 : 3;
    const displayShowMore = totalOutcomes > numOutcomesToShow;
    const showMoreText = this.state.isOpen
      ? `- ${totalOutcomes - numOutcomesToShow} less`
      : `+ ${totalOutcomes - numOutcomesToShow} more`;

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
            isMobileSmall={isMobileSmall}
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
                <CategoricalOutcome
                  key={outcome.id}
                  outcome={outcome}
                  isMobileSmall={isMobileSmall}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

MarketOutcomesCategorical.propTypes = {
  outcomes: PropTypes.array.isRequired,
  isMobileSmall: PropTypes.bool
};

MarketOutcomesCategorical.defaultProps = {
  isMobileSmall: false
};

CategoricalOutcome.propTypes = {
  outcome: PropTypes.object.isRequired,
  className: PropTypes.string,
  isMobileSmall: PropTypes.bool
};

CategoricalOutcome.defaultProps = {
  className: null,
  isMobileSmall: false
};

export default MarketOutcomesCategorical;

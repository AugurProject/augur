import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import getValue from "utils/get-value";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/market/components/market-outcomes-categorical/market-outcomes-categorical.styles.less";
import { MarketOutcome } from "modules/types";

const CategoricalOutcome = ({ className, marketOutcome, isMobileSmall }) => (
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
            {getValue(marketOutcome, "lastPricePercent.full")}
          </span>
          <MarketOutcomeTradingIndicator
            style={{ marginLeft: "10px" }}
            outcome={marketOutcome}
            location="categorical"
          />
        </div>
        <span className={Styles["MarketOutcomesCategorical__outcome-name"]}>
          {marketOutcome.description}
        </span>
      </div>
    ) : (
      <div className={Styles.MarketOutcomesCategorical__container}>
        <span className={Styles["MarketOutcomesCategorical__outcome-name"]}>
          {marketOutcome.description}
        </span>
        <span className={Styles["MarketOutcomesCategorical__outcome-value"]}>
          {getValue(marketOutcome, "lastPricePercent.full")}
        </span>
        <MarketOutcomeTradingIndicator
          style={{ marginLeft: "10px" }}
          outcome={marketOutcome}
          location="categorical"
        />
      </div>
    )}
  </div>
);

CategoricalOutcome.propTypes = {
  marketOutcome: PropTypes.object.isRequired,
  className: PropTypes.string,
  isMobileSmall: PropTypes.bool
};

CategoricalOutcome.defaultProps = {
  className: null,
  isMobileSmall: false
};

interface MarketOutcomesCategoricalProps {
  marketOutcomes: Array<MarketOutcome>,
  isMobileSmall: boolean,
};

class MarketOutcomesCategorical extends Component<MarketOutcomesCategoricalProps> {
  static defaultProps = {
    isMobileSmall: false
  };
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
    const { marketOutcomes, isMobileSmall } = this.props;
    const totalOutcomes = marketOutcomes.length;

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
        {marketOutcomes.length > 0 && (
          <CategoricalOutcome
            className={Styles["MarketOutcomesCategorical__height-sentinel"]}
            marketOutcome={marketOutcomes[0]}
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
            {marketOutcomes.length > 0 &&
              marketOutcomes.map(outcome => (
                <CategoricalOutcome
                  key={outcome.id}
                  marketOutcome={outcome}
                  isMobileSmall={isMobileSmall}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default MarketOutcomesCategorical;

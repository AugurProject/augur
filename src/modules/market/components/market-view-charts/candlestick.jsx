import React from "react";

import * as PropTypes from "prop-types";
import { loadCandleStickData } from "src/modules/markets/actions/load-candlestick-data";
import logError from "src/utils/log-error";
import { checkPropsChange } from "src/utils/check-props-change";
import MarketOutcomeCandlestick from "src/modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick";
import { BigNumber } from "bignumber.js";
import {
  DEFAULT_SHORT_PERIODS_VALUE,
  DEFAULT_PERIODS_VALUE
} from "modules/common-elements/constants";

export class Candlestick extends React.Component {
  static propTypes = {
    currentTimeInSeconds: PropTypes.number.isRequired,
    marketId: PropTypes.string.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    selectedOutcome: PropTypes.string.isRequired,
    daysPassed: PropTypes.number.isRequired,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    isMobile: false
  };

  constructor(props) {
    super(props);

    const defPeriod =
      props.daysPassed < 1
        ? DEFAULT_SHORT_PERIODS_VALUE
        : DEFAULT_PERIODS_VALUE;

    this.state = {
      priceTimeSeries: [],
      selectedPeriod: defPeriod
    };

    this.getData = this.getData.bind(this);
    this.updateSelectedPeriod = this.updateSelectedPeriod.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      checkPropsChange(prevProps, this.props, [
        "currentTimeInSeconds",
        "selectedOutcome",
        "marketId"
      ]) ||
      checkPropsChange(prevState, this.state, ["selectedPeriod"])
    ) {
      this.getData();
    }
  }

  getData() {
    const { currentTimeInSeconds, marketId, selectedOutcome } = this.props;
    const { selectedPeriod } = this.state;

    loadCandleStickData(
      {
        marketId,
        period: selectedPeriod,
        end: currentTimeInSeconds,
        outcome: selectedOutcome
      },
      (err, data) => {
        if (err) return logError(err);
        const priceTimeSeries = data[selectedOutcome] || [];
        this.setState({
          priceTimeSeries
        });
      }
    );
  }

  updateSelectedPeriod(selectedPeriod) {
    this.setState({
      selectedPeriod
    });
  }

  render() {
    const { maxPrice, minPrice, currentTimeInSeconds, isMobile } = this.props;
    const { priceTimeSeries, selectedPeriod } = this.state;

    return (
      <MarketOutcomeCandlestick
        priceTimeSeries={priceTimeSeries}
        isMobile={isMobile}
        fixedPrecision={4}
        pricePrecision={4}
        selectedPeriod={selectedPeriod}
        updateSelectedPeriod={this.updateSelectedPeriod}
        updateSelectedOrderProperties={() => {}}
        marketMax={maxPrice}
        marketMin={minPrice}
        currentTimeInSeconds={currentTimeInSeconds}
      />
    );
  }
}

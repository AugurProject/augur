import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "utils/custom-prop-types";
import {
  PERIODS,
  VOLUME_ETH_SHARES,
  ETH
} from "modules/common/constants";
import {
  SquareDropdown,
  StaticLabelDropdown
} from "modules/common/selection";
import Styles from "modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick.styles.less";
import MarketOutcomeChartsCandlestickHighchart from "modules/market-charts/containers/market-candlestick";
import { CandlestickOchl } from "modules/market-charts/components/market-outcome-charts--candlestick/candlestick-ochl";

interface MarketOutcomeCandlestickProps {
  fixedPrecision: number;
  isMobile: boolean;
  marketMax: BigNumber;
  marketMin: BigNumber;
  priceTimeSeries: Array<any>;
  selectedPeriod: number;
  updateSelectedPeriod: Function;
  pricePrecision: number;
}

interface MarketOutcomeCandlestickState {
  containerWidth: number;
  containerHeight: number;
  hoveredPeriod: any;
  volumeType: string;
  defaultCandlePeriod: any;
}
class MarketOutcomeCandlestick extends React.PureComponent<MarketOutcomeCandlestickProps, MarketOutcomeCandlestickState> {
  static defaultProps = {
    isMobile: false
  };
  drawContainer: any;

  constructor(props) {
    super(props);

    this.state = {
      containerWidth: 0,
      containerHeight: 0,
      hoveredPeriod: {},
      volumeType: ETH,
      defaultCandlePeriod: props.selectedPeriod
    };

    this.getContainerWidths = this.getContainerWidths.bind(this);
    this.updateContainerWidths = this.updateContainerWidths.bind(this);
    this.updateHoveredPeriod = this.updateHoveredPeriod.bind(this);
    this.updateVolumeType = this.updateVolumeType.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const containerWidths = this.getContainerWidths();

    this.setState({
      ...containerWidths
    });
  }

  getContainerWidths() {
    return {
      containerWidth: this.drawContainer.clientWidth,
      containerHeight: this.drawContainer.clientHeight
    };
  }

  updateVolumeType(value) {
    this.setState({
      volumeType: value
    });
  }

  updateContainerWidths() {
    this.setState(this.getContainerWidths());
  }

  updateHoveredPeriod(hoveredPeriod) {
    this.setState({
      hoveredPeriod
    });
  }

  render() {
    const {
      fixedPrecision,
      pricePrecision,
      isMobile,
      priceTimeSeries,
      selectedPeriod,
      updateSelectedPeriod,
      marketMin,
      marketMax
    } = this.props;

    const {
      hoveredPeriod,
      volumeType,
      containerHeight,
      defaultCandlePeriod
    } = this.state;

    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <div className={Styles.MarketOutcomeChartsHeader__chart__interaction}>
          <div>
            <SquareDropdown
              defaultValue={defaultCandlePeriod}
              options={PERIODS}
              onChange={updateSelectedPeriod}
              sortByStyles={{ minWidth: "4.875rem" }}
            />
            <StaticLabelDropdown
              options={VOLUME_ETH_SHARES}
              sortByStyles={{ minWidth: "9.375rem" }}
              staticLabel={
                hoveredPeriod.volume
                  ? `V: ${hoveredPeriod.volume
                      .toFixed(fixedPrecision)
                      .toString()}`
                  : "Show Volume in "
              }
              onChange={this.updateVolumeType}
              highlight={!!hoveredPeriod.volume}
            />
          </div>
          <CandlestickOchl
            hoveredPeriod={hoveredPeriod}
            pricePrecision={pricePrecision}
          />
        </div>
        <div
          ref={drawContainer => {
            this.drawContainer = drawContainer;
          }}
          className={Styles.MarketOutcomeCandlestick__container}
        >
          <MarketOutcomeChartsCandlestickHighchart
            priceTimeSeries={priceTimeSeries}
            selectedPeriod={selectedPeriod}
            pricePrecision={pricePrecision}
            updateHoveredPeriod={this.updateHoveredPeriod}
            marketMin={marketMin}
            marketMax={marketMax}
            volumeType={volumeType}
            containerHeight={containerHeight}
            isMobile={isMobile}
          />
        </div>
      </section>
    );
  }
}

export default MarketOutcomeCandlestick;

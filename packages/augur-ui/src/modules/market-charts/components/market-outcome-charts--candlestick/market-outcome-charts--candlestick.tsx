import React from 'react';
import { PERIODS, VOLUME_DAI_SHARES, DAI } from 'modules/common/constants';
import { SquareDropdown, StaticLabelDropdown } from 'modules/common/selection';
import Styles from 'modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick.styles.less';
import MarketOutcomeChartsCandlestickHighchart from 'modules/market-charts/containers/market-candlestick';
import { CandlestickOchl } from 'modules/market-charts/components/market-outcome-charts--candlestick/candlestick-ochl';

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
  hoveredPeriod: any;
  volumeType: string;
  defaultCandlePeriod: any;
}
class MarketOutcomeCandlestick extends React.PureComponent<
  MarketOutcomeCandlestickProps,
  MarketOutcomeCandlestickState
> {
  static defaultProps = {
    isMobile: false,
  };
  drawContainer: any;

  constructor(props) {
    super(props);

    this.state = {
      hoveredPeriod: {},
      volumeType: DAI,
      defaultCandlePeriod: props.selectedPeriod,
    };

    this.updateHoveredPeriod = this.updateHoveredPeriod.bind(this);
    this.updateVolumeType = this.updateVolumeType.bind(this);
  }

  updateVolumeType(value) {
    this.setState({
      volumeType: value,
    });
  }

  updateHoveredPeriod(hoveredPeriod) {
    this.setState({
      hoveredPeriod,
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
      marketMax,
    } = this.props;

    const {
      hoveredPeriod,
      volumeType,
      defaultCandlePeriod,
    } = this.state;
    const staticMenuLabel = 'Show Volume in';
    const staticLabel = hoveredPeriod.volume
    ? `V: ${hoveredPeriod.volume
        .toFixed(fixedPrecision)
        .toString()}`
    : staticMenuLabel;

    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <div className={Styles.TopSection}>
          <SquareDropdown
            defaultValue={defaultCandlePeriod}
            options={PERIODS}
            onChange={updateSelectedPeriod}
          />
          <CandlestickOchl
            hoveredPeriod={hoveredPeriod}
            pricePrecision={pricePrecision}
          />
          <StaticLabelDropdown
            defaultValue={DAI}
            options={VOLUME_DAI_SHARES}
            staticLabel={staticLabel}
            staticMenuLabel={staticMenuLabel}
            onChange={this.updateVolumeType}
            highlight={!!hoveredPeriod.volume}
          />
        </div>
        <div
          ref={drawContainer => {
            this.drawContainer = drawContainer;
          }}
          className={Styles.ChartContainer}
        >
          <MarketOutcomeChartsCandlestickHighchart
            priceTimeSeries={priceTimeSeries}
            selectedPeriod={selectedPeriod}
            pricePrecision={pricePrecision}
            updateHoveredPeriod={this.updateHoveredPeriod}
            marketMin={marketMin}
            marketMax={marketMax}
            volumeType={volumeType}
            isMobile={isMobile}
          />
        </div>
      </section>
    );
  }
}

export default MarketOutcomeCandlestick;

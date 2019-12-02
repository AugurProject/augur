import React from 'react';
import { PERIODS, VOLUME_DAI_SHARES, DAI } from 'modules/common/constants';
import { SquareDropdown, StaticLabelDropdown } from 'modules/common/selection';
import Styles from 'modules/market-charts/components/candlestick/outcome-candlestick.styles.less';
import CandlestickHighchart from 'modules/market-charts/containers/candlestick-highchart';
import { CandlestickOchl } from 'modules/market-charts/components/candlestick/candlestick-ochl';

interface OutcomeCandlestickProps {
  fixedPrecision: number;
  marketMax: BigNumber;
  marketMin: BigNumber;
  priceTimeSeries: Array<any>;
  selectedPeriod: number;
  updateSelectedPeriod: Function;
  pricePrecision: number;
}

interface OutcomeCandlestickState {
  hoveredPeriod: any;
  volumeType: string;
  defaultCandlePeriod: any;
}
class OutcomeCandlestick extends React.PureComponent<
  OutcomeCandlestickProps,
  OutcomeCandlestickState
> {
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
      priceTimeSeries,
      selectedPeriod,
      updateSelectedPeriod,
      marketMin,
      marketMax,
    } = this.props;

    const { hoveredPeriod, volumeType, defaultCandlePeriod } = this.state;
    const staticMenuLabel = 'Show Volume in';
    const staticLabel = hoveredPeriod.volume
      ? `V: ${hoveredPeriod.volume.toFixed(fixedPrecision).toString()}`
      : staticMenuLabel;

    return (
      <section className={Styles.OutcomeCandlestick}>
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
          <CandlestickHighchart
            priceTimeSeries={priceTimeSeries}
            selectedPeriod={selectedPeriod}
            pricePrecision={pricePrecision}
            updateHoveredPeriod={this.updateHoveredPeriod}
            marketMin={marketMin}
            marketMax={marketMax}
            volumeType={volumeType}
          />
        </div>
      </section>
    );
  }
}

export default OutcomeCandlestick;

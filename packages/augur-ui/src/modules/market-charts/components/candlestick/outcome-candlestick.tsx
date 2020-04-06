import React, { useState, useRef } from 'react';
import { PERIODS, VOLUME_DAI_SHARES, DAI } from 'modules/common/constants';
import { SquareDropdown, StaticLabelDropdown } from 'modules/common/selection';
import Styles from 'modules/market-charts/components/candlestick/outcome-candlestick.styles.less';
import CandlestickHighchart from 'modules/market-charts/containers/candlestick-highchart';
import { CandlestickOchl } from 'modules/market-charts/components/candlestick/candlestick-ochl';
import { BigNumber } from 'bignumber.js';

interface OutcomeCandlestickProps {
  fixedPrecision: number;
  marketMax: BigNumber;
  marketMin: BigNumber;
  priceTimeSeries: Array<any>;
  selectedPeriod: number;
  updateSelectedPeriod: Function;
  pricePrecision: number;
  isArchived?: boolean;
}

interface OutcomeCandlestickState {
  hoveredPeriod: any;
  volumeType: string;
  defaultCandlePeriod: any;
}

const OutcomeCandlestick = ({
  fixedPrecision,
  marketMax,
  marketMin,
  priceTimeSeries,
  selectedPeriod,
  updateSelectedPeriod,
  pricePrecision,
  isArchived
}: OutcomeCandlestickProps) => {
  const [volumeType, setVolumeType] = useState(DAI);
  const [hoveredPeriod, setHoverPeriod] = useState({
    open: '',
    close: '',
    high: '',
    low: '',
    volume: '',
  });
  const [defaultCandlePeriod] = useState(selectedPeriod);
  const drawContainer = useRef(null);
  const staticMenuLabel = 'Show Volume in';
  const staticLabel = typeof hoveredPeriod.volume === 'object'
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
          onChange={v => setVolumeType(v)}
          highlight={!!hoveredPeriod.volume}
        />
      </div>
      <div ref={drawContainer} className={Styles.ChartContainer}>
        <CandlestickHighchart
          priceTimeSeries={priceTimeSeries}
          selectedPeriod={selectedPeriod}
          pricePrecision={pricePrecision}
          updateHoveredPeriod={v => setHoverPeriod(v)}
          marketMin={marketMin}
          marketMax={marketMax}
          volumeType={volumeType}
          isArchived={isArchived}
        />
      </div>
    </section>
  );
};

export default OutcomeCandlestick;

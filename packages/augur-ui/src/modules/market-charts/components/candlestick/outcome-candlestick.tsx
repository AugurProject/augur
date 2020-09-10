import React, { useState } from 'react';
import { PERIODS, VOLUME_DAI_SHARES, DAI } from 'modules/common/constants';
import { SquareDropdown, StaticLabelDropdown } from 'modules/common/selection';
import Styles from 'modules/market-charts/components/candlestick/outcome-candlestick.styles.less';
import { CandlestickHighchart } from 'modules/market-charts/components/candlestick/candlestick-highchart';
import { CandlestickOchl } from 'modules/market-charts/components/candlestick/candlestick-ochl';
import { BigNumber } from 'bignumber.js';

interface OutcomeCandlestickProps {
  marketMax: BigNumber;
  marketMin: BigNumber;
  priceTimeSeries: Array<any>;
  selectedPeriod: number;
  updateSelectedPeriod: Function;
  pricePrecision?: number;
  fixedPrecision?: number;
  isArchived?: boolean;
}

const OutcomeCandlestick = ({
  marketMax,
  marketMin,
  priceTimeSeries,
  selectedPeriod,
  updateSelectedPeriod,
  pricePrecision = 2,
  fixedPrecision = 2,
  isArchived,
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
  const staticMenuLabel = 'Show Volume in';
  const staticLabel =
    hoveredPeriod.volume === ''
      ? staticMenuLabel
      : `V: ${hoveredPeriod.volume.toFixed(fixedPrecision)}`;

  return (
    <section className={Styles.OutcomeCandlestick}>
      <div className={Styles.TopSection}>
        <SquareDropdown
          defaultValue={defaultCandlePeriod}
          options={PERIODS}
          onChange={updateSelectedPeriod}
        />
        <CandlestickOchl {...{ hoveredPeriod, pricePrecision }} />
        <StaticLabelDropdown
          defaultValue={DAI}
          options={VOLUME_DAI_SHARES}
          staticLabel={staticLabel}
          staticMenuLabel={staticMenuLabel}
          onChange={v => setVolumeType(v)}
        />
      </div>
      <div className={Styles.ChartContainer}>
        <CandlestickHighchart
          {...{
            priceTimeSeries,
            selectedPeriod,
            pricePrecision,
            marketMin,
            marketMax,
            volumeType,
            isArchived,
            updateHoveredPeriod: v => setHoverPeriod(v),
          }}
        />
      </div>
    </section>
  );
};

export default OutcomeCandlestick;

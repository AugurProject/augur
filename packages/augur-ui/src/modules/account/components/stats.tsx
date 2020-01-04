import React, { useEffect } from 'react';
import { TIMEFRAME_OPTIONS } from 'modules/common/constants';
import { LinearPropertyLabel } from 'modules/common/labels';
import { formatNumber } from 'utils/format-number';
import { PillSelection } from 'modules/common/selection';
import Styles from 'modules/account/components/stats.styles.less';

export interface StatsProps {
  updateSelected: Function;
  properties: Array<any>;
  currentAugurTimestamp: number;
  updateTimeframeData: Function;
  timeframe: number;
}

const Stats = ({
  timeframe,
  properties,
  updateSelected,
  currentAugurTimestamp,
  updateTimeframeData,
}: StatsProps) => {

  useEffect(() => {
    const period = TIMEFRAME_OPTIONS[timeframe].periodInterval;
    const startTime =
      period === 0 ? null : currentAugurTimestamp - period;
    updateTimeframeData({ startTime });
  }, [timeframe]);

  return (
    <div className={Styles.Stats}>
    <PillSelection
      options={TIMEFRAME_OPTIONS}
      defaultSelection={timeframe}
      onChange={(selected) => updateSelected(selected)}
    />
    {properties.map((property: any) => (
      <LinearPropertyLabel
        key={property.key}
        label={property.label}
        value={
          formatNumber(property.value, {
            decimals: 2,
            decimalsRounded: 2,
            denomination: () => '',
            positiveSign: false,
            zeroStyled: true,
          } as any).minimized
        }
      />
    ))}
  </div>
  );
};

export default Stats;

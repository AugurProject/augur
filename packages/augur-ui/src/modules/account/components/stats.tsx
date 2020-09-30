import React, { useEffect } from 'react';
import { TIMEFRAME_OPTIONS } from 'modules/common/constants';
import { LinearPropertyLabel } from 'modules/common/labels';
import { formatNumber, formatAttoRep } from 'utils/format-number';
import { PillSelection } from 'modules/common/selection';
import Styles from 'modules/account/components/stats.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { updateTimeframeData } from 'modules/account/actions/update-timeframe-data';
import { updatePlatformTimeframeData } from 'modules/account/actions/update-platform-timeframe-data';

export interface StatsProps {
  updateSelected?: Function;
  timeframe?: number;
  isPlatform: boolean;
}

const DEFAULT_OPTIONS = {
  decimals: 2,
  decimalsRounded: 2,
  denomination: () => '',
  positiveSign: false,
  zeroStyled: true,
};

const usePlatform = (isPlatform: boolean) => {
  const {
    loginAccount: {
      timeframeData: {
        positions,
        marketsTraded,
        successfulDisputes,
        redeemedPositions,
      },
    },
    universe: {
      timeframeData: {
        activeUsers,
        marketsCreated,
        numberOfTrades,
        disputedMarkets,
        volume,
        amountStaked,
      }
    }
  } = useAppStatusStore();
  let result = {
    properties: [],
    updateTimeframe: updateTimeframeData,
  };
  if (isPlatform) {
    result.updateTimeframe = updatePlatformTimeframeData;
    result.properties = [
      {
        key: 0,
        label: 'Active Users',
        value: activeUsers,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
      {
        key: 1,
        label: 'Markets Created',
        value: marketsCreated,
      },
      {
        key: 2,
        label: 'Trades',
        value: numberOfTrades,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
      {
        key: 3,
        label: 'Markets in dispute',
        value: disputedMarkets,
      },
      {
        key: 4,
        label: 'Volume',
        value: volume,
        options: {
          useFull: true,
          removeComma: true,
          denomination: v => `$${v}`,
        },
        useFull: true,
      },
      {
        key: 5,
        label: 'REPv2 in dispute',
        value: formatAttoRep(amountStaked, {
          decimals: 4,
        }).fullPrecision,
      },
    ];
  } else {
    result.properties = [
      {
        key: 0,
        label: 'Positions',
        value: positions,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
      {
        key: 1,
        label: 'Number of Trades',
        value: numberOfTrades,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
      {
        key: 2,
        label: 'Markets Traded',
        value: marketsTraded,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
      {
        key: 3,
        label: 'Markets Created',
        value: marketsCreated,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
      {
        key: 4,
        label: 'Successful Disputes',
        value: successfulDisputes,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
      {
        key: 5,
        label: 'Redeemed Positions',
        value: redeemedPositions,
        options: {
          decimals: 0,
          decimalsRounded: 0,
        },
      },
    ];
  }
  return result;
};

const Stats = ({
  timeframe,
  updateSelected,
  isPlatform = false,
}: StatsProps) => {
  const {
    blockchain: { currentAugurTimestamp },
  } = useAppStatusStore();
  const { properties, updateTimeframe } = usePlatform(isPlatform);
  useEffect(() => {
    const period = TIMEFRAME_OPTIONS[timeframe].periodInterval;
    const startTime = period === 0 ? null : currentAugurTimestamp - period;
    updateTimeframe({ startTime });
  }, [timeframe]);

  return (
    <div className={Styles.Stats}>
      <PillSelection
        options={TIMEFRAME_OPTIONS}
        defaultSelection={timeframe}
        onChange={selected => updateSelected(selected)}
      />
      {properties.map(
        ({ key, label, value, options = {}, useFull = false }: any) => (
          <LinearPropertyLabel
            key={key}
            label={label}
            value={formatNumber(value, {
              ...DEFAULT_OPTIONS,
              ...options,
            } as any)}
            useFull={useFull}
          />
        )
      )}
    </div>
  );
};

export default Stats;

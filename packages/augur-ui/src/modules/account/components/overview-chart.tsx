import React from 'react';
import * as constants from 'modules/common/constants';
import logError from 'utils/log-error';
import { PulseLoader } from 'react-spinners';
import ProfitLossChart from 'modules/account/components/profit-loss-chart';
import { MovementLabel } from 'modules/common/labels';
import Styles from 'modules/account/components/overview-chart.styles.less';
import { formatDaiPrice, formatPercent, formatDai } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';

const ALL_TIME = 3;
export interface OverviewChartProps {
  universe: string;
  currentAugurTimestamp: number;
  timeframe: number;
  getProfitLoss: Function;
}

interface TimeFrameOption {
  label: string;
  periodInterval: number;
  id: number;
}

export interface UserTimeRangeData {
  timestamp: number;
  realized: number;
  realizedPercent: number;
  totalCost: number;
  length: any;
}

interface OverviewChartState {
  profitLossData: number[][];
  profitLossChange: FormattedNumber | null;
  profitLossChangeHasValue: boolean;
  noTrades: boolean;
}

const BEGINNING_START_TIME = 1530366577;
export default class OverviewChart extends React.Component<
  OverviewChartProps,
  OverviewChartState
> {
  state: OverviewChartState = {
    profitLossData: [],
    profitLossChange: null,
    profitLossChangeHasValue: false,
    noTrades: true,
  };

  public container: object | null = null;

  componentDidMount = () => {
    const timeRangeDataConfig =
      constants.TIMEFRAME_OPTIONS[this.props.timeframe];
    this.getChartData(timeRangeDataConfig);
  };

  componentDidUpdate = (prevProps: OverviewChartProps) => {
    if (
      prevProps.timeframe !== this.props.timeframe ||
      (prevProps.currentAugurTimestamp === 0 &&
        prevProps.currentAugurTimestamp !== this.props.currentAugurTimestamp)
    ) {
      const timeRangeDataConfig =
        constants.TIMEFRAME_OPTIONS[this.props.timeframe];
      this.getChartData(timeRangeDataConfig);
    }
  };

  getChartData = async (timeRangeDataConfig: TimeFrameOption) => {
    const { universe, currentAugurTimestamp } = this.props;

    if (currentAugurTimestamp === 0) {
      return;
    }

    let startTime: number | null =
      currentAugurTimestamp - timeRangeDataConfig.periodInterval;

    if (timeRangeDataConfig.id === ALL_TIME) {
      startTime = BEGINNING_START_TIME;
    }

    try {
      const data = await this.props.getProfitLoss(
        universe,
        startTime,
        currentAugurTimestamp
      );

      const firstData =
        data.length > 0
          ? data[0]
          : { realized: 0, realizedPercent: 0 };

      const lastData =
        data.length > 0
          ? data[data.length - 1]
          : { realized: 0, realizedPercent: 0 };

      const chartValues = data.reduce(
        (p, d) => ({
          ...p,
          [d.timestamp === 0
            ? startTime * 1000
            : d.timestamp * 1000]: createBigNumber(d.realized).toNumber(),
        }),
        {}
      );

      let profitLossData = [];
      profitLossData = profitLossData.concat(
        Object.keys(chartValues).reduce(
          (p, t) => [...p, [parseInt(t, 10), chartValues[t]]],
          []
        )
      );

      profitLossData.push([
        currentAugurTimestamp * 1000,
        createBigNumber(data[data.length - 1].realized).toNumber(),
      ]);

      if (this.container) {
        const realizedChange = createBigNumber(lastData.realized).minus(firstData.realized);
        this.setState({
          profitLossData,
          profitLossChange: formatDai(realizedChange || 0),
          profitLossChangeHasValue: !createBigNumber(lastData.realized || 0).eq(
            constants.ZERO
          ),
          noTrades: false,
        });
      }
    } catch (error) {
      logError(error);
    }
  };

  render() {
    const {
      profitLossData,
      profitLossChange,
      noTrades,
    } = this.state;

    let content: any = null;
    const { currentAugurTimestamp } = this.props;
    const isLoading = currentAugurTimestamp === 0;
    if (noTrades) {
      content = (
        <>
          <h3>{constants.PROFIT_LOSS_CHART_TITLE}</h3>
          {isLoading && (
            <PulseLoader
              color="#AFA7C1"
              sizeUnit="px"
              size={6}
              loading={isLoading}
            />
          )}
          {!isLoading && <span>No Trading Activity</span>}
        </>
      );
    } else {
      content = (
        <>
          <h3>{constants.PROFIT_LOSS_CHART_TITLE}</h3>
          <MovementLabel
            showIcon
            showPlusMinus
            showBrackets
            value={profitLossChange}
            useFull
          />
          {isLoading && (
            <PulseLoader
              color="#AFA7C1"
              sizeUnit="px"
              size={6}
              loading={isLoading}
            />
          )}
          {!isLoading && (
            <ProfitLossChart
              data={profitLossData}
              // @ts-ignore
              width={this.container.clientWidth}
            />
          )}
        </>
      );
    }
    return (
      <div
        className={Styles.OverviewChart}
        ref={container => {
          this.container = container;
        }}
      >
        {content}
      </div>
    );
  }
}

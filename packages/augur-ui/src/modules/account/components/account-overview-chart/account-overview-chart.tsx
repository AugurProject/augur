import React from "react";

import * as constants from "modules/common-elements/constants";
import { createBigNumber } from "utils/create-big-number";
import { EthIcon } from "modules/common-elements/icons";
import AccountProfitLossChart from "modules/account/components/account-overview-chart/account-profit-loss-chart";
import { MovementLabel } from "modules/common-elements/labels";
import Styles from "modules/account/components/account-overview-chart/account-overview-chart.styles";
import { formatEther } from "utils/format-number";

const ALL_TIME = 3;
export interface AccountOverviewChartProps {
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
}

interface AccountOverviewChartState {
  profitLossData: Array<Array<number>>;
  profitLossChange: string | null;
  profitLossValue: string | null;
  profitLossChangeHasValue: boolean;
  noTrades: boolean;
}

const BEGINNING_START_TIME = 1530366577;
export default class AccountOverviewChart extends React.Component<
  AccountOverviewChartProps,
  AccountOverviewChartState
> {
  state: AccountOverviewChartState = {
    profitLossData: [],
    profitLossChange: null,
    profitLossValue: null,
    profitLossChangeHasValue: false,
    noTrades: true
  };

  componentDidMount = () => {
    const timeRangeDataConfig =
      constants.TIMEFRAME_OPTIONS[this.props.timeframe];
    this.getChartData(timeRangeDataConfig);
  };

  componentDidUpdate = (nextProps: AccountOverviewChartProps) => {
    if (nextProps.timeframe !== this.props.timeframe) {
      const timeRangeDataConfig =
        constants.TIMEFRAME_OPTIONS[this.props.timeframe];
      this.getChartData(timeRangeDataConfig);
    }
  };

  getChartData = (timeRangeDataConfig: TimeFrameOption) => {
    const { universe, currentAugurTimestamp } = this.props;
    const endTime = null;
    let startTime: number | null =
      currentAugurTimestamp - timeRangeDataConfig.periodInterval;
    if (timeRangeDataConfig.id === ALL_TIME) {
      startTime = BEGINNING_START_TIME;
    }
    this.props.getProfitLoss(
      universe,
      startTime,
      endTime,
      null,
      null,
      (err: string, data: Array<UserTimeRangeData>) => {
        if (err) return console.log("Error:", err);
        const noTrades = data
          .reduce(
            (p, d) => createBigNumber(d.totalCost || constants.ZERO).plus(p),
            constants.ZERO
          )
          .eq(constants.ZERO);
        let profitLossData: Array<Array<number>> = [];

        const lastData =
          data.length > 0
            ? data[data.length - 1]
            : { realized: 0, realizedPercent: 0 };

        const chartValues = data.reduce(
          (p, d) => ({
            ...p,
            [d.timestamp * 1000]: createBigNumber(d.realized).toNumber(4)
          }),
          {}
        );

        profitLossData = profitLossData.concat(
          Object.keys(chartValues).reduce(
            (p, t) => [...p, [parseInt(t, 10), chartValues[t]]],
            []
          )
        );

        profitLossData.push([
          currentAugurTimestamp * 1000,
          createBigNumber(data[data.length - 1].realized).toNumber(4)
        ]);

        this.setState({
          profitLossData,
          profitLossChange: formatEther(lastData.realizedPercent || 0)
            .formatted,
          profitLossChangeHasValue: !createBigNumber(
            lastData.realizedPercent || 0
          ).eq(constants.ZERO),
          profitLossValue: formatEther(lastData.realized).formatted,
          noTrades
        });
      }
    );
  };

  container: Object | null = null;

  render() {
    const {
      profitLossData,
      profitLossChange,
      profitLossValue,
      profitLossChangeHasValue,
      noTrades
    } = this.state;
    let content = null;

    if (noTrades) {
      content = (
        <React.Fragment>
          <div>{constants.PROFIT_LOSS_CHART_TITLE}</div>
          <span>No Trading Activity to date</span>
        </React.Fragment>
      );
    } else {
      content = (
        <React.Fragment>
          <div>{constants.PROFIT_LOSS_CHART_TITLE}</div>
          <div>
            <MovementLabel
              showColors
              showIcon={profitLossChangeHasValue}
              showPlusMinus
              showBrackets
              value={profitLossChange}
              size="medium"
            />
          </div>
          <div>
            {profitLossValue}
            {EthIcon}
          </div>
          <AccountProfitLossChart
            data={profitLossData}
            width={this.container.clientWidth}
          />
        </React.Fragment>
      );
    }
    return (
      <div
        className={Styles.AccountOverviewChart}
        ref={container => {
          this.container = container;
        }}
      >
        {content}
      </div>
    );
  }
}

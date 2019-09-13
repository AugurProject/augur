import React, { Component } from 'react';
import { augurSdk } from 'services/augursdk';
import classNames from 'classNames';
import Styles from 'modules/create-market/components/visibility.styles';
import {
  LargeSubheaders,
  ContentBlock,
  SmallHeaderLink,
  SmallSubheaders,
  SmallSubheadersTooltip,
} from 'modules/create-market/components/common';
import { getMarketLiquidityRanking } from 'modules/create-market/actions/get-market-liquidity-ranking';
import {
  CATEGORICAL,
  SCALAR,
	MAX_SPREAD_10_PERCENT,
	BUY
} from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import {
  constructMarketParamsReturn,
  constructMarketParams,
} from 'modules/create-market/helpers/construct-market-params';
import {
  tickSizeToNumTickWithDisplayPrices,
  convertDisplayValuetoAttoValue,
  convertDisplayPriceToOnChainPrice,
  marketNameToType,
} from '@augurproject/sdk';

export interface VisibilityProps {
  newMarket: NewMarket;
}

export interface VisibilityState {
  marketRank: number;
  totalMarkets: number;
  hasLiquidity: boolean;
}

export default class Visibility extends Component<
  VisibilityProps,
  VisibilityState
> {
  constructor(props) {
    super(props);

    this.state = {
      marketRank: 0,
      totalMarkets: 0,
      hasLiquidity: props.newMarket.initialLiquidityDai.toString() !== '0',
    };
  }

  calculateParams(newMarket) {
    const {
      marketType,
      outcomesFormatted,
      tickSize,
      maxPriceBigNumber,
      minPriceBigNumber,
      orderBook,
      settlementFee,
    } = newMarket;
    const tickSizeBigNumber = createBigNumber(tickSize);
    const numTicks = tickSizeToNumTickWithDisplayPrices(
      tickSizeBigNumber,
      minPriceBigNumber,
      maxPriceBigNumber
    );
    // backend uses YesNo, ui uses yesNo, this ensures capital Y if that's the case.
    const marketName = marketType.charAt(0).toUpperCase() + marketType.slice(1);
    const marketTypeNumber = marketNameToType(marketName);
    let formattedOrderBook = {};
    Object.entries(orderBook).forEach(([outcome, orders]) => {
      const numOutcome = parseInt(outcome);
      formattedOrderBook[numOutcome] = { bids: [], asks: [] };
      orders.forEach(order => {
        const formattedOrder = {
          price: convertDisplayPriceToOnChainPrice(
            createBigNumber(order.price),
            minPriceBigNumber,
            tickSizeBigNumber
          ).toFixed(),
          amount: convertDisplayValuetoAttoValue(
            createBigNumber(order.quantity)
          ).toFixed(),
        };
        if (order.type === BUY) {
          formattedOrderBook[numOutcome].bids.push(formattedOrder);
        } else {
          formattedOrderBook[numOutcome].asks.push(formattedOrder);
        }
      });
    });
    const params = {
      orderBook: formattedOrderBook,
      numTicks: numTicks.toFixed(),
      numOutcomes: outcomesFormatted.length,
      marketType: marketTypeNumber,
      marketFeeDivisor: `${settlementFee}`,
      reportingFeeDivisor: '0',
      spread: parseFloat(MAX_SPREAD_10_PERCENT),
    };
    return params;
  }

  getMarketLiquidityRanking = async (
    params,
    callback: NodeStyleCallback = logError
  ) => {
    const Augur = augurSdk.get();
    const MarketLiquidityRanking = await Augur.getMarketLiquidityRanking(
      params
    );
    callback(null, MarketLiquidityRanking);
  };

  getRanking() {
    const { newMarket } = this.props;
    const params = this.calculateParams(newMarket);
    this.getMarketLiquidityRanking(params, (err, updates) =>
      this.setState({ ...updates })
    );
  }

  componentDidUpdate(prevProps) {
    const { newMarket } = this.props;
    if (
      prevProps.newMarket.initialLiquidityDai.comparedTo(
        newMarket.initialLiquidityDai
      ) !== 0 ||
      prevProps.newMarket.settlementFee !== newMarket.settlementFee
    ) {
      this.getRanking();
    }
  }

  componentDidMount() {
    this.getRanking();
  }

  render() {
    const { marketRank, totalMarkets, hasLiquidity } = this.state;

    return (
      <ContentBlock dark>
        <div
          className={classNames(Styles.Visibility, {
            [Styles.Passing]: hasLiquidity,
          })}
        >
          <LargeSubheaders
            link
            header="Market visibility"
            subheader="To ensure your market is visible to users you must pass the spread filter check. To improve the ranking or visiblity of your market, ensure you add good liquidity to each outcome."
          />
          <SmallSubheadersTooltip
            header="default Spread filter check"
            subheader={hasLiquidity ? 'Pass' : 'Fail'}
            text="Info text"
          />

          {!hasLiquidity && (
            <SmallSubheaders
              header="How to pass spread filter check"
              subheader="New suggestion: Tighten spread to less than 15% on [Outcome: X] to pass spread filter check"
            />
          )}

          <SmallSubheadersTooltip
            header="Market ranking"
            subheader={`${marketRank} / ${totalMarkets}`}
            text="Info text"
          />

          <SmallSubheaders
            header="default Spread filter check"
            subheader="1. Add Buy and Sell orders to any outcomes that do not have orders"
          />
        </div>
      </ContentBlock>
    );
  }
}

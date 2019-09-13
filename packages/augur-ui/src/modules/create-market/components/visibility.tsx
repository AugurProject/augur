import React, { Component } from 'react';

import Styles from 'modules/create-market/components/visibility.styles';
import {
  LargeSubheaders,
  ContentBlock,
  SmallHeaderLink,
  SmallSubheaders,
  SmallSubheadersTooltip,
} from 'modules/create-market/components/common';
import { getMarketLiquidityRanking } from 'modules/create-market/actions/get-market-liquidity-ranking';
import { CATEGORICAL, SCALAR } from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import {
  constructMarketParamsReturn,
  constructMarketParams,
} from 'modules/create-market/helpers/construct-market-params';
import {
  CreateYesNoMarketParams,
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  stringTo32ByteHex,
  tickSizeToNumTickWithDisplayPrices,
  convertDisplayValuetoAttoValue,
  convertDisplayPriceToOnChainPrice,
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
    let marketTypeNumber = 0;
    switch (marketType) {
      case CATEGORICAL:
        marketTypeNumber = 1;
        break;
      case SCALAR:
        marketTypeNumber = 2;
        break;
      default:
        break;
    }
    const formattedOrderBook = {};

    Object.entries(orderBook).forEach(([outcome, orders]) => {
      formattedOrderBook[outcome] = {
        bids: [],
        asks: [],
      };
      orders.forEach(order => {
        const formattedOrder = {
          price: convertDisplayPriceToOnChainPrice(
            createBigNumber(order.price),
            minPriceBigNumber,
            tickSizeBigNumber
          ).toFixed(),
          quantity: convertDisplayValuetoAttoValue(
            createBigNumber(order.quantity)
          ).toFixed(),
        };
        if (order.type === 'buy') {
          formattedOrderBook[outcome].bids.push(formattedOrder);
        } else {
          formattedOrderBook[outcome].asks.push(formattedOrder);
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
			spread: 10,
    };
    return params;
  }

  getRanking() {
    const { newMarket } = this.props;
		const params = this.calculateParams(newMarket);
    getMarketLiquidityRanking(params, (err, updates) => {
			if (err) return null;
      this.setState({ ...updates });
    });
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
    const { marketRank, totalMarkets } = this.state;

    return (
      <ContentBlock dark>
        <div className={Styles.Visibility}>
          <LargeSubheaders
            link
            header="Market visibility"
            subheader="To ensure your market is visible to users you must pass the spread filter check. To improve the ranking or visiblity of your market, ensure you add good liquidity to each outcome."
          />
          <SmallSubheadersTooltip
            header="default Spread filter check"
            subheader="Fail"
            text="Info text"
          />

          <SmallSubheaders
            header="How to pass spread filter check"
            subheader="New suggestion: Tighten spread to less than 15% on [Outcome: X] to pass spread filter check"
          />

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

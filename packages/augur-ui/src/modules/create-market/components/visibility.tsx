import React, { Component } from 'react';
import { augurSdk } from 'services/augursdk';
import classNames from 'classNames';
import Styles from 'modules/create-market/components/visibility.styles';
import {
  LargeSubheaders,
  ContentBlock,
  SmallSubheaders,
  SmallSubheadersTooltip,
} from 'modules/create-market/components/common';
import { MAX_SPREAD_10_PERCENT, BUY, ZERO } from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import {
  tickSizeToNumTickWithDisplayPrices,
  convertDisplayValuetoAttoValue,
  convertDisplayPriceToOnChainPrice,
  marketNameToType,
} from '@augurproject/sdk';
import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';

export interface VisibilityProps {
  newMarket: NewMarket;
}

export interface Validations {
  hasLiquidity: boolean;
  hasSells: boolean;
  hasBuys: boolean;
  validSpread: boolean;
}

export interface VisibilityState {
  marketRank: number;
  totalMarkets: number;
  hasLiquidity: boolean;
  validations: Validations;
  validationMessage: string;
  previousRank: number;
}

// 1. spread to wide
// 2. no bids
// 3. no sells
// 4. no liquidity at all
const DEFAULT_VALIDATIONS = {
  hasLiquidity: false,
  hasSells: false,
  hasBuys: false,
  validSpread: false,
};

const VALIDATION_TIPS = {
  liquidity: () =>
    'Add Buy and Sell orders to a single outcome to pass the spread filter check.',
  sells: outcomeName =>
    `Add a Sell order on "${outcomeName}" to pass the spread filter check.`,
  buys: outcomeName =>
    `Add a Buy order on "${outcomeName}" to pass the spread filter check.`,
  spread: outcomeName =>
    `Tighten spread to less than ${MAX_SPREAD_10_PERCENT}% on "${outcomeName}" to pass spread filter check.`,
};

export default class Visibility extends Component<
  VisibilityProps,
  VisibilityState
> {
  constructor(props) {
    super(props);

    this.state = {
      marketRank: 0,
      totalMarkets: 0,
      hasLiquidity: false,
      validations: DEFAULT_VALIDATIONS,
      validationMessage: VALIDATION_TIPS.liquidity(),
      previousRank: 0,
    };
  }

  validate(newMarket, hasBuys, hasSells, closestOutcome, spreadValid) {
    const validations = DEFAULT_VALIDATIONS;
    const closestOutcomeName = newMarket.outcomesFormatted.find(
      outcome => outcome.id === closestOutcome
    ).description;
    let validationMessage = '';
    validations.hasLiquidity = newMarket.initialLiquidityDai.toString() !== '0';
    validations.hasBuys = hasBuys;
    validations.hasSells = hasSells;
    validations.validSpread = spreadValid;

    if (!validations.hasLiquidity) {
      validationMessage = VALIDATION_TIPS.liquidity();
    } else if (!hasBuys || !hasSells) {
      validationMessage = !hasBuys
        ? VALIDATION_TIPS.buys(closestOutcomeName)
        : VALIDATION_TIPS.sells(closestOutcomeName);
    } else if (!spreadValid) {
      validationMessage = VALIDATION_TIPS.spread(closestOutcomeName);
    }
    return { validations, validationMessage };
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
    const marketTypeNumber = marketNameToType(marketType);
    let formattedOrderBook = {};
    let hasBuys = false;
    let hasSells = false;
    let closestOutcome = 0;
    let spreadValid = false;
    const maxOnChain = convertDisplayPriceToOnChainPrice(
      maxPriceBigNumber,
      minPriceBigNumber,
      tickSizeBigNumber
    );
    const onChainSpread = createBigNumber(`.${MAX_SPREAD_10_PERCENT}`).times(
      maxOnChain
    );
    Object.entries(orderBook).forEach(([outcome, orders]: Array<any>) => {
      const numOutcome = parseInt(outcome);
      formattedOrderBook[numOutcome] = { bids: [], asks: [] };
      let spreadCheck = [ZERO, ZERO];
      orders.forEach(order => {
        const bnPrice = convertDisplayPriceToOnChainPrice(
          createBigNumber(order.price),
          minPriceBigNumber,
          tickSizeBigNumber
        );
        const formattedOrder = {
          price: bnPrice.toFixed(),
          amount: convertDisplayValuetoAttoValue(
            createBigNumber(order.quantity)
          ).toFixed(),
        };
        if (order.type === BUY) {
          hasBuys = true;
          formattedOrderBook[numOutcome].bids.push(formattedOrder);
          if (bnPrice.isGreaterThan(spreadCheck[0])) {
            spreadCheck[0] = bnPrice;
          }
        } else {
          hasSells = true;
          formattedOrderBook[numOutcome].asks.push(formattedOrder);
          if (
            bnPrice.isLessThan(spreadCheck[1]) ||
            spreadCheck[1].toFixed() === '0'
          ) {
            spreadCheck[1] = bnPrice;
          }
        }
        if (hasBuys || (hasSells && !spreadValid && closestOutcome === 0))
          closestOutcome = numOutcome;
        if (
          spreadCheck[0].plus(onChainSpread).isGreaterThan(spreadCheck[1]) &&
          spreadCheck[1].isGreaterThan(0)
        )
          spreadValid = true;
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
    return {
      params,
      hasBuys,
      hasSells,
      closestOutcome,
      spreadValid,
    };
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
    const { marketRank } = this.state;
    const {
      params,
      hasBuys,
      hasSells,
      closestOutcome,
      spreadValid,
    } = this.calculateParams(newMarket);
    const { validations, validationMessage } = this.validate(
      newMarket,
      hasBuys,
      hasSells,
      closestOutcome,
      spreadValid
    );
    this.getMarketLiquidityRanking(params, (err, updates) => {
      this.setState({
        ...updates,
        marketRank:
          updates.marketRank === 0 ? updates.totalMarkets : updates.marketRank,
        previousRank: marketRank === 0 ? updates.totalMarkets : marketRank,
        validations,
        validationMessage,
      });
    });
  }

  componentDidUpdate(prevProps) {
    const { newMarket } = this.props;
    if (
      prevProps.newMarket.initialLiquidityDai.comparedTo(
        newMarket.initialLiquidityDai
      ) !== 0
    ) {
      this.getRanking();
    }
  }

  componentDidMount() {
    this.getRanking();
  }

  render() {
    const {
      marketRank,
      totalMarkets,
      validationMessage,
      previousRank,
    } = this.state;
    const isValid = validationMessage.length === 0;
    const rankUpdate = totalMarkets - marketRank;
    const rankingString = `+ ${rankUpdate} ranking`;

    return (
      <ContentBlock dark>
        <div
          className={classNames(Styles.Visibility, {
            [Styles.Passing]: isValid,
          })}
        >
          <LargeSubheaders
            link
            header="Market visibility"
            subheader="To ensure your market is visible to users you must pass the spread filter check. To improve the ranking or visiblity of your market, ensure you add good liquidity to each outcome."
          />
          <SmallSubheadersTooltip
            header="default Spread filter check"
            subheader={isValid ? 'Pass' : 'Fail'}
            text="Info text"
          />

          {!isValid && (
            <SmallSubheaders
              header="How to pass spread filter check"
              subheader={validationMessage}
            />
          )}

          <SmallSubheadersTooltip
            header="Market ranking"
            subheader={
              <span>
                {`${marketRank} / ${totalMarkets} `}
                <span className={Styles.Positive}>{rankingString}</span>
              </span>
            }
            text="Info text"
          />

          <SmallSubheaders
            header="how to improve market ranking"
            subheader="Add both Buy and Sell orders to an outcome, increase quantity to increase ranking."
          />
        </div>
      </ContentBlock>
    );
  }
}

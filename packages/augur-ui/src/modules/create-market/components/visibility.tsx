import React, { Component } from 'react';
import { augurSdk } from 'services/augursdk';
import classNames from 'classnames';
import Styles from 'modules/create-market/components/visibility.styles.less';
import {
  LargeSubheaders,
  ContentBlock,
  SmallSubheaders,
  SmallSubheadersTooltip,
} from 'modules/create-market/components/common';
import { MAX_SPREAD_10_PERCENT, BUY, SCALAR } from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import {
  tickSizeToNumTickWithDisplayPrices,
  convertDisplayPriceToOnChainPrice,
  marketNameToType,
  convertDisplayAmountToOnChainAmount,
} from '@augurproject/sdk-lite';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { MARKET_COPY_LIST } from 'modules/create-market/constants';
import { getReportingDivisor } from 'modules/contracts/actions/contractCalls';

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
  reportingFeeDivisor: string;
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

const bnSpreadFilter = createBigNumber(`.${MAX_SPREAD_10_PERCENT}`);

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
      reportingFeeDivisor: '10000',
    };
  }

  getNumOutcomes(marketType, numOutcomes) {
    return marketType === SCALAR ? 3 : numOutcomes;
  }

  validate(newMarket: NewMarket) {
    const validations = DEFAULT_VALIDATIONS;
    let validationMessage = '';

    validations.hasLiquidity = newMarket.initialLiquidityDai.toString() !== '0';

    if (!validations.hasLiquidity) {
      validationMessage = VALIDATION_TIPS.liquidity();
      return { validations, validationMessage };
    }

    let closestOutcome = 0;

    Object.entries(newMarket.orderBook).forEach(
      ([outcome, orders]: Array<any>) => {
        const { asks, bids, spread } = formatOrderBook(orders);
        if (asks.length > 0) validations.hasSells = true;
        if (bids.length > 0) validations.hasBuys = true;
        if (asks.length > 0 || bids.length > 0) {
          closestOutcome = parseInt(outcome);
        }
        if (spread) {
          if (newMarket.marketType === SCALAR) {
            const range = createBigNumber(newMarket.maxPrice).minus(
              createBigNumber(newMarket.minPrice)
            );
            validations.validSpread = createBigNumber(spread)
              .dividedBy(range)
              .isLessThan(bnSpreadFilter);
          } else {
            validations.validSpread = createBigNumber(
              spread
            ).isLessThan(bnSpreadFilter);
          }
        }
        if (validations.validSpread) return { validations, validationMessage };
      }
    );

    const closestOutcomeName = newMarket.outcomesFormatted.find(
      outcome => outcome.id === closestOutcome
    ).description;

    if (!validations.hasBuys || !validations.hasSells) {
      validationMessage = !validations.hasBuys
        ? VALIDATION_TIPS.buys(closestOutcomeName)
        : VALIDATION_TIPS.sells(closestOutcomeName);
    } else if (!validations.validSpread) {
      validationMessage = VALIDATION_TIPS.spread(closestOutcomeName);
    }

    return { validations, validationMessage };
  }

  calculateParams(newMarket) {
    const {
      marketType,
      outcomesFormatted,
      tickSize,
      maxPrice,
      minPrice,
      orderBook,
      settlementFee,
    } = newMarket;
    const minPriceBigNumber = createBigNumber(minPrice);
    const maxPriceBigNumber = createBigNumber(maxPrice);
    const tickSizeBigNumber = createBigNumber(tickSize);
    const numTicks = tickSizeToNumTickWithDisplayPrices(
      tickSizeBigNumber,
      minPriceBigNumber,
      maxPriceBigNumber
    );
    const marketTypeNumber = marketNameToType(marketType);
    let formattedOrderBook = {};

    Object.entries(orderBook).forEach(([outcome, orders]: Array<any>) => {
      formattedOrderBook[outcome] = { bids: [], asks: [] };
      orders.forEach(order => {
        const formattedOrder = {
          price: convertDisplayPriceToOnChainPrice(
            createBigNumber(order.price),
            minPriceBigNumber,
            tickSizeBigNumber
          ).toFixed(),
          amount: convertDisplayAmountToOnChainAmount(
            createBigNumber(order.quantity),
            createBigNumber(tickSize)
          ).toFixed(),
        };
        if (order.type === BUY) {
          formattedOrderBook[outcome].bids.push(formattedOrder);
        } else {
          formattedOrderBook[outcome].asks.push(formattedOrder);
        }
      });
    });

    return {
      orderBook: formattedOrderBook,
      numTicks: numTicks.toFixed(),
      numOutcomes: this.getNumOutcomes(marketType, outcomesFormatted.length),
      marketType: marketTypeNumber,
      feePerCashInAttoCash: String(settlementFee),
      reportingFeeDivisor: String(this.state.reportingFeeDivisor),
      spread: parseInt(MAX_SPREAD_10_PERCENT),
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
    const { validations, validationMessage } = this.validate(newMarket);
    const { hasLiquidity } = validations;
    if ((hasLiquidity)) {
      const params = this.calculateParams(newMarket);
      this.getMarketLiquidityRanking(params, (err, updates) => {
        this.setState({
          ...updates,
          marketRank:
            updates.marketRank === 0
              ? updates.totalMarkets
              : updates.marketRank,
          validations,
          validationMessage,
        });
      });
    } else {
      this.setState({ validations, validationMessage });
    }
  }

  getReportingFeeDivisor = () => {
    getReportingDivisor().then(divisor =>
      this.setState({reportingFeeDivisor: String(divisor)})
    )
  }

  componentDidUpdate(prevProps) {
    const { newMarket } = this.props;
    if (
      String(prevProps.newMarket.initialLiquidityDai) !== (
        String(newMarket.initialLiquidityDai)
      ) || prevProps.newMarket.settlementFee !== newMarket.settlementFee
    ) {
      this.getRanking();
    }
  }

  componentDidMount() {
    this.getReportingFeeDivisor();
    this.getRanking();
  }

  render() {
    const { marketRank, totalMarkets, validationMessage, hasLiquidity, validations } = this.state;
    const rankUpdate = totalMarkets - marketRank;
    const rankingString = `+${rankUpdate} ranking`;

    return (
      <ContentBlock dark>
        <div
          className={classNames(Styles.Visibility, {
            [Styles.Passing]: hasLiquidity,
          })}
        >
          <LargeSubheaders
            link
            copyType={MARKET_COPY_LIST.VISIBILITY}
            header="Market visibility"
            subheader="To ensure your market is visible to users you must pass the spread filter check. To improve the ranking or visiblity of your market, ensure you add sizeable liquidity to each outcome."
          />
          <SmallSubheadersTooltip
            header="default Spread filter check"
            subheader={hasLiquidity ? 'Pass' : 'Fail'}
            text="Displays markets based on how much liquidity there is available under a 15% spread"
          />

          {!hasLiquidity && (
            <SmallSubheaders
              header="How to pass spread filter check"
              subheader={(!hasLiquidity && validations.hasBuys && validations.hasSells) ? "Increase quantity size to both sides to Pass." : validationMessage}
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
            text="Shows how your market will compare to all other markets"
          />

          <SmallSubheaders
            header="how to improve market ranking"
            subheader={"Add both Buy and Sell orders to an outcome, increase quantity to increase ranking."}
          />
        </div>
      </ContentBlock>
    );
  }
}

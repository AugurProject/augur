import React, { useState, useEffect } from 'react';
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
import { useAppStatusStore } from 'modules/app/store/app-status';

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
const getNumOutcomes = (marketType, numOutcomes) =>
  marketType === SCALAR ? 3 : numOutcomes;

const calculateParams = (
  {
    marketType,
    outcomesFormatted,
    tickSize,
    maxPrice,
    minPrice,
    orderBook,
    settlementFee,
  }: NewMarket,
  reportingFeeDivisor: string
) => {
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

  const Augur = augurSdk ? augurSdk.get() : undefined;

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
          createBigNumber(tickSize),
          Augur.precision,
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
    numOutcomes: getNumOutcomes(marketType, outcomesFormatted.length),
    marketType: marketTypeNumber,
    feePerCashInAttoCash: String(settlementFee),
    reportingFeeDivisor: String(reportingFeeDivisor),
    spread: parseInt(MAX_SPREAD_10_PERCENT),
  };
};

const validate = ({
  initialLiquidityDai,
  orderBook,
  marketType,
  maxPrice,
  minPrice,
  outcomesFormatted,
}: NewMarket) => {
  const validations = DEFAULT_VALIDATIONS;
  let validationMessage = '';

  validations.hasLiquidity = initialLiquidityDai.toString() !== '0';

  if (!validations.hasLiquidity) {
    validationMessage = VALIDATION_TIPS.liquidity();
    return { validations, validationMessage };
  }

  let closestOutcome = 0;

  Object.entries(orderBook).forEach(([outcome, orders]: Array<any>) => {
    const { asks, bids, spread } = formatOrderBook(orders);
    if (asks.length > 0) validations.hasSells = true;
    if (bids.length > 0) validations.hasBuys = true;
    if (asks.length > 0 || bids.length > 0) {
      closestOutcome = parseInt(outcome);
    }
    if (spread) {
      if (marketType === SCALAR) {
        const range = createBigNumber(maxPrice).minus(
          createBigNumber(minPrice)
        );
        validations.validSpread = createBigNumber(spread)
          .dividedBy(range)
          .isLessThan(bnSpreadFilter);
      } else {
        validations.validSpread = createBigNumber(spread).isLessThan(
          bnSpreadFilter
        );
      }
    }
    if (validations.validSpread) return { validations, validationMessage };
  });

  const closestOutcomeName = outcomesFormatted.find(
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
};

const getMarketLiquidityRanking = async (
  params,
  callback: NodeStyleCallback = logError
) => {
  const Augur = augurSdk.get();
  const MarketLiquidityRanking = await Augur.getMarketLiquidityRanking(params);
  callback(null, MarketLiquidityRanking);
};

export const Visibility = () => {
  const { newMarket } = useAppStatusStore();
  const [reportingFeeDivisor, setReportingFeeDivisor] = useState('10000');
  const [marketRank, setMarketRank] = useState(0);
  const [totalMarkets, setTotalMarkets] = useState(0);
  const [hasLiquidity, setHasLiquidty] = useState(false);
  const [validationMessage, setValidationMessage] = useState(
    VALIDATION_TIPS.liquidity()
  );

  useEffect(() => {
    getReportingDivisor().then(divisor => {
      setReportingFeeDivisor(String(divisor));
    });
  }, [false]);

  useEffect(() => {
    getRanking();
  }, [newMarket.initialLiquidityDai, newMarket.settlementFee]);

  const getRanking = () => {
    const { validations, validationMessage } = validate(newMarket);
    const { hasLiquidity } = validations;
    if (hasLiquidity) {
      const params = calculateParams(newMarket, reportingFeeDivisor);
      getMarketLiquidityRanking(params, (err, updates) => {
        setHasLiquidty(updates.hasLiquidity);
        setTotalMarkets(updates.totalMarkets);
        setMarketRank(
          updates.marketRank === 0 ? updates.totalMarkets : updates.marketRank
        );
        setValidationMessage(validationMessage);
      });
    } else {
      setValidationMessage(validationMessage);
    }
  };

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
          subheader="To ensure your market is visible to users you must pass the spread filter check. To improve the ranking or visiblity of your market, ensure you add good liquidity to each outcome."
        />
        <SmallSubheadersTooltip
          header="default Spread filter check"
          subheader={hasLiquidity ? 'Pass' : 'Fail'}
          text="Displays markets based on how much liquidity there is available under a 15% spread"
        />

        {!hasLiquidity && (
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
          text="Shows how your market will compare to all other markets"
        />

        <SmallSubheaders
          header="how to improve market ranking"
          subheader="Add both Buy and Sell orders to an outcome, increase quantity to increase ranking."
        />
      </div>
    </ContentBlock>
  );
};

export default Visibility;

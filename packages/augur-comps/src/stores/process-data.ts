import {
  AmmTransaction,
  Trades,
  AmmExchange,
  Cash,
  Cashes,
  MarketOutcome,
  TransactionTypes,
  MarketInfo,
  ActivityData,
  ProcessedData,
} from '../utils/types';
import { BigNumber as BN } from 'bignumber.js';
import { getDayFormat, getDayTimestamp, getTimeFormat } from '../utils/date-utils';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk';
import {
  convertOnChainCashAmountToDisplayCashAmount,
  formatShares,
  convertOnChainSharesToDisplayShareAmount,
  isSameAddress,
  formatCash,
  formatCashPrice,
  formatSimpleShares,
} from '../utils/format-number';
import {
  BUY,
  MARKET_STATUS,
  OUTCOME_INVALID_NAME,
  OUTCOME_NO_NAME,
  OUTCOME_YES_NAME,
  DAYS_IN_YEAR,
  SELL,
  SEC_IN_DAY,
} from '../utils/constants';
import { timeSinceTimestamp } from '../utils/time-since';
import { getMarketInvalidity } from '../utils/contract-calls';
import { Web3Provider } from '@ethersproject/providers'
export interface GraphMarket {
  id: string;
  description: string;
  endTimestamp: string;
  timestamp: string;
  status: string;
  extraInfoRaw: string;
  fee: string;
  categories: string[];
  outcomes: GraphMarketOutcome[];
  amms: GraphAmmExchange[];
  numTicks: string;
  tradingProceedsClaimed: GraphClaims[];
  symbols: string[];
  universe?: {
    id: string;
    reportingFee: string;
  };
  currentDisputeWindow?: {
    id: string,
    endTime: string,
  }
}

export interface GraphClaims {
  id: string;
  shareToken: {
    id: string;
  };
  sender: {
    id: string;
  };
  outcome: number;
  numPayoutTokens: string;
  fees: string;
  timestamp: string;
}
export interface GraphMarketOutcome {
  id: string;
  isFinalNumerator: boolean;
  payoutNumerator: string;
  value: string;
}
export interface GraphTransaction {
  id: string;
  cash: string;
  noShares: string;
  yesShares: string;
  sender: { id: string };
  timestamp: string;
  tx_hash: string;
}
export interface GraphEnter extends GraphTransaction {
  price: string;
}

export interface GraphExit extends GraphTransaction {
  price: string;
}

export interface GraphAddLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange;
  cashValue: string;
  lpTokens: string;
  yesShareCashValue: string;
  noShareCashValue: string;
  netShares: string;
}

export interface GraphRemoveLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange;
  cashValue: string;
  yesShareCashValue: string;
  noShareCashValue: string;
}

export interface GraphInvalidPool {
  id: string;
  cashBalance: string;
  cashWeight: string;
  invalidBalance: string;
  invalidWeight: string;
  spotPrice: string[];
  swapFee: string;
}
export interface GraphAmmExchange {
  id: string;
  cashBalance: string;
  shareToken: {
    id: string;
    cash: {
      id: string;
    };
  };
  liquidity: string;
  liquidityInvalid: string;
  liquidityNo: string;
  liquidityYes: string;
  volumeYes: string;
  volumeNo: string;
  percentageNo: string;
  percentageYes: string;
  feePercent: string;
  fee: string;
  enters: GraphEnter[];
  exits: GraphExit[];
  addLiquidity: GraphAddLiquidity[];
  removeLiquidity: GraphRemoveLiquidity[];
  totalSupply: string;
  invalidPool: GraphInvalidPool;
  symbols: string[];
}

export interface GraphData {
  markets: GraphMarket[];
  past: GraphMarket[];
  paraShareTokens: {};
  cashes: { [address: string]: Cash };
}

export const processGraphMarkets = async (graphData: GraphData, provider?: Web3Provider): Promise<ProcessedData> => {
  const { markets: rawMarkets, past: rawPastMarkets, cashes } = graphData;
  const keyedMarkets: { [marketId: string]: GraphMarket } = rawMarkets.reduce(
    (group, a) => ({ ...group, [a.id]: a }),
    {}
  );
  const keyedPastMarkets: {
    [marketId: string]: GraphMarket;
  } = rawPastMarkets.reduce((group, a) => ({ ...group, [a.id]: a }), {});

  let markets = {};
  let ammExchanges = {};
  Object.keys(keyedMarkets).forEach(async (marketId) => {
    const market = keyedMarkets[marketId];
    const pastMarket = keyedPastMarkets[marketId];
    const amms = market.amms;

    // keying markets by marketId or marketId-ammExchange.id.
    if (amms.length === 0) {
      markets[marketId] = shapeMarketInfo(market, null, cashes);
    } else if (amms.length === 1) {
      const ammExchange = shapeAmmExchange(
        amms[0],
        pastMarket?.amms[0],
        cashes,
        market
      );
      const ammMarket = shapeMarketInfo(market, ammExchange, cashes);
      markets[`${marketId}-${ammExchange.id}`] = ammMarket;
      ammExchange.market = ammMarket;
      ammExchanges[ammExchange.id] = ammExchange;
    } else {
      const marketAmms: {
        [marketId: string]: GraphAmmExchange;
      } = market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});
      const pastMarketAmms: {
        [marketId: string]: GraphAmmExchange;
      } = pastMarket.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});

      Object.keys(marketAmms).forEach(async (ammId) => {
        const amm = marketAmms[ammId];
        const pastAmm = pastMarketAmms[ammId];
        const newAmmExchange = shapeAmmExchange(amm, pastAmm, cashes, market);
        const ammMarket = shapeMarketInfo(market, newAmmExchange, cashes);
        markets[`${marketId}-${ammId}`] = ammMarket;
        ammExchanges[newAmmExchange.id] = newAmmExchange;
        newAmmExchange.market = ammMarket;
      });
    }
  });

  let uMarkets = markets;
  let uAmmExchanges = ammExchanges;
  if (provider) {
    const result = await getMarketInvalidity(provider, markets, ammExchanges, cashes);
    uMarkets = result.markets;
    uAmmExchanges = result.ammExchanges;
  }

  return { cashes, markets: uMarkets, ammExchanges: uAmmExchanges, errors: null };
};

const shapeMarketInfo = (
  market: GraphMarket,
  ammExchange: AmmExchange,
  cashes: Cashes
): MarketInfo => {
  const extraInfo = JSON.parse(market?.extraInfoRaw);
  const feeAsPercent = convertAttoValueToDisplayValue(new BN(market.fee)).times(
    100
  );
  const reportingFeeAsPercent = new BN(1).dividedBy(new BN(market.universe.reportingFee)).times(100);
  const shareTokenCashes = Object.values(cashes).reduce(
    (p, c) => ({ ...p, [c.shareToken.toLowerCase()]: c }),
    {}
  );
  let reportingState = MARKET_STATUS.TRADING;
  const currentTime = Number(Math.floor(new Date().getTime() / 1000));

  if (currentTime > Number(market.endTimestamp)) {
    reportingState = MARKET_STATUS.REPORTING;
  }
  // set market awaiting finalized to finalized
  if (market?.currentDisputeWindow?.endTime && Number(currentTime) > Number(market?.currentDisputeWindow?.endTime)) {
    reportingState = MARKET_STATUS.FINALIZED
  }

  const claimedProceeds = market.tradingProceedsClaimed
    .filter((t) => t.numPayoutTokens !== '0')
    .map((t) => {
      const cash = shareTokenCashes[t.shareToken.id.toLowerCase()];
      return {
        id: t.id,
        shareToken: t.shareToken.id,
        user: t.sender.id,
        outcome: Number(t.outcome),
        rawSharesClaimed: t.numPayoutTokens,
        fees: String(
          convertOnChainCashAmountToDisplayCashAmount(t.fees, cash?.decimals)
        ),
        winnings: String(
          convertOnChainCashAmountToDisplayCashAmount(
            t.numPayoutTokens,
            cash?.decimals
          )
        ),
        timestamp: Number(t.timestamp),
        cash,
      };
    });

  return {
    marketId: market.id,
    numTicks: market.numTicks,
    description: market.description,
    longDescription: extraInfo.longDescription,
    categories: extraInfo?.categories || [],
    endTimestamp: Number(market.endTimestamp),
    creationTimestamp: market.timestamp,
    extraInfoRaw: market.extraInfoRaw,
    fee: String(feeAsPercent),
    reportingFee: String(reportingFeeAsPercent),
    settlementFee: String(feeAsPercent.plus(reportingFeeAsPercent)),
    outcomes: shapeOutcomes(reportingState, market.outcomes),
    amm: ammExchange,
    reportingState,
    claimedProceeds,
    isInvalid: false,
  };
};

const shapeOutcomes = (reportingState: string, graphOutcomes: GraphMarketOutcome[]): MarketOutcome[] =>
  (graphOutcomes || []).map((g) => ({
    id: Number(g.id.split('-')[1]),
    isFinalNumerator: reportingState === MARKET_STATUS.FINALIZED,
    payoutNumerator: g.payoutNumerator,
    name: g.value,
    isInvalid: g.id.indexOf('-0') > -1,
    isWinner: Boolean(Number(g.payoutNumerator)),
  }));

const shapeAmmExchange = (
  amm: GraphAmmExchange,
  pastAmm: GraphAmmExchange,
  cashes: Cashes,
  market: GraphMarket
): AmmExchange => {
  const marketId = market.id;
  const outcomes = shapeOutcomes(null, market.outcomes);
  const cash: Cash = cashes[amm.shareToken.cash.id];
  let transactions = [];
  transactions = transactions.concat(shapeEnterTransactions(amm.enters, cash));
  transactions = transactions.concat(shapeExitTransactions(amm.exits, cash));
  transactions = transactions.concat(
    shapeAddLiquidityTransactions(amm.addLiquidity, cash)
  );
  transactions = transactions.concat(
    shapeRemoveLiquidityTransactions(amm.removeLiquidity, cash)
  );

  let outcomeTrades = outcomes.reduce((p, o) => ({ ...p, [o.id]: [] }), {});

  const trades = getAmmTradeData(
    outcomeTrades,
    amm.enters,
    amm.exits,
    cash.displayDecimals
  );
  const priceYes = Number(amm.percentageNo) / 100;
  const priceNo = Number(amm.percentageYes) / 100;

  const { volumeNo, volumeYes, liquidity, addLiquidity } = amm;
  const {
    volumeNo: pastVolumeNo,
    volumeYes: pastVolumeYes,
    liquidity: pastLiquidity,
    percentageNo: pastPctNo,
    percentageYes: pastPctYes,
  } = pastAmm || {};
  const past24hrPriceYes = pastPctNo ? Number(pastPctNo) / 100 : null;
  const past24hrPriceNo = pastPctYes ? Number(pastPctYes) / 100 : null;

  const volumeNoUSD = calculateVolumeInUsd(volumeNo, priceNo, cash.usdPrice);
  const volumeYesUSD = calculateVolumeInUsd(volumeYes, priceYes, cash.usdPrice);
  const volumeTotal = String(new BN(volumeNo).plus(new BN(volumeYes)));
  const volumeTotalUSD = calculateTotalShareVolumeInUsd(
    volumeNo,
    volumeYes,
    priceNo,
    priceYes,
    cash.usdPrice
  );

  const liquidityUSD = calculateLiquidityInUsd(amm.liquidity, cash.usdPrice);

  const volume24hrNoUSD = calculatePastVolumeInUsd(
    volumeNo,
    pastVolumeNo,
    priceNo,
    cash.usdPrice
  );
  const volume24hrYesUSD = calculatePastVolumeInUsd(
    volumeYes,
    pastVolumeYes,
    priceYes,
    cash.usdPrice
  );
  const volume24hrTotalUSD = Number(
    new BN(volume24hrNoUSD).plus(new BN(volume24hrYesUSD)).toFixed(2)
  );
  const liquidity24hrUSD = calculatePastLiquidityInUsd(
    liquidity,
    pastLiquidity,
    cash.usdPrice
  );

  // TODO: feeDecimal is off by one on graph data, calculating manually update if fixed
  const feeDecimal = String(new BN(amm.fee).div(1000));
  const feeInPercent = String(new BN(feeDecimal).times(100));
  const apy = calculateAmmApy(volumeTotalUSD, amm, feeDecimal, liquidityUSD, addLiquidity);

  const priceNoFixed = priceNo.toFixed(4);
  const priceYesFixed = priceYes.toFixed(4);

  // recreate outcomes specific for amm
  const ammOutcomes = [
    {
      id: 0,
      isInvalid: true,
      price: '0',
      name: OUTCOME_INVALID_NAME,
    },
    {
      id: 1,
      price: priceNoFixed,
      name: OUTCOME_NO_NAME,
    },
    {
      id: 2,
      price: priceYesFixed,
      name: OUTCOME_YES_NAME,
    },
  ];

  return {
    id: amm.id,
    marketId,
    market: null, // gets filled in later
    liquidity: amm.liquidity,
    liquidity24hrUSD,
    liquidityInvalid: amm.liquidityInvalid,
    liquidityNo: amm.liquidityNo,
    liquidityYes: amm.liquidityYes,
    liquidityUSD,
    cash,
    priceNo: priceNoFixed,
    priceYes: priceYesFixed,
    sharetoken: amm?.shareToken?.id,
    percentageNo: amm.percentageNo,
    percentageYes: amm.percentageYes,
    volumeYes,
    volumeNo,
    volumeYesUSD,
    volumeNoUSD,
    feeDecimal,
    feeRaw: amm.fee,
    feeInPercent,
    volumeTotal,
    volume24hrTotalUSD,
    volumeTotalUSD,
    transactions,
    trades,
    past24hrPriceNo: past24hrPriceNo ? past24hrPriceNo.toFixed(2) : null,
    past24hrPriceYes: past24hrPriceYes ? past24hrPriceYes.toFixed(2) : null,
    totalSupply: amm.totalSupply,
    apy,
    ammOutcomes,
    isAmmMarketInvalid: false, // this will be calc by process
    invalidPool: amm?.invalidPool,
    symbols: amm.symbols,
  };
};


const calculateAmmApy = (
  volumeTotalUSD: number,
  amm: GraphAmmExchange,
  feeDecimal: string,
  liquidityUSD: number,
  addLiquidity: GraphAddLiquidity[] = []
): string => {
  const initValue =
    addLiquidity.length > 0 ? Number(addLiquidity[0].timestamp) : 0;
  const startTimestamp = addLiquidity.reduce(
    (p, t) => (Number(t.timestamp) < p ? Number(t.timestamp) : p),
    initValue
  );

  if (
    liquidityUSD === 0 ||
    volumeTotalUSD === 0 ||
    startTimestamp === 0 ||
    feeDecimal === '0'
  )
    return '0';

  const totalFeesInUsd = new BN(volumeTotalUSD).times(new BN(feeDecimal));
  const currTimestamp = Math.floor(new Date().getTime() / 1000); // current time in unix timestamp
  const secondsPast = currTimestamp - startTimestamp;
  const pastDays = Math.floor(new BN(secondsPast).div(SEC_IN_DAY).toNumber());

  const tradeFeeLiquidityPerDay = totalFeesInUsd
    .div(new BN(liquidityUSD))
    .div(new BN(pastDays || 1));

  const tradeFeePerDayInYear = tradeFeeLiquidityPerDay
    .times(DAYS_IN_YEAR)
    .abs()
    .times(100)
    .toFixed(4);

  return String(tradeFeePerDayInYear);
};

const shapeEnterTransactions = (
  transactions: GraphEnter[],
  cash: Cash
): AmmTransaction[] => {
  return transactions.map((e) => {
    const properties = formatTransaction(e, cash);
    const cashValueUsd = new BN(properties.value)
      .times(cash?.usdPrice)
      .toFixed(2);
    const subheader = `Swap ${cash.name} for ${e.noShares !== '0' ? 'No Shares' : 'Yes Shares'
      }`;
    return {
      ...e,
      tx_type: TransactionTypes.ENTER,
      sender: e.sender?.id,
      subheader,
      ...properties,
      cashValueUsd: String(cashValueUsd),
      value: cashValueUsd
    };
  });
};

const shapeExitTransactions = (
  transactions: GraphExit[],
  cash: Cash
): AmmTransaction[] => {
  return transactions.map((e) => {
    const properties = formatTransaction(e, cash);
    const subheader = `Swap ${e.noShares !== '0' ? 'No Shares' : 'Yes Shares'
      } for ${cash.name}`;
    const cashValueUsd = new BN(properties.value)
      .abs()
      .times(cash?.usdPrice)
      .toFixed(2);
    return {
      ...e,
      tx_type: TransactionTypes.EXIT,
      sender: e.sender?.id,
      subheader,
      ...properties,
      value: cashValueUsd,
      cashValueUsd: String(cashValueUsd)
    };
  });
};

const shapeAddLiquidityTransactions = (
  transactions: GraphAddLiquidity[],
  cash: Cash
): AmmTransaction[] => {
  return transactions.map((e) => {
    const properties = formatTransaction(e, cash);
    const subheader = `Add ${cash.name} Liquidity`;
    // TODO: cashValue seems to be off on graph data, work around is to add up yes/no share cashValues
    const totalCashValue = new BN(e.noShareCashValue).plus(e.yesShareCashValue);
    const cashValue =
      convertOnChainSharesToDisplayShareAmount(
        totalCashValue,
        new BN(cash.decimals)
      );
    const cashValueUsd = String(
      cashValue.times(cash.usdPrice)
    );
    const lpTokens = String(
      convertOnChainSharesToDisplayShareAmount(
        new BN(e.lpTokens),
        new BN(cash.decimals)
      )
    );

    return {
      ...e,
      tx_type: TransactionTypes.ADD_LIQUIDITY,
      sender: e.sender?.id,
      subheader,
      ...properties,
      price: null,
      cashValueUsd,
      value: String(cashValue),
      lpTokens,
      netShares: e.netShares,
    };
  });
};

const shapeRemoveLiquidityTransactions = (
  transactions: GraphRemoveLiquidity[],
  cash: Cash
): AmmTransaction[] => {
  return transactions.map((e) => {
    const properties = formatTransaction(e, cash);
    const subheader = `Remove ${cash.name} Liquidity`;
    const cashValue = convertOnChainSharesToDisplayShareAmount(
      new BN(e.cashValue),
      new BN(cash.decimals)
    )
    const cashValueUsd = String(
      cashValue.times(cash.usdPrice)
    );
    const shares = new BN(e.noShares).plus(new BN(e.yesShares));
    const shareAmount = String(
      formatShares(
        convertOnChainSharesToDisplayShareAmount(
          new BN(shares),
          new BN(cash.decimals)
        ),
        {
          decimals: 4,
          decimalsRounded: 4,
        }
      ).formattedValue
    );

    const tokenAmount = `-`; // TODO; graph data needs to to provide lp token amount burnt
    return {
      ...e,
      tx_type: TransactionTypes.REMOVE_LIQUIDITY,
      sender: e.sender?.id,
      subheader,
      ...properties,
      price: null,
      cashValue: String(cashValue),
      cashValueUsd,
      value: String(cashValue),
      tokenAmount,
      shareAmount,
    };
  });
};

const formatTransaction = (
  tx: GraphEnter | GraphExit | GraphAddLiquidity | GraphRemoveLiquidity,
  cash: Cash
) => {
  const tokenAmount = convertOnChainCashAmountToDisplayCashAmount(
    new BN(tx.cash),
    new BN(cash.decimals)
  ).abs();
  const value = String(tokenAmount);
  const date = getDayFormat(tx.timestamp);
  const time = timeSinceTimestamp(Number(tx.timestamp));
  const currency = cash.name;
  const shares = tx.noShares !== '0' ? tx.noShares : tx.yesShares;
  const shareAmount = String(
    formatShares(
      convertOnChainSharesToDisplayShareAmount(
        new BN(shares),
        new BN(cash.decimals)
      ),
      {
        decimals: 4,
        decimalsRounded: 4,
      }
    ).formattedValue
  );
  const tAmount = String(
    formatShares(tokenAmount, {
      decimals: 4,
      decimalsRounded: 4,
    }).formattedValue
  );
  return { shareAmount, currency, time, date, tokenAmount: tAmount, value };
};

const calculateTotalShareVolumeInUsd = (
  volumeNo: string,
  volumeYes: string,
  priceNo: number,
  priceYes: number,
  priceUsd: string
): number => {
  const usePriceYes = priceYes ? priceYes : 0.5;
  const usePriceNo = priceNo ? priceNo : 0.5;
  const normalizedYes = new BN(volumeNo || 0).times(new BN(usePriceNo));
  const normalizedNo = new BN(volumeYes || 0).times(new BN(usePriceYes));
  return normalizedYes.plus(normalizedNo).times(new BN(priceUsd)).toNumber();
};

const hasZeroValue = (value) => value === '0' || !value;
const calculateVolumeInUsd = (
  volumeShare: string,
  priceShare: number,
  priceUsd: string
): string => {
  if (!volumeShare || !priceUsd) return '0';
  const usePrice = hasZeroValue(priceShare) ? 0.5 : priceShare;
  return String(
    new BN(volumeShare).times(new BN(usePrice)).times(new BN(priceUsd))
  );
};

const calculateLiquidityInUsd = (
  volumeOrLiquidity: string,
  priceUsd: string
): number => {
  if (!volumeOrLiquidity || !priceUsd) return 0;
  return Number(new BN(volumeOrLiquidity).times(new BN(priceUsd)).toFixed(2));
};

const calculatePastVolumeInUsd = (
  volume: string = '0',
  pastVolume: string = '0',
  priceShare: number = 0,
  priceUsd: string = '0'
): string => {
  if (hasZeroValue(priceUsd)) return '0';
  // use half way market for price if amm doesn't have price cuz no liquidity
  const usePrice = hasZeroValue(priceShare) ? 0.5 : priceShare;
  return String(
    new BN(volume)
      .minus(new BN(pastVolume))
      .times(new BN(usePrice))
      .times(new BN(priceUsd))
  );
};

const calculatePastLiquidityInUsd = (
  volume: string,
  pastVolume: string,
  priceUsd: string
): string => {
  if (!volume || !pastVolume || !priceUsd) return '0';
  return String(
    new BN(volume).minus(new BN(pastVolume)).times(new BN(priceUsd))
  );
};

// TODO: this needs to chagne when categoricals come along. We'll need to change up graph data processing
const calculateTradePrice = (
  txs: (GraphEnter | GraphExit)[],
  trades: Trades,
  displayDecimals: number
) => {
  return txs.reduce((p, tx) => {
    if (tx.noShares !== '0') {
      const shares = String(
        convertOnChainSharesToDisplayShareAmount(tx.noShares, displayDecimals)
      );
      p[1].push({
        shares: shares,
        price: Number(Number.parseFloat(tx.price).toPrecision(displayDecimals)),
        timestamp: Number(tx.timestamp),
      });
    } else {
      const shares = String(
        convertOnChainSharesToDisplayShareAmount(tx.yesShares, displayDecimals)
      );
      p[2].push({
        shares: shares,
        price: Number(Number.parseFloat(tx.price).toPrecision(displayDecimals)),
        timestamp: Number(tx.timestamp),
      });
    }
    return p;
  }, trades);
};

export const getAmmTradeData = (
  outcomeTrades: Trades,
  enters: GraphEnter[],
  exits: GraphExit[],
  displayDecimals: number
) => {
  const enterTrades = calculateTradePrice(
    enters,
    outcomeTrades,
    displayDecimals
  );
  return calculateTradePrice(exits, enterTrades, displayDecimals);
};

const getActivityType = (
  tx: AmmTransaction,
  cash: Cash
): {
  type: string;
  subheader: string;
  value: string;
} => {
  let type = null;
  let subheader = null;
  let value = null;
  switch (tx.tx_type) {
    case TransactionTypes.ADD_LIQUIDITY: {
      type = 'Add Liquidity';
      value = `${formatCash(tx.value, cash.name).full}`;
      break;
    }
    case TransactionTypes.REMOVE_LIQUIDITY: {
      type = 'Remove Liquidity';
      value = `${formatCash(tx.value, cash.name).full}`;
      break;
    }
    default: {
      const shares =
        tx.yesShares !== '0'
          ? convertOnChainSharesToDisplayShareAmount(
            tx.yesShares,
            cash.decimals
          )
          : convertOnChainSharesToDisplayShareAmount(
            tx.noShares,
            cash.decimals
          );
      const shareType = tx.yesShares !== '0' ? 'Yes' : 'No';
      const formattedPrice = formatCashPrice(tx.price, cash.name);
      subheader = `${formatSimpleShares(String(shares)).full
        } Shares of ${shareType} @ ${formattedPrice.full}`;
      // when design wants to add usd value
      const cashValue = convertOnChainCashAmountToDisplayCashAmount(
        tx.cash,
        cash.decimals
      );
      value = `${formatCash(String(cashValue.abs()), cash.name).full}`;
      type = tx.tx_type === TransactionTypes.ENTER ? BUY : SELL;
      break;
    }
  }
  return {
    type,
    value,
    subheader,
  };
};

export const shapeUserActvity = (
  account: string,
  markets: { [id: string]: MarketInfo },
  ammExchanges: { [id: string]: AmmExchange }
): ActivityData[] =>
  formatUserTransactionActvity(account, markets, ammExchanges);

export const formatUserTransactionActvity = (
  account: string,
  markets: { [id: string]: MarketInfo },
  ammExchanges: { [id: string]: AmmExchange }
): ActivityData[] => {
  if (!ammExchanges || !account) return [];
  const exchanges = Object.values(ammExchanges);
  if (!exchanges || exchanges.length === 0) return [];

  const transactions = exchanges
    .reduce((p, exchange) => {
      const cashName = exchange.cash?.name;
      const userTx: AmmTransaction[] = exchange.transactions.filter((t) =>
        isSameAddress(t.sender, account)
      );

      const claims = markets[
        `${exchange.marketId}-${exchange.id}`
      ].claimedProceeds.filter((c) => isSameAddress(c.user, account) && c.cash.name === cashName);
      if (userTx.length === 0 && claims.length === 0) return p;

      const userClaims = claims.map((c) => {
        return {
          id: c.id,
          currency: cashName,
          description:
            markets[`${exchange.marketId}-${exchange.id}`]?.description,
          type: `Claim Proceeds`,
          date: getDayFormat(c.timestamp),
          sortableMonthDay: getDayTimestamp(String(c.timestamp)),
          time: getTimeFormat(c.timestamp),
          txHash: null,
          timestamp: Number(c.timestamp),
          value: `${formatCash(c.winnings, c.cash.name).full}`,
        };
      });

      const datedUserTx = userTx.map((t) => {
        const typeDetails = getActivityType(t, exchange.cash);
        return {
          id: t.id,
          currency: cashName,
          description:
            markets[`${exchange.marketId}-${exchange.id}`]?.description,
          ...typeDetails,
          date: getDayFormat(t.timestamp),
          sortableMonthDay: getDayTimestamp(t.timestamp),
          time: getTimeFormat(t.timestamp),
          txHash: t.tx_hash,
          timestamp: Number(t.timestamp),
        };
      });
      return [...p, ...datedUserTx, ...userClaims];
    }, [])
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  // form array of grouped by date activities
  return [...transactions]
    .reduce((p, t) => {
      const item = p.find((x) => x.date === t.date);
      if (item) {
        item.activity.push(t);
        return p;
      }
      return [
        ...p,
        {
          date: t.date,
          sortableMonthDay: t.sortableMonthDay,
          activity: [t],
        },
      ];
    }, [])
    .sort((a, b) => (a.sortableMonthDay < b.sortableMonthDay ? 1 : -1));
};

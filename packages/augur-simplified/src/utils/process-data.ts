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
} from '../modules/types';
import { BigNumber as BN } from 'bignumber.js';
import { getDayFormat, getDayTimestamp, getTimeFormat } from './date-utils';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk';
import {
  convertOnChainCashAmountToDisplayCashAmount,
  formatShares,
  convertOnChainSharesToDisplayShareAmount,
  isSameAddress,
  formatCash,
  formatCashPrice,
  formatSimpleShares,
} from './format-number';
import {
  BUY,
  OUTCOME_INVALID_NAME,
  OUTCOME_NO_NAME,
  OUTCOME_YES_NAME,
  SEC_IN_YEAR,
  SELL,
} from '../modules/constants';
import { timeSinceTimestamp } from './time-since';

interface GraphMarket {
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
  tradingProceedsClaimed: GraphClaims[]
}

interface GraphClaims {
  id: string;
  shareToken: {
    id: string;
  }
  outcome: number;
  numPayoutTokens: string;
  fees: string;
  timestamp: string;
}
interface GraphMarketOutcome {
  id: string;
  isFinalNumerator: boolean;
  payoutNumerator: string;
  value: string;
}
interface GraphTransaction {
  id: string;
  cash: string;
  noShares: string;
  yesShares: string;
  sender: { id: string };
  timestamp: string;
  tx_hash: string;
}
interface GraphEnter extends GraphTransaction {
  price: string;
}

interface GraphExit extends GraphTransaction {
  price: string;
}

interface GraphAddLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange;
  cashValue: string;
  lpTokens: string;
  yesShareCashValue: string;
  noShareCashValue: string;
}

interface GraphRemoveLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange;
  cashValue: string;
  yesShareCashValue: string;
  noShareCashValue: string;
}

interface GraphAmmExchange {
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
}

interface GraphData {
  markets: GraphMarket[];
  past: GraphMarket[];
  paraShareTokens: {};
  cashes: { [address: string]: Cash };
}

export const processGraphMarkets = (graphData: GraphData): ProcessedData => {
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
  Object.keys(keyedMarkets).forEach((marketId) => {
    const market = keyedMarkets[marketId];
    const past = keyedPastMarkets[marketId];
    const amms = market.amms;

    // keying markets by marketId or marketId-ammExchange.id.
    if (amms.length === 0) {
      markets[marketId] = shapeMarketInfo(market, null);
    } else if (amms.length === 1) {
      const ammExchange = shapeAmmExchange(
        market.amms[0],
        past?.amms[0],
        cashes,
        market
      );
      const ammMarket = shapeMarketInfo(market, ammExchange);
      markets[`${marketId}-${ammExchange.id}`] = ammMarket;
      ammExchange.market = ammMarket;
      ammExchanges[ammExchange.id] = ammExchange;
    } else {
      const marketAmms: {
        [marketId: string]: GraphAmmExchange;
      } = market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});
      const pastMarketAmms: {
        [marketId: string]: GraphAmmExchange;
      } = market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});

      Object.keys(marketAmms).forEach((ammId) => {
        const amm = marketAmms[ammId];
        const pastAmm = pastMarketAmms[ammId];
        const newAmmExchange = shapeAmmExchange(amm, pastAmm, cashes, market);
        const ammMarket = shapeMarketInfo(market, newAmmExchange);
        markets[`${marketId}-${ammId}`] = ammMarket;
        ammExchanges[newAmmExchange.id] = newAmmExchange;
        newAmmExchange.market = ammMarket;
      });
    }
  });

  return { cashes, markets, ammExchanges, errors: null };
};

const shapeMarketInfo = (
  market: GraphMarket,
  ammExchange: AmmExchange
): MarketInfo => {
  const extraInfo = JSON.parse(market?.extraInfoRaw);
  const feeAsPercent = convertAttoValueToDisplayValue(new BN(market.fee)).times(
    100
  );
  const cashDecimals = ammExchange?.cash?.decimals
  const claimedProceeds = market.tradingProceedsClaimed.filter(t => t.numPayoutTokens !== "0").map(t => ({
    id: t.id,
    shareToken: t.shareToken.id,
    outcome: t.outcome,
    fees: String(convertOnChainCashAmountToDisplayCashAmount(t.fees, cashDecimals)),
    winnings: String(convertOnChainCashAmountToDisplayCashAmount(t.numPayoutTokens, cashDecimals)),
    timestamp: Number(t.timestamp),
  }));

  return {
    marketId: market.id,
    description: market.description,
    longDescription: extraInfo.longDescription,
    categories: extraInfo?.categories || [],
    endTimestamp: Number(market.endTimestamp),
    creationTimestamp: market.timestamp,
    extraInfoRaw: market.extraInfoRaw,
    fee: String(feeAsPercent),
    outcomes: shapeOutcomes(market.outcomes),
    amm: ammExchange,
    reportingState: market.status,
    claimedProceeds,
  };
};

const shapeOutcomes = (graphOutcomes: GraphMarketOutcome[]): MarketOutcome[] =>
  (graphOutcomes || []).map((g) => ({
    id: Number(g.id.split('-')[1]),
    isFinalNumerator: g.isFinalNumerator,
    payoutNumerator: g.payoutNumerator,
    name: g.value,
    isInvalid: g.id.indexOf('-0') > -1,
  }));

const shapeAmmExchange = (
  amm: GraphAmmExchange,
  past: GraphAmmExchange,
  cashes: Cashes,
  market: GraphMarket
): AmmExchange => {
  const marketId = market.id;
  const outcomes = shapeOutcomes(market.outcomes);
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
  } = past || {};
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
  const apy = calculateAmmApy(
    volumeTotalUSD,
    amm,
    liquidityUSD,
    addLiquidity
  );

  const priceNoFixed = priceNo.toFixed(2);
  const priceYesFixed = priceYes.toFixed(2);

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

  // TODO: feeDecimal is off by one on graph data, calculating manually update if fixed
  const feeDecimal = String(new BN(amm.fee).div(1000));
  const feeInPercent = String(new BN(feeDecimal).times(100));

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
  };
};

const calculateAmmApy = (
  volumeTotalUSD: number,
  amm: GraphAmmExchange,
  liquidityUSD: number,
  addLiquidity: GraphAddLiquidity[] = [],
): string => {
  const initValue =
    addLiquidity.length > 0 ? Number(addLiquidity[0].timestamp) : 0;
  const startTimestamp = addLiquidity.reduce(
    (p, t) => (Number(t.timestamp) < p ? Number(t.timestamp) : p),
    initValue
  );

  if (liquidityUSD === 0 || volumeTotalUSD === 0 || startTimestamp === 0 || amm.fee === '0') return '0';

  const fee = new BN(amm.fee).div(new BN(1000));
  const totalFeesInUsd = new BN(volumeTotalUSD).times(new BN(fee));
  const currTimestamp = Math.floor(new Date().getTime() / 1000); // current time in unix timestamp
  const secondsPast = currTimestamp - startTimestamp;
  const percentFeeLiquidity = (totalFeesInUsd.div(new BN(liquidityUSD))).div(secondsPast);
  const percentPerSecondForYear = percentFeeLiquidity.times(SEC_IN_YEAR).abs().toFixed(4);

  return String(percentPerSecondForYear);
};

const shapeEnterTransactions = (
  transactions: GraphEnter[],
  cash: Cash
): AmmTransaction[] => {
  return transactions.map((e) => {
    const properties = formatTransaction(e, cash);
    const cashValueUsd = new BN(properties.value).times(cash?.usdPrice).toFixed(2);
    const subheader = `Swap ${cash.name} for ${
      e.noShares !== '0' ? 'No Shares' : 'Yes Shares'
    }`;
    return {
      ...e,
      tx_type: TransactionTypes.ENTER,
      sender: e.sender?.id,
      subheader,
      ...properties,
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
    const subheader = `Swap ${
      e.noShares !== '0' ? 'No Shares' : 'Yes Shares'
    } for ${cash.name}`;
    const cashValueUsd = new BN(properties.value).abs().times(cash?.usdPrice).toFixed(2);
    return {
      ...e,
      tx_type: TransactionTypes.EXIT,
      sender: e.sender?.id,
      subheader,
      ...properties,
      value: cashValueUsd,
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
    const cashValueUsd = String(
      convertOnChainSharesToDisplayShareAmount(
        totalCashValue,
        new BN(cash.decimals)
      ).times(cash.usdPrice)
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
      value: cashValueUsd,
      lpTokens,
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
    const cashValue = String(
      convertOnChainSharesToDisplayShareAmount(
        new BN(e.cashValue),
        new BN(cash.decimals)
      )
    );
    const shares = new BN(e.noShares).plus(new BN(e.yesShares));
    const shareAmount = String(formatShares(
      convertOnChainSharesToDisplayShareAmount(
        new BN(shares),
        new BN(cash.decimals)
      ),
      {
        decimals: 4,
        decimalsRounded: 4,
      }
    ).formattedValue);

    const tokenAmount =  `-`; // TODO; graph data needs to to provide lp token amount burnt
    return {
      ...e,
      tx_type: TransactionTypes.REMOVE_LIQUIDITY,
      sender: e.sender?.id,
      subheader,
      ...properties,
      price: null,
      cashValue,
      value: cashValue,
      tokenAmount,
      shareAmount
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
  const shareAmount = String(formatShares(
    convertOnChainSharesToDisplayShareAmount(
      new BN(shares),
      new BN(cash.decimals)
    ),
    {
      decimals: 4,
      decimalsRounded: 4,
    }
  ).formattedValue);
  const tAmount = String(formatShares(tokenAmount, {
    decimals: 4,
    decimalsRounded: 4,
  }).formattedValue);
  return { shareAmount, currency, time, date, tokenAmount: tAmount, value };
};

const calculateTotalShareVolumeInUsd = (
  volumeNo: string,
  volumeYes: string,
  priceNo: number,
  priceYes: number,
  priceUsd: string
): number => {
  if (!priceNo || !priceYes) return 0;
  const normalizedYes = new BN(volumeNo || 0).times(new BN(priceNo));
  const normalizedNo = new BN(volumeYes || 0).times(new BN(priceYes));
  return normalizedYes.plus(normalizedNo).times(new BN(priceUsd)).toNumber();
}

const calculateVolumeInUsd = (volumeShare: string, priceShare: number, priceUsd: string): string => {
  if (!volumeShare || !priceUsd || !priceShare) return "0"
  return String(new BN(volumeShare).times(new BN(priceShare)).times(new BN(priceUsd)))
}

const calculateLiquidityInUsd = (volumeOrLiquidity: string, priceUsd: string): number => {
  if (!volumeOrLiquidity || !priceUsd) return 0;
  return Number(new BN(volumeOrLiquidity).times(new BN(priceUsd)).toFixed(2))
}

const hasZeroValue = (value) => value === "0" || !value;
const calculatePastVolumeInUsd = (volume: string = "0", pastVolume: string = "0", priceShare: number = 0, priceUsd: string = "0"): string => {
  if (hasZeroValue(priceShare) || hasZeroValue(priceUsd)) return "0"
  return String(new BN(volume)
    .minus(new BN(pastVolume))
    .times(new BN(priceShare))
    .times(new BN(priceUsd)))
}

const calculatePastLiquidityInUsd = (volume: string, pastVolume: string, priceUsd: string): string => {
  if (!volume || !pastVolume || !priceUsd) return "0"
  return String(new BN(volume)
    .minus(new BN(pastVolume))
    .times(new BN(priceUsd)))
}

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
  switch(tx.tx_type) {
    case(TransactionTypes.ADD_LIQUIDITY): {
      type = 'Add Liquidity';
      // when design wants to add usd value for this or remove use below:
      //const usdValue = `${String(new BN(tx.value).times(new BN(cash.usdPrice)))}`;
      value = `${formatCash(tx.value, cash.name).full}`;
      break;
    }
    case (TransactionTypes.REMOVE_LIQUIDITY): {
      type = 'Remove Liquidity';
      value = `${formatCash(tx.value, cash.name).full}`;
      break;
    }
    default: {
      const shares =
      tx.yesShares !== '0'
        ? convertOnChainSharesToDisplayShareAmount(tx.yesShares, cash.decimals)
        : convertOnChainSharesToDisplayShareAmount(tx.noShares, cash.decimals);
      const shareType = tx.yesShares !== '0' ? 'Yes' : 'No';
      const formattedPrice = formatCashPrice(tx.price, cash.name);
      subheader = `${
        formatSimpleShares(String(shares)).full
      } Shares of ${shareType} @ ${formattedPrice.full}`;
      // when design wants to add usd value
      const cashValue = convertOnChainCashAmountToDisplayCashAmount(tx.cash, cash.decimals);
      value = `${
        formatCash(String(cashValue), cash.name).full
      }`;
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

      if (userTx.length === 0) return p;

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
      return [...p, ...datedUserTx];
    }, [])
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  // form array of grouped by date activities
  return transactions
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

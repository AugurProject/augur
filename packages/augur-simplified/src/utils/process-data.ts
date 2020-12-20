import { MarketInfo } from "modules/types";
import { AmmExchange, Cash, Cashes, MarketOutcome, TransactionTypes } from "../modules/types";
import { BigNumber as BN } from 'bignumber.js'

interface GraphMarket {
  id: string,
  description: string,
  endTimestamp: string,
  status: string,
  extraInfoRaw: string,
  fee: string,
  categories: string[],
  outcomes: GraphMarketOutcome[]
  amms: GraphAmmExchange[]
}

interface GraphMarketOutcome {
  id: string,
  isFinalNumerator: boolean,
  payoutNumerator: string,
  value: string,
}
interface GraphTransaction {
  id: string,
  cash: string,
  noShares: string,
  yesShares: string,
  sender: { id: string },
  timestamp: string,
  tx_hash: string,
}
interface GraphEnter extends GraphTransaction {
  price: string,
}

interface GraphExits extends GraphTransaction {
  price: string,
}

interface GraphAddLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange,
}

interface GraphRemoveLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange,
}

interface GraphAmmExchange {
  id: string,
  cashBalance: string,
  shareToken: {
    id: string,
    cash: {
      id: string,
    },
  },
  liquidity: string,
  liquidityCash: string,
  liquidityInvalid: string,
  liquidityNo: string,
  liquidityYes: string,
  volumeYes: string,
  volumeNo: string,
  percentageNo: string,
  percentageYes: string,
  feePercent: string,
  enters: GraphEnter[],
  exits: GraphExits[],
  addLiquidity: GraphAddLiquidity[],
  removeLiquidity: GraphRemoveLiquidity[]
}

interface GraphData {
  markets: GraphMarket[],
  past: GraphMarket[],
  paraShareTokens: {}
  cashes: { [address: string]: Cash }
}

interface ProcessedData {
  markets: {
    [marketIdKey: string]: MarketInfo
  },
  cashes: {
    [address: string]: Cash
  },
  ammExchanges: {
    [id: string]: AmmExchange
  }
}

export const processGraphMarkets = (graphData: GraphData): ProcessedData => {
  const { markets: rawMarkets, past: rawPastMarkets, cashes } = graphData;

  const keyedMarkets: { [marketId: string]: GraphMarket } = rawMarkets.reduce((group, a) => ({ ...group, [a.id]: a }), {});
  const keyedPastMarkets: { [marketId: string]: GraphMarket } = rawPastMarkets.reduce((group, a) => ({ ...group, [a.id]: a }), {});

  let markets = {};
  let ammExchanges = {};
  Object.keys(keyedMarkets).forEach(marketId => {
    const market = keyedMarkets[marketId]
    const past = keyedPastMarkets[marketId];
    const amms = market.amms;

    // keying markets by marketId or marketId-ammExchange.id.
    if (amms.length < Object.keys(cashes).length) {

      markets[marketId] = shapeMarketInfo(market, null);

    } else if (amms.length === 1) {

      const ammExchange = shapeAmmExchange(market.amms[0], past?.amms[0], cashes, marketId)
      markets[`${marketId}-${ammExchange.id}`] = shapeMarketInfo(market, ammExchange);
      ammExchanges[ammExchange.id] = ammExchange;
    } else {

      const marketAmms: { [marketId: string]: GraphAmmExchange } = market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});
      const pastMarketAmms: { [marketId: string]: GraphAmmExchange } = market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});

      Object.keys(marketAmms).forEach(ammId => {
        const amm = marketAmms[ammId];
        const pastAmm = pastMarketAmms[ammId];
        const newAmmExchange = shapeAmmExchange(amm, pastAmm, cashes, marketId);
        markets[`${marketId}-${ammId}`] = shapeMarketInfo(market, newAmmExchange);
        ammExchanges[newAmmExchange.id] = newAmmExchange;
      })
    }
  });

  //console.log(cashes, markets, ammExchanges)
  return { cashes, markets, ammExchanges };
}

const shapeMarketInfo = (market: GraphMarket, ammExchange: AmmExchange): MarketInfo => {
  const extraInfo = JSON.parse(market?.extraInfoRaw)
  return {
    marketId: market.id,
    description: market.description,
    longDescription: extraInfo.longDescription,
    categories: extraInfo?.categories || [],
    endTimestamp: market.endTimestamp,
    outcomes: shapeOutcomes(market.outcomes),
    ammExchange: ammExchange
  }
}

const shapeOutcomes = (graphOutcomes: GraphMarketOutcome[]): MarketOutcome[] =>
  (graphOutcomes || []).map(g => ({
    id: Number(g.id.split('-')[1]),
    isFinalNumerator: g.isFinalNumerator,
    payoutNumerator: g.payoutNumerator,
    name: g.value
  }));


const shapeAmmExchange = (amm: GraphAmmExchange, past: GraphAmmExchange, cashes: Cashes, marketId: string): AmmExchange => {
  let transactions = [];
  transactions = transactions.concat(amm.enters.map(e => ({ ...e, tx_type: TransactionTypes.ENTER, sender: e.sender.id })));
  transactions = transactions.concat(amm.exits.map(e => ({ ...e, tx_type: TransactionTypes.EXIT, sender: e.sender.id })));
  transactions = transactions.concat(amm.addLiquidity.map(e => ({ ...e, tx_type: TransactionTypes.ADD_LIQUIDITY, sender: e.sender.id })));
  transactions = transactions.concat(amm.removeLiquidity.map(e => ({ ...e, tx_type: TransactionTypes.REMOVE_LIQUIDITY, sender: e.sender.id })));

  const cash = cashes[amm.shareToken.cash.id]
  const priceYes = (Number(amm.percentageNo) / 100);
  const priceNo = (Number(amm.percentageYes) / 100);

  const { volumeNo, volumeYes, liquidity } = amm;
  const { volumeNo: pastVolumeNo, volumeYes: pastVolumeYes, liquidity: pastLiquidity } = (past || {});

  const volumeNoUSD = calculateVolumeInUsd(volumeNo, priceNo, cash.usdPrice);
  const volumeYesUSD = calculateVolumeInUsd(volumeYes, priceYes, cash.usdPrice);
  const volumeTotal = String(new BN(volumeNo).plus(new BN(volumeYes)))
  const volumeTotalUSD = calculateTotalShareVolumeInUsd(volumeNo, volumeYes, priceNo, priceYes, cash.usdPrice);
  const liquidityUSD = calculateLiquidityInUsd(amm.liquidity, cash.usdPrice);

  const volume24hrNoUSD = calculatePastVolumeInUsd(volumeNo, pastVolumeNo, priceNo, cash.usdPrice);
  const volume24hrYesUSD = calculatePastVolumeInUsd(volumeYes, pastVolumeYes, priceYes, cash.usdPrice);
  const volume24hrTotalUSD = String(new BN(volume24hrNoUSD).plus(new BN(volume24hrYesUSD)))
  const liquidity24hrUSD = calculatePastLiquidityInUsd(liquidity, pastLiquidity, cash.usdPrice)

  return {
    id: amm.id,
    marketId,
    liquidity: amm.liquidity,
    liquidity24hrUSD,
    liquidityInvalid: amm.liquidityInvalid,
    liquidityNo: amm.liquidityNo,
    liquidityYes: amm.liquidityYes,
    liquidityCash: amm.liquidityCash,
    liquidityUSD,
    cash,
    priceYes: priceYes.toFixed(2),
    priceNo: priceNo.toFixed(2),
    sharetoken: amm?.shareToken?.id,
    percentageNo: amm.percentageNo,
    percentageYes: amm.percentageYes,
    volumeYes,
    volumeNo,
    volumeYesUSD,
    volumeNoUSD,
    feePercent: amm.feePercent,
    volumeTotal,
    volume24hrTotalUSD,
    volumeTotalUSD,
    transactions,
  }
}

const calculateTotalShareVolumeInUsd = (volumeNo: string, volumeYes: string, priceNo: number, priceYes: number, priceUsd: string): string => {
  if (!priceNo || !priceYes) return "0";
  const normalizedYes = new BN(volumeNo || 0).times(new BN(priceNo));
  const normalizedNo = new BN(volumeYes || 0).times(new BN(priceYes));
  return String(normalizedYes.plus(normalizedNo).times(new BN(priceUsd)));
}

const calculateVolumeInUsd = (volumeShare: string, priceShare: number, priceUsd: string): string => {
  if (!volumeShare || !priceUsd || !priceShare) return "0"
  return String(new BN(volumeShare).times(new BN(priceShare)).times(new BN(priceUsd)))
}

const calculateLiquidityInUsd = (volumeOrLiquidity: string, priceUsd: string): string => {
  if (!volumeOrLiquidity || !priceUsd) return "0"
  return String(new BN(volumeOrLiquidity).times(new BN(priceUsd)))
}

const calculatePastVolumeInUsd = (volume: string, pastVolume: string, priceShare: number, priceUsd: string): string => {
  if (!volume || !pastVolume || !priceShare || !priceUsd) return "0"
  return String(new BN(volume)
    .minus(new BN(pastVolume))
    .times(priceShare)
    .times(new BN(priceUsd)))
}

const calculatePastLiquidityInUsd = (volume: string, pastVolume: string, priceUsd: string): string => {
  if (!volume || !pastVolume || !priceUsd) return "0"
  return String(new BN(volume)
    .minus(new BN(pastVolume))
    .times(new BN(priceUsd)))
}

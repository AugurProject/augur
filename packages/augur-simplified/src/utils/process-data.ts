import { MarketInfo } from "modules/types";

interface GraphMarket {
  id: string,
  description: string,
  endTimestamp: string,
  status: string,
  extraInfoRaw: string,
  fee: string,
  categories: string[],
  outcomes: {
    id: string,
    isFinalNumerator: boolean,
    payoutNumerator: string,
    value: string,
  }
  amms: GraphAmmExchange[]
}

interface GraphTransaction {
  id: string,
  cash: string,
  noShares: string,
  yesShares: string,
  sender: string,
  timestamp: string,
  tx_hash: string,
}
interface GraphEnter extends GraphTransaction {
  price: string,
}

interface GraphExits {
  price: string,
}

interface GraphAddLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange,
}

interface GraphRemoveLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange,
}

interface GraphAmmExchange {
  cash: string,
  cashBalance: string,
  shareToken: {
    id: string,
    cash: string
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

interface PriceUsd {
  priceUSD: string,
  cashAddress: string,
}

interface GraphData {
  markets: GraphMarket[],
  past: {},
  paraShareTokens: {}
  pricesUsd: PriceUsd[]
}

interface ProcessedData {
  markets: {
    [marketIdKey: string]: MarketInfo
  }
}

export const processGraphMarkets = (graphData: GraphData): ProcessedData => {
  const { markets: rawMarkets, past: rawPastMarkets, pricesUsd } = graphData;

  console.log('rawMarkets', rawMarkets)
  console.log('pricesUsd', pricesUsd)

  return null;
}

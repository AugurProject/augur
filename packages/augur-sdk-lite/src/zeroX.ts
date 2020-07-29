import { BigNumber as BN, defaultAbiCoder, ParamType } from 'ethers/utils';
import { getAddress } from 'ethers/utils/address';
import { BigNumber } from 'bignumber.js';

import { ZeroXOrders, OutcomeOrders, OrderTypeOrders, ZeroXOrder } from './constants';
import { OrderType } from './logs';

const multiAssetDataAbi: ParamType[] = [
    { name: 'amounts', type: 'uint256[]' },
    { name: 'nestedAssetData', type: 'bytes[]' },
];

// Original ABI from Go
// [
//   {
//     constant: false,
//     inputs: [
//       { name: 'address', type: 'address' },
//       { name: 'ids', type: 'uint256[]' },
//       { name: 'values', type: 'uint256[]' },
//       { name: 'callbackData', type: 'bytes' },
//     ],
//     name: 'ERC1155Assets',
//     outputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
// ];
const erc1155AssetDataAbi: ParamType[] = [
    { name: 'address', type: 'address' },
    { name: 'ids', type: 'uint256[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'callbackData', type: 'bytes' },
];

export interface OrderData {
    market: string;
    price: string;
    outcome: string;
    orderType: string;
    invalidOrder?: boolean;
}

export interface ParsedAssetDataResults {
    orderData: OrderData;
    multiAssetData: any;
}

export function parseZeroXMakerAssetData(makerAssetData: string): OrderData {
    const { orderData } = parseAssetData(makerAssetData);
    return orderData;
}

export function parseAssetData(assetData: string): ParsedAssetDataResults {
    try {
        const multiAssetData = defaultAbiCoder.decode(multiAssetDataAbi, `0x${assetData.slice(10)}`);
        const nestedAssetData = multiAssetData[1] as string[];
        const orderData = parseTradeAssetData(nestedAssetData[0]);
        return {
        orderData,
        multiAssetData
        };
    } catch(e) {
        throw new Error(`Order not in multi-asset format. Error: ${e}`);
    }
}

export function parseTradeAssetData(assetData: string): OrderData {
    // Remove the first 10 characters because assetData is prefixed in 0x, and then contains a selector.
    // Drop the selector and add back to 0x prefix so the AbiDecoder will treat it properly as hex.
    const decoded = defaultAbiCoder.decode(erc1155AssetDataAbi, `0x${assetData.slice(10)}`);
    const ids = decoded[1] as BigNumber[];

    if (ids.length !== 1) {
        throw new Error('More than one ID passed into 0x order');
    }

    // No idea why the BigNumber instance returned here just wont serialize to hex
    // Since `ids[n]` is a BigNumber, it is possible for the higher order bits
    // to all be 0. This will result in the tokenid serialization here to be
    // less than the expected full 32 bytes (64 characters in hex).
    const tokenid = new BN(`${ids[0].toString()}`).toHexString().substr(2).padStart(64, '0');

    // From ZeroXTrade.sol
    //  assembly {
    //      _market := shr(96, and(_tokenId, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000000))
    //      _price := shr(16,  and(_tokenId, 0x0000000000000000000000000000000000000000FFFFFFFFFFFFFFFFFFFF0000))
    //      _outcome := shr(8, and(_tokenId, 0x000000000000000000000000000000000000000000000000000000000000FF00))
    //      _type :=           and(_tokenId, 0x00000000000000000000000000000000000000000000000000000000000000FF)
    //  }
    return {
        market: getAddress(`0x${tokenid.substr(0, 40)}`),
        price: `0x${tokenid.substr(40, 20)}`,
        outcome: `0x${tokenid.substr(60, 2)}`,
        orderType: `0x${tokenid.substr(62, 2)}`,
    };
}

export function ignoreCrossedOrders(
  books: ZeroXOrders,
  allowedAccount: string
): ZeroXOrders {
  return Object.keys(books).reduce(
    (aggs, marketId) => ({
      ...aggs,
      [marketId]: filterMarketOutcomeOrders(books[marketId], allowedAccount),
    }),
    {}
  );
}

function filterMarketOutcomeOrders(
  outcomeOrders: OutcomeOrders,
  allowedAccount: string
): OutcomeOrders {
  return Object.keys(outcomeOrders).reduce(
    (aggs, outcomeId) => ({
      ...aggs,
      [Number(outcomeId)]: removeCrossedOrdersInOutcome(
        outcomeOrders[Number(outcomeId)],
        allowedAccount
      ),
    }),
    {}
  );
}

function removeCrossedOrdersInOutcome(
  orders: OrderTypeOrders,
  allowedAccount: string
): OrderTypeOrders {
  if (Object.keys(orders).length < 2) return orders;
  if (Object.keys(orders[OrderType.Ask]).length === 0) return orders;
  if (Object.keys(orders[OrderType.Bid]).length === 0) return orders;

  let asks = [
    ...Object.values(orders[OrderType.Ask]).filter(o => o.makerAddress !== allowedAccount).sort(sortOrdersAscending),
  ];
  let bids = [
    ...Object.values(orders[OrderType.Bid]).filter(o => o.makerAddress !== allowedAccount).sort(sortOrdersDecending),
  ];
  let hasCrossOrders = hasCrossedOrders(asks, bids);
  if (!hasCrossOrders) return orders;

  const { bestAsk, bestBid } = getBestOrders(asks, bids);
  let crossedAsks = getCrossedOrders(
    asks,
    bestBid.price,
    (askPrice, price) => parseFloat(askPrice) <= parseFloat(price)
  );
  let crossedBids = getCrossedOrders(
    bids,
    bestAsk.price,
    (bidPrice, price) => parseFloat(bidPrice) >= parseFloat(price)
  );
  let ignoreOrders = [];
  while (hasCrossOrders) {
    // get all orders that price cross
    // remove smallest sized crossed orders
    // if same size remove oldest crossed orders
    // leave account orders if crossed
    ignoreOrdersBasedOnSizeTtl(crossedAsks, crossedBids, ignoreOrders);
    crossedAsks = crossedAsks.filter((o) => !ignoreOrders.includes(o));
    crossedBids = crossedBids.filter((o) => !ignoreOrders.includes(o));
    hasCrossOrders = hasCrossedOrders(crossedAsks, crossedBids);
  }

  ignoreOrders.map((o: ZeroXOrder) => delete orders[OrderType.Ask][o.orderId]);
  ignoreOrders.map((o: ZeroXOrder) => delete orders[OrderType.Bid][o.orderId]);

  return orders;
}

function ignoreOrdersBasedOnSizeTtl(
  asks: ZeroXOrder[],
  bids: ZeroXOrder[],
  ignore: ZeroXOrder[]
): void {
  if (asks.length === 0 || bids.length === 0) return;
  const { bestAsk, bestBid } = getBestOrders(asks, bids);
  let ignoreOrder = new BigNumber(bestAsk.amount).lt(
    new BigNumber(bestBid.amount)
  )
    ? bestAsk
    : bestBid;

  if (bestAsk.amount === bestBid.amount) {
    if (bestAsk.expirationTimeSeconds === bestBid.expirationTimeSeconds) {
      ignoreOrder =
        parseFloat(bestAsk.price) < parseFloat(bestBid.price)
          ? bestAsk
          : bestBid;
    } else {
      ignoreOrder =
        bestAsk.creationTime > bestBid.creationTime
          ? bestAsk
          : bestBid;
    }
  }
  ignore.push(ignoreOrder);
}

function getCrossedOrders(
  orders: ZeroXOrder[],
  limitPrice: string,
  condition: Function
) {
  const crossed = [];
  let process = !!orders.length;
  let i = 0;
  while (process) {
    const order = orders[i];
    order && condition(order.price, limitPrice)
      ? crossed.push(order)
      : (process = false);
    i++;
  }
  return crossed;
}

function getBestOrders(
  askOrders: ZeroXOrder[],
  bidOrders: ZeroXOrder[]
): { bestAsk: ZeroXOrder; bestBid: ZeroXOrder } {
  const bestAsk = askOrders.sort(sortOrdersAscending)[0];
  const bestBid = bidOrders.sort(sortOrdersDecending)[0];
  return { bestAsk, bestBid };
}

function hasCrossedOrders(
  askOrders: ZeroXOrder[],
  bidOrders: ZeroXOrder[]
): boolean {
  const { bestAsk, bestBid } = getBestOrders(askOrders, bidOrders);
  if (!bestAsk || !bestBid) return false;
  return hasCrossBestOrders(bestAsk, bestBid);
}

function hasCrossBestOrders(ask, bid): boolean {
  return (
    parseFloat(ask.price) <= parseFloat(bid.price) ||
    parseFloat(bid.price) >= parseFloat(ask.price)
  );
}

function sortOrdersAscending(order1: ZeroXOrder, order2: ZeroXOrder): number {
  if (parseFloat(order1.price) > parseFloat(order2.price)) return 1;
  if (parseFloat(order1.price) < parseFloat(order2.price)) return -1;
  return 0;
}

function sortOrdersDecending(order1: ZeroXOrder, order2: ZeroXOrder): number {
  if (parseFloat(order1.price) < parseFloat(order2.price)) return 1;
  if (parseFloat(order1.price) > parseFloat(order2.price)) return -1;
  return 0;
}

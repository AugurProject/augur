import {
  ignoreCrossedOrders,
  ZeroXOrders,
  OrderState,
  OrderType,
  ZeroXOrder,
} from '@augurproject/sdk-lite';
import * as _ from 'lodash';

describe('Cross orderbook', () => {
  const maker = 'maker';
  const account2 = 'account2';
  const fakeData = 'fakeData';
  beforeAll(async () => {});

  afterAll(() => {});

  const createOrder = (
    account,
    orderId,
    price,
    amount,
    creationTime
  ): ZeroXOrder => {
    return {
      creationTime,
      makerAddress: account,
      orderId,
      price,
      amount,
      makerAssetAmount: fakeData,
      takerAssetAmount: fakeData,
      salt: fakeData,
      makerAssetData: fakeData,
      takerAssetData: fakeData,
      signature: fakeData,
      makerFeeAssetData: fakeData,
      takerFeeAssetData: fakeData,
      feeRecipientAddress: fakeData,
      takerAddress: fakeData,
      senderAddress: fakeData,
      makerFee: fakeData,
      takerFee: fakeData,
      transactionHash: fakeData,
      logIndex: 1,
      owner: fakeData,
      orderState: OrderState.OPEN,
      amountFilled: '0',
      fullPrecisionPrice: fakeData,
      fullPrecisionAmount: fakeData,
      tokensEscrowed: fakeData,
      sharesEscrowed: fakeData,
      expirationTimeSeconds: 55555,
      creationBlockNumber: 1,
      originalFullPrecisionAmount: '0',
    };
  };

  describe('tests', () => {
    test('CrossOrderBook: no book', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {},
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, maker);
      expect(newBook).toMatchObject(testOutcomeOrders);
    });

    test('CrossOrderBook: no cross empty bids', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order3`]: createOrder(maker, `order3`, `0.52`, 100, 1111),
              [`order2`]: createOrder(maker, `order2`, `0.42`, 100, 1111),
              [`order1`]: createOrder(maker, `order1`, `0.41`, 100, 1111),
            },
            [String(OrderType.Bid)]: {},
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, maker);
      expect(newBook).toMatchObject(testOutcomeOrders);
    });

    test('CrossOrderBook: no bids book', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order3`]: createOrder(maker, `order3`, `0.52`, 100, 1111),
              [`order2`]: createOrder(maker, `order2`, `0.42`, 100, 1111),
              [`order1`]: createOrder(maker, `order1`, `0.41`, 100, 1111),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, maker);
      expect(newBook).toMatchObject(testOutcomeOrders);
    });

    test('CrossOrderBook: no asks book', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order3`]: createOrder(maker, `order3`, `0.52`, 100, 1111),
              [`order2`]: createOrder(maker, `order2`, `0.42`, 100, 1111),
              [`order1`]: createOrder(maker, `order1`, `0.41`, 100, 1111),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, maker);
      expect(newBook).toMatchObject(testOutcomeOrders);
    });

    test('CrossOrderBook: ignore one crossed ask order smaller size ', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order3`]: createOrder(maker, `order3`, `0.52`, 100, 1111),
              [`order2`]: createOrder(maker, `order2`, `0.42`, 100, 1111),
              [`order1`]: createOrder(maker, `order1`, `0.41`, 100, 1111),
              [`order0`]: createOrder(maker, `order0`, `0.38`, 10, 1111),
            },
            [String(OrderType.Bid)]: {
              [`order4`]: createOrder(maker, `order4`, `0.39`, 100, 1111),
              [`order5`]: createOrder(maker, `order5`, `0.30`, 100, 1111),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)])).toHaveLength(2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)])).toHaveLength(3);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)]).includes(`order0`)).toBe(false);
    });


    test('CrossOrderBook: ignore one crossed ask order older order ', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order3`]: createOrder(maker, `order3`, `0.52`, 100, 1111),
              [`order2`]: createOrder(maker, `order2`, `0.42`, 100, 1111),
              [`order1`]: createOrder(maker, `order1`, `0.41`, 100, 1111),
              ['order0']: createOrder(maker, 'order0', `0.38`, 10, 1111),
            },
            [String(OrderType.Bid)]: {
              [`order4`]: createOrder(maker, `order4`, `0.39`, 10, 2222),
              [`order5`]: createOrder(maker, `order5`, `0.30`, 100, 1111),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)])).toHaveLength(2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)])).toHaveLength(3);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)]).includes('order0')).toBe(false);
    });

    test('CrossOrderBook: ignore multiple crossed ask order size and age ', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order5`]: createOrder(maker, `order5`, `0.52`, 100, 1115),
              [`order4`]: createOrder(maker, `order4`, `0.42`, 100, 1114),
              [`order3`]: createOrder(maker, `order3`, `0.41`, 100, 1113),
              [`order2`]: createOrder(maker, `order2`, `0.38`, 10, 1112),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 10, 1111),
              [`order0`]: createOrder(maker, `order0`, `0.37`, 10, 1110),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(maker, `order9`, `0.39`, 10, 2222),
              [`order8`]: createOrder(maker, `order8`, `0.30`, 100, 2221),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)])).toHaveLength(3);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)])).toHaveLength(2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)]).includes(`order0`)).toBe(false);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)]).includes(`order1`)).toBe(false);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)]).includes(`order2`)).toBe(false);
    });

    test('CrossOrderBook: crossed asks/bids keep bids large amount', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order5`]: createOrder(maker, `order5`, `0.52`, 100, 1111),
              [`order4`]: createOrder(maker, `order4`, `0.42`, 100, 1111),
              [`order3`]: createOrder(maker, `order3`, `0.41`, 100, 1111),
              [`order2`]: createOrder(maker, `order2`, `0.38`, 10, 1111),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 10, 1111),
              [`order0`]: createOrder(maker, `order0`, `0.37`, 10, 1111),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(maker, `order9`, `0.39`, 100, 1111),
              [`order81`]: createOrder(maker, `order81`, `0.38`, 100, 1111),
              [`order82`]: createOrder(maker, `order82`, `0.37`, 100, 1111),
              [`order83`]: createOrder(maker, `order83`, `0.30`, 100, 1111),
              [`order84`]: createOrder(maker, `order84`, `0.30`, 100, 1111),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)])).toHaveLength(3);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)])).toHaveLength(5);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)]).includes(`order0`)).toBe(false);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)]).includes(`order1`)).toBe(false);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)]).includes(`order2`)).toBe(false);
    });

    test('CrossOrderBook: crossed asks/bids keep bids ttl', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order5`]: createOrder(maker, `order5`, `0.52`, 100, 1111),
              [`order4`]: createOrder(maker, `order4`, `0.42`, 100, 1111),
              [`order3`]: createOrder(maker, `order3`, `0.41`, 100, 1115),
              [`order2`]: createOrder(maker, `order2`, `0.38`, 100, 1114),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 100, 1113),
              [`order0`]: createOrder(maker, `order0`, `0.37`, 100, 1112),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(maker, `order9`, `0.39`, 10, 2222),
              [`order81`]: createOrder(maker, `order81`, `0.38`, 100, 9999),
              [`order82`]: createOrder(maker, `order82`, `0.37`, 100, 1110),
              [`order83`]: createOrder(maker, `order83`, `0.30`, 100, 1119),
              [`order84`]: createOrder(maker, `order84`, `0.30`, 100, 1121),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)])).toHaveLength(5);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)])).toHaveLength(3);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)]).includes(`order0`)).toBe(false);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)]).includes(`order9`)).toBe(false);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)]).includes(`order81`)).toBe(false);
    });

    test('CrossOrderBook: crossed asks/bids remove last bid', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order5`]: createOrder(maker, `order5`, `0.52`, 100, 1111),
              [`order4`]: createOrder(maker, `order4`, `0.42`, 100, 1111),
              [`order3`]: createOrder(maker, `order3`, `0.41`, 100, 1115),
              [`order2`]: createOrder(maker, `order2`, `0.38`, 100, 1114),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 100, 1113),
              [`order0`]: createOrder(maker, `order0`, `0.37`, 100, 1112),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(maker, `order9`, `0.37`, 10, 2222),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)])).toHaveLength(6);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)])).toHaveLength(0);
    });


    test('CrossOrderBook: crossed asks/bids keep all orders by user', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order5`]: createOrder(maker, `order5`, `0.52`, 100, 1111),
              [`order4`]: createOrder(maker, `order4`, `0.42`, 100, 1111),
              [`order3`]: createOrder(maker, `order3`, `0.41`, 100, 1115),
              [`order2`]: createOrder(maker, `order2`, `0.38`, 100, 1114),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 100, 1113),
              [`order0`]: createOrder(maker, `order0`, `0.37`, 100, 1112),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(account2, `order9`, `0.37`, 10, 2222),
              [`order81`]: createOrder(maker, `order81`, `0.38`, 100, 9999),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(newBook).toMatchObject(testOutcomeOrders);
    });

    test('CrossOrderBook: crossed asks/bids remove non users crossed orders', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order5`]: createOrder(maker, `order5`, `0.52`, 100, 1111),
              [`order4`]: createOrder(maker, `order4`, `0.42`, 100, 1111),
              [`order3`]: createOrder(maker, `order3`, `0.41`, 100, 1115),
              [`order2`]: createOrder(maker, `order2`, `0.38`, 100, 1114),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 100, 1113),
              [`order0`]: createOrder(maker, `order0`, `0.37`, 100, 1112),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(account2, `order9`, `0.40`, 10, 2222),
              [`order10`]: createOrder(maker, `order10`, `0.39`, 10, 1111),
              [`order11`]: createOrder(maker, `order110`, `0.39`, 100, 9999),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(_.keys(newBook[marketId][1][String(OrderType.Ask)])).toHaveLength(3);
      expect(_.keys(newBook[marketId][1][String(OrderType.Bid)])).toHaveLength(2);
    });

    test('CrossOrderBook: crossed asks/bids users crossed orders same bid and ask price', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order2`]: createOrder(maker, `order2`, `0.38`, 100, 1114),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 100, 1113),
              [`order0`]: createOrder(account2, `order0`, `0.37`, 100, 1112),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(account2, `order9`, `0.37`, 10, 2222),
              [`order81`]: createOrder(maker, `order81`, `0.35`, 100, 9999),
              [`order82`]: createOrder(maker, `order82`, `0.31`, 100, 9999),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(newBook).toMatchObject(testOutcomeOrders);
    });


    test('CrossOrderBook: crossed users asks/bids no removals', async () => {
      const marketId = 'marketId';
      const testOutcomeOrders: ZeroXOrders = {
        [marketId]: {
          1: {
            [String(OrderType.Ask)]: {
              [`order2`]: createOrder(maker, `order2`, `0.38`, 100, 1114),
              [`order1`]: createOrder(maker, `order1`, `0.38`, 100, 1113),
              [`order0`]: createOrder(account2, `order0`, `0.37`, 100, 1112),
              [`ordera`]: createOrder(maker, `ordera`, `0.36`, 100, 1112),
            },
            [String(OrderType.Bid)]: {
              [`order9`]: createOrder(account2, `order9`, `0.37`, 10, 2222),
              [`order81`]: createOrder(maker, `order81`, `0.35`, 100, 9999),
              [`order82`]: createOrder(maker, `order82`, `0.31`, 100, 9999),
            },
          },
        },
      };
      const newBook = ignoreCrossedOrders(testOutcomeOrders, account2);
      expect(newBook).toMatchObject(testOutcomeOrders);
    });

  });
});

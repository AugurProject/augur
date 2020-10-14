[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/OnChainTrading"](_augur_sdk_src_state_getter_onchaintrading_.md)

# Module: "augur-sdk/src/state/getter/OnChainTrading"

## Index

### Classes

* [OnChainTrading](../classes/_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md)

### Interfaces

* [BetterWorseResult](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.betterworseresult.md)

### Variables

* [OrderType](_augur_sdk_src_state_getter_onchaintrading_.md#const-ordertype)
* [OrdersParams](_augur_sdk_src_state_getter_onchaintrading_.md#const-ordersparams)
* [OutcomeParam](_augur_sdk_src_state_getter_onchaintrading_.md#const-outcomeparam)
* [TradingHistoryParams](_augur_sdk_src_state_getter_onchaintrading_.md#const-tradinghistoryparams)
* [ZERO](_augur_sdk_src_state_getter_onchaintrading_.md#const-zero)
* [makerTaker](_augur_sdk_src_state_getter_onchaintrading_.md#const-makertaker)

### Functions

* [getMarkets](_augur_sdk_src_state_getter_onchaintrading_.md#getmarkets)

### Object literals

* [makerTakerValues](_augur_sdk_src_state_getter_onchaintrading_.md#const-makertakervalues)

## Variables

### `Const` OrderType

• **OrderType**: *KeyofC‹object›* = t.keyof({
  buy: null,
  sell: null,
})

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:68](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L68)*

___

### `Const` OrdersParams

• **OrdersParams**: *PartialC‹object›* = t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: OutcomeParam,
  orderType: t.string,
  account: t.string,
  orderState: t.string,
  expirationCutoffSeconds: t.number,
  ignoreCrossOrders: t.boolean,
})

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:57](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L57)*

___

### `Const` OutcomeParam

• **OutcomeParam**: *KeyofC‹object›* = t.keyof({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
})

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:38](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L38)*

___

### `Const` TradingHistoryParams

• **TradingHistoryParams**: *PartialC‹object›* = t.partial({
  universe: t.string,
  account: t.string,
  marketIds: t.array(t.string),
  outcome: t.number,
  filterFinalized: t.boolean,
})

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:30](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L30)*

___

### `Const` ZERO

• **ZERO**: *BigNumber‹›* = new BigNumber(0)

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:28](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L28)*

___

### `Const` makerTaker

• **makerTaker**: *KeyofC‹object›* = t.keyof(makerTakerValues)

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:55](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L55)*

## Functions

###  getMarkets

▸ **getMarkets**(`marketIds`: string[], `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `filterFinalized`: boolean): *Promise‹Dictionary‹MarketData››*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:382](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L382)*

**Parameters:**

Name | Type |
------ | ------ |
`marketIds` | string[] |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`filterFinalized` | boolean |

**Returns:** *Promise‹Dictionary‹MarketData››*

## Object literals

### `Const` makerTakerValues

### ▪ **makerTakerValues**: *object*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:49](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L49)*

###  either

• **either**: *string* = "either"

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:50](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L50)*

###  maker

• **maker**: *string* = "maker"

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:51](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L51)*

###  taker

• **taker**: *string* = "taker"

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:52](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L52)*

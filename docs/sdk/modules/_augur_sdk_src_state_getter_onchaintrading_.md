[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/OnChainTrading"](_augur_sdk_src_state_getter_onchaintrading_.md)

# Module: "augur-sdk/src/state/getter/OnChainTrading"

## Index

### Enumerations

* [OrderState](../enums/_augur_sdk_src_state_getter_onchaintrading_.orderstate.md)

### Classes

* [OnChainTrading](../classes/_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md)

### Interfaces

* [AllOrders](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.allorders.md)
* [BetterWorseResult](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.betterworseresult.md)
* [MarketTrade](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.markettrade.md)
* [MarketTradingHistory](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.markettradinghistory.md)
* [Order](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.order.md)
* [Orders](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.orders.md)

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

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:132](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L132)*

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
})

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:53](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L53)*

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

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:34](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L34)*

___

### `Const` TradingHistoryParams

• **TradingHistoryParams**: *PartialC‹object›* = t.partial({
  universe: t.string,
  account: t.string,
  marketIds: t.array(t.string),
  outcome: t.number,
  filterFinalized: t.boolean,
})

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:26](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L26)*

___

### `Const` ZERO

• **ZERO**: *BigNumber‹›* = new BigNumber(0)

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L24)*

___

### `Const` makerTaker

• **makerTaker**: *KeyofC‹object›* = t.keyof(makerTakerValues)

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:51](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L51)*

## Functions

###  getMarkets

▸ **getMarkets**(`marketIds`: string[], `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `filterFinalized`: boolean): *Promise‹Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)››*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:404](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L404)*

**Parameters:**

Name | Type |
------ | ------ |
`marketIds` | string[] |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`filterFinalized` | boolean |

**Returns:** *Promise‹Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)››*

## Object literals

### `Const` makerTakerValues

### ▪ **makerTakerValues**: *object*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:45](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L45)*

###  either

• **either**: *string* = "either"

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:46](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L46)*

###  maker

• **maker**: *string* = "maker"

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:47](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L47)*

###  taker

• **taker**: *string* = "taker"

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L48)*

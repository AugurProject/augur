[@augurproject/sdk](../README.md) > ["state/getter/Trading"](../modules/_state_getter_trading_.md)

# External module: "state/getter/Trading"

## Index

### Enumerations

* [OrderState](../enums/_state_getter_trading_.orderstate.md)

### Classes

* [Trading](../classes/_state_getter_trading_.trading.md)

### Interfaces

* [BetterWorseResult](../interfaces/_state_getter_trading_.betterworseresult.md)
* [MarketTradingHistory](../interfaces/_state_getter_trading_.markettradinghistory.md)
* [Order](../interfaces/_state_getter_trading_.order.md)
* [Orders](../interfaces/_state_getter_trading_.orders.md)

### Variables

* [BetterWorseOrdersParams](_state_getter_trading_.md#betterworseordersparams)
* [OrderType](_state_getter_trading_.md#ordertype)
* [OrdersParams](_state_getter_trading_.md#ordersparams)
* [OutcomeParam](_state_getter_trading_.md#outcomeparam)
* [TradingHistoryParams](_state_getter_trading_.md#tradinghistoryparams)
* [ZERO](_state_getter_trading_.md#zero)

---

## Variables

<a id="betterworseordersparams"></a>

### `<Const>` BetterWorseOrdersParams

**● BetterWorseOrdersParams**: *`any`* =  t.type({
  marketId: t.string,
  outcome: t.number,
  orderType: OrderType,
  price: t.number,
})

*Defined in [state/getter/Trading.ts:102](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L102)*

___
<a id="ordertype"></a>

### `<Const>` OrderType

**● OrderType**: *`any`* =  t.keyof({
  buy: null,
  sell: null,
})

*Defined in [state/getter/Trading.ts:97](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L97)*

___
<a id="ordersparams"></a>

### `<Const>` OrdersParams

**● OrdersParams**: *`any`* =  t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: OutcomeParam,
  orderType: t.string,
  creator: t.string,
  orderState: t.string,
  earliestCreationTime: t.number,
  latestCreationTime: t.number,
})

*Defined in [state/getter/Trading.ts:33](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L33)*

___
<a id="outcomeparam"></a>

### `<Const>` OutcomeParam

**● OutcomeParam**: *`any`* =  t.keyof({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
})

*Defined in [state/getter/Trading.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L22)*

___
<a id="tradinghistoryparams"></a>

### `<Const>` TradingHistoryParams

**● TradingHistoryParams**: *`any`* =  t.partial({
  universe: t.string,
  account: t.string,
  marketId: t.string,
  outcome: t.number,
  earliestCreationTime: t.number,
  latestCreationTime: t.number,
})

*Defined in [state/getter/Trading.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L13)*

___
<a id="zero"></a>

### `<Const>` ZERO

**● ZERO**: *`BigNumber`* =  new BigNumber(0)

*Defined in [state/getter/Trading.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L11)*

___


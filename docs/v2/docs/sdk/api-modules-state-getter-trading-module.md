---
id: api-modules-state-getter-trading-module
title: state/getter/Trading Module
sidebar_label: state/getter/Trading
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Trading Module]](api-modules-state-getter-trading-module.md)

## Module

### Enumerations

* [OrderState](api-enums-state-getter-trading-orderstate.md)

### Classes

* [Trading](api-classes-state-getter-trading-trading.md)

### Interfaces

* [BetterWorseResult](api-interfaces-state-getter-trading-betterworseresult.md)
* [MarketTradingHistory](api-interfaces-state-getter-trading-markettradinghistory.md)
* [Order](api-interfaces-state-getter-trading-order.md)
* [Orders](api-interfaces-state-getter-trading-orders.md)

### Variables

* [BetterWorseOrdersParams](api-modules-state-getter-trading-module.md#betterworseordersparams)
* [OrderType](api-modules-state-getter-trading-module.md#ordertype)
* [OrdersParams](api-modules-state-getter-trading-module.md#ordersparams)
* [OutcomeParam](api-modules-state-getter-trading-module.md#outcomeparam)
* [TradingHistoryParams](api-modules-state-getter-trading-module.md#tradinghistoryparams)
* [ZERO](api-modules-state-getter-trading-module.md#zero)

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

*Defined in [state/getter/Trading.ts:102](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L102)*

___
<a id="ordertype"></a>

### `<Const>` OrderType

**● OrderType**: *`any`* =  t.keyof({
  buy: null,
  sell: null,
})

*Defined in [state/getter/Trading.ts:97](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L97)*

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

*Defined in [state/getter/Trading.ts:33](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L33)*

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

*Defined in [state/getter/Trading.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L22)*

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

*Defined in [state/getter/Trading.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L13)*

___
<a id="zero"></a>

### `<Const>` ZERO

**● ZERO**: *`BigNumber`* =  new BigNumber(0)

*Defined in [state/getter/Trading.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L11)*

___


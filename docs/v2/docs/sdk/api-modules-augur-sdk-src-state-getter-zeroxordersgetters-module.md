---
id: api-modules-augur-sdk-src-state-getter-zeroxordersgetters-module
title: augur-sdk/src/state/getter/ZeroXOrdersGetters Module
sidebar_label: augur-sdk/src/state/getter/ZeroXOrdersGetters
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/ZeroXOrdersGetters Module]](api-modules-augur-sdk-src-state-getter-zeroxordersgetters-module.md)

## Module

### Classes

* [ZeroXOrdersGetters](api-classes-augur-sdk-src-state-getter-zeroxordersgetters-zeroxordersgetters.md)

### Interfaces

* [ZeroXOrder](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md)
* [ZeroXOrders](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorders.md)

### Variables

* [ZeroXOrdersParams](api-modules-augur-sdk-src-state-getter-zeroxordersgetters-module.md#zeroxordersparams)

---

## Variables

<a id="zeroxordersparams"></a>

### `<Const>` ZeroXOrdersParams

**● ZeroXOrdersParams**: *`PartialC`<`object`>* =  t.partial({
  marketId: t.string,
  outcome: t.number,
  orderType: t.string,
  account: t.string,
  orderState: t.string,
  matchPrice: t.string,
  ignoreOrders: t.array(t.string),
})

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:37](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L37)*

___


---
id: api-interfaces-packages-augur-sdk-src-state-getter-markets-marketorderbook
title: MarketOrderBook
sidebar_label: MarketOrderBook
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Markets Module]](api-modules-packages-augur-sdk-src-state-getter-markets-module.md) > [MarketOrderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketorderbook.md)

## Interface

## Hierarchy

**MarketOrderBook**

### Properties

* [marketId](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketorderbook.md#marketid)
* [orderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketorderbook.md#orderbook)

---

## Properties

<a id="marketid"></a>

###  marketId

**● marketId**: *`string`*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:155](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L155)*

___
<a id="orderbook"></a>

###  orderBook

**● orderBook**: *`object`*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:156](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L156)*

#### Type declaration

[outcome: `number`]: `object`

 asks: [OrderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-orderbook.md)[]

 bids: [OrderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-orderbook.md)[]

 spread: `string` \| `null`

___


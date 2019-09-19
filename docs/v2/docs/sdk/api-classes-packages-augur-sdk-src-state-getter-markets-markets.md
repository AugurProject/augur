---
id: api-classes-packages-augur-sdk-src-state-getter-markets-markets
title: Markets
sidebar_label: Markets
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Markets Module]](api-modules-packages-augur-sdk-src-state-getter-markets-module.md) > [Markets](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md)

## Class

## Hierarchy

**Markets**

### Properties

* [getCategoriesParams](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getcategoriesparams)
* [getMarketOrderBookParams](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketorderbookparams)
* [getMarketPriceCandlestickParams](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketpricecandlestickparams)
* [getMarketPriceHistoryParams](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketpricehistoryparams)
* [getMarketsInfoParams](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketsinfoparams)
* [getMarketsParams](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketsparams)

### Methods

* [getCategories](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getcategories)
* [getMarketOrderBook](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketorderbook)
* [getMarketPriceCandlesticks](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketpricecandlesticks)
* [getMarketPriceHistory](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketpricehistory)
* [getMarkets](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarkets)
* [getMarketsInfo](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md#getmarketsinfo)

---

## Properties

<a id="getcategoriesparams"></a>

### `<Static>` getCategoriesParams

**● getCategoriesParams**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.type({ universe: t.string })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:248](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L248)*

___
<a id="getmarketorderbookparams"></a>

### `<Static>` getMarketOrderBookParams

**● getMarketOrderBookParams**: *`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
    t.type({ marketId: t.string }),
    t.partial({
      outcomeId: t.union([outcomeIdType, t.array(outcomeIdType)]),
    }),
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:241](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L241)*

___
<a id="getmarketpricecandlestickparams"></a>

### `<Static>` getMarketPriceCandlestickParams

**● getMarketPriceCandlestickParams**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.type({
    marketId: t.string,
    outcome: outcomeIdType,
    start: t.union([t.number, t.null, t.undefined]),
    end: t.union([t.number, t.null, t.undefined]),
    period: t.union([t.number, t.null, t.undefined]),
  })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:228](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L228)*

___
<a id="getmarketpricehistoryparams"></a>

### `<Static>` getMarketPriceHistoryParams

**● getMarketPriceHistoryParams**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.type({ marketId: t.string })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:235](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L235)*

___
<a id="getmarketsinfoparams"></a>

### `<Static>` getMarketsInfoParams

**● getMarketsInfoParams**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.type({ marketIds: t.array(t.string) })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:240](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L240)*

___
<a id="getmarketsparams"></a>

### `<Static>` getMarketsParams

**● getMarketsParams**: *`IntersectionType`<[`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
    getMarketsParamsSpecific,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:236](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L236)*

___

## Methods

<a id="getcategories"></a>

### `<Static>` getCategories

▸ **getCategories**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`InterfaceType`>*): `Promise`<`string`[]>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:885](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L885)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** `Promise`<`string`[]>

___
<a id="getmarketorderbook"></a>

### `<Static>` getMarketOrderBook

▸ **getMarketOrderBook**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[MarketOrderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketorderbook.md)>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:620](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L620)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[MarketOrderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketorderbook.md)>

___
<a id="getmarketpricecandlesticks"></a>

### `<Static>` getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`InterfaceType`>*): `Promise`<[MarketPriceCandlesticks](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketpricecandlesticks.md)>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:251](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L251)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** `Promise`<[MarketPriceCandlesticks](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketpricecandlesticks.md)>

___
<a id="getmarketpricehistory"></a>

### `<Static>` getMarketPriceHistory

▸ **getMarketPriceHistory**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`InterfaceType`>*): `Promise`<[MarketPriceHistory](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketpricehistory.md)>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:389](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L389)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** `Promise`<[MarketPriceHistory](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketpricehistory.md)>

___
<a id="getmarkets"></a>

### `<Static>` getMarkets

▸ **getMarkets**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[MarketList](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlist.md)>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:422](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L422)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[MarketList](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlist.md)>

___
<a id="getmarketsinfo"></a>

### `<Static>` getMarketsInfo

▸ **getMarketsInfo**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`InterfaceType`>*): `Promise`<[MarketInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfo.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:734](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L734)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** `Promise`<[MarketInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfo.md)[]>

___


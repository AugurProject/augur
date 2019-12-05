---
id: api-classes-augur-sdk-src-state-getter-markets-markets
title: Markets
sidebar_label: Markets
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Markets Module]](api-modules-augur-sdk-src-state-getter-markets-module.md) > [Markets](api-classes-augur-sdk-src-state-getter-markets-markets.md)

## Class

## Hierarchy

**Markets**

### Properties

* [MaxLiquiditySpread](api-classes-augur-sdk-src-state-getter-markets-markets.md#maxliquidityspread)
* [getCategoriesParams](api-classes-augur-sdk-src-state-getter-markets-markets.md#getcategoriesparams)
* [getCategoryStatsParams](api-classes-augur-sdk-src-state-getter-markets-markets.md#getcategorystatsparams)
* [getMarketOrderBookParams](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketorderbookparams)
* [getMarketPriceCandlestickParams](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketpricecandlestickparams)
* [getMarketPriceHistoryParams](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketpricehistoryparams)
* [getMarketsInfoParams](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketsinfoparams)
* [getMarketsParams](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketsparams)

### Methods

* [getCategories](api-classes-augur-sdk-src-state-getter-markets-markets.md#getcategories)
* [getCategoryStats](api-classes-augur-sdk-src-state-getter-markets-markets.md#getcategorystats)
* [getMarketOrderBook](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketorderbook)
* [getMarketPriceCandlesticks](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketpricecandlesticks)
* [getMarketPriceHistory](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketpricehistory)
* [getMarkets](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarkets)
* [getMarketsInfo](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketsinfo)

---

## Properties

<a id="maxliquidityspread"></a>

### `<Static>` MaxLiquiditySpread

**● MaxLiquiditySpread**: *[MaxLiquiditySpread](api-enums-augur-sdk-src-state-getter-markets-maxliquidityspread.md)* =  MaxLiquiditySpread

*Defined in [augur-sdk/src/state/getter/Markets.ts:250](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L250)*

___
<a id="getcategoriesparams"></a>

### `<Static>` getCategoriesParams

**● getCategoriesParams**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      reportingStates: t.array(t.string)
    }),
  ])

*Defined in [augur-sdk/src/state/getter/Markets.ts:272](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L272)*

___
<a id="getcategorystatsparams"></a>

### `<Static>` getCategoryStatsParams

**● getCategoryStatsParams**: *`TypeC`<`object`>* =  t.type({
    universe: t.string,
    categories: t.array(t.string),
  })

*Defined in [augur-sdk/src/state/getter/Markets.ts:281](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L281)*

___
<a id="getmarketorderbookparams"></a>

### `<Static>` getMarketOrderBookParams

**● getMarketOrderBookParams**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
    t.type({ marketId: t.string }),
    t.partial({
      outcomeId: t.union([outcomeIdType, t.array(outcomeIdType)]),
    }),
  ])

*Defined in [augur-sdk/src/state/getter/Markets.ts:265](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L265)*

___
<a id="getmarketpricecandlestickparams"></a>

### `<Static>` getMarketPriceCandlestickParams

**● getMarketPriceCandlestickParams**: *`TypeC`<`object`>* =  t.type({
    marketId: t.string,
    outcome: outcomeIdType,
    start: t.union([t.number, t.null, t.undefined]),
    end: t.union([t.number, t.null, t.undefined]),
    period: t.union([t.number, t.null, t.undefined]),
  })

*Defined in [augur-sdk/src/state/getter/Markets.ts:252](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L252)*

___
<a id="getmarketpricehistoryparams"></a>

### `<Static>` getMarketPriceHistoryParams

**● getMarketPriceHistoryParams**: *`TypeC`<`object`>* =  t.type({ marketId: t.string })

*Defined in [augur-sdk/src/state/getter/Markets.ts:259](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L259)*

___
<a id="getmarketsinfoparams"></a>

### `<Static>` getMarketsInfoParams

**● getMarketsInfoParams**: *`TypeC`<`object`>* =  t.type({ marketIds: t.array(t.string) })

*Defined in [augur-sdk/src/state/getter/Markets.ts:264](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L264)*

___
<a id="getmarketsparams"></a>

### `<Static>` getMarketsParams

**● getMarketsParams**: *`IntersectionC`<[`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>, `PartialC`<`object`>]>* =  t.intersection([
    getMarketsParamsSpecific,
    sortOptions,
  ])

*Defined in [augur-sdk/src/state/getter/Markets.ts:260](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L260)*

___

## Methods

<a id="getcategories"></a>

### `<Static>` getCategories

▸ **getCategories**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<`string`[]>

*Defined in [augur-sdk/src/state/getter/Markets.ts:725](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L725)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<`string`[]>

___
<a id="getcategorystats"></a>

### `<Static>` getCategoryStats

▸ **getCategoryStats**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[CategoryStats](api-interfaces-augur-sdk-src-state-getter-markets-categorystats.md)>

*Defined in [augur-sdk/src/state/getter/Markets.ts:753](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L753)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[CategoryStats](api-interfaces-augur-sdk-src-state-getter-markets-categorystats.md)>

___
<a id="getmarketorderbook"></a>

### `<Static>` getMarketOrderBook

▸ **getMarketOrderBook**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[MarketOrderBook](api-interfaces-augur-sdk-src-state-getter-markets-marketorderbook.md)>

*Defined in [augur-sdk/src/state/getter/Markets.ts:597](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L597)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[MarketOrderBook](api-interfaces-augur-sdk-src-state-getter-markets-marketorderbook.md)>

___
<a id="getmarketpricecandlesticks"></a>

### `<Static>` getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[MarketPriceCandlesticks](api-interfaces-augur-sdk-src-state-getter-markets-marketpricecandlesticks.md)>

*Defined in [augur-sdk/src/state/getter/Markets.ts:287](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L287)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[MarketPriceCandlesticks](api-interfaces-augur-sdk-src-state-getter-markets-marketpricecandlesticks.md)>

___
<a id="getmarketpricehistory"></a>

### `<Static>` getMarketPriceHistory

▸ **getMarketPriceHistory**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[MarketPriceHistory](api-interfaces-augur-sdk-src-state-getter-markets-marketpricehistory.md)>

*Defined in [augur-sdk/src/state/getter/Markets.ts:421](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L421)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[MarketPriceHistory](api-interfaces-augur-sdk-src-state-getter-markets-marketpricehistory.md)>

___
<a id="getmarkets"></a>

### `<Static>` getMarkets

▸ **getMarkets**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[MarketList](api-interfaces-augur-sdk-src-state-getter-markets-marketlist.md)>

*Defined in [augur-sdk/src/state/getter/Markets.ts:452](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L452)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[MarketList](api-interfaces-augur-sdk-src-state-getter-markets-marketlist.md)>

___
<a id="getmarketsinfo"></a>

### `<Static>` getMarketsInfo

▸ **getMarketsInfo**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[MarketInfo](api-interfaces-augur-sdk-src-state-getter-markets-marketinfo.md)[]>

*Defined in [augur-sdk/src/state/getter/Markets.ts:711](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L711)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[MarketInfo](api-interfaces-augur-sdk-src-state-getter-markets-marketinfo.md)[]>

___


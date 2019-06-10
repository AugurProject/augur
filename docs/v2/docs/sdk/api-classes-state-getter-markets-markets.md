---
id: api-classes-state-getter-markets-markets
title: Markets
sidebar_label: Markets
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Markets Module]](api-modules-state-getter-markets-module.md) > [Markets](api-classes-state-getter-markets-markets.md)

## Class

## Hierarchy

**Markets**

### Properties

* [GetMarketPriceCandlestickParams](api-classes-state-getter-markets-markets.md#getmarketpricecandlestickparams)
* [GetMarketPriceHistoryParams](api-classes-state-getter-markets-markets.md#getmarketpricehistoryparams)
* [GetMarketsInfoParams](api-classes-state-getter-markets-markets.md#getmarketsinfoparams)
* [GetMarketsParams](api-classes-state-getter-markets-markets.md#getmarketsparams)
* [GetTopics](api-classes-state-getter-markets-markets.md#gettopics)

### Methods

* [getMarketPriceCandlesticks](api-classes-state-getter-markets-markets.md#getmarketpricecandlesticks)
* [getMarketPriceHistory](api-classes-state-getter-markets-markets.md#getmarketpricehistory)
* [getMarkets](api-classes-state-getter-markets-markets.md#getmarkets)
* [getMarketsInfo](api-classes-state-getter-markets-markets.md#getmarketsinfo)
* [getTopics](api-classes-state-getter-markets-markets.md#gettopics-1)

---

## Properties

<a id="getmarketpricecandlestickparams"></a>

### `<Static>` GetMarketPriceCandlestickParams

**● GetMarketPriceCandlestickParams**: *`any`* =  t.type({
    marketId: t.string,
    outcome: t.union([OutcomeParam, t.number, t.null, t.undefined]),
    start: t.union([t.number, t.null, t.undefined]),
    end: t.union([t.number, t.null, t.undefined]),
    period: t.union([t.number, t.null, t.undefined]),
  })

*Defined in [state/getter/Markets.ts:121](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L121)*

___
<a id="getmarketpricehistoryparams"></a>

### `<Static>` GetMarketPriceHistoryParams

**● GetMarketPriceHistoryParams**: *`any`* =  t.type({ marketId: t.string })

*Defined in [state/getter/Markets.ts:128](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L128)*

___
<a id="getmarketsinfoparams"></a>

### `<Static>` GetMarketsInfoParams

**● GetMarketsInfoParams**: *`any`* =  t.type({ marketIds: t.array(t.string) })

*Defined in [state/getter/Markets.ts:130](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L130)*

___
<a id="getmarketsparams"></a>

### `<Static>` GetMarketsParams

**● GetMarketsParams**: *`any`* =  t.intersection([GetMarketsParamsSpecific, SortLimit])

*Defined in [state/getter/Markets.ts:129](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L129)*

___
<a id="gettopics"></a>

### `<Static>` GetTopics

**● GetTopics**: *`any`* =  t.type({ universe: t.string })

*Defined in [state/getter/Markets.ts:131](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L131)*

___

## Methods

<a id="getmarketpricecandlesticks"></a>

### `<Static>` getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[MarketPriceCandlesticks](api-interfaces-state-getter-markets-marketpricecandlesticks.md)>

*Defined in [state/getter/Markets.ts:134](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[MarketPriceCandlesticks](api-interfaces-state-getter-markets-marketpricecandlesticks.md)>

___
<a id="getmarketpricehistory"></a>

### `<Static>` getMarketPriceHistory

▸ **getMarketPriceHistory**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[MarketPriceHistory](api-interfaces-state-getter-markets-marketpricehistory.md)>

*Defined in [state/getter/Markets.ts:168](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L168)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[MarketPriceHistory](api-interfaces-state-getter-markets-marketpricehistory.md)>

___
<a id="getmarkets"></a>

### `<Static>` getMarkets

▸ **getMarkets**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[Address](api-modules-state-logs-types-module.md#address)>>

*Defined in [state/getter/Markets.ts:194](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L194)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[Address](api-modules-state-logs-types-module.md#address)>>

___
<a id="getmarketsinfo"></a>

### `<Static>` getMarketsInfo

▸ **getMarketsInfo**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[MarketInfo](api-interfaces-state-getter-markets-marketinfo.md)>>

*Defined in [state/getter/Markets.ts:322](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L322)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[MarketInfo](api-interfaces-state-getter-markets-marketinfo.md)>>

___
<a id="gettopics-1"></a>

### `<Static>` getTopics

▸ **getTopics**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<`string`>>

*Defined in [state/getter/Markets.ts:403](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L403)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<`string`>>

___


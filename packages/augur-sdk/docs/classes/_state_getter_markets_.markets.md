[@augurproject/sdk](../README.md) > ["state/getter/Markets"](../modules/_state_getter_markets_.md) > [Markets](../classes/_state_getter_markets_.markets.md)

# Class: Markets

## Hierarchy

**Markets**

## Index

### Properties

* [GetMarketPriceCandlestickParams](_state_getter_markets_.markets.md#getmarketpricecandlestickparams)
* [GetMarketPriceHistoryParams](_state_getter_markets_.markets.md#getmarketpricehistoryparams)
* [GetMarketsInfoParams](_state_getter_markets_.markets.md#getmarketsinfoparams)
* [GetMarketsParams](_state_getter_markets_.markets.md#getmarketsparams)
* [GetTopics](_state_getter_markets_.markets.md#gettopics)

### Methods

* [getMarketPriceCandlesticks](_state_getter_markets_.markets.md#getmarketpricecandlesticks)
* [getMarketPriceHistory](_state_getter_markets_.markets.md#getmarketpricehistory)
* [getMarkets](_state_getter_markets_.markets.md#getmarkets)
* [getMarketsInfo](_state_getter_markets_.markets.md#getmarketsinfo)
* [getTopics](_state_getter_markets_.markets.md#gettopics-1)

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

*Defined in [state/getter/Markets.ts:121](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L121)*

___
<a id="getmarketpricehistoryparams"></a>

### `<Static>` GetMarketPriceHistoryParams

**● GetMarketPriceHistoryParams**: *`any`* =  t.type({ marketId: t.string })

*Defined in [state/getter/Markets.ts:128](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L128)*

___
<a id="getmarketsinfoparams"></a>

### `<Static>` GetMarketsInfoParams

**● GetMarketsInfoParams**: *`any`* =  t.type({ marketIds: t.array(t.string) })

*Defined in [state/getter/Markets.ts:130](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L130)*

___
<a id="getmarketsparams"></a>

### `<Static>` GetMarketsParams

**● GetMarketsParams**: *`any`* =  t.intersection([GetMarketsParamsSpecific, SortLimit])

*Defined in [state/getter/Markets.ts:129](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L129)*

___
<a id="gettopics"></a>

### `<Static>` GetTopics

**● GetTopics**: *`any`* =  t.type({ universe: t.string })

*Defined in [state/getter/Markets.ts:131](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L131)*

___

## Methods

<a id="getmarketpricecandlesticks"></a>

### `<Static>` getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[MarketPriceCandlesticks](../interfaces/_state_getter_markets_.marketpricecandlesticks.md)>

*Defined in [state/getter/Markets.ts:134](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[MarketPriceCandlesticks](../interfaces/_state_getter_markets_.marketpricecandlesticks.md)>

___
<a id="getmarketpricehistory"></a>

### `<Static>` getMarketPriceHistory

▸ **getMarketPriceHistory**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[MarketPriceHistory](../interfaces/_state_getter_markets_.marketpricehistory.md)>

*Defined in [state/getter/Markets.ts:168](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L168)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[MarketPriceHistory](../interfaces/_state_getter_markets_.marketpricehistory.md)>

___
<a id="getmarkets"></a>

### `<Static>` getMarkets

▸ **getMarkets**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[Address](../modules/_state_logs_types_.md#address)>>

*Defined in [state/getter/Markets.ts:194](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L194)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[Address](../modules/_state_logs_types_.md#address)>>

___
<a id="getmarketsinfo"></a>

### `<Static>` getMarketsInfo

▸ **getMarketsInfo**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[MarketInfo](../interfaces/_state_getter_markets_.marketinfo.md)>>

*Defined in [state/getter/Markets.ts:322](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L322)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[MarketInfo](../interfaces/_state_getter_markets_.marketinfo.md)>>

___
<a id="gettopics-1"></a>

### `<Static>` getTopics

▸ **getTopics**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<`string`>>

*Defined in [state/getter/Markets.ts:403](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L403)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<`string`>>

___


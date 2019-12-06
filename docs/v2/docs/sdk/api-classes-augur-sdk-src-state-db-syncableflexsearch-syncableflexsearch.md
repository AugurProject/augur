---
id: api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch
title: SyncableFlexSearch
sidebar_label: SyncableFlexSearch
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/SyncableFlexSearch Module]](api-modules-augur-sdk-src-state-db-syncableflexsearch-module.md) > [SyncableFlexSearch](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md)

## Class

## Hierarchy

**SyncableFlexSearch**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md#constructor)

### Properties

* [flexSearchIndex](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md#flexsearchindex)

### Methods

* [addMarketCreatedDocs](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md#addmarketcreateddocs)
* [removeMarketCreatedDocs](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md#removemarketcreateddocs)
* [search](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md#search)
* [where](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md#where)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncableFlexSearch**(): [SyncableFlexSearch](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md)

*Defined in [augur-sdk/src/state/db/SyncableFlexSearch.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L22)*

**Returns:** [SyncableFlexSearch](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md)

___

## Properties

<a id="flexsearchindex"></a>

### `<Private>` flexSearchIndex

**● flexSearchIndex**: *`Index`<[MarketFields](api-interfaces-augur-sdk-src-state-db-syncableflexsearch-marketfields.md)>*

*Defined in [augur-sdk/src/state/db/SyncableFlexSearch.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L22)*

___

## Methods

<a id="addmarketcreateddocs"></a>

###  addMarketCreatedDocs

▸ **addMarketCreatedDocs**(marketCreatedDocs: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)[]*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/SyncableFlexSearch.ts:58](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L58)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketCreatedDocs | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)[] |

**Returns:** `Promise`<`void`>

___
<a id="removemarketcreateddocs"></a>

###  removeMarketCreatedDocs

▸ **removeMarketCreatedDocs**(marketCreatedDocs: *`Collection`<`any`, `any`>*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/SyncableFlexSearch.ts:97](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketCreatedDocs | `Collection`<`any`, `any`> |

**Returns:** `Promise`<`void`>

___
<a id="search"></a>

###  search

▸ **search**(query: *`string`*, options?: *`SearchOptions`*): `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-augur-sdk-src-state-db-syncableflexsearch-marketfields.md)>>>

*Defined in [augur-sdk/src/state/db/SyncableFlexSearch.ts:50](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L50)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `string` |
| `Optional` options | `SearchOptions` |

**Returns:** `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-augur-sdk-src-state-db-syncableflexsearch-marketfields.md)>>>

___
<a id="where"></a>

###  where

▸ **where**(whereObj: *`object`*): `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-augur-sdk-src-state-db-syncableflexsearch-marketfields.md)>>>

*Defined in [augur-sdk/src/state/db/SyncableFlexSearch.ts:54](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| whereObj | `object` |

**Returns:** `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-augur-sdk-src-state-db-syncableflexsearch-marketfields.md)>>>

___


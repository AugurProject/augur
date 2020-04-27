[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/SyncableFlexSearch"](../modules/_augur_sdk_src_state_db_syncableflexsearch_.md) › [SyncableFlexSearch](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md)

# Class: SyncableFlexSearch

## Hierarchy

* **SyncableFlexSearch**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md#constructor)

### Properties

* [flexSearchIndex](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md#private-flexsearchindex)

### Methods

* [addMarketCreatedDocs](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md#addmarketcreateddocs)
* [removeMarketCreatedDocs](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md#removemarketcreateddocs)
* [search](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md#search)
* [where](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md#where)

## Constructors

###  constructor

\+ **new SyncableFlexSearch**(): *[SyncableFlexSearch](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md)*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L22)*

**Returns:** *[SyncableFlexSearch](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md)*

## Properties

### `Private` flexSearchIndex

• **flexSearchIndex**: *Index‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L22)*

## Methods

###  addMarketCreatedDocs

▸ **addMarketCreatedDocs**(`marketCreatedDocs`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:58](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`marketCreatedDocs` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[] |

**Returns:** *Promise‹void›*

___

###  removeMarketCreatedDocs

▸ **removeMarketCreatedDocs**(`marketCreatedDocs`: Collection‹any, any›): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:97](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L97)*

**Parameters:**

Name | Type |
------ | ------ |
`marketCreatedDocs` | Collection‹any, any› |

**Returns:** *Promise‹void›*

___

###  search

▸ **search**(`query`: string, `options?`: SearchOptions): *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:50](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`query` | string |
`options?` | SearchOptions |

**Returns:** *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

___

###  where

▸ **where**(`whereObj`: object): *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:54](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`whereObj` | object |

**Returns:** *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

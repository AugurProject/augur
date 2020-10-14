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

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L17)*

**Returns:** *[SyncableFlexSearch](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md)*

## Properties

### `Private` flexSearchIndex

• **flexSearchIndex**: *Index‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L17)*

## Methods

###  addMarketCreatedDocs

▸ **addMarketCreatedDocs**(`marketCreatedDocs`: MarketData[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:65](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`marketCreatedDocs` | MarketData[] |

**Returns:** *Promise‹void›*

___

###  removeMarketCreatedDocs

▸ **removeMarketCreatedDocs**(`marketCreatedDocs`: Collection‹any, any›): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:117](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`marketCreatedDocs` | Collection‹any, any› |

**Returns:** *Promise‹void›*

___

###  search

▸ **search**(`query`: string, `options?`: SearchOptions): *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:52](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`query` | string |
`options?` | SearchOptions |

**Returns:** *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

___

###  where

▸ **where**(`whereObj`: object): *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

*Defined in [packages/augur-sdk/src/state/db/SyncableFlexSearch.ts:59](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableFlexSearch.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`whereObj` | object |

**Returns:** *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

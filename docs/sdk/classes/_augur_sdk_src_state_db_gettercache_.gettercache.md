[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/GetterCache"](../modules/_augur_sdk_src_state_db_gettercache_.md) › [GetterCache](_augur_sdk_src_state_db_gettercache_.gettercache.md)

# Class: GetterCache

Stores Getter results

## Hierarchy

* [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md)

  ↳ **GetterCache**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_gettercache_.gettercache.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_db_gettercache_.gettercache.md#private-augur)
* [dbName](_augur_sdk_src_state_db_gettercache_.gettercache.md#readonly-dbname)
* [idFields](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-idfields)
* [networkId](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-networkid)
* [syncing](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-syncing)
* [table](_augur_sdk_src_state_db_gettercache_.gettercache.md#table)
* [timeToLive](_augur_sdk_src_state_db_gettercache_.gettercache.md#private-timetolive)

### Methods

* [allDocs](_augur_sdk_src_state_db_gettercache_.gettercache.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-bulkadddocuments)
* [bulkAddDocumentsInternal](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-bulkadddocumentsinternal)
* [bulkPutDocuments](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-bulkputdocuments)
* [bulkPutDocumentsInternal](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-bulkputdocumentsinternal)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-bulkupsertdocuments)
* [bulkUpsertDocumentsInternal](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-bulkupsertdocumentsinternal)
* [cacheResponse](_augur_sdk_src_state_db_gettercache_.gettercache.md#cacheresponse)
* [checkExpired](_augur_sdk_src_state_db_gettercache_.gettercache.md#checkexpired)
* [clear](_augur_sdk_src_state_db_gettercache_.gettercache.md#clear)
* [clearCaches](_augur_sdk_src_state_db_gettercache_.gettercache.md#clearcaches)
* [clearDB](_augur_sdk_src_state_db_gettercache_.gettercache.md#cleardb)
* [clearInternal](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-clearinternal)
* [delete](_augur_sdk_src_state_db_gettercache_.gettercache.md#delete)
* [find](_augur_sdk_src_state_db_gettercache_.gettercache.md#find)
* [getCachedResponse](_augur_sdk_src_state_db_gettercache_.gettercache.md#getcachedresponse)
* [getDocument](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-getdocument)
* [getDocumentCount](_augur_sdk_src_state_db_gettercache_.gettercache.md#getdocumentcount)
* [getIDValue](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-getidvalue)
* [saveDocuments](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-savedocuments)
* [subscribeToCacheClearingEvents](_augur_sdk_src_state_db_gettercache_.gettercache.md#subscribetocacheclearingevents)
* [subscribeToNewBlocks](_augur_sdk_src_state_db_gettercache_.gettercache.md#subscribetonewblocks)
* [upsertDocument](_augur_sdk_src_state_db_gettercache_.gettercache.md#protected-upsertdocument)
* [create](_augur_sdk_src_state_db_gettercache_.gettercache.md#static-create)
* [setConcurrency](_augur_sdk_src_state_db_gettercache_.gettercache.md#static-setconcurrency)

### Object literals

* [eventMapForCacheClearing](_augur_sdk_src_state_db_gettercache_.gettercache.md#eventmapforcacheclearing)

## Constructors

###  constructor

\+ **new GetterCache**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[GetterCache](_augur_sdk_src_state_db_gettercache_.gettercache.md)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[constructor](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-constructor)*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:90](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`networkId` | number |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[GetterCache](_augur_sdk_src_state_db_gettercache_.gettercache.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L11)*

___

### `Readonly` dbName

• **dbName**: *string*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#readonly-dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:33](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L33)*

___

### `Protected` idFields

• **idFields**: *string[]*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[idFields](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-idfields)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L34)*

___

### `Protected` networkId

• **networkId**: *number*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[networkId](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L32)*

___

### `Protected` syncing

• **syncing**: *boolean*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[syncing](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-syncing)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:35](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L35)*

___

###  table

• **table**: *Table‹any, any›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[table](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#table)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:31](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L31)*

___

### `Private` timeToLive

• **timeToLive**: *number* = 5 * 60 * 60 * 1000

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:13](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L13)*

## Methods

###  allDocs

▸ **allDocs**(): *Promise‹any[]›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[allDocs](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:85](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L85)*

**Returns:** *Promise‹any[]›*

___

### `Protected` bulkAddDocuments

▸ **bulkAddDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:131](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkAddDocumentsInternal

▸ **bulkAddDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:149](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocuments

▸ **bulkPutDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:135](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L135)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |
`documentIds?` | any[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocumentsInternal

▸ **bulkPutDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:163](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L163)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |
`documentIds?` | any[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkUpsertDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkupsertdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:139](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L139)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkUpsertDocumentsInternal

▸ **bulkUpsertDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkUpsertDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkupsertdocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:178](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L178)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  cacheResponse

▸ **cacheResponse**(`name`: string, `params`: any, `response`: any): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:121](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L121)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`params` | any |
`response` | any |

**Returns:** *Promise‹void›*

___

###  checkExpired

▸ **checkExpired**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:135](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L135)*

**Returns:** *Promise‹void›*

___

###  clear

▸ **clear**(): *Promise‹void›*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clear](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#clear)*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:158](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L158)*

**Returns:** *Promise‹void›*

___

###  clearCaches

▸ **clearCaches**(`names`: string[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:131](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`names` | string[] |

**Returns:** *Promise‹void›*

___

###  clearDB

▸ **clearDB**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearDB](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#cleardb)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:78](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L78)*

**Returns:** *Promise‹void›*

___

### `Protected` clearInternal

▸ **clearInternal**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-clearinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:143](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L143)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(): *Promise‹void›*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[delete](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#delete)*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:151](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L151)*

**Returns:** *Promise‹void›*

___

###  find

▸ **find**(`request`: object): *Promise‹Collection‹any, any››*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[find](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:204](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | object |

**Returns:** *Promise‹Collection‹any, any››*

___

###  getCachedResponse

▸ **getCachedResponse**(`name`: string, `params`: any): *Promise‹any›*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:110](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L110)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`params` | any |

**Returns:** *Promise‹any›*

___

### `Protected` getDocument

▸ **getDocument**‹**Document**›(`id`: string): *Promise‹Document | undefined›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:115](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L115)*

**Type parameters:**

▪ **Document**

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹Document | undefined›*

___

###  getDocumentCount

▸ **getDocumentCount**(): *Promise‹number›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocumentCount](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#getdocumentcount)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:108](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L108)*

**Returns:** *Promise‹number›*

___

### `Protected` getIDValue

▸ **getIDValue**(`document`: any): *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getIDValue](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getidvalue)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:208](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L208)*

**Parameters:**

Name | Type |
------ | ------ |
`document` | any |

**Returns:** *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:191](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  subscribeToCacheClearingEvents

▸ **subscribeToCacheClearingEvents**(): *void*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:141](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L141)*

**Returns:** *void*

___

###  subscribeToNewBlocks

▸ **subscribeToNewBlocks**(): *void*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:147](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L147)*

**Returns:** *void*

___

### `Protected` upsertDocument

▸ **upsertDocument**(`documentID`: [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id), `document`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[upsertDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:195](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`documentID` | [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id) |
`document` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md) |

**Returns:** *Promise‹void›*

___

### `Static` create

▸ **create**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[GetterCache](_augur_sdk_src_state_db_gettercache_.gettercache.md)*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:106](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`networkId` | number |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[GetterCache](_augur_sdk_src_state_db_gettercache_.gettercache.md)*

___

### `Static` setConcurrency

▸ **setConcurrency**(`limit`: number): *AsyncQueue‹[WriteQueueTask](../interfaces/_augur_sdk_src_state_db_abstracttable_.writequeuetask.md)›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[setConcurrency](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#static-setconcurrency)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L37)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`limit` | number | DEFAULT_CONCURRENCY |

**Returns:** *AsyncQueue‹[WriteQueueTask](../interfaces/_augur_sdk_src_state_db_abstracttable_.writequeuetask.md)›*

## Object literals

###  eventMapForCacheClearing

### ▪ **eventMapForCacheClearing**: *object*

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L16)*

###  [SubscriptionEventName.BulkOrderEvent]

• **[SubscriptionEventName.BulkOrderEvent]**: *string[]* = [
            "getMarketPriceHistory",
            "getMarketOrderBook",
            "getUserFrozenFundsBreakdown",
            "getUserAccountData",
            "getUserPositionsPlus",
            "getUserOpenOrders",
            "getAccountTimeRangedStats",
            "getTotalOnChainFrozenFunds",
            "getZeroXOrder",
            "getZeroXOrders",
            "getMarketsLiquidityPools",
            "getMarketOutcomeBestOffer"
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:57](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L57)*

###  [SubscriptionEventName.DBUpdatedZeroXOrders]

• **[SubscriptionEventName.DBUpdatedZeroXOrders]**: *string[]* = [
            "getMarketPriceHistory",
            "getMarketOrderBook",
            "getUserFrozenFundsBreakdown",
            "getUserAccountData",
            "getUserPositionsPlus",
            "getUserOpenOrders",
            "getAccountTimeRangedStats",
            "getTotalOnChainFrozenFunds",
            "getZeroXOrder",
            "getZeroXOrders",
            "getMarketsLiquidityPools",
            "getMarketOutcomeBestOffer"
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L71)*

###  [SubscriptionEventName.MarketsUpdated]

• **[SubscriptionEventName.MarketsUpdated]**: *string[]* = [
            "getMarkets",
            "getMarketLiquidityRanking",
            "getMarketOutcomeBestOffer",
            "getMarketsInfo",
            "getPlatformActivityStats",
            "getTotalOnChainFrozenFunds",
            "getCategories",
            "getCategoryStats"
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L17)*

###  [SubscriptionEventName.OrderEvent]

• **[SubscriptionEventName.OrderEvent]**: *string[]* = [
            "getProfitLoss",
            "getProfitLossSummary",
            "getTradingHistory",
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:52](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L52)*

###  [SubscriptionEventName.ProfitLossChanged]

• **[SubscriptionEventName.ProfitLossChanged]**: *string[]* = [
            "getUserTradingPositions",
            "getProfitLoss",
            "getProfitLossSummary",
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:85](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L85)*

###  [SubscriptionEventName.UniverseCreated]

• **[SubscriptionEventName.UniverseCreated]**: *string[]* = [
            "getUniverseChildren"
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:49](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L49)*

###  [SubscriptionEventName.ZeroXMeshOrderEvent]

• **[SubscriptionEventName.ZeroXMeshOrderEvent]**: *string[]* = [
            "getMarketPriceHistory",
            "getMarketOrderBook",
            "getUserFrozenFundsBreakdown",
            "getUserAccountData",
            "getUserPositionsPlus",
            "getUserOpenOrders",
            "getAccountTimeRangedStats",
            "getTotalOnChainFrozenFunds",
            "getZeroXOrder",
            "getZeroXOrders",
            "getMarketsLiquidityPools",
            "getMarketOutcomeBestOffer"
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:35](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L35)*

###  [TXEventName.Success]

• **[TXEventName.Success]**: *string[]* = [
            "getAccountRepStakeSummary",
            "getAccountTransactionHistory",
            "getUserCurrentDisputeStake",
            "getUserAccountData",
            "getUserPositionsPlus",
            "getAccountTimeRangedStats",
        ]

*Defined in [packages/augur-sdk/src/state/db/GetterCache.ts:27](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/GetterCache.ts#L27)*

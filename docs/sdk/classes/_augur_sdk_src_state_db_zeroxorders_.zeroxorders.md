[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/ZeroXOrders"](../modules/_augur_sdk_src_state_db_zeroxorders_.md) › [ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)

# Class: ZeroXOrders

Stores 0x orders

## Hierarchy

* [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md)

  ↳ **ZeroXOrders**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#private-augur)
* [cashAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#cashassetdata)
* [dbName](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#dbname)
* [idFields](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-idfields)
* [networkId](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-networkid)
* [pastOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#private-pastorders)
* [shareAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#shareassetdata)
* [stateDB](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-statedb)
* [syncStatus](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-syncstatus)
* [syncing](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-syncing)
* [table](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#table)
* [takerAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#takerassetdata)
* [tradeTokenAddress](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#tradetokenaddress)

### Methods

* [allDocs](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkadddocuments)
* [bulkPutDocuments](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkputdocuments)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkupsertdocuments)
* [clearDB](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#cleardb)
* [clearDBAndCacheOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#cleardbandcacheorders)
* [delete](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#delete)
* [find](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#find)
* [getDocument](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-getdocument)
* [getDocumentCount](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#getdocumentcount)
* [getIDValue](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-getidvalue)
* [handleOrderEvent](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#handleorderevent)
* [isValidMultiAssetFormat](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#isvalidmultiassetformat)
* [parseAssetDataAndValidate](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#parseassetdataandvalidate)
* [processOrder](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#processorder)
* [saveDocuments](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-savedocuments)
* [subscribeToOrderEvents](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#subscribetoorderevents)
* [sync](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#sync)
* [upsertDocument](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-upsertdocument)
* [validateOrder](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#validateorder)
* [validateStoredOrder](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#validatestoredorder)
* [create](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#static-create)
* [parseAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#static-parseassetdata)
* [parseTradeAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#static-parsetradeassetdata)

## Constructors

###  constructor

\+ **new ZeroXOrders**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[constructor](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-constructor)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:111](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L111)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`networkId` | number |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:106](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L106)*

___

###  cashAssetData

• **cashAssetData**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:108](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L108)*

___

###  dbName

• **dbName**: *string*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L17)*

___

### `Protected` idFields

• **idFields**: *string[]*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[idFields](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-idfields)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L18)*

___

### `Protected` networkId

• **networkId**: *number*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[networkId](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___

### `Private` pastOrders

• **pastOrders**: *Dictionary‹[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:111](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L111)*

___

###  shareAssetData

• **shareAssetData**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:109](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L109)*

___

### `Protected` stateDB

• **stateDB**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:105](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L105)*

___

### `Protected` syncStatus

• **syncStatus**: *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:104](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L104)*

___

### `Protected` syncing

• **syncing**: *boolean*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[syncing](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-syncing)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L19)*

___

###  table

• **table**: *Table‹any, any›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[table](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#table)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

___

###  takerAssetData

• **takerAssetData**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:110](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L110)*

___

###  tradeTokenAddress

• **tradeTokenAddress**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:107](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L107)*

## Methods

###  allDocs

▸ **allDocs**(): *Promise‹any[]›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[allDocs](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L35)*

**Returns:** *Promise‹any[]›*

___

### `Protected` bulkAddDocuments

▸ **bulkAddDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocuments

▸ **bulkPutDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:63](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L63)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:70](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  clearDB

▸ **clearDB**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearDB](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#cleardb)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:30](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L30)*

**Returns:** *Promise‹void›*

___

###  clearDBAndCacheOrders

▸ **clearDBAndCacheOrders**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:150](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L150)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(): *void*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:163](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L163)*

**Returns:** *void*

___

###  find

▸ **find**(`request`: object): *Promise‹Collection‹any, any››*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[find](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:94](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | object |

**Returns:** *Promise‹Collection‹any, any››*

___

### `Protected` getDocument

▸ **getDocument**<**Document**>(`id`: string): *Promise‹Document | undefined›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:52](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L52)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L48)*

**Returns:** *Promise‹number›*

___

### `Protected` getIDValue

▸ **getIDValue**(`document`: any): *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getIDValue](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getidvalue)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:98](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`document` | any |

**Returns:** *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

___

###  handleOrderEvent

▸ **handleOrderEvent**(`orderEvents`: OrderEvent[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:168](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L168)*

**Parameters:**

Name | Type |
------ | ------ |
`orderEvents` | OrderEvent[] |

**Returns:** *Promise‹void›*

___

###  isValidMultiAssetFormat

▸ **isValidMultiAssetFormat**(`multiAssetData`: any): *boolean*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:321](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L321)*

**Parameters:**

Name | Type |
------ | ------ |
`multiAssetData` | any |

**Returns:** *boolean*

___

###  parseAssetDataAndValidate

▸ **parseAssetDataAndValidate**(`assetData`: string): *[OrderData](../interfaces/_augur_sdk_src_state_db_zeroxorders_.orderdata.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:297](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L297)*

**Parameters:**

Name | Type |
------ | ------ |
`assetData` | string |

**Returns:** *[OrderData](../interfaces/_augur_sdk_src_state_db_zeroxorders_.orderdata.md)*

___

###  processOrder

▸ **processOrder**(`order`: OrderInfo): *[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:265](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L265)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | OrderInfo |

**Returns:** *[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:141](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  subscribeToOrderEvents

▸ **subscribeToOrderEvents**(): *void*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:156](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L156)*

**Returns:** *void*

___

###  sync

▸ **sync**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:209](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L209)*

**Returns:** *Promise‹void›*

___

### `Protected` upsertDocument

▸ **upsertDocument**(`documentID`: [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id), `document`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[upsertDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:85](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`documentID` | [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id) |
`document` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md) |

**Returns:** *Promise‹void›*

___

###  validateOrder

▸ **validateOrder**(`order`: OrderInfo): *boolean*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:238](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L238)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | OrderInfo |

**Returns:** *boolean*

___

###  validateStoredOrder

▸ **validateStoredOrder**(`storedOrder`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md), `markets`: Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)›): *boolean*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:245](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L245)*

**Parameters:**

Name | Type |
------ | ------ |
`storedOrder` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md) |
`markets` | Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)› |

**Returns:** *boolean*

___

### `Static` create

▸ **create**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:145](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`networkId` | number |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

___

### `Static` parseAssetData

▸ **parseAssetData**(`assetData`: string): *[ParsedAssetDataResults](../interfaces/_augur_sdk_src_state_db_zeroxorders_.parsedassetdataresults.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:307](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L307)*

**Parameters:**

Name | Type |
------ | ------ |
`assetData` | string |

**Returns:** *[ParsedAssetDataResults](../interfaces/_augur_sdk_src_state_db_zeroxorders_.parsedassetdataresults.md)*

___

### `Static` parseTradeAssetData

▸ **parseTradeAssetData**(`assetData`: string): *[OrderData](../interfaces/_augur_sdk_src_state_db_zeroxorders_.orderdata.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:337](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L337)*

**Parameters:**

Name | Type |
------ | ------ |
`assetData` | string |

**Returns:** *[OrderData](../interfaces/_augur_sdk_src_state_db_zeroxorders_.orderdata.md)*

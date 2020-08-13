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
* [cashAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#readonly-cashassetdata)
* [dbName](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#readonly-dbname)
* [idFields](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-idfields)
* [networkId](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-networkid)
* [pastOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#private-pastorders)
* [shareAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#readonly-shareassetdata)
* [stateDB](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-statedb)
* [syncStatus](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-syncstatus)
* [syncing](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-syncing)
* [table](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#table)
* [takerAssetData](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#readonly-takerassetdata)
* [tradeTokenAddress](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#readonly-tradetokenaddress)

### Methods

* [allDocs](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkadddocuments)
* [bulkAddDocumentsInternal](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkadddocumentsinternal)
* [bulkPutDocuments](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkputdocuments)
* [bulkPutDocumentsInternal](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkputdocumentsinternal)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkupsertdocuments)
* [bulkUpsertDocumentsInternal](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-bulkupsertdocumentsinternal)
* [cacheOrdersAndSync](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#cacheordersandsync)
* [clear](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#clear)
* [clearDB](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#cleardb)
* [clearInternal](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#protected-clearinternal)
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
* [setConcurrency](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md#static-setconcurrency)

## Constructors

###  constructor

\+ **new ZeroXOrders**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[constructor](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-constructor)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:72](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L72)*

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

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:67](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L67)*

___

### `Readonly` cashAssetData

• **cashAssetData**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:69](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L69)*

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

### `Private` pastOrders

• **pastOrders**: *Dictionary‹[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:72](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L72)*

___

### `Readonly` shareAssetData

• **shareAssetData**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:70](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L70)*

___

### `Protected` stateDB

• **stateDB**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:66](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L66)*

___

### `Protected` syncStatus

• **syncStatus**: *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:65](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L65)*

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

### `Readonly` takerAssetData

• **takerAssetData**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L71)*

___

### `Readonly` tradeTokenAddress

• **tradeTokenAddress**: *string*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:68](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L68)*

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

###  cacheOrdersAndSync

▸ **cacheOrdersAndSync**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:104](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L104)*

**Returns:** *Promise‹void›*

___

###  clear

▸ **clear**(): *Promise‹void›*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clear](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#clear)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:122](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L122)*

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

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:116](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L116)*

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

###  handleOrderEvent

▸ **handleOrderEvent**(`orderEvents`: OrderEvent[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:126](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`orderEvents` | OrderEvent[] |

**Returns:** *Promise‹void›*

___

###  isValidMultiAssetFormat

▸ **isValidMultiAssetFormat**(`multiAssetData`: any): *boolean*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:312](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L312)*

**Parameters:**

Name | Type |
------ | ------ |
`multiAssetData` | any |

**Returns:** *boolean*

___

###  parseAssetDataAndValidate

▸ **parseAssetDataAndValidate**(`assetData`: string): *OrderData*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:302](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L302)*

**Parameters:**

Name | Type |
------ | ------ |
`assetData` | string |

**Returns:** *OrderData*

___

###  processOrder

▸ **processOrder**(`order`: OrderInfo): *[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:270](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L270)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | OrderInfo |

**Returns:** *[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:95](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L95)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  subscribeToOrderEvents

▸ **subscribeToOrderEvents**(): *void*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:109](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L109)*

**Returns:** *void*

___

###  sync

▸ **sync**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:172](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L172)*

**Returns:** *Promise‹void›*

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

###  validateOrder

▸ **validateOrder**(`order`: OrderInfo): *boolean*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:242](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | OrderInfo |

**Returns:** *boolean*

___

###  validateStoredOrder

▸ **validateStoredOrder**(`storedOrder`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md), `markets`: Dictionary‹MarketData›): *boolean*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:249](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L249)*

**Parameters:**

Name | Type |
------ | ------ |
`storedOrder` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md) |
`markets` | Dictionary‹MarketData› |

**Returns:** *boolean*

___

### `Static` create

▸ **create**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:99](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`networkId` | number |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

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

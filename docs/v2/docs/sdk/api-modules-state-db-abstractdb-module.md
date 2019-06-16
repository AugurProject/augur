---
id: api-modules-state-db-abstractdb-module
title: state/db/AbstractDB Module
sidebar_label: state/db/AbstractDB
---

[@augurproject/sdk](api-readme.md) > [[state/db/AbstractDB Module]](api-modules-state-db-abstractdb-module.md)

## Module

### Classes

* [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md)

### Interfaces

* [BaseDocument](api-interfaces-state-db-abstractdb-basedocument.md)
* [DocumentIDToRev](api-interfaces-state-db-abstractdb-documentidtorev.md)

### Type aliases

* [PouchDBFactoryType](api-modules-state-db-abstractdb-module.md#pouchdbfactorytype)

### Functions

* [PouchDBFactory](api-modules-state-db-abstractdb-module.md#pouchdbfactory)

---

## Type aliases

<a id="pouchdbfactorytype"></a>

###  PouchDBFactoryType

**Ƭ PouchDBFactoryType**: *`function`*

*Defined in [state/db/AbstractDB.ts:95](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L95)*

#### Type declaration
▸(dbName: *`string`*): `Database`

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Database`

___

## Functions

<a id="pouchdbfactory"></a>

###  PouchDBFactory

▸ **PouchDBFactory**(dbArgs: *`DatabaseConfiguration`*): `(Anonymous function)`

*Defined in [state/db/AbstractDB.ts:97](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbArgs | `DatabaseConfiguration` |

**Returns:** `(Anonymous function)`

___


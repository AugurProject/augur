[@augurproject/sdk](../README.md) > ["state/db/AbstractDB"](../modules/_state_db_abstractdb_.md)

# External module: "state/db/AbstractDB"

## Index

### Classes

* [AbstractDB](../classes/_state_db_abstractdb_.abstractdb.md)

### Interfaces

* [BaseDocument](../interfaces/_state_db_abstractdb_.basedocument.md)
* [DocumentIDToRev](../interfaces/_state_db_abstractdb_.documentidtorev.md)

### Type aliases

* [PouchDBFactoryType](_state_db_abstractdb_.md#pouchdbfactorytype)

### Functions

* [PouchDBFactory](_state_db_abstractdb_.md#pouchdbfactory)

---

## Type aliases

<a id="pouchdbfactorytype"></a>

###  PouchDBFactoryType

**Ƭ PouchDBFactoryType**: *`function`*

*Defined in [state/db/AbstractDB.ts:95](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L95)*

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

*Defined in [state/db/AbstractDB.ts:97](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbArgs | `DatabaseConfiguration` |

**Returns:** `(Anonymous function)`

___


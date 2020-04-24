[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Universe"](../modules/_augur_sdk_src_state_getter_universe_.md) › [Universe](_augur_sdk_src_state_getter_universe_.universe.md)

# Class: Universe

## Hierarchy

* **Universe**

## Index

### Properties

* [getForkMigrationTotalsParams](_augur_sdk_src_state_getter_universe_.universe.md#static-getforkmigrationtotalsparams)
* [getUniverseChildrenParams](_augur_sdk_src_state_getter_universe_.universe.md#static-getuniversechildrenparams)

### Methods

* [getForkMigrationTotals](_augur_sdk_src_state_getter_universe_.universe.md#static-getforkmigrationtotals)
* [getUniverseChildren](_augur_sdk_src_state_getter_universe_.universe.md#static-getuniversechildren)

## Properties

### `Static` getForkMigrationTotalsParams

▪ **getForkMigrationTotalsParams**: *TypeC‹object›* = t.type({
    universe: t.string,
  })

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:52](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L52)*

___

### `Static` getUniverseChildrenParams

▪ **getUniverseChildrenParams**: *TypeC‹object›* = t.type({
    universe: t.string,
    account: t.string,
  })

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:55](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L55)*

## Methods

### `Static` getForkMigrationTotals

▸ **getForkMigrationTotals**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getForkMigrationTotalsParams›): *Promise‹[MigrationTotals](../interfaces/_augur_sdk_src_state_getter_universe_.migrationtotals.md) | [NonForkingMigrationTotals](../interfaces/_augur_sdk_src_state_getter_universe_.nonforkingmigrationtotals.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getForkMigrationTotalsParams› |

**Returns:** *Promise‹[MigrationTotals](../interfaces/_augur_sdk_src_state_getter_universe_.migrationtotals.md) | [NonForkingMigrationTotals](../interfaces/_augur_sdk_src_state_getter_universe_.nonforkingmigrationtotals.md)›*

___

### `Static` getUniverseChildren

▸ **getUniverseChildren**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUniverseChildrenParams›): *Promise‹[UniverseDetails](../interfaces/_augur_sdk_src_state_getter_universe_.universedetails.md) | null›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:84](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUniverseChildrenParams› |

**Returns:** *Promise‹[UniverseDetails](../interfaces/_augur_sdk_src_state_getter_universe_.universedetails.md) | null›*

[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Universe"](_augur_sdk_src_state_getter_universe_.md)

# Module: "augur-sdk/src/state/getter/Universe"

## Index

### Classes

* [Universe](../classes/_augur_sdk_src_state_getter_universe_.universe.md)

### Interfaces

* [MigrationOutcome](../interfaces/_augur_sdk_src_state_getter_universe_.migrationoutcome.md)
* [MigrationTotals](../interfaces/_augur_sdk_src_state_getter_universe_.migrationtotals.md)
* [NonForkingMigrationTotals](../interfaces/_augur_sdk_src_state_getter_universe_.nonforkingmigrationtotals.md)
* [UniverseDetails](../interfaces/_augur_sdk_src_state_getter_universe_.universedetails.md)

### Functions

* [calculateOutcomeFromLogs](_augur_sdk_src_state_getter_universe_.md#calculateoutcomefromlogs)
* [getMarket](_augur_sdk_src_state_getter_universe_.md#getmarket)
* [getMarketsForUniverse](_augur_sdk_src_state_getter_universe_.md#getmarketsforuniverse)
* [getMigrationOutcomes](_augur_sdk_src_state_getter_universe_.md#getmigrationoutcomes)
* [getOutcomeNameFromLogs](_augur_sdk_src_state_getter_universe_.md#getoutcomenamefromlogs)
* [getRepSupply](_augur_sdk_src_state_getter_universe_.md#getrepsupply)
* [getUniverseChildrenCreationLogs](_augur_sdk_src_state_getter_universe_.md#getuniversechildrencreationlogs)
* [getUniverseCreationLog](_augur_sdk_src_state_getter_universe_.md#getuniversecreationlog)
* [getUniverseDetails](_augur_sdk_src_state_getter_universe_.md#getuniversedetails)
* [getUniverseForkedLog](_augur_sdk_src_state_getter_universe_.md#getuniverseforkedlog)
* [getUserRep](_augur_sdk_src_state_getter_universe_.md#getuserrep)

## Functions

###  calculateOutcomeFromLogs

▸ **calculateOutcomeFromLogs**(`universeCreationLog`: [UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md), `forkingMarketLog`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)): *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:150](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`universeCreationLog` | [UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md) |
`forkingMarketLog` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |

**Returns:** *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*

___

###  getMarket

▸ **getMarket**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) | null›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:210](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) | null›*

___

###  getMarketsForUniverse

▸ **getMarketsForUniverse**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:214](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L214)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[]›*

___

###  getMigrationOutcomes

▸ **getMigrationOutcomes**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `forkingMarket`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `children`: [UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md)[]): *Promise‹[MigrationOutcome](../interfaces/_augur_sdk_src_state_getter_universe_.migrationoutcome.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:164](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L164)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`forkingMarket` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`children` | [UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md)[] |

**Returns:** *Promise‹[MigrationOutcome](../interfaces/_augur_sdk_src_state_getter_universe_.migrationoutcome.md)[]›*

___

###  getOutcomeNameFromLogs

▸ **getOutcomeNameFromLogs**(`universeCreationLog`: [UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md), `forkingMarketLog`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)): *string*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:142](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`universeCreationLog` | [UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md) |
`forkingMarketLog` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |

**Returns:** *string*

___

###  getRepSupply

▸ **getRepSupply**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `universe`: Universe): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:204](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`universe` | Universe |

**Returns:** *Promise‹BigNumber›*

___

###  getUniverseChildrenCreationLogs

▸ **getUniverseChildrenCreationLogs**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹[UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:238](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L238)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹[UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md)[]›*

___

###  getUniverseCreationLog

▸ **getUniverseCreationLog**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹[UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md) | null›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:218](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L218)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹[UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md) | null›*

___

###  getUniverseDetails

▸ **getUniverseDetails**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string, `account`: string): *Promise‹[UniverseDetails](../interfaces/_augur_sdk_src_state_getter_universe_.universedetails.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:103](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |
`account` | string |

**Returns:** *Promise‹[UniverseDetails](../interfaces/_augur_sdk_src_state_getter_universe_.universedetails.md)›*

___

###  getUniverseForkedLog

▸ **getUniverseForkedLog**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹[UniverseForkedLog](../interfaces/_augur_sdk_src_state_logs_types_.universeforkedlog.md) | null›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:228](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L228)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹[UniverseForkedLog](../interfaces/_augur_sdk_src_state_logs_types_.universeforkedlog.md) | null›*

___

###  getUserRep

▸ **getUserRep**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `universe`: Universe, `account`: string): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:190](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Universe.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`universe` | Universe |
`account` | string |

**Returns:** *Promise‹BigNumber›*

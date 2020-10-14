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

▸ **calculateOutcomeFromLogs**(`universeCreationLog`: UniverseCreatedLog, `forkingMarketLog`: MarketData): *PayoutNumeratorValue*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:176](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L176)*

**Parameters:**

Name | Type |
------ | ------ |
`universeCreationLog` | UniverseCreatedLog |
`forkingMarketLog` | MarketData |

**Returns:** *PayoutNumeratorValue*

___

###  getMarket

▸ **getMarket**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹MarketData | null›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:262](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L262)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹MarketData | null›*

___

###  getMarketsForUniverse

▸ **getMarketsForUniverse**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹MarketData[]›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:266](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L266)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹MarketData[]›*

___

###  getMigrationOutcomes

▸ **getMigrationOutcomes**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `forkingMarket`: MarketData, `children`: UniverseCreatedLog[]): *Promise‹[MigrationOutcome](../interfaces/_augur_sdk_src_state_getter_universe_.migrationoutcome.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:190](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`forkingMarket` | MarketData |
`children` | UniverseCreatedLog[] |

**Returns:** *Promise‹[MigrationOutcome](../interfaces/_augur_sdk_src_state_getter_universe_.migrationoutcome.md)[]›*

___

###  getOutcomeNameFromLogs

▸ **getOutcomeNameFromLogs**(`universeCreationLog`: UniverseCreatedLog, `forkingMarketLog`: MarketData): *string*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:165](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L165)*

**Parameters:**

Name | Type |
------ | ------ |
`universeCreationLog` | UniverseCreatedLog |
`forkingMarketLog` | MarketData |

**Returns:** *string*

___

###  getRepSupply

▸ **getRepSupply**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `universe`: Universe): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:250](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L250)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`universe` | Universe |

**Returns:** *Promise‹BigNumber›*

___

###  getUniverseChildrenCreationLogs

▸ **getUniverseChildrenCreationLogs**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹UniverseCreatedLog[]›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:305](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L305)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹UniverseCreatedLog[]›*

___

###  getUniverseCreationLog

▸ **getUniverseCreationLog**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹UniverseCreatedLog | null›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:275](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L275)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹UniverseCreatedLog | null›*

___

###  getUniverseDetails

▸ **getUniverseDetails**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string, `account`: string): *Promise‹[UniverseDetails](../interfaces/_augur_sdk_src_state_getter_universe_.universedetails.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:111](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L111)*

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

▸ **getUniverseForkedLog**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `address`: string): *Promise‹UniverseForkedLog | null›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:290](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L290)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`address` | string |

**Returns:** *Promise‹UniverseForkedLog | null›*

___

###  getUserRep

▸ **getUserRep**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `universe`: Universe, `account`: string): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/state/getter/Universe.ts:232](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Universe.ts#L232)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`universe` | Universe |
`account` | string |

**Returns:** *Promise‹BigNumber›*

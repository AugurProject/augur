[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Platform"](_augur_sdk_src_state_getter_platform_.md)

# Module: "augur-sdk/src/state/getter/Platform"

## Index

### Classes

* [Platform](../classes/_augur_sdk_src_state_getter_platform_.platform.md)

### Interfaces

* [PlatformActivityStatsResult](../interfaces/_augur_sdk_src_state_getter_platform_.platformactivitystatsresult.md)
* [TimeConstraint](../interfaces/_augur_sdk_src_state_getter_platform_.timeconstraint.md)

### Functions

* [formatTimestamp](_augur_sdk_src_state_getter_platform_.md#formattimestamp)
* [getActiveUsers](_augur_sdk_src_state_getter_platform_.md#getactiveusers)
* [getAmountStaked](_augur_sdk_src_state_getter_platform_.md#getamountstaked)
* [getDisputedMarkets](_augur_sdk_src_state_getter_platform_.md#getdisputedmarkets)
* [getMarketCount](_augur_sdk_src_state_getter_platform_.md#getmarketcount)
* [getOpenInterest](_augur_sdk_src_state_getter_platform_.md#getopeninterest)
* [getTradeCount](_augur_sdk_src_state_getter_platform_.md#gettradecount)
* [getVolume](_augur_sdk_src_state_getter_platform_.md#getvolume)
* [makeGetField](_augur_sdk_src_state_getter_platform_.md#makegetfield)
* [timeConstraint](_augur_sdk_src_state_getter_platform_.md#timeconstraint)

## Functions

###  formatTimestamp

▸ **formatTimestamp**(`timestamp`: number): *string*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:200](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L200)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | number |

**Returns:** *string*

___

###  getActiveUsers

▸ **getActiveUsers**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:75](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹number›*

___

###  getAmountStaked

▸ **getAmountStaked**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:147](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L147)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹BigNumber›*

___

###  getDisputedMarkets

▸ **getDisputedMarkets**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:165](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L165)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹number›*

___

###  getMarketCount

▸ **getMarketCount**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:118](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L118)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹number›*

___

###  getOpenInterest

▸ **getOpenInterest**(`universe`: string, `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:113](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹BigNumber›*

___

###  getTradeCount

▸ **getTradeCount**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:97](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L97)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹number›*

___

###  getVolume

▸ **getVolume**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:130](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L130)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹BigNumber›*

___

###  makeGetField

▸ **makeGetField**(`universe`: [Address](_augur_sdk_src_state_logs_types_.md#address), `startTime`: number, `endTime`: number): *(Anonymous function)*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:204](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | [Address](_augur_sdk_src_state_logs_types_.md#address) |
`startTime` | number |
`endTime` | number |

**Returns:** *(Anonymous function)*

___

###  timeConstraint

▸ **timeConstraint**(`startTime`: number, `endTime`: number): *[TimeConstraint](../interfaces/_augur_sdk_src_state_getter_platform_.timeconstraint.md)*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:188](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`startTime` | number |
`endTime` | number |

**Returns:** *[TimeConstraint](../interfaces/_augur_sdk_src_state_getter_platform_.timeconstraint.md)*

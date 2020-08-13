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

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:259](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L259)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | number |

**Returns:** *string*

___

###  getActiveUsers

▸ **getActiveUsers**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:82](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L82)*

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

▸ **getAmountStaked**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹string›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:188](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹string›*

___

###  getDisputedMarkets

▸ **getDisputedMarkets**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:214](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L214)*

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

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:152](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L152)*

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

▸ **getOpenInterest**(`universe`: string, `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹string›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:144](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L144)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹string›*

___

###  getTradeCount

▸ **getTradeCount**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:122](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L122)*

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

▸ **getVolume**(`universe`: string, `startTime`: number, `endTime`: number, `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md)): *Promise‹string›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:167](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`startTime` | number |
`endTime` | number |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *Promise‹string›*

___

###  makeGetField

▸ **makeGetField**(`universe`: Address, `startTime`: number, `endTime`: number): *(Anonymous function)*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:263](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L263)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | Address |
`startTime` | number |
`endTime` | number |

**Returns:** *(Anonymous function)*

___

###  timeConstraint

▸ **timeConstraint**(`startTime`: number, `endTime`: number): *[TimeConstraint](../interfaces/_augur_sdk_src_state_getter_platform_.timeconstraint.md)*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:247](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Platform.ts#L247)*

**Parameters:**

Name | Type |
------ | ------ |
`startTime` | number |
`endTime` | number |

**Returns:** *[TimeConstraint](../interfaces/_augur_sdk_src_state_getter_platform_.timeconstraint.md)*

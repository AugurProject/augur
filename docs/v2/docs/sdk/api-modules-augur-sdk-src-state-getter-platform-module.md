---
id: api-modules-augur-sdk-src-state-getter-platform-module
title: augur-sdk/src/state/getter/Platform Module
sidebar_label: augur-sdk/src/state/getter/Platform
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Platform Module]](api-modules-augur-sdk-src-state-getter-platform-module.md)

## Module

### Classes

* [Platform](api-classes-augur-sdk-src-state-getter-platform-platform.md)

### Interfaces

* [PlatformActivityStatsResult](api-interfaces-augur-sdk-src-state-getter-platform-platformactivitystatsresult.md)
* [TimeConstraint](api-interfaces-augur-sdk-src-state-getter-platform-timeconstraint.md)

### Functions

* [formatTimestamp](api-modules-augur-sdk-src-state-getter-platform-module.md#formattimestamp)
* [getActiveUsers](api-modules-augur-sdk-src-state-getter-platform-module.md#getactiveusers)
* [getAmountStaked](api-modules-augur-sdk-src-state-getter-platform-module.md#getamountstaked)
* [getDisputedMarkets](api-modules-augur-sdk-src-state-getter-platform-module.md#getdisputedmarkets)
* [getMarketCount](api-modules-augur-sdk-src-state-getter-platform-module.md#getmarketcount)
* [getOpenInterest](api-modules-augur-sdk-src-state-getter-platform-module.md#getopeninterest)
* [getTradeCount](api-modules-augur-sdk-src-state-getter-platform-module.md#gettradecount)
* [getVolume](api-modules-augur-sdk-src-state-getter-platform-module.md#getvolume)
* [makeGetField](api-modules-augur-sdk-src-state-getter-platform-module.md#makegetfield)
* [timeConstraint](api-modules-augur-sdk-src-state-getter-platform-module.md#timeconstraint-1)

---

## Functions

<a id="formattimestamp"></a>

###  formatTimestamp

▸ **formatTimestamp**(timestamp: *`number`*): `string`

*Defined in [augur-sdk/src/state/getter/Platform.ts:199](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L199)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| timestamp | `number` |

**Returns:** `string`

___
<a id="getactiveusers"></a>

###  getActiveUsers

▸ **getActiveUsers**(universe: *`string`*, startTime: *`number`*, endTime: *`number`*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/getter/Platform.ts:75](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| startTime | `number` |
| endTime | `number` |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<`number`>

___
<a id="getamountstaked"></a>

###  getAmountStaked

▸ **getAmountStaked**(universe: *`string`*, startTime: *`number`*, endTime: *`number`*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/state/getter/Platform.ts:146](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L146)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| startTime | `number` |
| endTime | `number` |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="getdisputedmarkets"></a>

###  getDisputedMarkets

▸ **getDisputedMarkets**(universe: *`string`*, startTime: *`number`*, endTime: *`number`*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/getter/Platform.ts:164](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L164)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| startTime | `number` |
| endTime | `number` |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<`number`>

___
<a id="getmarketcount"></a>

###  getMarketCount

▸ **getMarketCount**(universe: *`string`*, startTime: *`number`*, endTime: *`number`*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/getter/Platform.ts:117](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L117)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| startTime | `number` |
| endTime | `number` |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<`number`>

___
<a id="getopeninterest"></a>

###  getOpenInterest

▸ **getOpenInterest**(universe: *`string`*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/state/getter/Platform.ts:112](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L112)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="gettradecount"></a>

###  getTradeCount

▸ **getTradeCount**(universe: *`string`*, startTime: *`number`*, endTime: *`number`*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/getter/Platform.ts:97](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| startTime | `number` |
| endTime | `number` |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<`number`>

___
<a id="getvolume"></a>

###  getVolume

▸ **getVolume**(universe: *`string`*, startTime: *`number`*, endTime: *`number`*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/state/getter/Platform.ts:129](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L129)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| startTime | `number` |
| endTime | `number` |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="makegetfield"></a>

###  makeGetField

▸ **makeGetField**(universe: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*, startTime: *`number`*, endTime: *`number`*): `(Anonymous function)`

*Defined in [augur-sdk/src/state/getter/Platform.ts:203](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L203)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | [Address](api-modules-augur-sdk-src-state-logs-types-module.md#address) |
| startTime | `number` |
| endTime | `number` |

**Returns:** `(Anonymous function)`

___
<a id="timeconstraint-1"></a>

###  timeConstraint

▸ **timeConstraint**(startTime: *`number`*, endTime: *`number`*): [TimeConstraint](api-interfaces-augur-sdk-src-state-getter-platform-timeconstraint.md)

*Defined in [augur-sdk/src/state/getter/Platform.ts:187](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L187)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| startTime | `number` |
| endTime | `number` |

**Returns:** [TimeConstraint](api-interfaces-augur-sdk-src-state-getter-platform-timeconstraint.md)

___


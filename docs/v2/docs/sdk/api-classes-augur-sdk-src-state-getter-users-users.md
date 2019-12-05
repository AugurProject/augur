---
id: api-classes-augur-sdk-src-state-getter-users-users
title: Users
sidebar_label: Users
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Users Module]](api-modules-augur-sdk-src-state-getter-users-module.md) > [Users](api-classes-augur-sdk-src-state-getter-users-users.md)

## Class

## Hierarchy

**Users**

### Properties

* [getAccountTimeRangedStatsParams](api-classes-augur-sdk-src-state-getter-users-users.md#getaccounttimerangedstatsparams)
* [getProfitLossParams](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitlossparams)
* [getProfitLossSummaryParams](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitlosssummaryparams)
* [getUserAccountParams](api-classes-augur-sdk-src-state-getter-users-users.md#getuseraccountparams)
* [getUserTradingPositionsParams](api-classes-augur-sdk-src-state-getter-users-users.md#getusertradingpositionsparams)

### Methods

* [getAccountTimeRangedStats](api-classes-augur-sdk-src-state-getter-users-users.md#getaccounttimerangedstats)
* [getProfitLoss](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitloss)
* [getProfitLossSummary](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitlosssummary)
* [getUserAccountData](api-classes-augur-sdk-src-state-getter-users-users.md#getuseraccountdata)
* [getUserTradingPositions](api-classes-augur-sdk-src-state-getter-users-users.md#getusertradingpositions)

---

## Properties

<a id="getaccounttimerangedstatsparams"></a>

### `<Static>` getAccountTimeRangedStatsParams

**● getAccountTimeRangedStatsParams**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
    t.type({
      universe: t.string,
      account: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    }),
  ])

*Defined in [augur-sdk/src/state/getter/Users.ts:168](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L168)*

___
<a id="getprofitlossparams"></a>

### `<Static>` getProfitLossParams

**● getProfitLossParams**: *`IntersectionC`<[`PartialC`<`object`>, `PartialC`<`object`>]>* =  getProfitLossParams

*Defined in [augur-sdk/src/state/getter/Users.ts:183](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L183)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Static>` getProfitLossSummaryParams

**● getProfitLossSummaryParams**: *`PartialC`<`object`>* =  getProfitLossSummaryParams

*Defined in [augur-sdk/src/state/getter/Users.ts:184](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L184)*

___
<a id="getuseraccountparams"></a>

### `<Static>` getUserAccountParams

**● getUserAccountParams**: *`PartialC`<`object`>* =  getUserAccountParams

*Defined in [augur-sdk/src/state/getter/Users.ts:185](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L185)*

___
<a id="getusertradingpositionsparams"></a>

### `<Static>` getUserTradingPositionsParams

**● getUserTradingPositionsParams**: *`IntersectionC`<[`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>, `PartialC`<`object`>]>* =  t.intersection([
    userTradingPositionsParams,
    sortOptions,
  ])

*Defined in [augur-sdk/src/state/getter/Users.ts:179](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L179)*

___

## Methods

<a id="getaccounttimerangedstats"></a>

### `<Static>` getAccountTimeRangedStats

▸ **getAccountTimeRangedStats**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[AccountTimeRangedStatsResult](api-interfaces-augur-sdk-src-state-getter-users-accounttimerangedstatsresult.md)>

*Defined in [augur-sdk/src/state/getter/Users.ts:299](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L299)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[AccountTimeRangedStatsResult](api-interfaces-augur-sdk-src-state-getter-users-accounttimerangedstatsresult.md)>

___
<a id="getprofitloss"></a>

### `<Static>` getProfitLoss

▸ **getProfitLoss**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)[]>

*Defined in [augur-sdk/src/state/getter/Users.ts:649](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L649)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)[]>

___
<a id="getprofitlosssummary"></a>

### `<Static>` getProfitLossSummary

▸ **getProfitLossSummary**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`PartialC`>*): `Promise`<`NumericDictionary`<[MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)>>

*Defined in [augur-sdk/src/state/getter/Users.ts:779](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L779)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`PartialC`> |

**Returns:** `Promise`<`NumericDictionary`<[MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)>>

___
<a id="getuseraccountdata"></a>

### `<Static>` getUserAccountData

▸ **getUserAccountData**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`PartialC`>*): `Promise`<[UserAccountDataResult](api-interfaces-augur-sdk-src-state-getter-users-useraccountdataresult.md)>

*Defined in [augur-sdk/src/state/getter/Users.ts:188](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L188)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`PartialC`> |

**Returns:** `Promise`<[UserAccountDataResult](api-interfaces-augur-sdk-src-state-getter-users-useraccountdataresult.md)>

___
<a id="getusertradingpositions"></a>

### `<Static>` getUserTradingPositions

▸ **getUserTradingPositions**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[UserTradingPositions](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md)>

*Defined in [augur-sdk/src/state/getter/Users.ts:428](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L428)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[UserTradingPositions](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md)>

___


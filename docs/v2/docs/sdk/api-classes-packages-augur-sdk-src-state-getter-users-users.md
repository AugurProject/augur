---
id: api-classes-packages-augur-sdk-src-state-getter-users-users
title: Users
sidebar_label: Users
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Users Module]](api-modules-packages-augur-sdk-src-state-getter-users-module.md) > [Users](api-classes-packages-augur-sdk-src-state-getter-users-users.md)

## Class

## Hierarchy

**Users**

### Properties

* [getProfitLossParams](api-classes-packages-augur-sdk-src-state-getter-users-users.md#getprofitlossparams)
* [getProfitLossSummaryParams](api-classes-packages-augur-sdk-src-state-getter-users-users.md#getprofitlosssummaryparams)
* [getUserTradingPositionsParams](api-classes-packages-augur-sdk-src-state-getter-users-users.md#getusertradingpositionsparams)

### Methods

* [getProfitLoss](api-classes-packages-augur-sdk-src-state-getter-users-users.md#getprofitloss)
* [getProfitLossSummary](api-classes-packages-augur-sdk-src-state-getter-users-users.md#getprofitlosssummary)
* [getUserTradingPositions](api-classes-packages-augur-sdk-src-state-getter-users-users.md#getusertradingpositions)

---

## Properties

<a id="getprofitlossparams"></a>

### `<Static>` getProfitLossParams

**● getProfitLossParams**: *`IntersectionType`<[`PartialType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  getProfitLossParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:113](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Users.ts#L113)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Static>` getProfitLossSummaryParams

**● getProfitLossSummaryParams**: *`PartialType`<`object`, `object`, `object`, `unknown`>* =  getProfitLossSummaryParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:114](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Users.ts#L114)*

___
<a id="getusertradingpositionsparams"></a>

### `<Static>` getUserTradingPositionsParams

**● getUserTradingPositionsParams**: *`IntersectionType`<[`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
    userTradingPositionsParams,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:109](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Users.ts#L109)*

___

## Methods

<a id="getprofitloss"></a>

### `<Static>` getProfitLoss

▸ **getProfitLoss**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:283](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Users.ts#L283)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)[]>

___
<a id="getprofitlosssummary"></a>

### `<Static>` getProfitLossSummary

▸ **getProfitLossSummary**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`PartialType`>*): `Promise`<`NumericDictionary`<[MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)>>

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:426](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Users.ts#L426)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`PartialType`> |

**Returns:** `Promise`<`NumericDictionary`<[MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)>>

___
<a id="getusertradingpositions"></a>

### `<Static>` getUserTradingPositions

▸ **getUserTradingPositions**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[UserTradingPositions](api-interfaces-packages-augur-sdk-src-state-getter-users-usertradingpositions.md)>

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:117](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Users.ts#L117)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[UserTradingPositions](api-interfaces-packages-augur-sdk-src-state-getter-users-usertradingpositions.md)>

___


---
id: api-classes-state-getter-users-users
title: Users
sidebar_label: Users
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Users Module]](api-modules-state-getter-users-module.md) > [Users](api-classes-state-getter-users-users.md)

## Class

## Hierarchy

**Users**

### Properties

* [GetProfitLossParams](api-classes-state-getter-users-users.md#getprofitlossparams)
* [GetProfitLossSummaryParams](api-classes-state-getter-users-users.md#getprofitlosssummaryparams)
* [GetUserTradingPositionsParams](api-classes-state-getter-users-users.md#getusertradingpositionsparams)

### Methods

* [getProfitLoss](api-classes-state-getter-users-users.md#getprofitloss)
* [getProfitLossSummary](api-classes-state-getter-users-users.md#getprofitlosssummary)
* [getUserTradingPositions](api-classes-state-getter-users-users.md#getusertradingpositions)

---

## Properties

<a id="getprofitlossparams"></a>

### `<Static>` GetProfitLossParams

**● GetProfitLossParams**: *`any`* =  GetProfitLossParams

*Defined in [state/getter/Users.ts:90](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L90)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Static>` GetProfitLossSummaryParams

**● GetProfitLossSummaryParams**: *`any`* =  GetProfitLossSummaryParams

*Defined in [state/getter/Users.ts:91](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L91)*

___
<a id="getusertradingpositionsparams"></a>

### `<Static>` GetUserTradingPositionsParams

**● GetUserTradingPositionsParams**: *`any`* =  t.intersection([UserTradingPositionsParams, SortLimit])

*Defined in [state/getter/Users.ts:89](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L89)*

___

## Methods

<a id="getprofitloss"></a>

### `<Static>` getProfitLoss

▸ **getProfitLoss**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)>>

*Defined in [state/getter/Users.ts:188](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L188)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)>>

___
<a id="getprofitlosssummary"></a>

### `<Static>` getProfitLossSummary

▸ **getProfitLossSummary**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`NumericDictionary`<[MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)>>

*Defined in [state/getter/Users.ts:282](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L282)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`NumericDictionary`<[MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)>>

___
<a id="getusertradingpositions"></a>

### `<Static>` getUserTradingPositions

▸ **getUserTradingPositions**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[UserTradingPositions](api-interfaces-state-getter-users-usertradingpositions.md)>

*Defined in [state/getter/Users.ts:94](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[UserTradingPositions](api-interfaces-state-getter-users-usertradingpositions.md)>

___


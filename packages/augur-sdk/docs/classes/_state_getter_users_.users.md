[@augurproject/sdk](../README.md) > ["state/getter/Users"](../modules/_state_getter_users_.md) > [Users](../classes/_state_getter_users_.users.md)

# Class: Users

## Hierarchy

**Users**

## Index

### Properties

* [GetProfitLossParams](_state_getter_users_.users.md#getprofitlossparams)
* [GetProfitLossSummaryParams](_state_getter_users_.users.md#getprofitlosssummaryparams)
* [GetUserTradingPositionsParams](_state_getter_users_.users.md#getusertradingpositionsparams)

### Methods

* [getProfitLoss](_state_getter_users_.users.md#getprofitloss)
* [getProfitLossSummary](_state_getter_users_.users.md#getprofitlosssummary)
* [getUserTradingPositions](_state_getter_users_.users.md#getusertradingpositions)

---

## Properties

<a id="getprofitlossparams"></a>

### `<Static>` GetProfitLossParams

**● GetProfitLossParams**: *`any`* =  GetProfitLossParams

*Defined in [state/getter/Users.ts:90](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L90)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Static>` GetProfitLossSummaryParams

**● GetProfitLossSummaryParams**: *`any`* =  GetProfitLossSummaryParams

*Defined in [state/getter/Users.ts:91](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L91)*

___
<a id="getusertradingpositionsparams"></a>

### `<Static>` GetUserTradingPositionsParams

**● GetUserTradingPositionsParams**: *`any`* =  t.intersection([UserTradingPositionsParams, SortLimit])

*Defined in [state/getter/Users.ts:89](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L89)*

___

## Methods

<a id="getprofitloss"></a>

### `<Static>` getProfitLoss

▸ **getProfitLoss**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)>>

*Defined in [state/getter/Users.ts:188](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L188)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)>>

___
<a id="getprofitlosssummary"></a>

### `<Static>` getProfitLossSummary

▸ **getProfitLossSummary**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`NumericDictionary`<[MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)>>

*Defined in [state/getter/Users.ts:282](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L282)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`NumericDictionary`<[MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)>>

___
<a id="getusertradingpositions"></a>

### `<Static>` getUserTradingPositions

▸ **getUserTradingPositions**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[UserTradingPositions](../interfaces/_state_getter_users_.usertradingpositions.md)>

*Defined in [state/getter/Users.ts:94](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[UserTradingPositions](../interfaces/_state_getter_users_.usertradingpositions.md)>

___


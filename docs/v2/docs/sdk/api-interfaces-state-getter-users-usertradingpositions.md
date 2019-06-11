---
id: api-interfaces-state-getter-users-usertradingpositions
title: UserTradingPositions
sidebar_label: UserTradingPositions
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Users Module]](api-modules-state-getter-users-module.md) > [UserTradingPositions](api-interfaces-state-getter-users-usertradingpositions.md)

## Interface

## Hierarchy

**UserTradingPositions**

### Properties

* [frozenFundsTotal](api-interfaces-state-getter-users-usertradingpositions.md#frozenfundstotal)
* [tradingPositions](api-interfaces-state-getter-users-usertradingpositions.md#tradingpositions)
* [tradingPositionsPerMarket](api-interfaces-state-getter-users-usertradingpositions.md#tradingpositionspermarket)

---

## Properties

<a id="frozenfundstotal"></a>

###  frozenFundsTotal

**● frozenFundsTotal**: *`string`*

*Defined in [state/getter/Users.ts:75](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L75)*

___
<a id="tradingpositions"></a>

###  tradingPositions

**● tradingPositions**: *`Array`<[TradingPosition](api-interfaces-state-getter-users-tradingposition.md)>*

*Defined in [state/getter/Users.ts:71](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L71)*

___
<a id="tradingpositionspermarket"></a>

###  tradingPositionsPerMarket

**● tradingPositionsPerMarket**: *`object`*

*Defined in [state/getter/Users.ts:72](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L72)*

#### Type declaration

[marketId: `string`]: [MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)

___


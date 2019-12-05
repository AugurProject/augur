---
id: api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions
title: UserTradingPositions
sidebar_label: UserTradingPositions
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Users Module]](api-modules-augur-sdk-src-state-getter-users-module.md) > [UserTradingPositions](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md)

## Interface

## Hierarchy

**UserTradingPositions**

### Properties

* [frozenFundsTotal](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md#frozenfundstotal)
* [tradingPositions](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md#tradingpositions)
* [tradingPositionsPerMarket](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md#tradingpositionspermarket)
* [unrealizedRevenue24hChangePercent](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md#unrealizedrevenue24hchangepercent)

---

## Properties

<a id="frozenfundstotal"></a>

###  frozenFundsTotal

**● frozenFundsTotal**: *`string`*

*Defined in [augur-sdk/src/state/getter/Users.ts:137](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L137)*

___
<a id="tradingpositions"></a>

###  tradingPositions

**● tradingPositions**: *[TradingPosition](api-interfaces-augur-sdk-src-state-getter-users-tradingposition.md)[]*

*Defined in [augur-sdk/src/state/getter/Users.ts:132](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L132)*

___
<a id="tradingpositionspermarket"></a>

###  tradingPositionsPerMarket

**● tradingPositionsPerMarket**: *`object`*

*Defined in [augur-sdk/src/state/getter/Users.ts:133](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L133)*

#### Type declaration

[marketId: `string`]: [MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)

___
<a id="unrealizedrevenue24hchangepercent"></a>

###  unrealizedRevenue24hChangePercent

**● unrealizedRevenue24hChangePercent**: *`string`*

*Defined in [augur-sdk/src/state/getter/Users.ts:138](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L138)*

___


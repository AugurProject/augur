---
id: api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog
title: ProfitLossChangedLog
sidebar_label: ProfitLossChangedLog
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

 [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md)

**↳ ProfitLossChangedLog**

### Properties

* [account](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#account)
* [avgPrice](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#avgprice)
* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#blocknumber)
* [frozenFunds](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#frozenfunds)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#market)
* [netPosition](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#netposition)
* [outcome](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#outcome)
* [realizedCost](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#realizedcost)
* [realizedProfit](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#realizedprofit)
* [timestamp](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#timestamp)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md#universe)

---

## Properties

<a id="account"></a>

###  account

**● account**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:311](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L311)*

___
<a id="avgprice"></a>

###  avgPrice

**● avgPrice**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:314](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L314)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L21)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="frozenfunds"></a>

###  frozenFunds

**● frozenFunds**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:316](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L316)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L24)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:310](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L310)*

___
<a id="netposition"></a>

###  netPosition

**● netPosition**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:313](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L313)*

___
<a id="outcome"></a>

###  outcome

**● outcome**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:312](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L312)*

___
<a id="realizedcost"></a>

###  realizedCost

**● realizedCost**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:317](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L317)*

___
<a id="realizedprofit"></a>

###  realizedProfit

**● realizedProfit**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:315](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L315)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L23)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L22)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:309](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L309)*

___


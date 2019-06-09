---
id: api-interfaces-state-logs-types-profitlosschangedlog
title: ProfitLossChangedLog
sidebar_label: ProfitLossChangedLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [ProfitLossChangedLog](api-interfaces-state-logs-types-profitlosschangedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ ProfitLossChangedLog**

### Properties

* [_id](api-interfaces-state-logs-types-profitlosschangedlog.md#_id)
* [_rev](api-interfaces-state-logs-types-profitlosschangedlog.md#_rev)
* [account](api-interfaces-state-logs-types-profitlosschangedlog.md#account)
* [avgPrice](api-interfaces-state-logs-types-profitlosschangedlog.md#avgprice)
* [blockHash](api-interfaces-state-logs-types-profitlosschangedlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-profitlosschangedlog.md#blocknumber)
* [frozenFunds](api-interfaces-state-logs-types-profitlosschangedlog.md#frozenfunds)
* [logIndex](api-interfaces-state-logs-types-profitlosschangedlog.md#logindex)
* [market](api-interfaces-state-logs-types-profitlosschangedlog.md#market)
* [netPosition](api-interfaces-state-logs-types-profitlosschangedlog.md#netposition)
* [outcome](api-interfaces-state-logs-types-profitlosschangedlog.md#outcome)
* [realizedCost](api-interfaces-state-logs-types-profitlosschangedlog.md#realizedcost)
* [realizedProfit](api-interfaces-state-logs-types-profitlosschangedlog.md#realizedprofit)
* [timestamp](api-interfaces-state-logs-types-profitlosschangedlog.md#timestamp)
* [transactionHash](api-interfaces-state-logs-types-profitlosschangedlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-profitlosschangedlog.md#transactionindex)
* [universe](api-interfaces-state-logs-types-profitlosschangedlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-state-logs-types-doc.md).[_id](api-interfaces-state-logs-types-doc.md#_id)*

*Defined in [state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-state-logs-types-doc.md).[_rev](api-interfaces-state-logs-types-doc.md#_rev)*

*Defined in [state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="account"></a>

###  account

**● account**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:224](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L224)*

___
<a id="avgprice"></a>

###  avgPrice

**● avgPrice**: *`string`*

*Defined in [state/logs/types.ts:227](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L227)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[blockHash](api-interfaces-state-logs-types-log.md#blockhash)*

*Defined in [state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[blockNumber](api-interfaces-state-logs-types-log.md#blocknumber)*

*Defined in [state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="frozenfunds"></a>

###  frozenFunds

**● frozenFunds**: *`string`*

*Defined in [state/logs/types.ts:229](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L229)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[logIndex](api-interfaces-state-logs-types-log.md#logindex)*

*Defined in [state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:223](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L223)*

___
<a id="netposition"></a>

###  netPosition

**● netPosition**: *`string`*

*Defined in [state/logs/types.ts:226](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L226)*

___
<a id="outcome"></a>

###  outcome

**● outcome**: *`string`*

*Defined in [state/logs/types.ts:225](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L225)*

___
<a id="realizedcost"></a>

###  realizedCost

**● realizedCost**: *`string`*

*Defined in [state/logs/types.ts:230](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L230)*

___
<a id="realizedprofit"></a>

###  realizedProfit

**● realizedProfit**: *`string`*

*Defined in [state/logs/types.ts:228](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L228)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-state-logs-types-timestamped.md).[timestamp](api-interfaces-state-logs-types-timestamped.md#timestamp)*

*Defined in [state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L12)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[transactionHash](api-interfaces-state-logs-types-log.md#transactionhash)*

*Defined in [state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[transactionIndex](api-interfaces-state-logs-types-log.md#transactionindex)*

*Defined in [state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:222](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L222)*

___


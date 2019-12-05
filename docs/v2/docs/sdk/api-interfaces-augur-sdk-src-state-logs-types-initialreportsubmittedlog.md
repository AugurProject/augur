---
id: api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog
title: InitialReportSubmittedLog
sidebar_label: InitialReportSubmittedLog
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

 [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md)

**↳ InitialReportSubmittedLog**

### Properties

* [amountStaked](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#amountstaked)
* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#blocknumber)
* [description](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#description)
* [initialReporter](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#initialreporter)
* [isDesignatedReporter](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#isdesignatedreporter)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#market)
* [payoutNumerators](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#payoutnumerators)
* [reporter](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#reporter)
* [timestamp](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#timestamp)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md#universe)

---

## Properties

<a id="amountstaked"></a>

###  amountStaked

**● amountStaked**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:116](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L116)*

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
<a id="description"></a>

###  description

**● description**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:119](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L119)*

___
<a id="initialreporter"></a>

###  initialReporter

**● initialReporter**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:115](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L115)*

___
<a id="isdesignatedreporter"></a>

###  isDesignatedReporter

**● isDesignatedReporter**: *`boolean`*

*Defined in [augur-sdk/src/state/logs/types.ts:117](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L117)*

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

*Defined in [augur-sdk/src/state/logs/types.ts:114](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L114)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](api-modules-augur-sdk-src-state-logs-types-module.md#payoutnumerators)*

*Defined in [augur-sdk/src/state/logs/types.ts:118](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L118)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:113](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L113)*

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

*Defined in [augur-sdk/src/state/logs/types.ts:112](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L112)*

___


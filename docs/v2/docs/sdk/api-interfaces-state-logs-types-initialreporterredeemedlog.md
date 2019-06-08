---
id: api-interfaces-state-logs-types-initialreporterredeemedlog
title: InitialReporterRedeemedLog
sidebar_label: InitialReporterRedeemedLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [InitialReporterRedeemedLog](api-interfaces-state-logs-types-initialreporterredeemedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ InitialReporterRedeemedLog**

### Properties

* [_id](api-interfaces-state-logs-types-initialreporterredeemedlog.md#_id)
* [_rev](api-interfaces-state-logs-types-initialreporterredeemedlog.md#_rev)
* [amountRedeemed](api-interfaces-state-logs-types-initialreporterredeemedlog.md#amountredeemed)
* [blockHash](api-interfaces-state-logs-types-initialreporterredeemedlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-initialreporterredeemedlog.md#blocknumber)
* [logIndex](api-interfaces-state-logs-types-initialreporterredeemedlog.md#logindex)
* [market](api-interfaces-state-logs-types-initialreporterredeemedlog.md#market)
* [payoutNumerators](api-interfaces-state-logs-types-initialreporterredeemedlog.md#payoutnumerators)
* [repReceived](api-interfaces-state-logs-types-initialreporterredeemedlog.md#repreceived)
* [reporter](api-interfaces-state-logs-types-initialreporterredeemedlog.md#reporter)
* [timestamp](api-interfaces-state-logs-types-initialreporterredeemedlog.md#timestamp)
* [transactionHash](api-interfaces-state-logs-types-initialreporterredeemedlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-initialreporterredeemedlog.md#transactionindex)
* [universe](api-interfaces-state-logs-types-initialreporterredeemedlog.md#universe)

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
<a id="amountredeemed"></a>

###  amountRedeemed

**● amountRedeemed**: *`string`*

*Defined in [state/logs/types.ts:82](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L82)*

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
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[logIndex](api-interfaces-state-logs-types-log.md#logindex)*

*Defined in [state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:81](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L81)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](api-modules-state-logs-types-module.md#payoutnumerators)*

*Defined in [state/logs/types.ts:84](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L84)*

___
<a id="repreceived"></a>

###  repReceived

**● repReceived**: *`string`*

*Defined in [state/logs/types.ts:83](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L83)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:80](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L80)*

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

*Defined in [state/logs/types.ts:79](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L79)*

___


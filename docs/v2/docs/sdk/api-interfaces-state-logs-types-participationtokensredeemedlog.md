---
id: api-interfaces-state-logs-types-participationtokensredeemedlog
title: ParticipationTokensRedeemedLog
sidebar_label: ParticipationTokensRedeemedLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [ParticipationTokensRedeemedLog](api-interfaces-state-logs-types-participationtokensredeemedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ ParticipationTokensRedeemedLog**

### Properties

* [_id](api-interfaces-state-logs-types-participationtokensredeemedlog.md#_id)
* [_rev](api-interfaces-state-logs-types-participationtokensredeemedlog.md#_rev)
* [account](api-interfaces-state-logs-types-participationtokensredeemedlog.md#account)
* [attoParticipationTokens](api-interfaces-state-logs-types-participationtokensredeemedlog.md#attoparticipationtokens)
* [blockHash](api-interfaces-state-logs-types-participationtokensredeemedlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-participationtokensredeemedlog.md#blocknumber)
* [disputeWindow](api-interfaces-state-logs-types-participationtokensredeemedlog.md#disputewindow)
* [feePayoutShare](api-interfaces-state-logs-types-participationtokensredeemedlog.md#feepayoutshare)
* [logIndex](api-interfaces-state-logs-types-participationtokensredeemedlog.md#logindex)
* [timestamp](api-interfaces-state-logs-types-participationtokensredeemedlog.md#timestamp)
* [transactionHash](api-interfaces-state-logs-types-participationtokensredeemedlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-participationtokensredeemedlog.md#transactionindex)
* [universe](api-interfaces-state-logs-types-participationtokensredeemedlog.md#universe)

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

*Defined in [state/logs/types.ts:216](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L216)*

___
<a id="attoparticipationtokens"></a>

###  attoParticipationTokens

**● attoParticipationTokens**: *`string`*

*Defined in [state/logs/types.ts:217](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L217)*

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
<a id="disputewindow"></a>

###  disputeWindow

**● disputeWindow**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:215](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L215)*

___
<a id="feepayoutshare"></a>

###  feePayoutShare

**● feePayoutShare**: *`string`*

*Defined in [state/logs/types.ts:218](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L218)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[logIndex](api-interfaces-state-logs-types-log.md#logindex)*

*Defined in [state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L20)*

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

*Defined in [state/logs/types.ts:214](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L214)*

___


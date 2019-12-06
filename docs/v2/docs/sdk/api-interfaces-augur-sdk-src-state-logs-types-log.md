---
id: api-interfaces-augur-sdk-src-state-logs-types-log
title: Log
sidebar_label: Log
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

## Interface

## Hierarchy

**Log**

↳  [CompleteSetsPurchasedLog](api-interfaces-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)

↳  [CompleteSetsSoldLog](api-interfaces-augur-sdk-src-state-logs-types-completesetssoldlog.md)

↳  [DisputeCrowdsourcerCompletedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md)

↳  [DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)

↳  [DisputeCrowdsourcerCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md)

↳  [DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)

↳  [DisputeWindowCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-disputewindowcreatedlog.md)

↳  [InitialReporterRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)

↳  [InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)

↳  [MarketCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-marketcreatedlog.md)

↳  [MarketFinalizedLog](api-interfaces-augur-sdk-src-state-logs-types-marketfinalizedlog.md)

↳  [MarketMigratedLog](api-interfaces-augur-sdk-src-state-logs-types-marketmigratedlog.md)

↳  [MarketVolumeChangedLog](api-interfaces-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)

↳  [MarketOIChangedLog](api-interfaces-augur-sdk-src-state-logs-types-marketoichangedlog.md)

↳  [OrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md)

↳  [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)

↳  [ParticipationTokensRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)

↳  [ReportingParticipantDisavowedLog](api-interfaces-augur-sdk-src-state-logs-types-reportingparticipantdisavowedlog.md)

↳  [ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md)

↳  [TimestampSetLog](api-interfaces-augur-sdk-src-state-logs-types-timestampsetlog.md)

↳  [TokensMinted](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md)

↳  [TokenBalanceChangedLog](api-interfaces-augur-sdk-src-state-logs-types-tokenbalancechangedlog.md)

↳  [ShareTokenBalanceChangedLog](api-interfaces-augur-sdk-src-state-logs-types-sharetokenbalancechangedlog.md)

↳  [TradingProceedsClaimedLog](api-interfaces-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)

↳  [UniverseForkedLog](api-interfaces-augur-sdk-src-state-logs-types-universeforkedlog.md)

↳  [UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md)

↳  [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)

↳  [DisputeDoc](api-interfaces-augur-sdk-src-state-logs-types-disputedoc.md)

↳  [InitialReporterTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportertransferredlog.md)

↳  [MarketParticipantsDisavowedLog](api-interfaces-augur-sdk-src-state-logs-types-marketparticipantsdisavowedlog.md)

↳  [MarketTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-markettransferredlog.md)

↳  [TokensTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-tokenstransferredlog.md)

↳  [TransferSingleLog](api-interfaces-augur-sdk-src-state-logs-types-transfersinglelog.md)

↳  [TransferBatchLog](api-interfaces-augur-sdk-src-state-logs-types-transferbatchlog.md)

### Properties

* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-log.md#blocknumber)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#logindex)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionindex)

---

## Properties

<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L21)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Defined in [augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Defined in [augur-sdk/src/state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L24)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [augur-sdk/src/state/logs/types.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L23)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Defined in [augur-sdk/src/state/logs/types.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L22)*

___


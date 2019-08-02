---
id: api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog
title: FormattedEventLog
sidebar_label: FormattedEventLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/event-handlers Module]](api-modules-packages-augur-sdk-src-event-handlers-module.md) > [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md)

## Interface

## Hierarchy

**FormattedEventLog**

↳  [CompleteSetsPurchased](api-interfaces-packages-augur-sdk-src-event-handlers-completesetspurchased.md)

↳  [CompleteSetsSold](api-interfaces-packages-augur-sdk-src-event-handlers-completesetssold.md)

↳  [DisputeCrowdsourcerCompleted](api-interfaces-packages-augur-sdk-src-event-handlers-disputecrowdsourcercompleted.md)

↳  [DisputeCrowdsourcerContribution](api-interfaces-packages-augur-sdk-src-event-handlers-disputecrowdsourcercontribution.md)

↳  [DisputeCrowdsourcerCreated](api-interfaces-packages-augur-sdk-src-event-handlers-disputecrowdsourcercreated.md)

↳  [DisputeCrowdsourcerRedeemed](api-interfaces-packages-augur-sdk-src-event-handlers-disputecrowdsourcerredeemed.md)

↳  [DisputeWindowCreated](api-interfaces-packages-augur-sdk-src-event-handlers-disputewindowcreated.md)

↳  [InitialReportSubmitted](api-interfaces-packages-augur-sdk-src-event-handlers-initialreportsubmitted.md)

↳  [InitialReporterRedeemed](api-interfaces-packages-augur-sdk-src-event-handlers-initialreporterredeemed.md)

↳  [InitialReporterTransferred](api-interfaces-packages-augur-sdk-src-event-handlers-initialreportertransferred.md)

↳  [MarketCreated](api-interfaces-packages-augur-sdk-src-event-handlers-marketcreated.md)

↳  [MarketFinalized](api-interfaces-packages-augur-sdk-src-event-handlers-marketfinalized.md)

↳  [MarketMigrated](api-interfaces-packages-augur-sdk-src-event-handlers-marketmigrated.md)

↳  [MarketParticipantsDisavowed](api-interfaces-packages-augur-sdk-src-event-handlers-marketparticipantsdisavowed.md)

↳  [MarketTransferred](api-interfaces-packages-augur-sdk-src-event-handlers-markettransferred.md)

↳  [MarketVolumeChanged](api-interfaces-packages-augur-sdk-src-event-handlers-marketvolumechanged.md)

↳  [MarketOIChanged](api-interfaces-packages-augur-sdk-src-event-handlers-marketoichanged.md)

↳  [NewBlock](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md)

↳  [OrderEvent](api-interfaces-packages-augur-sdk-src-event-handlers-orderevent.md)

↳  [ParticipationTokensRedeemed](api-interfaces-packages-augur-sdk-src-event-handlers-participationtokensredeemed.md)

↳  [ProfitLossChanged](api-interfaces-packages-augur-sdk-src-event-handlers-profitlosschanged.md)

↳  [ReportingParticipantDisavowed](api-interfaces-packages-augur-sdk-src-event-handlers-reportingparticipantdisavowed.md)

↳  [TimestampSet](api-interfaces-packages-augur-sdk-src-event-handlers-timestampset.md)

↳  [TokenBalanceChanged](api-interfaces-packages-augur-sdk-src-event-handlers-tokenbalancechanged.md)

↳  [TokensBurned](api-interfaces-packages-augur-sdk-src-event-handlers-tokensburned.md)

↳  [TokensMinted](api-interfaces-packages-augur-sdk-src-event-handlers-tokensminted.md)

↳  [TokensTransferred](api-interfaces-packages-augur-sdk-src-event-handlers-tokenstransferred.md)

↳  [TradingProceedsClaimed](api-interfaces-packages-augur-sdk-src-event-handlers-tradingproceedsclaimed.md)

↳  [UniverseCreated](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md)

↳  [UniverseForked](api-interfaces-packages-augur-sdk-src-event-handlers-universeforked.md)

### Properties

* [address](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#address)
* [blockHash](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#blocknumber)
* [contractName](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#contractname)
* [eventName](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#eventname)
* [logIndex](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)
* [removed](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#removed)
* [transactionHash](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#transactionindex)

---

## Properties

<a id="address"></a>

###  address

**● address**: *[Address](api-modules-packages-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:9](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L9)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-event-handlers-module.md#bytes32)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:16](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L16)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:10](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L10)*

___
<a id="contractname"></a>

###  contractName

**● contractName**: *`string`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:14](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L14)*

___
<a id="eventname"></a>

###  eventName

**● eventName**: *`string`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:15](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L15)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:11](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L11)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L17)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-event-handlers-module.md#bytes32)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:12](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L12)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:13](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L13)*

___


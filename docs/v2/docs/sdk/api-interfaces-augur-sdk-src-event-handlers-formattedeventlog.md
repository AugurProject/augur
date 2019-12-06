---
id: api-interfaces-augur-sdk-src-event-handlers-formattedeventlog
title: FormattedEventLog
sidebar_label: FormattedEventLog
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md) > [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md)

## Interface

## Hierarchy

 [Event](api-interfaces-augur-sdk-src-event-handlers-event.md)

**↳ FormattedEventLog**

↳  [CompleteSetsPurchased](api-interfaces-augur-sdk-src-event-handlers-completesetspurchased.md)

↳  [CompleteSetsSold](api-interfaces-augur-sdk-src-event-handlers-completesetssold.md)

↳  [DisputeCrowdsourcerCompleted](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercompleted.md)

↳  [DisputeCrowdsourcerContribution](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercontribution.md)

↳  [DisputeCrowdsourcerCreated](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercreated.md)

↳  [DisputeCrowdsourcerRedeemed](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcerredeemed.md)

↳  [DisputeWindowCreated](api-interfaces-augur-sdk-src-event-handlers-disputewindowcreated.md)

↳  [InitialReportSubmitted](api-interfaces-augur-sdk-src-event-handlers-initialreportsubmitted.md)

↳  [InitialReporterRedeemed](api-interfaces-augur-sdk-src-event-handlers-initialreporterredeemed.md)

↳  [InitialReporterTransferred](api-interfaces-augur-sdk-src-event-handlers-initialreportertransferred.md)

↳  [MarketCreated](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md)

↳  [MarketFinalized](api-interfaces-augur-sdk-src-event-handlers-marketfinalized.md)

↳  [MarketMigrated](api-interfaces-augur-sdk-src-event-handlers-marketmigrated.md)

↳  [MarketParticipantsDisavowed](api-interfaces-augur-sdk-src-event-handlers-marketparticipantsdisavowed.md)

↳  [MarketTransferred](api-interfaces-augur-sdk-src-event-handlers-markettransferred.md)

↳  [MarketVolumeChanged](api-interfaces-augur-sdk-src-event-handlers-marketvolumechanged.md)

↳  [MarketOIChanged](api-interfaces-augur-sdk-src-event-handlers-marketoichanged.md)

↳  [NewBlock](api-interfaces-augur-sdk-src-event-handlers-newblock.md)

↳  [OrderEvent](api-interfaces-augur-sdk-src-event-handlers-orderevent.md)

↳  [ParticipationTokensRedeemed](api-interfaces-augur-sdk-src-event-handlers-participationtokensredeemed.md)

↳  [ProfitLossChanged](api-interfaces-augur-sdk-src-event-handlers-profitlosschanged.md)

↳  [ReportingParticipantDisavowed](api-interfaces-augur-sdk-src-event-handlers-reportingparticipantdisavowed.md)

↳  [TimestampSet](api-interfaces-augur-sdk-src-event-handlers-timestampset.md)

↳  [TokenBalanceChanged](api-interfaces-augur-sdk-src-event-handlers-tokenbalancechanged.md)

↳  [TokensBurned](api-interfaces-augur-sdk-src-event-handlers-tokensburned.md)

↳  [TokensMinted](api-interfaces-augur-sdk-src-event-handlers-tokensminted.md)

↳  [TokensTransferred](api-interfaces-augur-sdk-src-event-handlers-tokenstransferred.md)

↳  [TradingProceedsClaimed](api-interfaces-augur-sdk-src-event-handlers-tradingproceedsclaimed.md)

↳  [UniverseCreated](api-interfaces-augur-sdk-src-event-handlers-universecreated.md)

↳  [UniverseForked](api-interfaces-augur-sdk-src-event-handlers-universeforked.md)

### Properties

* [address](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#address)
* [blockHash](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#blocknumber)
* [contractName](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#contractname)
* [eventName](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#eventname)
* [logIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)
* [removed](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#removed)
* [transactionHash](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#transactionindex)

---

## Properties

<a id="address"></a>

###  address

**● address**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L16)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Defined in [augur-sdk/src/event-handlers.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L22)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L17)*

___
<a id="contractname"></a>

###  contractName

**● contractName**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L21)*

___
<a id="eventname"></a>

###  eventName

**● eventName**: *`string`*

*Inherited from [Event](api-interfaces-augur-sdk-src-event-handlers-event.md).[eventName](api-interfaces-augur-sdk-src-event-handlers-event.md#eventname)*

*Defined in [augur-sdk/src/event-handlers.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L8)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L18)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Defined in [augur-sdk/src/event-handlers.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L23)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Defined in [augur-sdk/src/event-handlers.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L20)*

___


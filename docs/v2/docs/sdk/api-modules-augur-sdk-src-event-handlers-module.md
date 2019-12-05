---
id: api-modules-augur-sdk-src-event-handlers-module
title: augur-sdk/src/event-handlers Module
sidebar_label: augur-sdk/src/event-handlers
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md)

## Module

### Interfaces

* [CompleteSetsPurchased](api-interfaces-augur-sdk-src-event-handlers-completesetspurchased.md)
* [CompleteSetsSold](api-interfaces-augur-sdk-src-event-handlers-completesetssold.md)
* [DisputeCrowdsourcerCompleted](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercompleted.md)
* [DisputeCrowdsourcerContribution](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercontribution.md)
* [DisputeCrowdsourcerCreated](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercreated.md)
* [DisputeCrowdsourcerRedeemed](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcerredeemed.md)
* [DisputeWindowCreated](api-interfaces-augur-sdk-src-event-handlers-disputewindowcreated.md)
* [Event](api-interfaces-augur-sdk-src-event-handlers-event.md)
* [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md)
* [InitialReportSubmitted](api-interfaces-augur-sdk-src-event-handlers-initialreportsubmitted.md)
* [InitialReporterRedeemed](api-interfaces-augur-sdk-src-event-handlers-initialreporterredeemed.md)
* [InitialReporterTransferred](api-interfaces-augur-sdk-src-event-handlers-initialreportertransferred.md)
* [MarketCreated](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md)
* [MarketFinalized](api-interfaces-augur-sdk-src-event-handlers-marketfinalized.md)
* [MarketMigrated](api-interfaces-augur-sdk-src-event-handlers-marketmigrated.md)
* [MarketOIChanged](api-interfaces-augur-sdk-src-event-handlers-marketoichanged.md)
* [MarketParticipantsDisavowed](api-interfaces-augur-sdk-src-event-handlers-marketparticipantsdisavowed.md)
* [MarketTransferred](api-interfaces-augur-sdk-src-event-handlers-markettransferred.md)
* [MarketVolumeChanged](api-interfaces-augur-sdk-src-event-handlers-marketvolumechanged.md)
* [NewBlock](api-interfaces-augur-sdk-src-event-handlers-newblock.md)
* [OrderEvent](api-interfaces-augur-sdk-src-event-handlers-orderevent.md)
* [ParticipationTokensRedeemed](api-interfaces-augur-sdk-src-event-handlers-participationtokensredeemed.md)
* [ProfitLossChanged](api-interfaces-augur-sdk-src-event-handlers-profitlosschanged.md)
* [ReportingParticipantDisavowed](api-interfaces-augur-sdk-src-event-handlers-reportingparticipantdisavowed.md)
* [TXStatus](api-interfaces-augur-sdk-src-event-handlers-txstatus.md)
* [TimestampSet](api-interfaces-augur-sdk-src-event-handlers-timestampset.md)
* [TokenBalanceChanged](api-interfaces-augur-sdk-src-event-handlers-tokenbalancechanged.md)
* [TokensBurned](api-interfaces-augur-sdk-src-event-handlers-tokensburned.md)
* [TokensMinted](api-interfaces-augur-sdk-src-event-handlers-tokensminted.md)
* [TokensTransferred](api-interfaces-augur-sdk-src-event-handlers-tokenstransferred.md)
* [TradingProceedsClaimed](api-interfaces-augur-sdk-src-event-handlers-tradingproceedsclaimed.md)
* [UniverseCreated](api-interfaces-augur-sdk-src-event-handlers-universecreated.md)
* [UniverseForked](api-interfaces-augur-sdk-src-event-handlers-universeforked.md)
* [UserDataSynced](api-interfaces-augur-sdk-src-event-handlers-userdatasynced.md)

### Type aliases

* [Address](api-modules-augur-sdk-src-event-handlers-module.md#address)
* [Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)
* [SubscriptionType](api-modules-augur-sdk-src-event-handlers-module.md#subscriptiontype)

---

## Type aliases

<a id="address"></a>

###  Address

**Ƭ Address**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:4](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L4)*

___
<a id="bytes32"></a>

###  Bytes32

**Ƭ Bytes32**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:5](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L5)*

___
<a id="subscriptiontype"></a>

###  SubscriptionType

**Ƭ SubscriptionType**: *[MarketCreated](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md) \| [InitialReportSubmitted](api-interfaces-augur-sdk-src-event-handlers-initialreportsubmitted.md) \| [DisputeCrowdsourcerCreated](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercreated.md) \| [DisputeCrowdsourcerContribution](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercontribution.md) \| [DisputeCrowdsourcerCompleted](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcercompleted.md) \| [InitialReporterRedeemed](api-interfaces-augur-sdk-src-event-handlers-initialreporterredeemed.md) \| [DisputeCrowdsourcerRedeemed](api-interfaces-augur-sdk-src-event-handlers-disputecrowdsourcerredeemed.md) \| [ReportingParticipantDisavowed](api-interfaces-augur-sdk-src-event-handlers-reportingparticipantdisavowed.md) \| [MarketParticipantsDisavowed](api-interfaces-augur-sdk-src-event-handlers-marketparticipantsdisavowed.md) \| [MarketFinalized](api-interfaces-augur-sdk-src-event-handlers-marketfinalized.md) \| [MarketMigrated](api-interfaces-augur-sdk-src-event-handlers-marketmigrated.md) \| [UniverseForked](api-interfaces-augur-sdk-src-event-handlers-universeforked.md) \| [UniverseCreated](api-interfaces-augur-sdk-src-event-handlers-universecreated.md) \| [OrderEvent](api-interfaces-augur-sdk-src-event-handlers-orderevent.md) \| [CompleteSetsPurchased](api-interfaces-augur-sdk-src-event-handlers-completesetspurchased.md) \| [CompleteSetsSold](api-interfaces-augur-sdk-src-event-handlers-completesetssold.md) \| [TradingProceedsClaimed](api-interfaces-augur-sdk-src-event-handlers-tradingproceedsclaimed.md) \| [TokensTransferred](api-interfaces-augur-sdk-src-event-handlers-tokenstransferred.md) \| [TokensMinted](api-interfaces-augur-sdk-src-event-handlers-tokensminted.md) \| [TokensBurned](api-interfaces-augur-sdk-src-event-handlers-tokensburned.md) \| [TokenBalanceChanged](api-interfaces-augur-sdk-src-event-handlers-tokenbalancechanged.md) \| [DisputeWindowCreated](api-interfaces-augur-sdk-src-event-handlers-disputewindowcreated.md) \| [InitialReporterTransferred](api-interfaces-augur-sdk-src-event-handlers-initialreportertransferred.md) \| [MarketTransferred](api-interfaces-augur-sdk-src-event-handlers-markettransferred.md) \| [MarketVolumeChanged](api-interfaces-augur-sdk-src-event-handlers-marketvolumechanged.md) \| [MarketOIChanged](api-interfaces-augur-sdk-src-event-handlers-marketoichanged.md) \| [ProfitLossChanged](api-interfaces-augur-sdk-src-event-handlers-profitlosschanged.md) \| [ParticipationTokensRedeemed](api-interfaces-augur-sdk-src-event-handlers-participationtokensredeemed.md) \| [TimestampSet](api-interfaces-augur-sdk-src-event-handlers-timestampset.md) \| [NewBlock](api-interfaces-augur-sdk-src-event-handlers-newblock.md) \| [TXStatus](api-interfaces-augur-sdk-src-event-handlers-txstatus.md)*

*Defined in [augur-sdk/src/event-handlers.ts:294](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L294)*

___


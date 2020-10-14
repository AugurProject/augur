[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/event-handlers"](_augur_sdk_src_event_handlers_.md)

# Module: "augur-sdk/src/event-handlers"

## Index

### Interfaces

* [CompleteSetsPurchased](../interfaces/_augur_sdk_src_event_handlers_.completesetspurchased.md)
* [CompleteSetsSold](../interfaces/_augur_sdk_src_event_handlers_.completesetssold.md)
* [DisputeCrowdsourcerCompleted](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcercompleted.md)
* [DisputeCrowdsourcerContribution](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcercontribution.md)
* [DisputeCrowdsourcerCreated](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcercreated.md)
* [DisputeCrowdsourcerRedeemed](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcerredeemed.md)
* [DisputeWindowCreated](../interfaces/_augur_sdk_src_event_handlers_.disputewindowcreated.md)
* [Event](../interfaces/_augur_sdk_src_event_handlers_.event.md)
* [FormattedEventLog](../interfaces/_augur_sdk_src_event_handlers_.formattedeventlog.md)
* [InitialReportSubmitted](../interfaces/_augur_sdk_src_event_handlers_.initialreportsubmitted.md)
* [InitialReporterRedeemed](../interfaces/_augur_sdk_src_event_handlers_.initialreporterredeemed.md)
* [InitialReporterTransferred](../interfaces/_augur_sdk_src_event_handlers_.initialreportertransferred.md)
* [MarketCreated](../interfaces/_augur_sdk_src_event_handlers_.marketcreated.md)
* [MarketFinalized](../interfaces/_augur_sdk_src_event_handlers_.marketfinalized.md)
* [MarketMigrated](../interfaces/_augur_sdk_src_event_handlers_.marketmigrated.md)
* [MarketOIChanged](../interfaces/_augur_sdk_src_event_handlers_.marketoichanged.md)
* [MarketParticipantsDisavowed](../interfaces/_augur_sdk_src_event_handlers_.marketparticipantsdisavowed.md)
* [MarketTransferred](../interfaces/_augur_sdk_src_event_handlers_.markettransferred.md)
* [MarketVolumeChanged](../interfaces/_augur_sdk_src_event_handlers_.marketvolumechanged.md)
* [NewBlock](../interfaces/_augur_sdk_src_event_handlers_.newblock.md)
* [OrderEvent](../interfaces/_augur_sdk_src_event_handlers_.orderevent.md)
* [ParticipationTokensRedeemed](../interfaces/_augur_sdk_src_event_handlers_.participationtokensredeemed.md)
* [ProfitLossChanged](../interfaces/_augur_sdk_src_event_handlers_.profitlosschanged.md)
* [ReportingFeeChanged](../interfaces/_augur_sdk_src_event_handlers_.reportingfeechanged.md)
* [ReportingParticipantDisavowed](../interfaces/_augur_sdk_src_event_handlers_.reportingparticipantdisavowed.md)
* [TXStatus](../interfaces/_augur_sdk_src_event_handlers_.txstatus.md)
* [TimestampSet](../interfaces/_augur_sdk_src_event_handlers_.timestampset.md)
* [TokenBalanceChanged](../interfaces/_augur_sdk_src_event_handlers_.tokenbalancechanged.md)
* [TokensBurned](../interfaces/_augur_sdk_src_event_handlers_.tokensburned.md)
* [TokensMinted](../interfaces/_augur_sdk_src_event_handlers_.tokensminted.md)
* [TokensTransferred](../interfaces/_augur_sdk_src_event_handlers_.tokenstransferred.md)
* [TradingProceedsClaimed](../interfaces/_augur_sdk_src_event_handlers_.tradingproceedsclaimed.md)
* [UniverseCreated](../interfaces/_augur_sdk_src_event_handlers_.universecreated.md)
* [UniverseForked](../interfaces/_augur_sdk_src_event_handlers_.universeforked.md)
* [UserDataSynced](../interfaces/_augur_sdk_src_event_handlers_.userdatasynced.md)

### Type aliases

* [Address](_augur_sdk_src_event_handlers_.md#address)
* [Bytes32](_augur_sdk_src_event_handlers_.md#bytes32)
* [SubscriptionType](_augur_sdk_src_event_handlers_.md#subscriptiontype)

## Type aliases

###  Address

Ƭ **Address**: *string*

*Defined in [packages/augur-sdk/src/event-handlers.ts:5](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L5)*

___

###  Bytes32

Ƭ **Bytes32**: *string*

*Defined in [packages/augur-sdk/src/event-handlers.ts:6](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L6)*

___

###  SubscriptionType

Ƭ **SubscriptionType**: *[MarketCreated](../interfaces/_augur_sdk_src_event_handlers_.marketcreated.md) | [InitialReportSubmitted](../interfaces/_augur_sdk_src_event_handlers_.initialreportsubmitted.md) | [DisputeCrowdsourcerCreated](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcercreated.md) | [DisputeCrowdsourcerContribution](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcercontribution.md) | [DisputeCrowdsourcerCompleted](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcercompleted.md) | [InitialReporterRedeemed](../interfaces/_augur_sdk_src_event_handlers_.initialreporterredeemed.md) | [DisputeCrowdsourcerRedeemed](../interfaces/_augur_sdk_src_event_handlers_.disputecrowdsourcerredeemed.md) | [ReportingParticipantDisavowed](../interfaces/_augur_sdk_src_event_handlers_.reportingparticipantdisavowed.md) | [MarketParticipantsDisavowed](../interfaces/_augur_sdk_src_event_handlers_.marketparticipantsdisavowed.md) | [MarketFinalized](../interfaces/_augur_sdk_src_event_handlers_.marketfinalized.md) | [MarketMigrated](../interfaces/_augur_sdk_src_event_handlers_.marketmigrated.md) | [UniverseForked](../interfaces/_augur_sdk_src_event_handlers_.universeforked.md) | [UniverseCreated](../interfaces/_augur_sdk_src_event_handlers_.universecreated.md) | [OrderEvent](../interfaces/_augur_sdk_src_event_handlers_.orderevent.md) | [CompleteSetsPurchased](../interfaces/_augur_sdk_src_event_handlers_.completesetspurchased.md) | [CompleteSetsSold](../interfaces/_augur_sdk_src_event_handlers_.completesetssold.md) | [TradingProceedsClaimed](../interfaces/_augur_sdk_src_event_handlers_.tradingproceedsclaimed.md) | [TokensTransferred](../interfaces/_augur_sdk_src_event_handlers_.tokenstransferred.md) | [TokensMinted](../interfaces/_augur_sdk_src_event_handlers_.tokensminted.md) | [TokensBurned](../interfaces/_augur_sdk_src_event_handlers_.tokensburned.md) | [TokenBalanceChanged](../interfaces/_augur_sdk_src_event_handlers_.tokenbalancechanged.md) | [DisputeWindowCreated](../interfaces/_augur_sdk_src_event_handlers_.disputewindowcreated.md) | [InitialReporterTransferred](../interfaces/_augur_sdk_src_event_handlers_.initialreportertransferred.md) | [MarketTransferred](../interfaces/_augur_sdk_src_event_handlers_.markettransferred.md) | [MarketVolumeChanged](../interfaces/_augur_sdk_src_event_handlers_.marketvolumechanged.md) | [MarketOIChanged](../interfaces/_augur_sdk_src_event_handlers_.marketoichanged.md) | [ProfitLossChanged](../interfaces/_augur_sdk_src_event_handlers_.profitlosschanged.md) | [ParticipationTokensRedeemed](../interfaces/_augur_sdk_src_event_handlers_.participationtokensredeemed.md) | [TimestampSet](../interfaces/_augur_sdk_src_event_handlers_.timestampset.md) | [NewBlock](../interfaces/_augur_sdk_src_event_handlers_.newblock.md) | [TXStatus](../interfaces/_augur_sdk_src_event_handlers_.txstatus.md)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:300](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L300)*

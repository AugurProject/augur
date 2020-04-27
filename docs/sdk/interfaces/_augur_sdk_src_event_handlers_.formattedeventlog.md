[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/event-handlers"](../modules/_augur_sdk_src_event_handlers_.md) › [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md)

# Interface: FormattedEventLog

## Hierarchy

* [Event](_augur_sdk_src_event_handlers_.event.md)

  ↳ **FormattedEventLog**

  ↳ [CompleteSetsPurchased](_augur_sdk_src_event_handlers_.completesetspurchased.md)

  ↳ [CompleteSetsSold](_augur_sdk_src_event_handlers_.completesetssold.md)

  ↳ [DisputeCrowdsourcerCompleted](_augur_sdk_src_event_handlers_.disputecrowdsourcercompleted.md)

  ↳ [DisputeCrowdsourcerContribution](_augur_sdk_src_event_handlers_.disputecrowdsourcercontribution.md)

  ↳ [DisputeCrowdsourcerCreated](_augur_sdk_src_event_handlers_.disputecrowdsourcercreated.md)

  ↳ [DisputeCrowdsourcerRedeemed](_augur_sdk_src_event_handlers_.disputecrowdsourcerredeemed.md)

  ↳ [DisputeWindowCreated](_augur_sdk_src_event_handlers_.disputewindowcreated.md)

  ↳ [InitialReportSubmitted](_augur_sdk_src_event_handlers_.initialreportsubmitted.md)

  ↳ [InitialReporterRedeemed](_augur_sdk_src_event_handlers_.initialreporterredeemed.md)

  ↳ [InitialReporterTransferred](_augur_sdk_src_event_handlers_.initialreportertransferred.md)

  ↳ [MarketCreated](_augur_sdk_src_event_handlers_.marketcreated.md)

  ↳ [MarketFinalized](_augur_sdk_src_event_handlers_.marketfinalized.md)

  ↳ [MarketMigrated](_augur_sdk_src_event_handlers_.marketmigrated.md)

  ↳ [MarketParticipantsDisavowed](_augur_sdk_src_event_handlers_.marketparticipantsdisavowed.md)

  ↳ [MarketTransferred](_augur_sdk_src_event_handlers_.markettransferred.md)

  ↳ [MarketVolumeChanged](_augur_sdk_src_event_handlers_.marketvolumechanged.md)

  ↳ [MarketOIChanged](_augur_sdk_src_event_handlers_.marketoichanged.md)

  ↳ [NewBlock](_augur_sdk_src_event_handlers_.newblock.md)

  ↳ [OrderEvent](_augur_sdk_src_event_handlers_.orderevent.md)

  ↳ [ParticipationTokensRedeemed](_augur_sdk_src_event_handlers_.participationtokensredeemed.md)

  ↳ [ProfitLossChanged](_augur_sdk_src_event_handlers_.profitlosschanged.md)

  ↳ [ReportingParticipantDisavowed](_augur_sdk_src_event_handlers_.reportingparticipantdisavowed.md)

  ↳ [TimestampSet](_augur_sdk_src_event_handlers_.timestampset.md)

  ↳ [TokenBalanceChanged](_augur_sdk_src_event_handlers_.tokenbalancechanged.md)

  ↳ [TokensBurned](_augur_sdk_src_event_handlers_.tokensburned.md)

  ↳ [TokensMinted](_augur_sdk_src_event_handlers_.tokensminted.md)

  ↳ [TokensTransferred](_augur_sdk_src_event_handlers_.tokenstransferred.md)

  ↳ [ReportingFeeChanged](_augur_sdk_src_event_handlers_.reportingfeechanged.md)

  ↳ [TradingProceedsClaimed](_augur_sdk_src_event_handlers_.tradingproceedsclaimed.md)

  ↳ [UniverseCreated](_augur_sdk_src_event_handlers_.universecreated.md)

  ↳ [UniverseForked](_augur_sdk_src_event_handlers_.universeforked.md)

## Index

### Properties

* [address](_augur_sdk_src_event_handlers_.formattedeventlog.md#address)
* [blockHash](_augur_sdk_src_event_handlers_.formattedeventlog.md#blockhash)
* [blockNumber](_augur_sdk_src_event_handlers_.formattedeventlog.md#blocknumber)
* [contractName](_augur_sdk_src_event_handlers_.formattedeventlog.md#contractname)
* [eventName](_augur_sdk_src_event_handlers_.formattedeventlog.md#eventname)
* [logIndex](_augur_sdk_src_event_handlers_.formattedeventlog.md#logindex)
* [removed](_augur_sdk_src_event_handlers_.formattedeventlog.md#removed)
* [transactionHash](_augur_sdk_src_event_handlers_.formattedeventlog.md#transactionhash)
* [transactionIndex](_augur_sdk_src_event_handlers_.formattedeventlog.md#transactionindex)

## Properties

###  address

• **address**: *[Address](../modules/_augur_sdk_src_event_handlers_.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L17)*

___

###  blockHash

• **blockHash**: *[Bytes32](../modules/_augur_sdk_src_event_handlers_.md#bytes32)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:23](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L23)*

___

###  blockNumber

• **blockNumber**: *number*

*Defined in [packages/augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L18)*

___

###  contractName

• **contractName**: *string*

*Defined in [packages/augur-sdk/src/event-handlers.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L22)*

___

###  eventName

• **eventName**: *string*

*Inherited from [Event](_augur_sdk_src_event_handlers_.event.md).[eventName](_augur_sdk_src_event_handlers_.event.md#eventname)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:9](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L9)*

___

###  logIndex

• **logIndex**: *number*

*Defined in [packages/augur-sdk/src/event-handlers.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L19)*

___

###  removed

• **removed**: *boolean*

*Defined in [packages/augur-sdk/src/event-handlers.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L24)*

___

###  transactionHash

• **transactionHash**: *[Bytes32](../modules/_augur_sdk_src_event_handlers_.md#bytes32)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L20)*

___

###  transactionIndex

• **transactionIndex**: *number*

*Defined in [packages/augur-sdk/src/event-handlers.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L21)*

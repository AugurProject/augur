[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](../modules/_augur_sdk_src_state_logs_types_.md) › [DisputeCrowdsourcerContributionLog](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md)

# Interface: DisputeCrowdsourcerContributionLog

## Hierarchy

  ↳ [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md)

  ↳ **DisputeCrowdsourcerContributionLog**

## Index

### Properties

* [amountStaked](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#amountstaked)
* [blockHash](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#blockhash)
* [blockNumber](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#blocknumber)
* [description](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#description)
* [disputeCrowdsourcer](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#disputecrowdsourcer)
* [disputeRound](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#disputeround)
* [logIndex](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#logindex)
* [market](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#market)
* [payoutNumerators](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#payoutnumerators)
* [reporter](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#reporter)
* [timestamp](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#timestamp)
* [transactionHash](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#transactionhash)
* [transactionIndex](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#transactionindex)
* [universe](_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md#universe)

## Properties

###  amountStaked

• **amountStaked**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:72](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L72)*

___

###  blockHash

• **blockHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockHash](_augur_sdk_src_state_logs_types_.log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L18)*

___

###  blockNumber

• **blockNumber**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockNumber](_augur_sdk_src_state_logs_types_.log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L17)*

___

###  description

• **description**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:73](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L73)*

___

###  disputeCrowdsourcer

• **disputeCrowdsourcer**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:70](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L70)*

___

###  disputeRound

• **disputeRound**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:74](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L74)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[logIndex](_augur_sdk_src_state_logs_types_.log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L21)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:69](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L69)*

___

###  payoutNumerators

• **payoutNumerators**: *[PayoutNumerators](../modules/_augur_sdk_src_state_logs_types_.md#payoutnumerators)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:71](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L71)*

___

###  reporter

• **reporter**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:68](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L68)*

___

###  timestamp

• **timestamp**: *[LogTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#logtimestamp)*

*Inherited from [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md).[timestamp](_augur_sdk_src_state_logs_types_.timestampedlog.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:25](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L25)*

___

###  transactionHash

• **transactionHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionHash](_augur_sdk_src_state_logs_types_.log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L20)*

___

###  transactionIndex

• **transactionIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionIndex](_augur_sdk_src_state_logs_types_.log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L19)*

___

###  universe

• **universe**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:67](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L67)*

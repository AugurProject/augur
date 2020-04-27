[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](../modules/_augur_sdk_src_state_logs_types_.md) › [ProfitLossChangedLog](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)

# Interface: ProfitLossChangedLog

## Hierarchy

  ↳ [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md)

  ↳ **ProfitLossChangedLog**

## Index

### Properties

* [account](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#account)
* [avgPrice](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#avgprice)
* [blockHash](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#blockhash)
* [blockNumber](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#blocknumber)
* [frozenFunds](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#frozenfunds)
* [logIndex](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#logindex)
* [market](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#market)
* [netPosition](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#netposition)
* [outcome](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#outcome)
* [realizedCost](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#realizedcost)
* [realizedProfit](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#realizedprofit)
* [timestamp](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#timestamp)
* [transactionHash](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#transactionhash)
* [transactionIndex](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#transactionindex)
* [universe](_augur_sdk_src_state_logs_types_.profitlosschangedlog.md#universe)

## Properties

###  account

• **account**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:332](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L332)*

___

###  avgPrice

• **avgPrice**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:335](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L335)*

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

###  frozenFunds

• **frozenFunds**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:337](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L337)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[logIndex](_augur_sdk_src_state_logs_types_.log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L21)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:331](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L331)*

___

###  netPosition

• **netPosition**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:334](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L334)*

___

###  outcome

• **outcome**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:333](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L333)*

___

###  realizedCost

• **realizedCost**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:338](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L338)*

___

###  realizedProfit

• **realizedProfit**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:336](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L336)*

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

*Defined in [packages/augur-sdk/src/state/logs/types.ts:330](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L330)*

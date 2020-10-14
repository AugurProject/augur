[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](../modules/_augur_sdk_src_state_logs_types_.md) › [MarketCreatedLog](_augur_sdk_src_state_logs_types_.marketcreatedlog.md)

# Interface: MarketCreatedLog

## Hierarchy

  ↳ [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md)

  ↳ **MarketCreatedLog**

## Index

### Properties

* [blockHash](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#blockhash)
* [blockNumber](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#blocknumber)
* [designatedReporter](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#designatedreporter)
* [endTime](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#endtime)
* [extraInfo](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#extrainfo)
* [feePerCashInAttoCash](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#feepercashinattocash)
* [logIndex](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#logindex)
* [market](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#market)
* [marketCreator](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#marketcreator)
* [marketType](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#markettype)
* [numTicks](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#numticks)
* [outcomes](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#outcomes)
* [prices](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#prices)
* [timestamp](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#timestamp)
* [transactionHash](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#transactionhash)
* [transactionIndex](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#transactionindex)
* [universe](_augur_sdk_src_state_logs_types_.marketcreatedlog.md#universe)

## Properties

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

###  designatedReporter

• **designatedReporter**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:140](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L140)*

___

###  endTime

• **endTime**: *[LogTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#logtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:136](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L136)*

___

###  extraInfo

• **extraInfo**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:137](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L137)*

___

###  feePerCashInAttoCash

• **feePerCashInAttoCash**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:141](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L141)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[logIndex](_augur_sdk_src_state_logs_types_.log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L21)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:138](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L138)*

___

###  marketCreator

• **marketCreator**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:139](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L139)*

___

###  marketType

• **marketType**: *[MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:143](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L143)*

___

###  numTicks

• **numTicks**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:144](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L144)*

___

###  outcomes

• **outcomes**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:145](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L145)*

___

###  prices

• **prices**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:142](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L142)*

___

###  timestamp

• **timestamp**: *string*

*Overrides [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md).[timestamp](_augur_sdk_src_state_logs_types_.timestampedlog.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:146](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L146)*

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

*Defined in [packages/augur-sdk/src/state/logs/types.ts:135](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L135)*

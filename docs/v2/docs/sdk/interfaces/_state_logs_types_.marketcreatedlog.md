[@augurproject/sdk](../README.md) > ["state/logs/types"](../modules/_state_logs_types_.md) > [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)

# Interface: MarketCreatedLog

## Hierarchy

 [Log](_state_logs_types_.log.md)

 [Doc](_state_logs_types_.doc.md)

 [Timestamped](_state_logs_types_.timestamped.md)

**↳ MarketCreatedLog**

## Index

### Properties

* [_id](_state_logs_types_.marketcreatedlog.md#_id)
* [_rev](_state_logs_types_.marketcreatedlog.md#_rev)
* [blockHash](_state_logs_types_.marketcreatedlog.md#blockhash)
* [blockNumber](_state_logs_types_.marketcreatedlog.md#blocknumber)
* [designatedReporter](_state_logs_types_.marketcreatedlog.md#designatedreporter)
* [endTime](_state_logs_types_.marketcreatedlog.md#endtime)
* [extraInfo](_state_logs_types_.marketcreatedlog.md#extrainfo)
* [feeDivisor](_state_logs_types_.marketcreatedlog.md#feedivisor)
* [logIndex](_state_logs_types_.marketcreatedlog.md#logindex)
* [market](_state_logs_types_.marketcreatedlog.md#market)
* [marketCreator](_state_logs_types_.marketcreatedlog.md#marketcreator)
* [marketType](_state_logs_types_.marketcreatedlog.md#markettype)
* [numTicks](_state_logs_types_.marketcreatedlog.md#numticks)
* [outcomes](_state_logs_types_.marketcreatedlog.md#outcomes)
* [prices](_state_logs_types_.marketcreatedlog.md#prices)
* [timestamp](_state_logs_types_.marketcreatedlog.md#timestamp)
* [topic](_state_logs_types_.marketcreatedlog.md#topic)
* [transactionHash](_state_logs_types_.marketcreatedlog.md#transactionhash)
* [transactionIndex](_state_logs_types_.marketcreatedlog.md#transactionindex)
* [universe](_state_logs_types_.marketcreatedlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](_state_logs_types_.doc.md).[_id](_state_logs_types_.doc.md#_id)*

*Defined in [state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](_state_logs_types_.doc.md).[_rev](_state_logs_types_.doc.md#_rev)*

*Defined in [state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](../modules/_state_logs_types_.md#bytes32)*

*Inherited from [Log](_state_logs_types_.log.md).[blockHash](_state_logs_types_.log.md#blockhash)*

*Defined in [state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](_state_logs_types_.log.md).[blockNumber](_state_logs_types_.log.md#blocknumber)*

*Defined in [state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="designatedreporter"></a>

###  designatedReporter

**● designatedReporter**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:111](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L111)*

___
<a id="endtime"></a>

###  endTime

**● endTime**: *[Timestamp](../modules/_state_logs_types_.md#timestamp)*

*Defined in [state/logs/types.ts:106](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L106)*

___
<a id="extrainfo"></a>

###  extraInfo

**● extraInfo**: *`string`*

*Defined in [state/logs/types.ts:108](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L108)*

___
<a id="feedivisor"></a>

###  feeDivisor

**● feeDivisor**: *`string`*

*Defined in [state/logs/types.ts:112](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L112)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](_state_logs_types_.log.md).[logIndex](_state_logs_types_.log.md#logindex)*

*Defined in [state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:109](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L109)*

___
<a id="marketcreator"></a>

###  marketCreator

**● marketCreator**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:110](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L110)*

___
<a id="markettype"></a>

###  marketType

**● marketType**: *[MarketType](../enums/_state_logs_types_.markettype.md)*

*Defined in [state/logs/types.ts:114](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L114)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`string`*

*Defined in [state/logs/types.ts:115](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L115)*

___
<a id="outcomes"></a>

###  outcomes

**● outcomes**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:116](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L116)*

___
<a id="prices"></a>

###  prices

**● prices**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:113](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L113)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](../modules/_state_logs_types_.md#timestamp)*

*Inherited from [Timestamped](_state_logs_types_.timestamped.md).[timestamp](_state_logs_types_.timestamped.md#timestamp)*

*Defined in [state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L12)*

___
<a id="topic"></a>

###  topic

**● topic**: *`string`*

*Defined in [state/logs/types.ts:107](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L107)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](../modules/_state_logs_types_.md#bytes32)*

*Inherited from [Log](_state_logs_types_.log.md).[transactionHash](_state_logs_types_.log.md#transactionhash)*

*Defined in [state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](_state_logs_types_.log.md).[transactionIndex](_state_logs_types_.log.md#transactionindex)*

*Defined in [state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:105](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L105)*

___


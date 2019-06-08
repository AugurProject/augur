[@augurproject/sdk](../README.md) > ["state/logs/types"](../modules/_state_logs_types_.md) > [InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md)

# Interface: InitialReportSubmittedLog

## Hierarchy

 [Log](_state_logs_types_.log.md)

 [Doc](_state_logs_types_.doc.md)

 [Timestamped](_state_logs_types_.timestamped.md)

**↳ InitialReportSubmittedLog**

## Index

### Properties

* [_id](_state_logs_types_.initialreportsubmittedlog.md#_id)
* [_rev](_state_logs_types_.initialreportsubmittedlog.md#_rev)
* [amountStaked](_state_logs_types_.initialreportsubmittedlog.md#amountstaked)
* [blockHash](_state_logs_types_.initialreportsubmittedlog.md#blockhash)
* [blockNumber](_state_logs_types_.initialreportsubmittedlog.md#blocknumber)
* [description](_state_logs_types_.initialreportsubmittedlog.md#description)
* [isDesignatedReporter](_state_logs_types_.initialreportsubmittedlog.md#isdesignatedreporter)
* [logIndex](_state_logs_types_.initialreportsubmittedlog.md#logindex)
* [market](_state_logs_types_.initialreportsubmittedlog.md#market)
* [payoutNumerators](_state_logs_types_.initialreportsubmittedlog.md#payoutnumerators)
* [reporter](_state_logs_types_.initialreportsubmittedlog.md#reporter)
* [timestamp](_state_logs_types_.initialreportsubmittedlog.md#timestamp)
* [transactionHash](_state_logs_types_.initialreportsubmittedlog.md#transactionhash)
* [transactionIndex](_state_logs_types_.initialreportsubmittedlog.md#transactionindex)
* [universe](_state_logs_types_.initialreportsubmittedlog.md#universe)

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
<a id="amountstaked"></a>

###  amountStaked

**● amountStaked**: *`string`*

*Defined in [state/logs/types.ts:91](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L91)*

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
<a id="description"></a>

###  description

**● description**: *`string`*

*Defined in [state/logs/types.ts:94](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L94)*

___
<a id="isdesignatedreporter"></a>

###  isDesignatedReporter

**● isDesignatedReporter**: *`boolean`*

*Defined in [state/logs/types.ts:92](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L92)*

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

*Defined in [state/logs/types.ts:90](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L90)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](../modules/_state_logs_types_.md#payoutnumerators)*

*Defined in [state/logs/types.ts:93](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L93)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:89](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L89)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](../modules/_state_logs_types_.md#timestamp)*

*Inherited from [Timestamped](_state_logs_types_.timestamped.md).[timestamp](_state_logs_types_.timestamped.md#timestamp)*

*Defined in [state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L12)*

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

*Defined in [state/logs/types.ts:88](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L88)*

___


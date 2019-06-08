[@augurproject/sdk](../README.md) > ["state/logs/types"](../modules/_state_logs_types_.md) > [DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md)

# Interface: DisputeCrowdsourcerContributionLog

## Hierarchy

 [Log](_state_logs_types_.log.md)

 [Doc](_state_logs_types_.doc.md)

 [Timestamped](_state_logs_types_.timestamped.md)

**↳ DisputeCrowdsourcerContributionLog**

## Index

### Properties

* [_id](_state_logs_types_.disputecrowdsourcercontributionlog.md#_id)
* [_rev](_state_logs_types_.disputecrowdsourcercontributionlog.md#_rev)
* [amountStaked](_state_logs_types_.disputecrowdsourcercontributionlog.md#amountstaked)
* [blockHash](_state_logs_types_.disputecrowdsourcercontributionlog.md#blockhash)
* [blockNumber](_state_logs_types_.disputecrowdsourcercontributionlog.md#blocknumber)
* [description](_state_logs_types_.disputecrowdsourcercontributionlog.md#description)
* [disputeCrowdsourcer](_state_logs_types_.disputecrowdsourcercontributionlog.md#disputecrowdsourcer)
* [logIndex](_state_logs_types_.disputecrowdsourcercontributionlog.md#logindex)
* [market](_state_logs_types_.disputecrowdsourcercontributionlog.md#market)
* [payoutNumerators](_state_logs_types_.disputecrowdsourcercontributionlog.md#payoutnumerators)
* [reporter](_state_logs_types_.disputecrowdsourcercontributionlog.md#reporter)
* [timestamp](_state_logs_types_.disputecrowdsourcercontributionlog.md#timestamp)
* [transactionHash](_state_logs_types_.disputecrowdsourcercontributionlog.md#transactionhash)
* [transactionIndex](_state_logs_types_.disputecrowdsourcercontributionlog.md#transactionindex)
* [universe](_state_logs_types_.disputecrowdsourcercontributionlog.md#universe)

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

*Defined in [state/logs/types.ts:55](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L55)*

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

*Defined in [state/logs/types.ts:56](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L56)*

___
<a id="disputecrowdsourcer"></a>

###  disputeCrowdsourcer

**● disputeCrowdsourcer**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:53](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L53)*

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

*Defined in [state/logs/types.ts:52](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L52)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](../modules/_state_logs_types_.md#payoutnumerators)*

*Defined in [state/logs/types.ts:54](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L54)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:51](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L51)*

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

*Defined in [state/logs/types.ts:50](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L50)*

___


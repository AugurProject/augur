[@augurproject/sdk](../README.md) > ["state/logs/types"](../modules/_state_logs_types_.md) > [DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md)

# Interface: DisputeCrowdsourcerRedeemedLog

## Hierarchy

 [Log](_state_logs_types_.log.md)

 [Doc](_state_logs_types_.doc.md)

 [Timestamped](_state_logs_types_.timestamped.md)

**↳ DisputeCrowdsourcerRedeemedLog**

## Index

### Properties

* [_id](_state_logs_types_.disputecrowdsourcerredeemedlog.md#_id)
* [_rev](_state_logs_types_.disputecrowdsourcerredeemedlog.md#_rev)
* [amountRedeemed](_state_logs_types_.disputecrowdsourcerredeemedlog.md#amountredeemed)
* [blockHash](_state_logs_types_.disputecrowdsourcerredeemedlog.md#blockhash)
* [blockNumber](_state_logs_types_.disputecrowdsourcerredeemedlog.md#blocknumber)
* [disputeCrowdsourcer](_state_logs_types_.disputecrowdsourcerredeemedlog.md#disputecrowdsourcer)
* [logIndex](_state_logs_types_.disputecrowdsourcerredeemedlog.md#logindex)
* [market](_state_logs_types_.disputecrowdsourcerredeemedlog.md#market)
* [payoutNumerators](_state_logs_types_.disputecrowdsourcerredeemedlog.md#payoutnumerators)
* [repReceived](_state_logs_types_.disputecrowdsourcerredeemedlog.md#repreceived)
* [reporter](_state_logs_types_.disputecrowdsourcerredeemedlog.md#reporter)
* [timestamp](_state_logs_types_.disputecrowdsourcerredeemedlog.md#timestamp)
* [transactionHash](_state_logs_types_.disputecrowdsourcerredeemedlog.md#transactionhash)
* [transactionIndex](_state_logs_types_.disputecrowdsourcerredeemedlog.md#transactionindex)
* [universe](_state_logs_types_.disputecrowdsourcerredeemedlog.md#universe)

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
<a id="amountredeemed"></a>

###  amountRedeemed

**● amountRedeemed**: *`string`*

*Defined in [state/logs/types.ts:64](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L64)*

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
<a id="disputecrowdsourcer"></a>

###  disputeCrowdsourcer

**● disputeCrowdsourcer**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:63](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L63)*

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

*Defined in [state/logs/types.ts:62](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L62)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](../modules/_state_logs_types_.md#payoutnumerators)*

*Defined in [state/logs/types.ts:66](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L66)*

___
<a id="repreceived"></a>

###  repReceived

**● repReceived**: *`string`*

*Defined in [state/logs/types.ts:65](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L65)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:61](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L61)*

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

*Defined in [state/logs/types.ts:60](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L60)*

___


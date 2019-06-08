[@augurproject/sdk](../README.md) > ["state/logs/types"](../modules/_state_logs_types_.md) > [ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md)

# Interface: ProfitLossChangedLog

## Hierarchy

 [Log](_state_logs_types_.log.md)

 [Doc](_state_logs_types_.doc.md)

 [Timestamped](_state_logs_types_.timestamped.md)

**↳ ProfitLossChangedLog**

## Index

### Properties

* [_id](_state_logs_types_.profitlosschangedlog.md#_id)
* [_rev](_state_logs_types_.profitlosschangedlog.md#_rev)
* [account](_state_logs_types_.profitlosschangedlog.md#account)
* [avgPrice](_state_logs_types_.profitlosschangedlog.md#avgprice)
* [blockHash](_state_logs_types_.profitlosschangedlog.md#blockhash)
* [blockNumber](_state_logs_types_.profitlosschangedlog.md#blocknumber)
* [frozenFunds](_state_logs_types_.profitlosschangedlog.md#frozenfunds)
* [logIndex](_state_logs_types_.profitlosschangedlog.md#logindex)
* [market](_state_logs_types_.profitlosschangedlog.md#market)
* [netPosition](_state_logs_types_.profitlosschangedlog.md#netposition)
* [outcome](_state_logs_types_.profitlosschangedlog.md#outcome)
* [realizedCost](_state_logs_types_.profitlosschangedlog.md#realizedcost)
* [realizedProfit](_state_logs_types_.profitlosschangedlog.md#realizedprofit)
* [timestamp](_state_logs_types_.profitlosschangedlog.md#timestamp)
* [transactionHash](_state_logs_types_.profitlosschangedlog.md#transactionhash)
* [transactionIndex](_state_logs_types_.profitlosschangedlog.md#transactionindex)
* [universe](_state_logs_types_.profitlosschangedlog.md#universe)

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
<a id="account"></a>

###  account

**● account**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:224](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L224)*

___
<a id="avgprice"></a>

###  avgPrice

**● avgPrice**: *`string`*

*Defined in [state/logs/types.ts:227](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L227)*

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
<a id="frozenfunds"></a>

###  frozenFunds

**● frozenFunds**: *`string`*

*Defined in [state/logs/types.ts:229](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L229)*

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

*Defined in [state/logs/types.ts:223](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L223)*

___
<a id="netposition"></a>

###  netPosition

**● netPosition**: *`string`*

*Defined in [state/logs/types.ts:226](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L226)*

___
<a id="outcome"></a>

###  outcome

**● outcome**: *`string`*

*Defined in [state/logs/types.ts:225](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L225)*

___
<a id="realizedcost"></a>

###  realizedCost

**● realizedCost**: *`string`*

*Defined in [state/logs/types.ts:230](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L230)*

___
<a id="realizedprofit"></a>

###  realizedProfit

**● realizedProfit**: *`string`*

*Defined in [state/logs/types.ts:228](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L228)*

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

*Defined in [state/logs/types.ts:222](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L222)*

___


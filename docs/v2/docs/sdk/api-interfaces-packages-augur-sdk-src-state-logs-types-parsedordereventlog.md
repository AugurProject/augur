---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog
title: ParsedOrderEventLog
sidebar_label: ParsedOrderEventLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

 [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md)

**↳ ParsedOrderEventLog**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#_rev)
* [amount](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#amount)
* [amountFilled](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#amountfilled)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#blocknumber)
* [eventType](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#eventtype)
* [fees](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#fees)
* [kycToken](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#kyctoken)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#market)
* [orderCreator](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#ordercreator)
* [orderFiller](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#orderfiller)
* [orderId](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#orderid)
* [orderType](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#ordertype)
* [outcome](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#outcome)
* [price](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#price)
* [sharesEscrowed](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#sharesescrowed)
* [sharesRefund](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#sharesrefund)
* [timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#timestamp)
* [tokenRefund](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#tokenrefund)
* [tokensEscrowed](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#tokensescrowed)
* [tradeGroupId](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#tradegroupid)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#transactionindex)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_id](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_id)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_rev)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="amount"></a>

###  amount

**● amount**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:205](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L205)*

___
<a id="amountfilled"></a>

###  amountFilled

**● amountFilled**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:210](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L210)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="eventtype"></a>

###  eventType

**● eventType**: *[OrderEventType](api-enums-packages-augur-sdk-src-state-logs-types-ordereventtype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:197](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L197)*

___
<a id="fees"></a>

###  fees

**● fees**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:209](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L209)*

___
<a id="kyctoken"></a>

###  kycToken

**● kycToken**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:201](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L201)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:196](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L196)*

___
<a id="ordercreator"></a>

###  orderCreator

**● orderCreator**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:202](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L202)*

___
<a id="orderfiller"></a>

###  orderFiller

**● orderFiller**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:203](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L203)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:199](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L199)*

___
<a id="ordertype"></a>

###  orderType

**● orderType**: *[OrderType](api-enums-packages-augur-sdk-src-state-logs-types-ordertype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:198](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L198)*

___
<a id="outcome"></a>

###  outcome

**● outcome**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:206](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L206)*

___
<a id="price"></a>

###  price

**● price**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:204](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L204)*

___
<a id="sharesescrowed"></a>

###  sharesEscrowed

**● sharesEscrowed**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:212](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L212)*

___
<a id="sharesrefund"></a>

###  sharesRefund

**● sharesRefund**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:208](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L208)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`string`*

*Overrides [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:211](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L211)*

___
<a id="tokenrefund"></a>

###  tokenRefund

**● tokenRefund**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:207](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L207)*

___
<a id="tokensescrowed"></a>

###  tokensEscrowed

**● tokensEscrowed**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:213](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L213)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:200](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L200)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:195](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L195)*

___


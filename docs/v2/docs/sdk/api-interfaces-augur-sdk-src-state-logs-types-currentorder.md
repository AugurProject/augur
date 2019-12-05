---
id: api-interfaces-augur-sdk-src-state-logs-types-currentorder
title: CurrentOrder
sidebar_label: CurrentOrder
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [CurrentOrder](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md)

## Interface

## Hierarchy

↳  [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)

**↳ CurrentOrder**

### Properties

* [amount](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#amount)
* [amountFilled](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#amountfilled)
* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#blocknumber)
* [eventType](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#eventtype)
* [fees](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#fees)
* [kycToken](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#kyctoken)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#market)
* [open](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#open)
* [orderCreator](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#ordercreator)
* [orderFiller](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#orderfiller)
* [orderId](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#orderid)
* [orderType](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#ordertype)
* [outcome](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#outcome)
* [price](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#price)
* [sharesEscrowed](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#sharesescrowed)
* [sharesRefund](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#sharesrefund)
* [timestamp](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#timestamp)
* [tokenRefund](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#tokenrefund)
* [tokensEscrowed](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#tokensescrowed)
* [tradeGroupId](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#tradegroupid)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md#universe)

---

## Properties

<a id="amount"></a>

###  amount

**● amount**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[amount](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#amount)*

*Defined in [augur-sdk/src/state/logs/types.ts:228](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L228)*

___
<a id="amountfilled"></a>

###  amountFilled

**● amountFilled**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[amountFilled](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#amountfilled)*

*Defined in [augur-sdk/src/state/logs/types.ts:233](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L233)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L21)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="eventtype"></a>

###  eventType

**● eventType**: *[OrderEventType](api-enums-augur-sdk-src-state-logs-types-ordereventtype.md)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[eventType](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#eventtype)*

*Defined in [augur-sdk/src/state/logs/types.ts:220](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L220)*

___
<a id="fees"></a>

###  fees

**● fees**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[fees](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#fees)*

*Defined in [augur-sdk/src/state/logs/types.ts:232](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L232)*

___
<a id="kyctoken"></a>

###  kycToken

**● kycToken**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[kycToken](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#kyctoken)*

*Defined in [augur-sdk/src/state/logs/types.ts:224](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L224)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L24)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[market](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#market)*

*Defined in [augur-sdk/src/state/logs/types.ts:219](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L219)*

___
<a id="open"></a>

###  open

**● open**: *`number`*

*Defined in [augur-sdk/src/state/logs/types.ts:240](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L240)*

___
<a id="ordercreator"></a>

###  orderCreator

**● orderCreator**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[orderCreator](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#ordercreator)*

*Defined in [augur-sdk/src/state/logs/types.ts:225](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L225)*

___
<a id="orderfiller"></a>

###  orderFiller

**● orderFiller**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[orderFiller](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#orderfiller)*

*Defined in [augur-sdk/src/state/logs/types.ts:226](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L226)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[orderId](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#orderid)*

*Defined in [augur-sdk/src/state/logs/types.ts:222](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L222)*

___
<a id="ordertype"></a>

###  orderType

**● orderType**: *[OrderType](api-enums-augur-sdk-src-state-logs-types-ordertype.md)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[orderType](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#ordertype)*

*Defined in [augur-sdk/src/state/logs/types.ts:221](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L221)*

___
<a id="outcome"></a>

###  outcome

**● outcome**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[outcome](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#outcome)*

*Defined in [augur-sdk/src/state/logs/types.ts:229](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L229)*

___
<a id="price"></a>

###  price

**● price**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[price](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#price)*

*Defined in [augur-sdk/src/state/logs/types.ts:227](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L227)*

___
<a id="sharesescrowed"></a>

###  sharesEscrowed

**● sharesEscrowed**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[sharesEscrowed](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#sharesescrowed)*

*Defined in [augur-sdk/src/state/logs/types.ts:235](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L235)*

___
<a id="sharesrefund"></a>

###  sharesRefund

**● sharesRefund**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[sharesRefund](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#sharesrefund)*

*Defined in [augur-sdk/src/state/logs/types.ts:231](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L231)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[timestamp](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#timestamp)*

*Overrides [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [augur-sdk/src/state/logs/types.ts:234](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L234)*

___
<a id="tokenrefund"></a>

###  tokenRefund

**● tokenRefund**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[tokenRefund](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#tokenrefund)*

*Defined in [augur-sdk/src/state/logs/types.ts:230](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L230)*

___
<a id="tokensescrowed"></a>

###  tokensEscrowed

**● tokensEscrowed**: *`string`*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[tokensEscrowed](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#tokensescrowed)*

*Defined in [augur-sdk/src/state/logs/types.ts:236](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L236)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[tradeGroupId](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#tradegroupid)*

*Defined in [augur-sdk/src/state/logs/types.ts:223](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L223)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L23)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L22)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Inherited from [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md).[universe](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md#universe)*

*Defined in [augur-sdk/src/state/logs/types.ts:218](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L218)*

___


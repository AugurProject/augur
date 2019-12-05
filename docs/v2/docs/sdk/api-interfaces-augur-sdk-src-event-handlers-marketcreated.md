---
id: api-interfaces-augur-sdk-src-event-handlers-marketcreated
title: MarketCreated
sidebar_label: MarketCreated
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md) > [MarketCreated](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md)

## Interface

## Hierarchy

↳  [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md)

**↳ MarketCreated**

### Properties

* [address](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#address)
* [blockHash](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#blocknumber)
* [contractName](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#contractname)
* [designatedReporter](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#designatedreporter)
* [endTime](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#endtime)
* [eventName](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#eventname)
* [extraInfo](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#extrainfo)
* [feePerCashInAttoCash](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#feepercashinattocash)
* [logIndex](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#logindex)
* [market](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#market)
* [marketCreator](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#marketcreator)
* [marketType](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#markettype)
* [numTicks](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#numticks)
* [outcomes](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#outcomes)
* [prices](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#prices)
* [removed](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#removed)
* [timestamp](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#timestamp)
* [topic](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#topic)
* [transactionHash](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-event-handlers-marketcreated.md#universe)

---

## Properties

<a id="address"></a>

###  address

**● address**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[address](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L16)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[blockHash](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#blockhash)*

*Defined in [augur-sdk/src/event-handlers.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L22)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[blockNumber](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#blocknumber)*

*Defined in [augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L17)*

___
<a id="contractname"></a>

###  contractName

**● contractName**: *`string`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[contractName](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#contractname)*

*Defined in [augur-sdk/src/event-handlers.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L21)*

___
<a id="designatedreporter"></a>

###  designatedReporter

**● designatedReporter**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:126](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L126)*

___
<a id="endtime"></a>

###  endTime

**● endTime**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:121](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L121)*

___
<a id="eventname"></a>

###  eventName

**● eventName**: *`string`*

*Inherited from [Event](api-interfaces-augur-sdk-src-event-handlers-event.md).[eventName](api-interfaces-augur-sdk-src-event-handlers-event.md#eventname)*

*Defined in [augur-sdk/src/event-handlers.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L8)*

___
<a id="extrainfo"></a>

###  extraInfo

**● extraInfo**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:123](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L123)*

___
<a id="feepercashinattocash"></a>

###  feePerCashInAttoCash

**● feePerCashInAttoCash**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:127](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L127)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[logIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)*

*Defined in [augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L18)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:124](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L124)*

___
<a id="marketcreator"></a>

###  marketCreator

**● marketCreator**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:125](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L125)*

___
<a id="markettype"></a>

###  marketType

**● marketType**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:129](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L129)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:130](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L130)*

___
<a id="outcomes"></a>

###  outcomes

**● outcomes**: *`string`[]*

*Defined in [augur-sdk/src/event-handlers.ts:131](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L131)*

___
<a id="prices"></a>

###  prices

**● prices**: *`string`[]*

*Defined in [augur-sdk/src/event-handlers.ts:128](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L128)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[removed](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#removed)*

*Defined in [augur-sdk/src/event-handlers.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L23)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:132](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L132)*

___
<a id="topic"></a>

###  topic

**● topic**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:122](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L122)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[transactionHash](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#transactionhash)*

*Defined in [augur-sdk/src/event-handlers.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[transactionIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#transactionindex)*

*Defined in [augur-sdk/src/event-handlers.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L20)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:120](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L120)*

___


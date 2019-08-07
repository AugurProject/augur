---
id: api-classes-packages-augur-sdk-src-augur-augur
title: Augur
sidebar_label: Augur
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/Augur Module]](api-modules-packages-augur-sdk-src-augur-module.md) > [Augur](api-classes-packages-augur-sdk-src-augur-augur.md)

## Class

## Type parameters
#### TProvider :  [Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)
## Hierarchy

**Augur**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-augur-augur.md#constructor)

### Properties

* [addresses](api-classes-packages-augur-sdk-src-augur-augur.md#addresses)
* [contracts](api-classes-packages-augur-sdk-src-augur-augur.md#contracts)
* [dependencies](api-classes-packages-augur-sdk-src-augur-augur.md#dependencies)
* [events](api-classes-packages-augur-sdk-src-augur-augur.md#events)
* [genericEventNames](api-classes-packages-augur-sdk-src-augur-augur.md#genericeventnames)
* [getAccountTransactionHistory](api-classes-packages-augur-sdk-src-augur-augur.md#getaccounttransactionhistory)
* [getAllOrders](api-classes-packages-augur-sdk-src-augur-augur.md#getallorders)
* [getMarketOrderBook](api-classes-packages-augur-sdk-src-augur-augur.md#getmarketorderbook)
* [getMarketPriceCandlesticks](api-classes-packages-augur-sdk-src-augur-augur.md#getmarketpricecandlesticks)
* [getMarketsInfo](api-classes-packages-augur-sdk-src-augur-augur.md#getmarketsinfo)
* [getProfitLoss](api-classes-packages-augur-sdk-src-augur-augur.md#getprofitloss)
* [getProfitLossSummary](api-classes-packages-augur-sdk-src-augur-augur.md#getprofitlosssummary)
* [getTradingHistory](api-classes-packages-augur-sdk-src-augur-augur.md#gettradinghistory)
* [getTradingOrders](api-classes-packages-augur-sdk-src-augur-augur.md#gettradingorders)
* [getUserTradingPositions](api-classes-packages-augur-sdk-src-augur-augur.md#getusertradingpositions)
* [liquidity](api-classes-packages-augur-sdk-src-augur-augur.md#liquidity)
* [market](api-classes-packages-augur-sdk-src-augur-augur.md#market)
* [networkId](api-classes-packages-augur-sdk-src-augur-augur.md#networkid)
* [provider](api-classes-packages-augur-sdk-src-augur-augur.md#provider)
* [trade](api-classes-packages-augur-sdk-src-augur-augur.md#trade)
* [txAwaitingSigningCallback](api-classes-packages-augur-sdk-src-augur-augur.md#txawaitingsigningcallback)
* [txFailureCallback](api-classes-packages-augur-sdk-src-augur-augur.md#txfailurecallback)
* [txPendingCallback](api-classes-packages-augur-sdk-src-augur-augur.md#txpendingcallback)
* [txSuccessCallback](api-classes-packages-augur-sdk-src-augur-augur.md#txsuccesscallback)
* [connector](api-classes-packages-augur-sdk-src-augur-augur.md#connector)

### Methods

* [bindTo](api-classes-packages-augur-sdk-src-augur-augur.md#bindto)
* [connect](api-classes-packages-augur-sdk-src-augur-augur.md#connect)
* [createCategoricalMarket](api-classes-packages-augur-sdk-src-augur-augur.md#createcategoricalmarket)
* [createScalarMarket](api-classes-packages-augur-sdk-src-augur-augur.md#createscalarmarket)
* [createYesNoMarket](api-classes-packages-augur-sdk-src-augur-augur.md#createyesnomarket)
* [deRegisterAllTransactionStatusCallbacks](api-classes-packages-augur-sdk-src-augur-augur.md#deregisteralltransactionstatuscallbacks)
* [deRegisterTransactionStatusCallback](api-classes-packages-augur-sdk-src-augur-augur.md#deregistertransactionstatuscallback)
* [disconnect](api-classes-packages-augur-sdk-src-augur-augur.md#disconnect)
* [getAccount](api-classes-packages-augur-sdk-src-augur-augur.md#getaccount)
* [getEthBalance](api-classes-packages-augur-sdk-src-augur-augur.md#getethbalance)
* [getGasPrice](api-classes-packages-augur-sdk-src-augur-augur.md#getgasprice)
* [getMarket](api-classes-packages-augur-sdk-src-augur-augur.md#getmarket)
* [getMarkets](api-classes-packages-augur-sdk-src-augur-augur.md#getmarkets)
* [getOrders](api-classes-packages-augur-sdk-src-augur-augur.md#getorders)
* [getSyncData](api-classes-packages-augur-sdk-src-augur-augur.md#getsyncdata)
* [getTimestamp](api-classes-packages-augur-sdk-src-augur-augur.md#gettimestamp)
* [getTransaction](api-classes-packages-augur-sdk-src-augur-augur.md#gettransaction)
* [getUniverse](api-classes-packages-augur-sdk-src-augur-augur.md#getuniverse)
* [listAccounts](api-classes-packages-augur-sdk-src-augur-augur.md#listaccounts)
* [off](api-classes-packages-augur-sdk-src-augur-augur.md#off)
* [on](api-classes-packages-augur-sdk-src-augur-augur.md#on)
* [placeTrade](api-classes-packages-augur-sdk-src-augur-augur.md#placetrade)
* [registerTransactionStatusCallback](api-classes-packages-augur-sdk-src-augur-augur.md#registertransactionstatuscallback)
* [registerTransactionStatusEvents](api-classes-packages-augur-sdk-src-augur-augur.md#registertransactionstatusevents)
* [simulateTrade](api-classes-packages-augur-sdk-src-augur-augur.md#simulatetrade)
* [simulateTradeGasLimit](api-classes-packages-augur-sdk-src-augur-augur.md#simulatetradegaslimit)
* [create](api-classes-packages-augur-sdk-src-augur-augur.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Augur**(provider: *`TProvider`*, dependencies: *`ContractDependenciesEthers`*, networkId: *`NetworkId`*, addresses: *`ContractAddresses`*, connector?: *[BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md)*): [Augur](api-classes-packages-augur-sdk-src-augur-augur.md)

*Defined in [packages/augur-sdk/src/Augur.ts:67](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L67)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesEthers` | - |
| networkId | `NetworkId` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md) |  new EmptyConnector() |

**Returns:** [Augur](api-classes-packages-augur-sdk-src-augur-augur.md)

___

## Properties

<a id="addresses"></a>

###  addresses

**● addresses**: *`ContractAddresses`*

*Defined in [packages/augur-sdk/src/Augur.ts:29](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L29)*

___
<a id="contracts"></a>

###  contracts

**● contracts**: *[Contracts](api-classes-packages-augur-sdk-src-api-contracts-contracts.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:30](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L30)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesEthers`*

*Defined in [packages/augur-sdk/src/Augur.ts:25](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L25)*

___
<a id="events"></a>

###  events

**● events**: *[Events](api-classes-packages-augur-sdk-src-api-events-events.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:28](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L28)*

___
<a id="genericeventnames"></a>

###  genericEventNames

**● genericEventNames**: *`string`[]* =  [
    "CompleteSetsPurchased",
    "CompleteSetsSold",
    "DisputeCrowdsourcerCompleted",
    "DisputeCrowdsourcerContribution",
    "DisputeCrowdsourcerCreated",
    "DisputeCrowdsourcerRedeemed",
    "DisputeWindowCreated",
    "InitialReporterRedeemed",
    "InitialReportSubmitted",
    "InitialReporterTransferred",
    "MarketCreated",
    "MarketFinalized",
    "MarketMigrated",
    "MarketParticipantsDisavowed",
    "MarketTransferred",
    "MarketVolumeChanged",
    "MarketOIChanged",
    "OrderEvent",
    "ParticipationTokensRedeemed",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "TradingProceedsClaimed",
    "UniverseCreated",
    "UniverseForked",
  ]

*Defined in [packages/augur-sdk/src/Augur.ts:42](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L42)*

___
<a id="getaccounttransactionhistory"></a>

###  getAccountTransactionHistory

**● getAccountTransactionHistory**: *`function`* =  this.bindTo(Accounts.getAccountTransactionHistory)

*Defined in [packages/augur-sdk/src/Augur.ts:224](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L224)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getallorders"></a>

###  getAllOrders

**● getAllOrders**: *`function`* =  this.bindTo(Trading.getAllOrders)

*Defined in [packages/augur-sdk/src/Augur.ts:215](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L215)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getmarketorderbook"></a>

###  getMarketOrderBook

**● getMarketOrderBook**: *`function`* =  this.bindTo(Markets.getMarketOrderBook)

*Defined in [packages/augur-sdk/src/Augur.ts:217](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L217)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getmarketpricecandlesticks"></a>

###  getMarketPriceCandlesticks

**● getMarketPriceCandlesticks**: *`function`* =  this.bindTo(Markets.getMarketPriceCandlesticks)

*Defined in [packages/augur-sdk/src/Augur.ts:219](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L219)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getmarketsinfo"></a>

###  getMarketsInfo

**● getMarketsInfo**: *`function`* =  this.bindTo(Markets.getMarketsInfo)

*Defined in [packages/augur-sdk/src/Augur.ts:209](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L209)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getprofitloss"></a>

###  getProfitLoss

**● getProfitLoss**: *`function`* =  this.bindTo(Users.getProfitLoss)

*Defined in [packages/augur-sdk/src/Augur.ts:222](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L222)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getprofitlosssummary"></a>

###  getProfitLossSummary

**● getProfitLossSummary**: *`function`* =  this.bindTo(Users.getProfitLossSummary)

*Defined in [packages/augur-sdk/src/Augur.ts:223](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L223)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="gettradinghistory"></a>

###  getTradingHistory

**● getTradingHistory**: *`function`* =  this.bindTo(Trading.getTradingHistory)

*Defined in [packages/augur-sdk/src/Augur.ts:214](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L214)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="gettradingorders"></a>

###  getTradingOrders

**● getTradingOrders**: *`function`* =  this.bindTo(Trading.getOrders)

*Defined in [packages/augur-sdk/src/Augur.ts:216](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L216)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getusertradingpositions"></a>

###  getUserTradingPositions

**● getUserTradingPositions**: *`function`* =  this.bindTo(Users.getUserTradingPositions)

*Defined in [packages/augur-sdk/src/Augur.ts:221](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L221)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="liquidity"></a>

###  liquidity

**● liquidity**: *[Liquidity](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:34](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L34)*

___
<a id="market"></a>

###  market

**● market**: *[Market](api-classes-packages-augur-sdk-src-api-market-market.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:32](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L32)*

___
<a id="networkid"></a>

###  networkId

**● networkId**: *`NetworkId`*

*Defined in [packages/augur-sdk/src/Augur.ts:27](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L27)*

___
<a id="provider"></a>

###  provider

**● provider**: *`TProvider`*

*Defined in [packages/augur-sdk/src/Augur.ts:24](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L24)*

___
<a id="trade"></a>

###  trade

**● trade**: *[Trade](api-classes-packages-augur-sdk-src-api-trade-trade.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:31](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L31)*

___
<a id="txawaitingsigningcallback"></a>

### `<Private>` txAwaitingSigningCallback

**● txAwaitingSigningCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:37](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L37)*

___
<a id="txfailurecallback"></a>

### `<Private>` txFailureCallback

**● txFailureCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:39](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L39)*

___
<a id="txpendingcallback"></a>

### `<Private>` txPendingCallback

**● txPendingCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:38](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L38)*

___
<a id="txsuccesscallback"></a>

### `<Private>` txSuccessCallback

**● txSuccessCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:36](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L36)*

___
<a id="connector"></a>

### `<Static>` connector

**● connector**: *[BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:33](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L33)*

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [packages/augur-sdk/src/Augur.ts:163](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L163)*

**Type parameters:**

#### R 
#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| f | `function` |

**Returns:** `function`

___
<a id="connect"></a>

###  connect

▸ **connect**(ethNodeUrl: *`string`*, account?: *`string`*): `Promise`<`any`>

*Defined in [packages/augur-sdk/src/Augur.ts:155](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L155)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ethNodeUrl | `string` |
| `Optional` account | `string` |

**Returns:** `Promise`<`any`>

___
<a id="createcategoricalmarket"></a>

###  createCategoricalMarket

▸ **createCategoricalMarket**(params: *[CreateCategoricalMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createcategoricalmarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/Augur.ts:238](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L238)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateCategoricalMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createcategoricalmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createscalarmarket"></a>

###  createScalarMarket

▸ **createScalarMarket**(params: *[CreateScalarMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createscalarmarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/Augur.ts:242](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L242)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateScalarMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createscalarmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createyesnomarket"></a>

###  createYesNoMarket

▸ **createYesNoMarket**(params: *[CreateYesNoMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createyesnomarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/Augur.ts:234](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L234)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateYesNoMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createyesnomarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="deregisteralltransactionstatuscallbacks"></a>

###  deRegisterAllTransactionStatusCallbacks

▸ **deRegisterAllTransactionStatusCallbacks**(): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:151](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L151)*

**Returns:** `void`

___
<a id="deregistertransactionstatuscallback"></a>

###  deRegisterTransactionStatusCallback

▸ **deRegisterTransactionStatusCallback**(key: *`string`*): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:147](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L147)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `void`

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Defined in [packages/augur-sdk/src/Augur.ts:159](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L159)*

**Returns:** `Promise`<`any`>

___
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(): `Promise`<`string` \| `null`>

*Defined in [packages/augur-sdk/src/Augur.ts:125](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L125)*

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getethbalance"></a>

###  getEthBalance

▸ **getEthBalance**(address: *`string`*): `Promise`<`string`>

*Defined in [packages/augur-sdk/src/Augur.ts:115](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L115)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Promise`<`string`>

___
<a id="getgasprice"></a>

###  getGasPrice

▸ **getGasPrice**(): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/Augur.ts:120](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L120)*

**Returns:** `Promise`<`BigNumber`>

___
<a id="getmarket"></a>

###  getMarket

▸ **getMarket**(address: *`string`*): `Market`

*Defined in [packages/augur-sdk/src/Augur.ts:135](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L135)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Market`

___
<a id="getmarkets"></a>

###  getMarkets

▸ **getMarkets**(params: *`object`*): `Promise`<`string`[]>

*Defined in [packages/augur-sdk/src/Augur.ts:203](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L203)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `Promise`<`string`[]>

___
<a id="getorders"></a>

###  getOrders

▸ **getOrders**(): `Orders`

*Defined in [packages/augur-sdk/src/Augur.ts:139](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L139)*

**Returns:** `Orders`

___
<a id="getsyncdata"></a>

###  getSyncData

▸ **getSyncData**(): `Promise`<[SyncData](api-interfaces-packages-augur-sdk-src-state-getter-status-syncdata.md)>

*Defined in [packages/augur-sdk/src/Augur.ts:210](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L210)*

**Returns:** `Promise`<[SyncData](api-interfaces-packages-augur-sdk-src-state-getter-status-syncdata.md)>

___
<a id="gettimestamp"></a>

###  getTimestamp

▸ **getTimestamp**(): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/Augur.ts:111](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L111)*

**Returns:** `Promise`<`BigNumber`>

___
<a id="gettransaction"></a>

###  getTransaction

▸ **getTransaction**(hash: *`string`*): `Promise`<`string`>

*Defined in [packages/augur-sdk/src/Augur.ts:102](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L102)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `string` |

**Returns:** `Promise`<`string`>

___
<a id="getuniverse"></a>

###  getUniverse

▸ **getUniverse**(address: *`string`*): `Universe`

*Defined in [packages/augur-sdk/src/Augur.ts:131](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L131)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Universe`

___
<a id="listaccounts"></a>

###  listAccounts

▸ **listAccounts**(): `Promise`<`string`[]>

*Defined in [packages/augur-sdk/src/Augur.ts:107](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L107)*

**Returns:** `Promise`<`string`[]>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md) \| `string`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/Augur.ts:185](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L185)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md) \| `string`*, callback: *[Callback](api-modules-packages-augur-sdk-src-events-module.md#callback) \| [TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/Augur.ts:167](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L167)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md) \| `string` |
| callback | [Callback](api-modules-packages-augur-sdk-src-events-module.md#callback) \| [TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback) |

**Returns:** `Promise`<`void`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/Augur.ts:230](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L230)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="registertransactionstatuscallback"></a>

###  registerTransactionStatusCallback

▸ **registerTransactionStatusCallback**(key: *`string`*, callback: *`TransactionStatusCallback`*): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:143](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L143)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| callback | `TransactionStatusCallback` |

**Returns:** `void`

___
<a id="registertransactionstatusevents"></a>

### `<Private>` registerTransactionStatusEvents

▸ **registerTransactionStatusEvents**(): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:250](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L250)*

**Returns:** `void`

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<[SimulateTradeData](api-interfaces-packages-augur-sdk-src-api-trade-simulatetradedata.md)>

*Defined in [packages/augur-sdk/src/Augur.ts:226](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L226)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<[SimulateTradeData](api-interfaces-packages-augur-sdk-src-api-trade-simulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/Augur.ts:246](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L246)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="create"></a>

### `<Static>` create

▸ **create**<`TProvider`>(provider: *`TProvider`*, dependencies: *`ContractDependenciesEthers`*, addresses: *`ContractAddresses`*, connector?: *[BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md)*): `Promise`<[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)>

*Defined in [packages/augur-sdk/src/Augur.ts:88](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/Augur.ts#L88)*

**Type parameters:**

#### TProvider :  [Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesEthers` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md) |  new EmptyConnector() |

**Returns:** `Promise`<[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)>

___


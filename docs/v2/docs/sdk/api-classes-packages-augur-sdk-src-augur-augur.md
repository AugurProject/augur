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
* [gnosis](api-classes-packages-augur-sdk-src-augur-augur.md#gnosis)
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
* [sendETH](api-classes-packages-augur-sdk-src-augur-augur.md#sendeth)
* [setGnosisSafeAddress](api-classes-packages-augur-sdk-src-augur-augur.md#setgnosissafeaddress)
* [setUseGnosisRelay](api-classes-packages-augur-sdk-src-augur-augur.md#setusegnosisrelay)
* [setUseGnosisSafe](api-classes-packages-augur-sdk-src-augur-augur.md#setusegnosissafe)
* [simulateTrade](api-classes-packages-augur-sdk-src-augur-augur.md#simulatetrade)
* [simulateTradeGasLimit](api-classes-packages-augur-sdk-src-augur-augur.md#simulatetradegaslimit)
* [create](api-classes-packages-augur-sdk-src-augur-augur.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Augur**(provider: *`TProvider`*, dependencies: *`ContractDependenciesGnosis`*, networkId: *`NetworkId`*, addresses: *`ContractAddresses`*, connector?: *[BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md)*, gnosisRelay?: *`IGnosisRelayAPI`*): [Augur](api-classes-packages-augur-sdk-src-augur-augur.md)

*Defined in [packages/augur-sdk/src/Augur.ts:72](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L72)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesGnosis` | - |
| networkId | `NetworkId` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md) |  new EmptyConnector() |
| `Default value` gnosisRelay | `IGnosisRelayAPI` |  undefined |

**Returns:** [Augur](api-classes-packages-augur-sdk-src-augur-augur.md)

___

## Properties

<a id="addresses"></a>

###  addresses

**● addresses**: *`ContractAddresses`*

*Defined in [packages/augur-sdk/src/Augur.ts:33](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L33)*

___
<a id="contracts"></a>

###  contracts

**● contracts**: *[Contracts](api-classes-packages-augur-sdk-src-api-contracts-contracts.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:34](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L34)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesGnosis`*

*Defined in [packages/augur-sdk/src/Augur.ts:29](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L29)*

___
<a id="events"></a>

###  events

**● events**: *[Events](api-classes-packages-augur-sdk-src-api-events-events.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:32](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L32)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:47](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L47)*

___
<a id="getaccounttransactionhistory"></a>

###  getAccountTransactionHistory

**● getAccountTransactionHistory**: *`function`* =  this.bindTo(Accounts.getAccountTransactionHistory)

*Defined in [packages/augur-sdk/src/Augur.ts:257](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L257)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:248](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L248)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:250](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L250)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:252](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L252)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:242](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L242)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:255](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L255)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:256](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L256)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:247](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L247)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:249](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L249)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:254](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L254)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="gnosis"></a>

###  gnosis

**● gnosis**: *[Gnosis](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:37](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L37)*

___
<a id="liquidity"></a>

###  liquidity

**● liquidity**: *[Liquidity](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:39](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L39)*

___
<a id="market"></a>

###  market

**● market**: *[Market](api-classes-packages-augur-sdk-src-api-market-market.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:36](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L36)*

___
<a id="networkid"></a>

###  networkId

**● networkId**: *`NetworkId`*

*Defined in [packages/augur-sdk/src/Augur.ts:31](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L31)*

___
<a id="provider"></a>

###  provider

**● provider**: *`TProvider`*

*Defined in [packages/augur-sdk/src/Augur.ts:28](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L28)*

___
<a id="trade"></a>

###  trade

**● trade**: *[Trade](api-classes-packages-augur-sdk-src-api-trade-trade.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:35](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L35)*

___
<a id="txawaitingsigningcallback"></a>

### `<Private>` txAwaitingSigningCallback

**● txAwaitingSigningCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:42](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L42)*

___
<a id="txfailurecallback"></a>

### `<Private>` txFailureCallback

**● txFailureCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:44](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L44)*

___
<a id="txpendingcallback"></a>

### `<Private>` txPendingCallback

**● txPendingCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:43](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L43)*

___
<a id="txsuccesscallback"></a>

### `<Private>` txSuccessCallback

**● txSuccessCallback**: *[TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:41](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L41)*

___
<a id="connector"></a>

### `<Static>` connector

**● connector**: *[BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:38](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L38)*

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [packages/augur-sdk/src/Augur.ts:196](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L196)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:188](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L188)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:271](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L271)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateCategoricalMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createcategoricalmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createscalarmarket"></a>

###  createScalarMarket

▸ **createScalarMarket**(params: *[CreateScalarMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createscalarmarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/Augur.ts:275](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L275)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateScalarMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createscalarmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createyesnomarket"></a>

###  createYesNoMarket

▸ **createYesNoMarket**(params: *[CreateYesNoMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createyesnomarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/Augur.ts:267](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L267)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateYesNoMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createyesnomarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="deregisteralltransactionstatuscallbacks"></a>

###  deRegisterAllTransactionStatusCallbacks

▸ **deRegisterAllTransactionStatusCallbacks**(): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:184](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L184)*

**Returns:** `void`

___
<a id="deregistertransactionstatuscallback"></a>

###  deRegisterTransactionStatusCallback

▸ **deRegisterTransactionStatusCallback**(key: *`string`*): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:180](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L180)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `void`

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Defined in [packages/augur-sdk/src/Augur.ts:192](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L192)*

**Returns:** `Promise`<`any`>

___
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(): `Promise`<`string` \| `null`>

*Defined in [packages/augur-sdk/src/Augur.ts:131](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L131)*

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getethbalance"></a>

###  getEthBalance

▸ **getEthBalance**(address: *`string`*): `Promise`<`string`>

*Defined in [packages/augur-sdk/src/Augur.ts:121](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L121)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Promise`<`string`>

___
<a id="getgasprice"></a>

###  getGasPrice

▸ **getGasPrice**(): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/Augur.ts:126](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L126)*

**Returns:** `Promise`<`BigNumber`>

___
<a id="getmarket"></a>

###  getMarket

▸ **getMarket**(address: *`string`*): `Market`

*Defined in [packages/augur-sdk/src/Augur.ts:168](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L168)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Market`

___
<a id="getmarkets"></a>

###  getMarkets

▸ **getMarkets**(params: *`object`*): `Promise`<[MarketList](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlist.md)>

*Defined in [packages/augur-sdk/src/Augur.ts:236](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L236)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `Promise`<[MarketList](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlist.md)>

___
<a id="getorders"></a>

###  getOrders

▸ **getOrders**(): `Orders`

*Defined in [packages/augur-sdk/src/Augur.ts:172](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L172)*

**Returns:** `Orders`

___
<a id="getsyncdata"></a>

###  getSyncData

▸ **getSyncData**(): `Promise`<[SyncData](api-interfaces-packages-augur-sdk-src-state-getter-status-syncdata.md)>

*Defined in [packages/augur-sdk/src/Augur.ts:243](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L243)*

**Returns:** `Promise`<[SyncData](api-interfaces-packages-augur-sdk-src-state-getter-status-syncdata.md)>

___
<a id="gettimestamp"></a>

###  getTimestamp

▸ **getTimestamp**(): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/Augur.ts:117](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L117)*

**Returns:** `Promise`<`BigNumber`>

___
<a id="gettransaction"></a>

###  getTransaction

▸ **getTransaction**(hash: *`string`*): `Promise`<`TransactionResponse`>

*Defined in [packages/augur-sdk/src/Augur.ts:108](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L108)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `string` |

**Returns:** `Promise`<`TransactionResponse`>

___
<a id="getuniverse"></a>

###  getUniverse

▸ **getUniverse**(address: *`string`*): `Universe`

*Defined in [packages/augur-sdk/src/Augur.ts:164](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L164)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Universe`

___
<a id="listaccounts"></a>

###  listAccounts

▸ **listAccounts**(): `Promise`<`string`[]>

*Defined in [packages/augur-sdk/src/Augur.ts:113](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L113)*

**Returns:** `Promise`<`string`[]>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md) \| `string`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/Augur.ts:218](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L218)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md) \| `string`*, callback: *[Callback](api-modules-packages-augur-sdk-src-events-module.md#callback) \| [TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/Augur.ts:200](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L200)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:263](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L263)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="registertransactionstatuscallback"></a>

###  registerTransactionStatusCallback

▸ **registerTransactionStatusCallback**(key: *`string`*, callback: *`TransactionStatusCallback`*): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:176](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L176)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:283](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L283)*

**Returns:** `void`

___
<a id="sendeth"></a>

###  sendETH

▸ **sendETH**(address: *`string`*, value: *`BigNumber`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/Augur.ts:142](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L142)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |
| value | `BigNumber` |

**Returns:** `Promise`<`void`>

___
<a id="setgnosissafeaddress"></a>

###  setGnosisSafeAddress

▸ **setGnosisSafeAddress**(safeAddress: *`string`*): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:152](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L152)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| safeAddress | `string` |

**Returns:** `void`

___
<a id="setusegnosisrelay"></a>

###  setUseGnosisRelay

▸ **setUseGnosisRelay**(useRelay: *`boolean`*): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:160](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L160)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| useRelay | `boolean` |

**Returns:** `void`

___
<a id="setusegnosissafe"></a>

###  setUseGnosisSafe

▸ **setUseGnosisSafe**(useSafe: *`boolean`*): `void`

*Defined in [packages/augur-sdk/src/Augur.ts:156](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L156)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| useSafe | `boolean` |

**Returns:** `void`

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<[SimulateTradeData](api-interfaces-packages-augur-sdk-src-api-trade-simulatetradedata.md)>

*Defined in [packages/augur-sdk/src/Augur.ts:259](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L259)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<[SimulateTradeData](api-interfaces-packages-augur-sdk-src-api-trade-simulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/Augur.ts:279](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L279)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="create"></a>

### `<Static>` create

▸ **create**<`TProvider`>(provider: *`TProvider`*, dependencies: *`ContractDependenciesGnosis`*, addresses: *`ContractAddresses`*, connector?: *[BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md)*, gnosisRelay?: *`IGnosisRelayAPI`*): `Promise`<[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)>

*Defined in [packages/augur-sdk/src/Augur.ts:94](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/Augur.ts#L94)*

**Type parameters:**

#### TProvider :  [Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesGnosis` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md) |  new EmptyConnector() |
| `Default value` gnosisRelay | `IGnosisRelayAPI` |  undefined |

**Returns:** `Promise`<[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)>

___


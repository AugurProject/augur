---
id: api-classes-augur-sdk-src-augur-augur
title: Augur
sidebar_label: Augur
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/Augur Module]](api-modules-augur-sdk-src-augur-module.md) > [Augur](api-classes-augur-sdk-src-augur-augur.md)

## Class

## Type parameters
#### TProvider :  [Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)
## Hierarchy

**Augur**

### Constructors

* [constructor](api-classes-augur-sdk-src-augur-augur.md#constructor)

### Properties

* [addresses](api-classes-augur-sdk-src-augur-augur.md#addresses)
* [connector](api-classes-augur-sdk-src-augur-augur.md#connector)
* [contracts](api-classes-augur-sdk-src-augur-augur.md#contracts)
* [dependencies](api-classes-augur-sdk-src-augur-augur.md#dependencies)
* [events](api-classes-augur-sdk-src-augur-augur.md#events)
* [gnosis](api-classes-augur-sdk-src-augur-augur.md#gnosis)
* [hotLoading](api-classes-augur-sdk-src-augur-augur.md#hotloading)
* [liquidity](api-classes-augur-sdk-src-augur-augur.md#liquidity)
* [market](api-classes-augur-sdk-src-augur-augur.md#market)
* [networkId](api-classes-augur-sdk-src-augur-augur.md#networkid)
* [onChainTrade](api-classes-augur-sdk-src-augur-augur.md#onchaintrade)
* [provider](api-classes-augur-sdk-src-augur-augur.md#provider)
* [subscriptions](api-classes-augur-sdk-src-augur-augur.md#subscriptions)
* [syncableFlexSearch](api-classes-augur-sdk-src-augur-augur.md#syncableflexsearch)
* [trade](api-classes-augur-sdk-src-augur-augur.md#trade)
* [txAwaitingSigningCallback](api-classes-augur-sdk-src-augur-augur.md#txawaitingsigningcallback)
* [txFailureCallback](api-classes-augur-sdk-src-augur-augur.md#txfailurecallback)
* [txPendingCallback](api-classes-augur-sdk-src-augur-augur.md#txpendingcallback)
* [txSuccessCallback](api-classes-augur-sdk-src-augur-augur.md#txsuccesscallback)
* [universe](api-classes-augur-sdk-src-augur-augur.md#universe)
* [zeroX](api-classes-augur-sdk-src-augur-augur.md#zerox)

### Accessors

* [signer](api-classes-augur-sdk-src-augur-augur.md#signer)

### Methods

* [bindTo](api-classes-augur-sdk-src-augur-augur.md#bindto)
* [checkSafe](api-classes-augur-sdk-src-augur-augur.md#checksafe)
* [connect](api-classes-augur-sdk-src-augur-augur.md#connect)
* [createCategoricalMarket](api-classes-augur-sdk-src-augur-augur.md#createcategoricalmarket)
* [createScalarMarket](api-classes-augur-sdk-src-augur-augur.md#createscalarmarket)
* [createYesNoMarket](api-classes-augur-sdk-src-augur-augur.md#createyesnomarket)
* [deRegisterAllTransactionStatusCallbacks](api-classes-augur-sdk-src-augur-augur.md#deregisteralltransactionstatuscallbacks)
* [deRegisterTransactionStatusCallback](api-classes-augur-sdk-src-augur-augur.md#deregistertransactionstatuscallback)
* [disconnect](api-classes-augur-sdk-src-augur-augur.md#disconnect)
* [getAccount](api-classes-augur-sdk-src-augur-augur.md#getaccount)
* [getAccountRepStakeSummary](api-classes-augur-sdk-src-augur-augur.md#getaccountrepstakesummary)
* [getAccountTimeRangedStats](api-classes-augur-sdk-src-augur-augur.md#getaccounttimerangedstats)
* [getAccountTransactionHistory](api-classes-augur-sdk-src-augur-augur.md#getaccounttransactionhistory)
* [getAllOrders](api-classes-augur-sdk-src-augur-augur.md#getallorders)
* [getAugurEventEmitter](api-classes-augur-sdk-src-augur-augur.md#getaugureventemitter)
* [getCategoryStats](api-classes-augur-sdk-src-augur-augur.md#getcategorystats)
* [getDisputeWindow](api-classes-augur-sdk-src-augur-augur.md#getdisputewindow)
* [getEthBalance](api-classes-augur-sdk-src-augur-augur.md#getethbalance)
* [getGasPrice](api-classes-augur-sdk-src-augur-augur.md#getgasprice)
* [getGnosisStatus](api-classes-augur-sdk-src-augur-augur.md#getgnosisstatus)
* [getMarket](api-classes-augur-sdk-src-augur-augur.md#getmarket)
* [getMarketLiquidityRanking](api-classes-augur-sdk-src-augur-augur.md#getmarketliquidityranking)
* [getMarketOrderBook](api-classes-augur-sdk-src-augur-augur.md#getmarketorderbook)
* [getMarketPriceCandlesticks](api-classes-augur-sdk-src-augur-augur.md#getmarketpricecandlesticks)
* [getMarkets](api-classes-augur-sdk-src-augur-augur.md#getmarkets)
* [getMarketsInfo](api-classes-augur-sdk-src-augur-augur.md#getmarketsinfo)
* [getOrders](api-classes-augur-sdk-src-augur-augur.md#getorders)
* [getPlatformActivityStats](api-classes-augur-sdk-src-augur-augur.md#getplatformactivitystats)
* [getProfitLoss](api-classes-augur-sdk-src-augur-augur.md#getprofitloss)
* [getProfitLossSummary](api-classes-augur-sdk-src-augur-augur.md#getprofitlosssummary)
* [getSyncData](api-classes-augur-sdk-src-augur-augur.md#getsyncdata)
* [getTimestamp](api-classes-augur-sdk-src-augur-augur.md#gettimestamp)
* [getTradingHistory](api-classes-augur-sdk-src-augur-augur.md#gettradinghistory)
* [getTradingOrders](api-classes-augur-sdk-src-augur-augur.md#gettradingorders)
* [getTransaction](api-classes-augur-sdk-src-augur-augur.md#gettransaction)
* [getUniverse](api-classes-augur-sdk-src-augur-augur.md#getuniverse)
* [getUniverseChildren](api-classes-augur-sdk-src-augur-augur.md#getuniversechildren)
* [getUserAccountData](api-classes-augur-sdk-src-augur-augur.md#getuseraccountdata)
* [getUserCurrentDisputeStake](api-classes-augur-sdk-src-augur-augur.md#getusercurrentdisputestake)
* [getUserTradingPositions](api-classes-augur-sdk-src-augur-augur.md#getusertradingpositions)
* [getZeroXOrders](api-classes-augur-sdk-src-augur-augur.md#getzeroxorders)
* [hotloadMarket](api-classes-augur-sdk-src-augur-augur.md#hotloadmarket)
* [listAccounts](api-classes-augur-sdk-src-augur-augur.md#listaccounts)
* [off](api-classes-augur-sdk-src-augur-augur.md#off)
* [on](api-classes-augur-sdk-src-augur-augur.md#on)
* [placeTrade](api-classes-augur-sdk-src-augur-augur.md#placetrade)
* [registerTransactionStatusCallback](api-classes-augur-sdk-src-augur-augur.md#registertransactionstatuscallback)
* [registerTransactionStatusEvents](api-classes-augur-sdk-src-augur-augur.md#registertransactionstatusevents)
* [sendETH](api-classes-augur-sdk-src-augur-augur.md#sendeth)
* [setGasPrice](api-classes-augur-sdk-src-augur-augur.md#setgasprice)
* [setGnosisSafeAddress](api-classes-augur-sdk-src-augur-augur.md#setgnosissafeaddress)
* [setGnosisStatus](api-classes-augur-sdk-src-augur-augur.md#setgnosisstatus)
* [setUseGnosisRelay](api-classes-augur-sdk-src-augur-augur.md#setusegnosisrelay)
* [setUseGnosisSafe](api-classes-augur-sdk-src-augur-augur.md#setusegnosissafe)
* [signMessage](api-classes-augur-sdk-src-augur-augur.md#signmessage)
* [simulateTrade](api-classes-augur-sdk-src-augur-augur.md#simulatetrade)
* [simulateTradeGasLimit](api-classes-augur-sdk-src-augur-augur.md#simulatetradegaslimit)
* [updateGnosisSafe](api-classes-augur-sdk-src-augur-augur.md#updategnosissafe)
* [create](api-classes-augur-sdk-src-augur-augur.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Augur**(provider: *`TProvider`*, dependencies: *`ContractDependenciesGnosis`*, networkId: *`NetworkId`*, addresses: *`ContractAddresses`*, connector?: *[BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)*, gnosisRelay?: *`IGnosisRelayAPI`*, enableFlexSearch?: *`boolean`*, meshClient?: *`WSClient`*, browserMesh?: *[BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md)*): [Augur](api-classes-augur-sdk-src-augur-augur.md)

*Defined in [augur-sdk/src/Augur.ts:73](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L73)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesGnosis` | - |
| networkId | `NetworkId` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md) |  new EmptyConnector() |
| `Default value` gnosisRelay | `IGnosisRelayAPI` |  undefined |
| `Default value` enableFlexSearch | `boolean` | false |
| `Default value` meshClient | `WSClient` |  undefined |
| `Default value` browserMesh | [BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md) |  undefined |

**Returns:** [Augur](api-classes-augur-sdk-src-augur-augur.md)

___

## Properties

<a id="addresses"></a>

###  addresses

**● addresses**: *`ContractAddresses`*

*Defined in [augur-sdk/src/Augur.ts:55](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L55)*

___
<a id="connector"></a>

###  connector

**● connector**: *[BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)*

*Defined in [augur-sdk/src/Augur.ts:65](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L65)*

___
<a id="contracts"></a>

###  contracts

**● contracts**: *[Contracts](api-classes-augur-sdk-src-api-contracts-contracts.md)*

*Defined in [augur-sdk/src/Augur.ts:56](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L56)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesGnosis`*

*Defined in [augur-sdk/src/Augur.ts:51](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L51)*

___
<a id="events"></a>

###  events

**● events**: *[Events](api-classes-augur-sdk-src-api-events-events.md)*

*Defined in [augur-sdk/src/Augur.ts:54](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L54)*

___
<a id="gnosis"></a>

###  gnosis

**● gnosis**: *[Gnosis](api-classes-augur-sdk-src-api-gnosis-gnosis.md)*

*Defined in [augur-sdk/src/Augur.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L61)*

___
<a id="hotloading"></a>

###  hotLoading

**● hotLoading**: *[HotLoading](api-classes-augur-sdk-src-api-hotloading-hotloading.md)*

*Defined in [augur-sdk/src/Augur.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L67)*

___
<a id="liquidity"></a>

###  liquidity

**● liquidity**: *[Liquidity](api-classes-augur-sdk-src-api-liquidity-liquidity.md)*

*Defined in [augur-sdk/src/Augur.ts:66](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L66)*

___
<a id="market"></a>

###  market

**● market**: *[Market](api-classes-augur-sdk-src-api-market-market.md)*

*Defined in [augur-sdk/src/Augur.ts:60](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L60)*

___
<a id="networkid"></a>

###  networkId

**● networkId**: *`NetworkId`*

*Defined in [augur-sdk/src/Augur.ts:53](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L53)*

___
<a id="onchaintrade"></a>

###  onChainTrade

**● onChainTrade**: *[OnChainTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md)*

*Defined in [augur-sdk/src/Augur.ts:57](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L57)*

___
<a id="provider"></a>

###  provider

**● provider**: *`TProvider`*

*Defined in [augur-sdk/src/Augur.ts:50](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L50)*

___
<a id="subscriptions"></a>

###  subscriptions

**● subscriptions**: *[Subscriptions](api-classes-augur-sdk-src-subscriptions-subscriptions.md)*

*Defined in [augur-sdk/src/Augur.ts:68](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L68)*

___
<a id="syncableflexsearch"></a>

###  syncableFlexSearch

**● syncableFlexSearch**: *[SyncableFlexSearch](api-classes-augur-sdk-src-state-db-syncableflexsearch-syncableflexsearch.md)*

*Defined in [augur-sdk/src/Augur.ts:64](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L64)*

___
<a id="trade"></a>

###  trade

**● trade**: *[Trade](api-classes-augur-sdk-src-api-trade-trade.md)*

*Defined in [augur-sdk/src/Augur.ts:59](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L59)*

___
<a id="txawaitingsigningcallback"></a>

### `<Private>` txAwaitingSigningCallback

**● txAwaitingSigningCallback**: *[TXStatusCallback](api-modules-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [augur-sdk/src/Augur.ts:71](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L71)*

___
<a id="txfailurecallback"></a>

### `<Private>` txFailureCallback

**● txFailureCallback**: *[TXStatusCallback](api-modules-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [augur-sdk/src/Augur.ts:73](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L73)*

___
<a id="txpendingcallback"></a>

### `<Private>` txPendingCallback

**● txPendingCallback**: *[TXStatusCallback](api-modules-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [augur-sdk/src/Augur.ts:72](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L72)*

___
<a id="txsuccesscallback"></a>

### `<Private>` txSuccessCallback

**● txSuccessCallback**: *[TXStatusCallback](api-modules-augur-sdk-src-events-module.md#txstatuscallback)*

*Defined in [augur-sdk/src/Augur.ts:70](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L70)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Universe](api-classes-augur-sdk-src-state-getter-universe-universe.md)*

*Defined in [augur-sdk/src/Augur.ts:63](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L63)*

___
<a id="zerox"></a>

###  zeroX

**● zeroX**: *[ZeroX](api-classes-augur-sdk-src-api-zerox-zerox.md)*

*Defined in [augur-sdk/src/Augur.ts:58](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L58)*

___

## Accessors

<a id="signer"></a>

###  signer

**get signer**(): `EthersSigner`

**set signer**(signer: *`EthersSigner`*): `void`

*Defined in [augur-sdk/src/Augur.ts:326](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L326)*

**Returns:** `EthersSigner`

*Defined in [augur-sdk/src/Augur.ts:330](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L330)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| signer | `EthersSigner` |

**Returns:** `void`

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [augur-sdk/src/Augur.ts:265](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L265)*

**Type parameters:**

#### R 
#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| f | `function` |

**Returns:** `function`

___
<a id="checksafe"></a>

###  checkSafe

▸ **checkSafe**(owner: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*, safe: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*): `Promise`<`GnosisSafeStateReponse`>

*Defined in [augur-sdk/src/Augur.ts:220](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L220)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| owner | [Address](api-modules-augur-sdk-src-state-logs-types-module.md#address) |
| safe | [Address](api-modules-augur-sdk-src-state-logs-types-module.md#address) |

**Returns:** `Promise`<`GnosisSafeStateReponse`>

___
<a id="connect"></a>

###  connect

▸ **connect**(ethNodeUrl: *`string`*, account?: *`string`*): `Promise`<`any`>

*Defined in [augur-sdk/src/Augur.ts:257](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L257)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ethNodeUrl | `string` |
| `Optional` account | `string` |

**Returns:** `Promise`<`any`>

___
<a id="createcategoricalmarket"></a>

###  createCategoricalMarket

▸ **createCategoricalMarket**(params: *[CreateCategoricalMarketParams](api-interfaces-augur-sdk-src-api-market-createcategoricalmarketparams.md)*): `Promise`<`Market`>

*Defined in [augur-sdk/src/Augur.ts:451](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L451)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateCategoricalMarketParams](api-interfaces-augur-sdk-src-api-market-createcategoricalmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createscalarmarket"></a>

###  createScalarMarket

▸ **createScalarMarket**(params: *[CreateScalarMarketParams](api-interfaces-augur-sdk-src-api-market-createscalarmarketparams.md)*): `Promise`<`Market`>

*Defined in [augur-sdk/src/Augur.ts:457](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L457)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateScalarMarketParams](api-interfaces-augur-sdk-src-api-market-createscalarmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createyesnomarket"></a>

###  createYesNoMarket

▸ **createYesNoMarket**(params: *[CreateYesNoMarketParams](api-interfaces-augur-sdk-src-api-market-createyesnomarketparams.md)*): `Promise`<`Market`>

*Defined in [augur-sdk/src/Augur.ts:445](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L445)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateYesNoMarketParams](api-interfaces-augur-sdk-src-api-market-createyesnomarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="deregisteralltransactionstatuscallbacks"></a>

###  deRegisterAllTransactionStatusCallbacks

▸ **deRegisterAllTransactionStatusCallbacks**(): `void`

*Defined in [augur-sdk/src/Augur.ts:253](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L253)*

**Returns:** `void`

___
<a id="deregistertransactionstatuscallback"></a>

###  deRegisterTransactionStatusCallback

▸ **deRegisterTransactionStatusCallback**(key: *`string`*): `void`

*Defined in [augur-sdk/src/Augur.ts:249](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L249)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `void`

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Defined in [augur-sdk/src/Augur.ts:261](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L261)*

**Returns:** `Promise`<`any`>

___
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(): `Promise`<`string` \| `null`>

*Defined in [augur-sdk/src/Augur.ts:171](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L171)*

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getaccountrepstakesummary"></a>

###  getAccountRepStakeSummary

▸ **getAccountRepStakeSummary**(params: *`object`*): `ReturnType`<[getAccountRepStakeSummary](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccountrepstakesummary)>

*Defined in [augur-sdk/src/Augur.ts:400](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L400)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getAccountRepStakeSummary](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccountrepstakesummary)>

___
<a id="getaccounttimerangedstats"></a>

###  getAccountTimeRangedStats

▸ **getAccountTimeRangedStats**(params: *`object` & `object`*): `ReturnType`<[getAccountTimeRangedStats](api-classes-augur-sdk-src-state-getter-users-users.md#getaccounttimerangedstats)>

*Defined in [augur-sdk/src/Augur.ts:382](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L382)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` |

**Returns:** `ReturnType`<[getAccountTimeRangedStats](api-classes-augur-sdk-src-state-getter-users-users.md#getaccounttimerangedstats)>

___
<a id="getaccounttransactionhistory"></a>

###  getAccountTransactionHistory

▸ **getAccountTransactionHistory**(params: *`object` & `object`*): `ReturnType`<[getAccountTransactionHistory](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccounttransactionhistory)>

*Defined in [augur-sdk/src/Augur.ts:394](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L394)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` |

**Returns:** `ReturnType`<[getAccountTransactionHistory](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccounttransactionhistory)>

___
<a id="getallorders"></a>

###  getAllOrders

▸ **getAllOrders**(params: *`object`*): `ReturnType`<[getAllOrders](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getallorders)>

*Defined in [augur-sdk/src/Augur.ts:339](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L339)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getAllOrders](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getallorders)>

___
<a id="getaugureventemitter"></a>

###  getAugurEventEmitter

▸ **getAugurEventEmitter**(): [EventNameEmitter](api-classes-augur-sdk-src-events-eventnameemitter.md)

*Defined in [augur-sdk/src/Augur.ts:431](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L431)*

**Returns:** [EventNameEmitter](api-classes-augur-sdk-src-events-eventnameemitter.md)

___
<a id="getcategorystats"></a>

###  getCategoryStats

▸ **getCategoryStats**(params: *`object`*): `ReturnType`<[getCategoryStats](api-classes-augur-sdk-src-state-getter-markets-markets.md#getcategorystats)>

*Defined in [augur-sdk/src/Augur.ts:416](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L416)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getCategoryStats](api-classes-augur-sdk-src-state-getter-markets-markets.md#getcategorystats)>

___
<a id="getdisputewindow"></a>

###  getDisputeWindow

▸ **getDisputeWindow**(params: *[GetDisputeWindowParams](api-interfaces-augur-sdk-src-api-hotloading-getdisputewindowparams.md)*): `Promise`<[DisputeWindow](api-interfaces-augur-sdk-src-api-hotloading-disputewindow.md)>

*Defined in [augur-sdk/src/Augur.ts:426](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L426)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetDisputeWindowParams](api-interfaces-augur-sdk-src-api-hotloading-getdisputewindowparams.md) |

**Returns:** `Promise`<[DisputeWindow](api-interfaces-augur-sdk-src-api-hotloading-disputewindow.md)>

___
<a id="getethbalance"></a>

###  getEthBalance

▸ **getEthBalance**(address: *`string`*): `Promise`<`string`>

*Defined in [augur-sdk/src/Augur.ts:161](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L161)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Promise`<`string`>

___
<a id="getgasprice"></a>

###  getGasPrice

▸ **getGasPrice**(): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/Augur.ts:166](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L166)*

**Returns:** `Promise`<`BigNumber`>

___
<a id="getgnosisstatus"></a>

###  getGnosisStatus

▸ **getGnosisStatus**(): `GnosisSafeState`

*Defined in [augur-sdk/src/Augur.ts:208](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L208)*

**Returns:** `GnosisSafeState`

___
<a id="getmarket"></a>

###  getMarket

▸ **getMarket**(address: *`string`*): `Market`

*Defined in [augur-sdk/src/Augur.ts:231](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L231)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Market`

___
<a id="getmarketliquidityranking"></a>

###  getMarketLiquidityRanking

▸ **getMarketLiquidityRanking**(params: *`object`*): `ReturnType`<[getMarketLiquidityRanking](api-classes-augur-sdk-src-state-getter-liquidity-liquidity.md#getmarketliquidityranking)>

*Defined in [augur-sdk/src/Augur.ts:361](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L361)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getMarketLiquidityRanking](api-classes-augur-sdk-src-state-getter-liquidity-liquidity.md#getmarketliquidityranking)>

___
<a id="getmarketorderbook"></a>

###  getMarketOrderBook

▸ **getMarketOrderBook**(params: *`object` & `object`*): `ReturnType`<[getMarketOrderBook](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketorderbook)>

*Defined in [augur-sdk/src/Augur.ts:349](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L349)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` |

**Returns:** `ReturnType`<[getMarketOrderBook](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketorderbook)>

___
<a id="getmarketpricecandlesticks"></a>

###  getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(params: *`object`*): `ReturnType`<[getMarketPriceCandlesticks](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketpricecandlesticks)>

*Defined in [augur-sdk/src/Augur.ts:355](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L355)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getMarketPriceCandlesticks](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketpricecandlesticks)>

___
<a id="getmarkets"></a>

###  getMarkets

▸ **getMarkets**(params: *`object` & `object` & `object`*): `ReturnType`<[getMarkets](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarkets)>

*Defined in [augur-sdk/src/Augur.ts:304](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L304)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` & `object` |

**Returns:** `ReturnType`<[getMarkets](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarkets)>

___
<a id="getmarketsinfo"></a>

###  getMarketsInfo

▸ **getMarketsInfo**(params: *`object`*): `ReturnType`<[getMarketsInfo](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketsinfo)>

*Defined in [augur-sdk/src/Augur.ts:310](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L310)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getMarketsInfo](api-classes-augur-sdk-src-state-getter-markets-markets.md#getmarketsinfo)>

___
<a id="getorders"></a>

###  getOrders

▸ **getOrders**(): `Orders`

*Defined in [augur-sdk/src/Augur.ts:235](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L235)*

**Returns:** `Orders`

___
<a id="getplatformactivitystats"></a>

###  getPlatformActivityStats

▸ **getPlatformActivityStats**(params: *`object` & `object`*): `ReturnType`<[getPlatformActivityStats](api-classes-augur-sdk-src-state-getter-platform-platform.md#getplatformactivitystats)>

*Defined in [augur-sdk/src/Augur.ts:411](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L411)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` |

**Returns:** `ReturnType`<[getPlatformActivityStats](api-classes-augur-sdk-src-state-getter-platform-platform.md#getplatformactivitystats)>

___
<a id="getprofitloss"></a>

###  getProfitLoss

▸ **getProfitLoss**(params: *`object` & `object`*): `ReturnType`<[getProfitLoss](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitloss)>

*Defined in [augur-sdk/src/Augur.ts:372](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L372)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` |

**Returns:** `ReturnType`<[getProfitLoss](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitloss)>

___
<a id="getprofitlosssummary"></a>

###  getProfitLossSummary

▸ **getProfitLossSummary**(params: *`object`*): `ReturnType`<[getProfitLossSummary](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitlosssummary)>

*Defined in [augur-sdk/src/Augur.ts:377](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L377)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getProfitLossSummary](api-classes-augur-sdk-src-state-getter-users-users.md#getprofitlosssummary)>

___
<a id="getsyncdata"></a>

###  getSyncData

▸ **getSyncData**(): `Promise`<[SyncData](api-interfaces-augur-sdk-src-state-getter-status-syncdata.md)>

*Defined in [augur-sdk/src/Augur.ts:316](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L316)*

**Returns:** `Promise`<[SyncData](api-interfaces-augur-sdk-src-state-getter-status-syncdata.md)>

___
<a id="gettimestamp"></a>

###  getTimestamp

▸ **getTimestamp**(): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/Augur.ts:157](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L157)*

**Returns:** `Promise`<`BigNumber`>

___
<a id="gettradinghistory"></a>

###  getTradingHistory

▸ **getTradingHistory**(params: *`object` & `object`*): `ReturnType`<[getTradingHistory](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#gettradinghistory)>

*Defined in [augur-sdk/src/Augur.ts:334](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L334)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` |

**Returns:** `ReturnType`<[getTradingHistory](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#gettradinghistory)>

___
<a id="gettradingorders"></a>

###  getTradingOrders

▸ **getTradingOrders**(params: *`object` & `object`*): `ReturnType`<[getOrders](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getorders)>

*Defined in [augur-sdk/src/Augur.ts:344](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L344)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` |

**Returns:** `ReturnType`<[getOrders](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getorders)>

___
<a id="gettransaction"></a>

###  getTransaction

▸ **getTransaction**(hash: *`string`*): `Promise`<`TransactionResponse`>

*Defined in [augur-sdk/src/Augur.ts:144](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L144)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `string` |

**Returns:** `Promise`<`TransactionResponse`>

___
<a id="getuniverse"></a>

###  getUniverse

▸ **getUniverse**(address: *`string`*): `Universe`

*Defined in [augur-sdk/src/Augur.ts:227](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L227)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Universe`

___
<a id="getuniversechildren"></a>

###  getUniverseChildren

▸ **getUniverseChildren**(params: *`object`*): `ReturnType`<[getUniverseChildren](api-classes-augur-sdk-src-state-getter-universe-universe.md#getuniversechildren)>

*Defined in [augur-sdk/src/Augur.ts:469](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L469)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getUniverseChildren](api-classes-augur-sdk-src-state-getter-universe-universe.md#getuniversechildren)>

___
<a id="getuseraccountdata"></a>

###  getUserAccountData

▸ **getUserAccountData**(params: *`object`*): `ReturnType`<[getUserAccountData](api-classes-augur-sdk-src-state-getter-users-users.md#getuseraccountdata)>

*Defined in [augur-sdk/src/Augur.ts:388](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L388)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getUserAccountData](api-classes-augur-sdk-src-state-getter-users-users.md#getuseraccountdata)>

___
<a id="getusercurrentdisputestake"></a>

###  getUserCurrentDisputeStake

▸ **getUserCurrentDisputeStake**(params: *`object`*): `ReturnType`<[getUserCurrentDisputeStake](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getusercurrentdisputestake)>

*Defined in [augur-sdk/src/Augur.ts:406](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L406)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `ReturnType`<[getUserCurrentDisputeStake](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getusercurrentdisputestake)>

___
<a id="getusertradingpositions"></a>

###  getUserTradingPositions

▸ **getUserTradingPositions**(params: *`object` & `object` & `object`*): `ReturnType`<[getUserTradingPositions](api-classes-augur-sdk-src-state-getter-users-users.md#getusertradingpositions)>

*Defined in [augur-sdk/src/Augur.ts:367](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L367)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` & `object` & `object` |

**Returns:** `ReturnType`<[getUserTradingPositions](api-classes-augur-sdk-src-state-getter-users-users.md#getusertradingpositions)>

___
<a id="getzeroxorders"></a>

###  getZeroXOrders

▸ **getZeroXOrders**(params: *`object`*): `Promise`<[ZeroXOrders](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorders.md)>

*Defined in [augur-sdk/src/Augur.ts:320](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L320)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `object` |

**Returns:** `Promise`<[ZeroXOrders](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorders.md)>

___
<a id="hotloadmarket"></a>

###  hotloadMarket

▸ **hotloadMarket**(marketId: *`string`*): `Promise`<[HotLoadMarketInfo](api-interfaces-augur-sdk-src-api-hotloading-hotloadmarketinfo.md)>

*Defined in [augur-sdk/src/Augur.ts:422](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L422)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketId | `string` |

**Returns:** `Promise`<[HotLoadMarketInfo](api-interfaces-augur-sdk-src-api-hotloading-hotloadmarketinfo.md)>

___
<a id="listaccounts"></a>

###  listAccounts

▸ **listAccounts**(): `Promise`<`string`[]>

*Defined in [augur-sdk/src/Augur.ts:149](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L149)*

**Returns:** `Promise`<`string`[]>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-augur-sdk-src-constants-txeventname.md) \| `string`*): `Promise`<`void`>

*Defined in [augur-sdk/src/Augur.ts:288](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L288)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-augur-sdk-src-constants-txeventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-augur-sdk-src-constants-txeventname.md) \| `string`*, callback: *[Callback](api-modules-augur-sdk-src-events-module.md#callback) \| [TXStatusCallback](api-modules-augur-sdk-src-events-module.md#txstatuscallback)*): `Promise`<`void`>

*Defined in [augur-sdk/src/Augur.ts:271](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L271)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| [TXEventName](api-enums-augur-sdk-src-constants-txeventname.md) \| `string` |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) \| [TXStatusCallback](api-modules-augur-sdk-src-events-module.md#txstatuscallback) |

**Returns:** `Promise`<`void`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/Augur.ts:441](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L441)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="registertransactionstatuscallback"></a>

###  registerTransactionStatusCallback

▸ **registerTransactionStatusCallback**(key: *`string`*, callback: *`TransactionStatusCallback`*): `void`

*Defined in [augur-sdk/src/Augur.ts:242](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L242)*

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

*Defined in [augur-sdk/src/Augur.ts:475](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L475)*

**Returns:** `void`

___
<a id="sendeth"></a>

###  sendETH

▸ **sendETH**(address: *`string`*, value: *`BigNumber`*): `Promise`<`void`>

*Defined in [augur-sdk/src/Augur.ts:182](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L182)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |
| value | `BigNumber` |

**Returns:** `Promise`<`void`>

___
<a id="setgasprice"></a>

###  setGasPrice

▸ **setGasPrice**(gasPrice: *`BigNumber`*): `void`

*Defined in [augur-sdk/src/Augur.ts:196](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L196)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| gasPrice | `BigNumber` |

**Returns:** `void`

___
<a id="setgnosissafeaddress"></a>

###  setGnosisSafeAddress

▸ **setGnosisSafeAddress**(safeAddress: *`string`*): `void`

*Defined in [augur-sdk/src/Augur.ts:200](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L200)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| safeAddress | `string` |

**Returns:** `void`

___
<a id="setgnosisstatus"></a>

###  setGnosisStatus

▸ **setGnosisStatus**(status: *`GnosisSafeState`*): `void`

*Defined in [augur-sdk/src/Augur.ts:204](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L204)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| status | `GnosisSafeState` |

**Returns:** `void`

___
<a id="setusegnosisrelay"></a>

###  setUseGnosisRelay

▸ **setUseGnosisRelay**(useRelay: *`boolean`*): `void`

*Defined in [augur-sdk/src/Augur.ts:216](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L216)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| useRelay | `boolean` |

**Returns:** `void`

___
<a id="setusegnosissafe"></a>

###  setUseGnosisSafe

▸ **setUseGnosisSafe**(useSafe: *`boolean`*): `void`

*Defined in [augur-sdk/src/Augur.ts:212](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L212)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| useSafe | `boolean` |

**Returns:** `void`

___
<a id="signmessage"></a>

###  signMessage

▸ **signMessage**(message: *`Arrayish`*): `Promise`<`string`>

*Defined in [augur-sdk/src/Augur.ts:153](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L153)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Arrayish` |

**Returns:** `Promise`<`string`>

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<[SimulateTradeData](api-interfaces-augur-sdk-src-api-trade-simulatetradedata.md)>

*Defined in [augur-sdk/src/Augur.ts:435](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L435)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<[SimulateTradeData](api-interfaces-augur-sdk-src-api-trade-simulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/Augur.ts:463](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L463)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="updategnosissafe"></a>

###  updateGnosisSafe

▸ **updateGnosisSafe**(payload: *[GnosisSafeStatusPayload](api-interfaces-augur-sdk-src-api-gnosis-gnosissafestatuspayload.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/Augur.ts:194](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L194)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payload | [GnosisSafeStatusPayload](api-interfaces-augur-sdk-src-api-gnosis-gnosissafestatuspayload.md) |

**Returns:** `Promise`<`void`>

___
<a id="create"></a>

### `<Static>` create

▸ **create**<`TProvider`>(provider: *`TProvider`*, dependencies: *`ContractDependenciesGnosis`*, addresses: *`ContractAddresses`*, connector?: *[BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)*, gnosisRelay?: *`IGnosisRelayAPI`*, enableFlexSearch?: *`boolean`*, meshClient?: *`WSClient`*, meshBrowser?: *[BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md)*): `Promise`<[Augur](api-classes-augur-sdk-src-augur-augur.md)>

*Defined in [augur-sdk/src/Augur.ts:117](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/Augur.ts#L117)*

**Type parameters:**

#### TProvider :  [Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesGnosis` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md) |  new SingleThreadConnector() |
| `Default value` gnosisRelay | `IGnosisRelayAPI` |  undefined |
| `Default value` enableFlexSearch | `boolean` | false |
| `Default value` meshClient | `WSClient` |  undefined |
| `Default value` meshBrowser | [BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md) |  undefined |

**Returns:** `Promise`<[Augur](api-classes-augur-sdk-src-augur-augur.md)>

___


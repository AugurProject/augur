[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/Augur"](../modules/_augur_sdk_src_augur_.md) › [Augur](_augur_sdk_src_augur_.augur.md)

# Class: Augur <**TProvider**>

## Type parameters

▪ **TProvider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

## Hierarchy

* **Augur**

## Index

### Constructors

* [constructor](_augur_sdk_src_augur_.augur.md#constructor)

### Properties

* [_sdkReady](_augur_sdk_src_augur_.augur.md#private-_sdkready)
* [_zeroX](_augur_sdk_src_augur_.augur.md#private-_zerox)
* [config](_augur_sdk_src_augur_.augur.md#config)
* [connector](_augur_sdk_src_augur_.augur.md#connector)
* [contractEvents](_augur_sdk_src_augur_.augur.md#contractevents)
* [contracts](_augur_sdk_src_augur_.augur.md#contracts)
* [dependencies](_augur_sdk_src_augur_.augur.md#dependencies)
* [events](_augur_sdk_src_augur_.augur.md#events)
* [gsn](_augur_sdk_src_augur_.augur.md#gsn)
* [hotLoading](_augur_sdk_src_augur_.augur.md#hotloading)
* [liquidity](_augur_sdk_src_augur_.augur.md#liquidity)
* [market](_augur_sdk_src_augur_.augur.md#market)
* [onChainTrade](_augur_sdk_src_augur_.augur.md#onchaintrade)
* [provider](_augur_sdk_src_augur_.augur.md#provider)
* [syncableFlexSearch](_augur_sdk_src_augur_.augur.md#syncableflexsearch)
* [trade](_augur_sdk_src_augur_.augur.md#trade)
* [txAwaitingSigningCallback](_augur_sdk_src_augur_.augur.md#private-txawaitingsigningcallback)
* [txFailureCallback](_augur_sdk_src_augur_.augur.md#private-txfailurecallback)
* [txFeeTooLowCallback](_augur_sdk_src_augur_.augur.md#private-txfeetoolowcallback)
* [txPendingCallback](_augur_sdk_src_augur_.augur.md#private-txpendingcallback)
* [txRelayerDownCallback](_augur_sdk_src_augur_.augur.md#private-txrelayerdowncallback)
* [txSuccessCallback](_augur_sdk_src_augur_.augur.md#private-txsuccesscallback)
* [uniswap](_augur_sdk_src_augur_.augur.md#uniswap)
* [universe](_augur_sdk_src_augur_.augur.md#universe)
* [warpSync](_augur_sdk_src_augur_.augur.md#warpsync)

### Accessors

* [networkId](_augur_sdk_src_augur_.augur.md#networkid)
* [sdkReady](_augur_sdk_src_augur_.augur.md#sdkready)
* [signer](_augur_sdk_src_augur_.augur.md#signer)
* [zeroX](_augur_sdk_src_augur_.augur.md#zerox)

### Methods

* [batchCancelOrders](_augur_sdk_src_augur_.augur.md#batchcancelorders)
* [bindTo](_augur_sdk_src_augur_.augur.md#bindto)
* [cancelOrder](_augur_sdk_src_augur_.augur.md#cancelorder)
* [convertGasEstimateToDaiCost](_augur_sdk_src_augur_.augur.md#convertgasestimatetodaicost)
* [createCategoricalMarket](_augur_sdk_src_augur_.augur.md#createcategoricalmarket)
* [createScalarMarket](_augur_sdk_src_augur_.augur.md#createscalarmarket)
* [createYesNoMarket](_augur_sdk_src_augur_.augur.md#createyesnomarket)
* [deRegisterAllTransactionStatusCallbacks](_augur_sdk_src_augur_.augur.md#deregisteralltransactionstatuscallbacks)
* [deRegisterTransactionStatusCallback](_augur_sdk_src_augur_.augur.md#deregistertransactionstatuscallback)
* [disconnect](_augur_sdk_src_augur_.augur.md#disconnect)
* [getAccount](_augur_sdk_src_augur_.augur.md#getaccount)
* [getAccountRepStakeSummary](_augur_sdk_src_augur_.augur.md#getaccountrepstakesummary)
* [getAccountTimeRangedStats](_augur_sdk_src_augur_.augur.md#getaccounttimerangedstats)
* [getAccountTransactionHistory](_augur_sdk_src_augur_.augur.md#getaccounttransactionhistory)
* [getCategoryStats](_augur_sdk_src_augur_.augur.md#getcategorystats)
* [getDisputeWindow](_augur_sdk_src_augur_.augur.md#getdisputewindow)
* [getEthBalance](_augur_sdk_src_augur_.augur.md#getethbalance)
* [getGasConfirmEstimate](_augur_sdk_src_augur_.augur.md#getgasconfirmestimate)
* [getGasPrice](_augur_sdk_src_augur_.augur.md#getgasprice)
* [getGasStation](_augur_sdk_src_augur_.augur.md#getgasstation)
* [getMarket](_augur_sdk_src_augur_.augur.md#getmarket)
* [getMarketLiquidityRanking](_augur_sdk_src_augur_.augur.md#getmarketliquidityranking)
* [getMarketOrderBook](_augur_sdk_src_augur_.augur.md#getmarketorderbook)
* [getMarketPriceCandlesticks](_augur_sdk_src_augur_.augur.md#getmarketpricecandlesticks)
* [getMarkets](_augur_sdk_src_augur_.augur.md#getmarkets)
* [getMarketsInfo](_augur_sdk_src_augur_.augur.md#getmarketsinfo)
* [getMostRecentWarpSync](_augur_sdk_src_augur_.augur.md#getmostrecentwarpsync)
* [getOrder](_augur_sdk_src_augur_.augur.md#getorder)
* [getOrders](_augur_sdk_src_augur_.augur.md#getorders)
* [getPayoutFromWarpSyncHash](_augur_sdk_src_augur_.augur.md#getpayoutfromwarpsynchash)
* [getPlatformActivityStats](_augur_sdk_src_augur_.augur.md#getplatformactivitystats)
* [getProfitLoss](_augur_sdk_src_augur_.augur.md#getprofitloss)
* [getProfitLossSummary](_augur_sdk_src_augur_.augur.md#getprofitlosssummary)
* [getSyncData](_augur_sdk_src_augur_.augur.md#getsyncdata)
* [getTimestamp](_augur_sdk_src_augur_.augur.md#gettimestamp)
* [getTotalOnChainFrozenFunds](_augur_sdk_src_augur_.augur.md#gettotalonchainfrozenfunds)
* [getTradingHistory](_augur_sdk_src_augur_.augur.md#gettradinghistory)
* [getTradingOrders](_augur_sdk_src_augur_.augur.md#gettradingorders)
* [getTransaction](_augur_sdk_src_augur_.augur.md#gettransaction)
* [getUniverse](_augur_sdk_src_augur_.augur.md#getuniverse)
* [getUniverseChildren](_augur_sdk_src_augur_.augur.md#getuniversechildren)
* [getUseRelay](_augur_sdk_src_augur_.augur.md#getuserelay)
* [getUseWallet](_augur_sdk_src_augur_.augur.md#getusewallet)
* [getUserAccountData](_augur_sdk_src_augur_.augur.md#getuseraccountdata)
* [getUserCurrentDisputeStake](_augur_sdk_src_augur_.augur.md#getusercurrentdisputestake)
* [getUserOpenOrders](_augur_sdk_src_augur_.augur.md#getuseropenorders)
* [getUserPositionsPlus](_augur_sdk_src_augur_.augur.md#getuserpositionsplus)
* [getUserTradingPositions](_augur_sdk_src_augur_.augur.md#getusertradingpositions)
* [getWarpSyncHashFromPayout](_augur_sdk_src_augur_.augur.md#getwarpsynchashfrompayout)
* [getWarpSyncMarket](_augur_sdk_src_augur_.augur.md#getwarpsyncmarket)
* [getZeroXOrders](_augur_sdk_src_augur_.augur.md#getzeroxorders)
* [hotloadMarket](_augur_sdk_src_augur_.augur.md#hotloadmarket)
* [listAccounts](_augur_sdk_src_augur_.augur.md#listaccounts)
* [off](_augur_sdk_src_augur_.augur.md#off)
* [on](_augur_sdk_src_augur_.augur.md#on)
* [placeTrade](_augur_sdk_src_augur_.augur.md#placetrade)
* [registerTransactionStatusCallback](_augur_sdk_src_augur_.augur.md#registertransactionstatuscallback)
* [registerTransactionStatusEvents](_augur_sdk_src_augur_.augur.md#private-registertransactionstatusevents)
* [sendETH](_augur_sdk_src_augur_.augur.md#sendeth)
* [setLoggerLevel](_augur_sdk_src_augur_.augur.md#setloggerlevel)
* [setUseRelay](_augur_sdk_src_augur_.augur.md#setuserelay)
* [setUseWallet](_augur_sdk_src_augur_.augur.md#setusewallet)
* [signMessage](_augur_sdk_src_augur_.augur.md#signmessage)
* [simulateTrade](_augur_sdk_src_augur_.augur.md#simulatetrade)
* [simulateTradeGasLimit](_augur_sdk_src_augur_.augur.md#simulatetradegaslimit)
* [create](_augur_sdk_src_augur_.augur.md#static-create)

## Constructors

###  constructor

\+ **new Augur**(`provider`: TProvider, `dependencies`: ContractDependenciesGSN, `config`: SDKConfiguration, `connector`: [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md), `_zeroX`: any, `enableFlexSearch`: boolean): *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:82](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L82)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | TProvider | - |
`dependencies` | ContractDependenciesGSN | - |
`config` | SDKConfiguration | - |
`connector` | [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md) | new EmptyConnector() |
`_zeroX` | any | null |
`enableFlexSearch` | boolean | false |

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)*

## Properties

### `Private` _sdkReady

• **_sdkReady**: *boolean* = false

*Defined in [packages/augur-sdk/src/Augur.ts:59](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L59)*

___

### `Private` _zeroX

• **_zeroX**: *any*

*Defined in [packages/augur-sdk/src/Augur.ts:89](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L89)*

___

###  config

• **config**: *SDKConfiguration*

*Defined in [packages/augur-sdk/src/Augur.ts:87](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L87)*

___

###  connector

• **connector**: *[BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:88](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L88)*

___

###  contractEvents

• **contractEvents**: *[ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:45](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L45)*

___

###  contracts

• **contracts**: *[Contracts](_augur_sdk_src_api_contracts_.contracts.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:46](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L46)*

___

###  dependencies

• **dependencies**: *ContractDependenciesGSN*

*Defined in [packages/augur-sdk/src/Augur.ts:86](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L86)*

___

###  events

• **events**: *[Subscriptions](_augur_sdk_src_subscriptions_.subscriptions.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:57](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L57)*

___

###  gsn

• **gsn**: *[GSN](_augur_sdk_src_api_gsn_.gsn.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:51](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L51)*

___

###  hotLoading

• **hotLoading**: *[HotLoading](_augur_sdk_src_api_hotloading_.hotloading.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L56)*

___

###  liquidity

• **liquidity**: *[Liquidity](_augur_sdk_src_api_liquidity_.liquidity.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:55](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L55)*

___

###  market

• **market**: *[Market](_augur_sdk_src_api_market_.market.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:49](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L49)*

___

###  onChainTrade

• **onChainTrade**: *[OnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:47](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L47)*

___

###  provider

• **provider**: *TProvider*

*Defined in [packages/augur-sdk/src/Augur.ts:85](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L85)*

___

###  syncableFlexSearch

• **syncableFlexSearch**: *[SyncableFlexSearch](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:43](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L43)*

___

###  trade

• **trade**: *[Trade](_augur_sdk_src_api_trade_.trade.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L48)*

___

### `Private` txAwaitingSigningCallback

• **txAwaitingSigningCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:62](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L62)*

___

### `Private` txFailureCallback

• **txFailureCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:64](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L64)*

___

### `Private` txFeeTooLowCallback

• **txFeeTooLowCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:65](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L65)*

___

### `Private` txPendingCallback

• **txPendingCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:63](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L63)*

___

### `Private` txRelayerDownCallback

• **txRelayerDownCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:66](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L66)*

___

### `Private` txSuccessCallback

• **txSuccessCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L61)*

___

###  uniswap

• **uniswap**: *[Uniswap](_augur_sdk_src_api_uniswap_.uniswap.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:52](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L52)*

___

###  universe

• **universe**: *[Universe](_augur_sdk_src_state_getter_universe_.universe.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:54](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L54)*

___

###  warpSync

• **warpSync**: *[WarpSync](_augur_sdk_src_api_warpsync_.warpsync.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:50](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L50)*

## Accessors

###  networkId

• **get networkId**(): *NetworkId*

*Defined in [packages/augur-sdk/src/Augur.ts:150](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L150)*

**Returns:** *NetworkId*

___

###  sdkReady

• **get sdkReady**(): *boolean*

*Defined in [packages/augur-sdk/src/Augur.ts:80](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L80)*

**Returns:** *boolean*

___

###  signer

• **get signer**(): *EthersSigner*

*Defined in [packages/augur-sdk/src/Augur.ts:368](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L368)*

**Returns:** *EthersSigner*

• **set signer**(`signer`: EthersSigner): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:372](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L372)*

**Parameters:**

Name | Type |
------ | ------ |
`signer` | EthersSigner |

**Returns:** *void*

___

###  zeroX

• **get zeroX**(): *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:68](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L68)*

**Returns:** *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

• **set zeroX**(`zeroX`: [ZeroX](_augur_sdk_src_api_zerox_.zerox.md)): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:72](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`zeroX` | [ZeroX](_augur_sdk_src_api_zerox_.zerox.md) |

**Returns:** *void*

## Methods

###  batchCancelOrders

▸ **batchCancelOrders**(`orderHashes`: string[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:523](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L523)*

**Parameters:**

Name | Type |
------ | ------ |
`orderHashes` | string[] |

**Returns:** *Promise‹void›*

___

###  bindTo

▸ **bindTo**<**R**, **P**>(`f`: function): *function*

*Defined in [packages/augur-sdk/src/Augur.ts:286](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L286)*

**Type parameters:**

▪ **R**

▪ **P**

**Parameters:**

▪ **f**: *function*

▸ (`db`: any, `augur`: any, `params`: P): *Promise‹R›*

**Parameters:**

Name | Type |
------ | ------ |
`db` | any |
`augur` | any |
`params` | P |

**Returns:** *function*

▸ (`params`: P): *Promise‹R›*

**Parameters:**

Name | Type |
------ | ------ |
`params` | P |

___

###  cancelOrder

▸ **cancelOrder**(`orderHash`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:518](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L518)*

**Parameters:**

Name | Type |
------ | ------ |
`orderHash` | string |

**Returns:** *Promise‹void›*

___

###  convertGasEstimateToDaiCost

▸ **convertGasEstimateToDaiCost**(`gasEstimate`: BigNumber): *BigNumber*

*Defined in [packages/augur-sdk/src/Augur.ts:261](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L261)*

**Parameters:**

Name | Type |
------ | ------ |
`gasEstimate` | BigNumber |

**Returns:** *BigNumber*

___

###  createCategoricalMarket

▸ **createCategoricalMarket**(`params`: [CreateCategoricalMarketParams](../interfaces/_augur_sdk_src_api_market_.createcategoricalmarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:540](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L540)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateCategoricalMarketParams](../interfaces/_augur_sdk_src_api_market_.createcategoricalmarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  createScalarMarket

▸ **createScalarMarket**(`params`: [CreateScalarMarketParams](../interfaces/_augur_sdk_src_api_market_.createscalarmarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:546](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L546)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateScalarMarketParams](../interfaces/_augur_sdk_src_api_market_.createscalarmarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  createYesNoMarket

▸ **createYesNoMarket**(`params`: [CreateYesNoMarketParams](../interfaces/_augur_sdk_src_api_market_.createyesnomarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:534](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L534)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateYesNoMarketParams](../interfaces/_augur_sdk_src_api_market_.createyesnomarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  deRegisterAllTransactionStatusCallbacks

▸ **deRegisterAllTransactionStatusCallbacks**(): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:276](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L276)*

**Returns:** *void*

___

###  deRegisterTransactionStatusCallback

▸ **deRegisterTransactionStatusCallback**(`key`: string): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:272](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L272)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*

___

###  disconnect

▸ **disconnect**(): *Promise‹any›*

*Defined in [packages/augur-sdk/src/Augur.ts:280](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L280)*

**Returns:** *Promise‹any›*

___

###  getAccount

▸ **getAccount**(): *Promise‹string | null›*

*Defined in [packages/augur-sdk/src/Augur.ts:181](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L181)*

**Returns:** *Promise‹string | null›*

___

###  getAccountRepStakeSummary

▸ **getAccountRepStakeSummary**(`params`: Parameters<typeof getAccountRepStakeSummary>[2]): *ReturnType‹typeof getAccountRepStakeSummary›*

*Defined in [packages/augur-sdk/src/Augur.ts:472](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L472)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getAccountRepStakeSummary>[2] |

**Returns:** *ReturnType‹typeof getAccountRepStakeSummary›*

___

###  getAccountTimeRangedStats

▸ **getAccountTimeRangedStats**(`params`: Parameters<typeof getAccountTimeRangedStats>[2]): *ReturnType‹typeof getAccountTimeRangedStats›*

*Defined in [packages/augur-sdk/src/Augur.ts:443](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L443)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getAccountTimeRangedStats>[2] |

**Returns:** *ReturnType‹typeof getAccountTimeRangedStats›*

___

###  getAccountTransactionHistory

▸ **getAccountTransactionHistory**(`params`: Parameters<typeof getAccountTransactionHistory>[2]): *ReturnType‹typeof getAccountTransactionHistory›*

*Defined in [packages/augur-sdk/src/Augur.ts:466](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L466)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getAccountTransactionHistory>[2] |

**Returns:** *ReturnType‹typeof getAccountTransactionHistory›*

___

###  getCategoryStats

▸ **getCategoryStats**(`params`: Parameters<typeof getCategoryStats>[2]): *ReturnType‹typeof getCategoryStats›*

*Defined in [packages/augur-sdk/src/Augur.ts:488](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L488)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getCategoryStats>[2] |

**Returns:** *ReturnType‹typeof getCategoryStats›*

___

###  getDisputeWindow

▸ **getDisputeWindow**(`params`: [GetDisputeWindowParams](../interfaces/_augur_sdk_src_api_hotloading_.getdisputewindowparams.md)): *Promise‹[DisputeWindow](../interfaces/_augur_sdk_src_api_hotloading_.disputewindow.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:504](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L504)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [GetDisputeWindowParams](../interfaces/_augur_sdk_src_api_hotloading_.getdisputewindowparams.md) |

**Returns:** *Promise‹[DisputeWindow](../interfaces/_augur_sdk_src_api_hotloading_.disputewindow.md)›*

___

###  getEthBalance

▸ **getEthBalance**(`address`: string): *Promise‹string›*

*Defined in [packages/augur-sdk/src/Augur.ts:171](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L171)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Promise‹string›*

___

###  getGasConfirmEstimate

▸ **getGasConfirmEstimate**(): *Promise‹60 | 180 | 1800›*

*Defined in [packages/augur-sdk/src/Augur.ts:228](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L228)*

**Returns:** *Promise‹60 | 180 | 1800›*

___

###  getGasPrice

▸ **getGasPrice**(): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:176](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L176)*

**Returns:** *Promise‹BigNumber›*

___

###  getGasStation

▸ **getGasStation**(): *Promise‹any›*

*Defined in [packages/augur-sdk/src/Augur.ts:219](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L219)*

**Returns:** *Promise‹any›*

___

###  getMarket

▸ **getMarket**(`address`: string): *Market*

*Defined in [packages/augur-sdk/src/Augur.ts:250](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L250)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Market*

___

###  getMarketLiquidityRanking

▸ **getMarketLiquidityRanking**(`params`: Parameters<typeof getMarketLiquidityRanking>[2]): *ReturnType‹typeof getMarketLiquidityRanking›*

*Defined in [packages/augur-sdk/src/Augur.ts:398](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L398)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getMarketLiquidityRanking>[2] |

**Returns:** *ReturnType‹typeof getMarketLiquidityRanking›*

___

###  getMarketOrderBook

▸ **getMarketOrderBook**(`params`: Parameters<typeof getMarketOrderBook>[2]): *ReturnType‹typeof getMarketOrderBook›*

*Defined in [packages/augur-sdk/src/Augur.ts:386](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L386)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getMarketOrderBook>[2] |

**Returns:** *ReturnType‹typeof getMarketOrderBook›*

___

###  getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(`params`: Parameters<typeof getMarketPriceCandlesticks>[2]): *ReturnType‹typeof getMarketPriceCandlesticks›*

*Defined in [packages/augur-sdk/src/Augur.ts:392](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L392)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getMarketPriceCandlesticks>[2] |

**Returns:** *ReturnType‹typeof getMarketPriceCandlesticks›*

___

###  getMarkets

▸ **getMarkets**(`params`: Parameters<typeof getMarkets>[2]): *ReturnType‹typeof getMarkets›*

*Defined in [packages/augur-sdk/src/Augur.ts:346](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L346)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getMarkets>[2] |

**Returns:** *ReturnType‹typeof getMarkets›*

___

###  getMarketsInfo

▸ **getMarketsInfo**(`params`: Parameters<typeof getMarketsInfo>[2]): *ReturnType‹typeof getMarketsInfo›*

*Defined in [packages/augur-sdk/src/Augur.ts:352](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L352)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getMarketsInfo>[2] |

**Returns:** *ReturnType‹typeof getMarketsInfo›*

___

###  getMostRecentWarpSync

▸ **getMostRecentWarpSync**(): *ReturnType‹typeof getMostRecentWarpSync›*

*Defined in [packages/augur-sdk/src/Augur.ts:416](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L416)*

**Returns:** *ReturnType‹typeof getMostRecentWarpSync›*

___

###  getOrder

▸ **getOrder**(`params`: Parameters<typeof getZeroXOrder>[2]): *ReturnType‹typeof getZeroXOrder›*

*Defined in [packages/augur-sdk/src/Augur.ts:494](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L494)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getZeroXOrder>[2] |

**Returns:** *ReturnType‹typeof getZeroXOrder›*

___

###  getOrders

▸ **getOrders**(): *Orders*

*Defined in [packages/augur-sdk/src/Augur.ts:254](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L254)*

**Returns:** *Orders*

___

###  getPayoutFromWarpSyncHash

▸ **getPayoutFromWarpSyncHash**(`hash`: string): *Promise‹BigNumber[]›*

*Defined in [packages/augur-sdk/src/Augur.ts:421](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L421)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *Promise‹BigNumber[]›*

___

###  getPlatformActivityStats

▸ **getPlatformActivityStats**(`params`: Parameters<typeof getPlatformActivityStats>[2]): *ReturnType‹typeof getPlatformActivityStats›*

*Defined in [packages/augur-sdk/src/Augur.ts:483](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L483)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getPlatformActivityStats>[2] |

**Returns:** *ReturnType‹typeof getPlatformActivityStats›*

___

###  getProfitLoss

▸ **getProfitLoss**(`params`: Parameters<typeof getProfitLoss>[2]): *ReturnType‹typeof getProfitLoss›*

*Defined in [packages/augur-sdk/src/Augur.ts:432](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L432)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getProfitLoss>[2] |

**Returns:** *ReturnType‹typeof getProfitLoss›*

___

###  getProfitLossSummary

▸ **getProfitLossSummary**(`params`: Parameters<typeof getProfitLossSummary>[2]): *ReturnType‹typeof getProfitLossSummary›*

*Defined in [packages/augur-sdk/src/Augur.ts:437](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L437)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getProfitLossSummary>[2] |

**Returns:** *ReturnType‹typeof getProfitLossSummary›*

___

###  getSyncData

▸ **getSyncData**(): *Promise‹[SyncData](../interfaces/_augur_sdk_src_state_getter_status_.syncdata.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:358](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L358)*

**Returns:** *Promise‹[SyncData](../interfaces/_augur_sdk_src_state_getter_status_.syncdata.md)›*

___

###  getTimestamp

▸ **getTimestamp**(): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:167](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L167)*

**Returns:** *Promise‹BigNumber›*

___

###  getTotalOnChainFrozenFunds

▸ **getTotalOnChainFrozenFunds**(`params`: Parameters<typeof getTotalOnChainFrozenFunds>[2]): *ReturnType‹typeof getTotalOnChainFrozenFunds›*

*Defined in [packages/augur-sdk/src/Augur.ts:461](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L461)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getTotalOnChainFrozenFunds>[2] |

**Returns:** *ReturnType‹typeof getTotalOnChainFrozenFunds›*

___

###  getTradingHistory

▸ **getTradingHistory**(`params`: Parameters<typeof getTradingHistory>[2]): *ReturnType‹typeof getTradingHistory›*

*Defined in [packages/augur-sdk/src/Augur.ts:376](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L376)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getTradingHistory>[2] |

**Returns:** *ReturnType‹typeof getTradingHistory›*

___

###  getTradingOrders

▸ **getTradingOrders**(`params`: Parameters<typeof getOpenOrders>[2]): *ReturnType‹typeof getOpenOrders›*

*Defined in [packages/augur-sdk/src/Augur.ts:381](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L381)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getOpenOrders>[2] |

**Returns:** *ReturnType‹typeof getOpenOrders›*

___

###  getTransaction

▸ **getTransaction**(`hash`: string): *Promise‹TransactionResponse›*

*Defined in [packages/augur-sdk/src/Augur.ts:154](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L154)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *Promise‹TransactionResponse›*

___

###  getUniverse

▸ **getUniverse**(`address`: string): *Universe*

*Defined in [packages/augur-sdk/src/Augur.ts:246](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L246)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Universe*

___

###  getUniverseChildren

▸ **getUniverseChildren**(`params`: Parameters<typeof getUniverseChildren>[2]): *ReturnType‹typeof getUniverseChildren›*

*Defined in [packages/augur-sdk/src/Augur.ts:558](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L558)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getUniverseChildren>[2] |

**Returns:** *ReturnType‹typeof getUniverseChildren›*

___

###  getUseRelay

▸ **getUseRelay**(): *boolean*

*Defined in [packages/augur-sdk/src/Augur.ts:215](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L215)*

**Returns:** *boolean*

___

###  getUseWallet

▸ **getUseWallet**(): *boolean*

*Defined in [packages/augur-sdk/src/Augur.ts:211](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L211)*

**Returns:** *boolean*

___

###  getUserAccountData

▸ **getUserAccountData**(`params`: Parameters<typeof getUserAccountData>[2]): *ReturnType‹typeof getUserAccountData›*

*Defined in [packages/augur-sdk/src/Augur.ts:449](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L449)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getUserAccountData>[2] |

**Returns:** *ReturnType‹typeof getUserAccountData›*

___

###  getUserCurrentDisputeStake

▸ **getUserCurrentDisputeStake**(`params`: Parameters<typeof getUserCurrentDisputeStake>[2]): *ReturnType‹typeof getUserCurrentDisputeStake›*

*Defined in [packages/augur-sdk/src/Augur.ts:478](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L478)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getUserCurrentDisputeStake>[2] |

**Returns:** *ReturnType‹typeof getUserCurrentDisputeStake›*

___

###  getUserOpenOrders

▸ **getUserOpenOrders**(`params`: Parameters<typeof getUserOpenOrders>[2]): *ReturnType‹typeof getUserOpenOrders›*

*Defined in [packages/augur-sdk/src/Augur.ts:410](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L410)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getUserOpenOrders>[2] |

**Returns:** *ReturnType‹typeof getUserOpenOrders›*

___

###  getUserPositionsPlus

▸ **getUserPositionsPlus**(`params`: Parameters<typeof getUserPositionsPlus>[2]): *ReturnType‹typeof getUserPositionsPlus›*

*Defined in [packages/augur-sdk/src/Augur.ts:455](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L455)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getUserPositionsPlus>[2] |

**Returns:** *ReturnType‹typeof getUserPositionsPlus›*

___

###  getUserTradingPositions

▸ **getUserTradingPositions**(`params`: Parameters<typeof getUserTradingPositions>[2]): *ReturnType‹typeof getUserTradingPositions›*

*Defined in [packages/augur-sdk/src/Augur.ts:404](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L404)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getUserTradingPositions>[2] |

**Returns:** *ReturnType‹typeof getUserTradingPositions›*

___

###  getWarpSyncHashFromPayout

▸ **getWarpSyncHashFromPayout**(`payout`: BigNumber[]): *string*

*Defined in [packages/augur-sdk/src/Augur.ts:425](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L425)*

**Parameters:**

Name | Type |
------ | ------ |
`payout` | BigNumber[] |

**Returns:** *string*

___

###  getWarpSyncMarket

▸ **getWarpSyncMarket**(`universe`: string): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:429](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L429)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |

**Returns:** *Promise‹Market›*

___

###  getZeroXOrders

▸ **getZeroXOrders**(`params`: Parameters<typeof getZeroXOrders>[2]): *Promise‹[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:362](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L362)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters<typeof getZeroXOrders>[2] |

**Returns:** *Promise‹[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)›*

___

###  hotloadMarket

▸ **hotloadMarket**(`marketId`: string): *Promise‹[HotLoadMarketInfo](../interfaces/_augur_sdk_src_api_hotloading_.hotloadmarketinfo.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:500](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L500)*

**Parameters:**

Name | Type |
------ | ------ |
`marketId` | string |

**Returns:** *Promise‹[HotLoadMarketInfo](../interfaces/_augur_sdk_src_api_hotloading_.hotloadmarketinfo.md)›*

___

###  listAccounts

▸ **listAccounts**(): *Promise‹string[]›*

*Defined in [packages/augur-sdk/src/Augur.ts:159](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L159)*

**Returns:** *Promise‹string[]›*

___

###  off

▸ **off**(`eventName`: [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) | [TXEventName](../enums/_augur_sdk_src_constants_.txeventname.md) | string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:326](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L326)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) &#124; [TXEventName](../enums/_augur_sdk_src_constants_.txeventname.md) &#124; string |

**Returns:** *Promise‹void›*

___

###  on

▸ **on**(`eventName`: [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) | [TXEventName](../enums/_augur_sdk_src_constants_.txeventname.md) | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback) | [TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:305](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L305)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) &#124; [TXEventName](../enums/_augur_sdk_src_constants_.txeventname.md) &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) &#124; [TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback) |

**Returns:** *Promise‹void›*

___

###  placeTrade

▸ **placeTrade**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/Augur.ts:514](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L514)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹boolean›*

___

###  registerTransactionStatusCallback

▸ **registerTransactionStatusCallback**(`key`: string, `callback`: TransactionStatusCallback): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:265](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L265)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`callback` | TransactionStatusCallback |

**Returns:** *void*

___

### `Private` registerTransactionStatusEvents

▸ **registerTransactionStatusEvents**(): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:564](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L564)*

**Returns:** *void*

___

###  sendETH

▸ **sendETH**(`address`: string, `value`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:193](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`value` | BigNumber |

**Returns:** *Promise‹void›*

___

###  setLoggerLevel

▸ **setLoggerLevel**(`logLevel`: LoggerLevels): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:299](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L299)*

**Parameters:**

Name | Type |
------ | ------ |
`logLevel` | LoggerLevels |

**Returns:** *void*

___

###  setUseRelay

▸ **setUseRelay**(`useRelay`: boolean): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:207](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L207)*

**Parameters:**

Name | Type |
------ | ------ |
`useRelay` | boolean |

**Returns:** *void*

___

###  setUseWallet

▸ **setUseWallet**(`useSafe`: boolean): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:203](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`useSafe` | boolean |

**Returns:** *void*

___

###  signMessage

▸ **signMessage**(`message`: Arrayish): *Promise‹string›*

*Defined in [packages/augur-sdk/src/Augur.ts:163](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L163)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Arrayish |

**Returns:** *Promise‹string›*

___

###  simulateTrade

▸ **simulateTrade**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹[SimulateTradeData](../interfaces/_augur_sdk_src_api_trade_.simulatetradedata.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:508](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L508)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹[SimulateTradeData](../interfaces/_augur_sdk_src_api_trade_.simulatetradedata.md)›*

___

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:552](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L552)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹BigNumber›*

___

### `Static` create

▸ **create**<**TProvider**>(`provider`: TProvider, `dependencies`: ContractDependenciesGSN, `config`: SDKConfiguration, `connector`: [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md), `zeroX`: [ZeroX](_augur_sdk_src_api_zerox_.zerox.md), `enableFlexSearch`: boolean): *Promise‹[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)››*

*Defined in [packages/augur-sdk/src/Augur.ts:130](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/Augur.ts#L130)*

**Type parameters:**

▪ **TProvider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | TProvider | - |
`dependencies` | ContractDependenciesGSN | - |
`config` | SDKConfiguration | - |
`connector` | [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md) | new SingleThreadConnector() |
`zeroX` | [ZeroX](_augur_sdk_src_api_zerox_.zerox.md) | null |
`enableFlexSearch` | boolean | false |

**Returns:** *Promise‹[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)››*

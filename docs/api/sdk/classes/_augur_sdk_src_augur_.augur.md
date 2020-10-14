[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/Augur"](../modules/_augur_sdk_src_augur_.md) › [Augur](_augur_sdk_src_augur_.augur.md)

# Class: Augur ‹**TProvider**›

## Type parameters

▪ **TProvider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

## Hierarchy

* **Augur**

## Index

### Constructors

* [constructor](_augur_sdk_src_augur_.augur.md#constructor)

### Properties

* [_sdkReady](_augur_sdk_src_augur_.augur.md#private-_sdkready)
* [_warpController](_augur_sdk_src_augur_.augur.md#private-_warpcontroller)
* [_zeroX](_augur_sdk_src_augur_.augur.md#private-_zerox)
* [bestOffer](_augur_sdk_src_augur_.augur.md#readonly-bestoffer)
* [config](_augur_sdk_src_augur_.augur.md#config)
* [connector](_augur_sdk_src_augur_.augur.md#connector)
* [contractEvents](_augur_sdk_src_augur_.augur.md#readonly-contractevents)
* [contracts](_augur_sdk_src_augur_.augur.md#readonly-contracts)
* [dependencies](_augur_sdk_src_augur_.augur.md#readonly-dependencies)
* [ethExchangetoken0IsCash](_augur_sdk_src_augur_.augur.md#private-ethexchangetoken0iscash)
* [events](_augur_sdk_src_augur_.augur.md#readonly-events)
* [hotLoading](_augur_sdk_src_augur_.augur.md#readonly-hotloading)
* [liquidity](_augur_sdk_src_augur_.augur.md#readonly-liquidity)
* [market](_augur_sdk_src_augur_.augur.md#readonly-market)
* [marketInvalidBids](_augur_sdk_src_augur_.augur.md#readonly-marketinvalidbids)
* [onChainTrade](_augur_sdk_src_augur_.augur.md#readonly-onchaintrade)
* [provider](_augur_sdk_src_augur_.augur.md#readonly-provider)
* [syncableFlexSearch](_augur_sdk_src_augur_.augur.md#syncableflexsearch)
* [trade](_augur_sdk_src_augur_.augur.md#readonly-trade)
* [txAwaitingSigningCallback](_augur_sdk_src_augur_.augur.md#private-txawaitingsigningcallback)
* [txFailureCallback](_augur_sdk_src_augur_.augur.md#private-txfailurecallback)
* [txFeeTooLowCallback](_augur_sdk_src_augur_.augur.md#private-txfeetoolowcallback)
* [txPendingCallback](_augur_sdk_src_augur_.augur.md#private-txpendingcallback)
* [txRelayerDownCallback](_augur_sdk_src_augur_.augur.md#private-txrelayerdowncallback)
* [txSuccessCallbacks](_augur_sdk_src_augur_.augur.md#private-txsuccesscallbacks)
* [uniswap](_augur_sdk_src_augur_.augur.md#readonly-uniswap)
* [universe](_augur_sdk_src_augur_.augur.md#readonly-universe)
* [warpSync](_augur_sdk_src_augur_.augur.md#readonly-warpsync)

### Accessors

* [networkId](_augur_sdk_src_augur_.augur.md#networkid)
* [sdkReady](_augur_sdk_src_augur_.augur.md#sdkready)
* [signer](_augur_sdk_src_augur_.augur.md#signer)
* [warpController](_augur_sdk_src_augur_.augur.md#warpcontroller)
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
* [getAccountEthBalance](_augur_sdk_src_augur_.augur.md#getaccountethbalance)
* [getAccountRepStakeSummary](_augur_sdk_src_augur_.augur.md#getaccountrepstakesummary)
* [getAccountTimeRangedStats](_augur_sdk_src_augur_.augur.md#getaccounttimerangedstats)
* [getAccountTransactionHistory](_augur_sdk_src_augur_.augur.md#getaccounttransactionhistory)
* [getCategoryStats](_augur_sdk_src_augur_.augur.md#getcategorystats)
* [getDisputeWindow](_augur_sdk_src_augur_.augur.md#getdisputewindow)
* [getEthBalance](_augur_sdk_src_augur_.augur.md#getethbalance)
* [getExchangeRate](_augur_sdk_src_augur_.augur.md#getexchangerate)
* [getGasConfirmEstimate](_augur_sdk_src_augur_.augur.md#getgasconfirmestimate)
* [getGasPrice](_augur_sdk_src_augur_.augur.md#getgasprice)
* [getMarket](_augur_sdk_src_augur_.augur.md#getmarket)
* [getMarketLiquidityRanking](_augur_sdk_src_augur_.augur.md#getmarketliquidityranking)
* [getMarketOrderBook](_augur_sdk_src_augur_.augur.md#getmarketorderbook)
* [getMarketOutcomeBestOffer](_augur_sdk_src_augur_.augur.md#getmarketoutcomebestoffer)
* [getMarketPriceCandlesticks](_augur_sdk_src_augur_.augur.md#getmarketpricecandlesticks)
* [getMarkets](_augur_sdk_src_augur_.augur.md#getmarkets)
* [getMarketsInfo](_augur_sdk_src_augur_.augur.md#getmarketsinfo)
* [getMarketsLiquidityPools](_augur_sdk_src_augur_.augur.md#getmarketsliquiditypools)
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
* [getUserAccountData](_augur_sdk_src_augur_.augur.md#getuseraccountdata)
* [getUserCurrentDisputeStake](_augur_sdk_src_augur_.augur.md#getusercurrentdisputestake)
* [getUserFrozenFundsBreakdown](_augur_sdk_src_augur_.augur.md#getuserfrozenfundsbreakdown)
* [getUserOpenOrders](_augur_sdk_src_augur_.augur.md#getuseropenorders)
* [getUserPositionsPlus](_augur_sdk_src_augur_.augur.md#getuserpositionsplus)
* [getUserTradingPositions](_augur_sdk_src_augur_.augur.md#getusertradingpositions)
* [getWarpSyncHashFromPayout](_augur_sdk_src_augur_.augur.md#getwarpsynchashfrompayout)
* [getWarpSyncMarket](_augur_sdk_src_augur_.augur.md#getwarpsyncmarket)
* [getWarpSyncStatus](_augur_sdk_src_augur_.augur.md#getwarpsyncstatus)
* [getZeroXOrders](_augur_sdk_src_augur_.augur.md#getzeroxorders)
* [hotloadMarket](_augur_sdk_src_augur_.augur.md#hotloadmarket)
* [listAccounts](_augur_sdk_src_augur_.augur.md#listaccounts)
* [off](_augur_sdk_src_augur_.augur.md#off)
* [on](_augur_sdk_src_augur_.augur.md#on)
* [pinHashByGatewayUrl](_augur_sdk_src_augur_.augur.md#pinhashbygatewayurl)
* [placeTrade](_augur_sdk_src_augur_.augur.md#placetrade)
* [registerTransactionStatusCallback](_augur_sdk_src_augur_.augur.md#registertransactionstatuscallback)
* [registerTransactionStatusEvents](_augur_sdk_src_augur_.augur.md#private-registertransactionstatusevents)
* [sendETH](_augur_sdk_src_augur_.augur.md#sendeth)
* [setLoggerLevel](_augur_sdk_src_augur_.augur.md#setloggerlevel)
* [setProvider](_augur_sdk_src_augur_.augur.md#setprovider)
* [signMessage](_augur_sdk_src_augur_.augur.md#signmessage)
* [simulateTrade](_augur_sdk_src_augur_.augur.md#simulatetrade)
* [simulateTradeGasLimit](_augur_sdk_src_augur_.augur.md#simulatetradegaslimit)
* [txSuccessCallback](_augur_sdk_src_augur_.augur.md#txsuccesscallback)
* [create](_augur_sdk_src_augur_.augur.md#static-create)

## Constructors

###  constructor

\+ **new Augur**(`provider`: TProvider, `dependencies`: ContractDependenciesEthers, `config`: SDKConfiguration, `connector`: [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md), `_zeroX`: any, `enableFlexSearch`: boolean): *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:123](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L123)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | TProvider | - |
`dependencies` | ContractDependenciesEthers | - |
`config` | SDKConfiguration | - |
`connector` | [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md) | new EmptyConnector() |
`_zeroX` | any | null |
`enableFlexSearch` | boolean | false |

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)*

## Properties

### `Private` _sdkReady

• **_sdkReady**: *boolean* = false

*Defined in [packages/augur-sdk/src/Augur.ts:90](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L90)*

___

### `Private` _warpController

• **_warpController**: *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:99](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L99)*

___

### `Private` _zeroX

• **_zeroX**: *any*

*Defined in [packages/augur-sdk/src/Augur.ts:130](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L130)*

___

### `Readonly` bestOffer

• **bestOffer**: *[BestOffer](_augur_sdk_src_api_bestoffer_.bestoffer.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:84](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L84)*

___

###  config

• **config**: *SDKConfiguration*

*Defined in [packages/augur-sdk/src/Augur.ts:128](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L128)*

___

###  connector

• **connector**: *[BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:129](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L129)*

___

### `Readonly` contractEvents

• **contractEvents**: *[ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:73](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L73)*

___

### `Readonly` contracts

• **contracts**: *[Contracts](_augur_sdk_src_api_contracts_.contracts.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:74](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L74)*

___

### `Readonly` dependencies

• **dependencies**: *ContractDependenciesEthers*

*Defined in [packages/augur-sdk/src/Augur.ts:127](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L127)*

___

### `Private` ethExchangetoken0IsCash

• **ethExchangetoken0IsCash**: *Boolean*

*Defined in [packages/augur-sdk/src/Augur.ts:88](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L88)*

___

### `Readonly` events

• **events**: *EventEmitter*

*Defined in [packages/augur-sdk/src/Augur.ts:86](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L86)*

___

### `Readonly` hotLoading

• **hotLoading**: *[HotLoading](_augur_sdk_src_api_hotloading_.hotloading.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:83](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L83)*

___

### `Readonly` liquidity

• **liquidity**: *[Liquidity](_augur_sdk_src_api_liquidity_.liquidity.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:82](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L82)*

___

### `Readonly` market

• **market**: *[Market](_augur_sdk_src_api_market_.market.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:77](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L77)*

___

### `Readonly` marketInvalidBids

• **marketInvalidBids**: *[MarketInvalidBids](_augur_sdk_src_api_marketinvalidbids_.marketinvalidbids.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:85](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L85)*

___

### `Readonly` onChainTrade

• **onChainTrade**: *[OnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:75](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L75)*

___

### `Readonly` provider

• **provider**: *TProvider*

*Defined in [packages/augur-sdk/src/Augur.ts:126](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L126)*

___

###  syncableFlexSearch

• **syncableFlexSearch**: *[SyncableFlexSearch](_augur_sdk_src_state_db_syncableflexsearch_.syncableflexsearch.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L71)*

___

### `Readonly` trade

• **trade**: *[Trade](_augur_sdk_src_api_trade_.trade.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:76](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L76)*

___

### `Private` txAwaitingSigningCallback

• **txAwaitingSigningCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:92](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L92)*

___

### `Private` txFailureCallback

• **txFailureCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:94](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L94)*

___

### `Private` txFeeTooLowCallback

• **txFeeTooLowCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:95](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L95)*

___

### `Private` txPendingCallback

• **txPendingCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:93](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L93)*

___

### `Private` txRelayerDownCallback

• **txRelayerDownCallback**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)*

*Defined in [packages/augur-sdk/src/Augur.ts:96](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L96)*

___

### `Private` txSuccessCallbacks

• **txSuccessCallbacks**: *[TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)[]*

*Defined in [packages/augur-sdk/src/Augur.ts:97](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L97)*

___

### `Readonly` uniswap

• **uniswap**: *[Uniswap](_augur_sdk_src_api_uniswap_.uniswap.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:79](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L79)*

___

### `Readonly` universe

• **universe**: *[Universe](_augur_sdk_src_state_getter_universe_.universe.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:81](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L81)*

___

### `Readonly` warpSync

• **warpSync**: *[WarpSync](_augur_sdk_src_api_warpsync_.warpsync.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:78](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L78)*

## Accessors

###  networkId

• **get networkId**(): *NetworkId*

*Defined in [packages/augur-sdk/src/Augur.ts:208](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L208)*

**Returns:** *NetworkId*

___

###  sdkReady

• **get sdkReady**(): *boolean*

*Defined in [packages/augur-sdk/src/Augur.ts:121](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L121)*

**Returns:** *boolean*

___

###  signer

• **get signer**(): *EthersSigner*

*Defined in [packages/augur-sdk/src/Augur.ts:439](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L439)*

**Returns:** *EthersSigner*

• **set signer**(`signer`: EthersSigner): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:443](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L443)*

**Parameters:**

Name | Type |
------ | ------ |
`signer` | EthersSigner |

**Returns:** *void*

___

###  warpController

• **get warpController**(): *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)‹›*

*Defined in [packages/augur-sdk/src/Augur.ts:105](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L105)*

**Returns:** *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)‹›*

• **set warpController**(`_warpController`: [WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:101](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`_warpController` | [WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md) |

**Returns:** *void*

___

###  zeroX

• **get zeroX**(): *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

*Defined in [packages/augur-sdk/src/Augur.ts:109](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L109)*

**Returns:** *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

• **set zeroX**(`zeroX`: [ZeroX](_augur_sdk_src_api_zerox_.zerox.md)): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:113](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`zeroX` | [ZeroX](_augur_sdk_src_api_zerox_.zerox.md) |

**Returns:** *void*

## Methods

###  batchCancelOrders

▸ **batchCancelOrders**(`orderHashes`: string[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:631](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L631)*

**Parameters:**

Name | Type |
------ | ------ |
`orderHashes` | string[] |

**Returns:** *Promise‹void›*

___

###  bindTo

▸ **bindTo**‹**R**, **P**›(`f`: function): *function*

*Defined in [packages/augur-sdk/src/Augur.ts:351](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L351)*

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

*Defined in [packages/augur-sdk/src/Augur.ts:626](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L626)*

**Parameters:**

Name | Type |
------ | ------ |
`orderHash` | string |

**Returns:** *Promise‹void›*

___

###  convertGasEstimateToDaiCost

▸ **convertGasEstimateToDaiCost**(`gasEstimate`: BigNumber, `manualGasPrice?`: number): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:297](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L297)*

**Parameters:**

Name | Type |
------ | ------ |
`gasEstimate` | BigNumber |
`manualGasPrice?` | number |

**Returns:** *Promise‹BigNumber›*

___

###  createCategoricalMarket

▸ **createCategoricalMarket**(`params`: [CreateCategoricalMarketParams](../interfaces/_augur_sdk_src_api_market_.createcategoricalmarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:648](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L648)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateCategoricalMarketParams](../interfaces/_augur_sdk_src_api_market_.createcategoricalmarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  createScalarMarket

▸ **createScalarMarket**(`params`: [CreateScalarMarketParams](../interfaces/_augur_sdk_src_api_market_.createscalarmarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:654](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L654)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateScalarMarketParams](../interfaces/_augur_sdk_src_api_market_.createscalarmarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  createYesNoMarket

▸ **createYesNoMarket**(`params`: [CreateYesNoMarketParams](../interfaces/_augur_sdk_src_api_market_.createyesnomarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:642](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L642)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateYesNoMarketParams](../interfaces/_augur_sdk_src_api_market_.createyesnomarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  deRegisterAllTransactionStatusCallbacks

▸ **deRegisterAllTransactionStatusCallbacks**(): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:341](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L341)*

**Returns:** *void*

___

###  deRegisterTransactionStatusCallback

▸ **deRegisterTransactionStatusCallback**(`key`: string): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:337](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L337)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*

___

###  disconnect

▸ **disconnect**(): *Promise‹any›*

*Defined in [packages/augur-sdk/src/Augur.ts:345](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L345)*

**Returns:** *Promise‹any›*

___

###  getAccount

▸ **getAccount**(): *Promise‹string | null›*

*Defined in [packages/augur-sdk/src/Augur.ts:239](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L239)*

**Returns:** *Promise‹string | null›*

___

###  getAccountEthBalance

▸ **getAccountEthBalance**(): *Promise‹string›*

*Defined in [packages/augur-sdk/src/Augur.ts:250](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L250)*

**Returns:** *Promise‹string›*

___

###  getAccountRepStakeSummary

▸ **getAccountRepStakeSummary**(`params`: Parameters‹typeof getAccountRepStakeSummary›[2]): *ReturnType‹typeof getAccountRepStakeSummary›*

*Defined in [packages/augur-sdk/src/Augur.ts:562](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L562)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getAccountRepStakeSummary›[2] |

**Returns:** *ReturnType‹typeof getAccountRepStakeSummary›*

___

###  getAccountTimeRangedStats

▸ **getAccountTimeRangedStats**(`params`: Parameters‹typeof getAccountTimeRangedStats›[2]): *ReturnType‹typeof getAccountTimeRangedStats›*

*Defined in [packages/augur-sdk/src/Augur.ts:533](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L533)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getAccountTimeRangedStats›[2] |

**Returns:** *ReturnType‹typeof getAccountTimeRangedStats›*

___

###  getAccountTransactionHistory

▸ **getAccountTransactionHistory**(`params`: Parameters‹typeof getAccountTransactionHistory›[2]): *ReturnType‹typeof getAccountTransactionHistory›*

*Defined in [packages/augur-sdk/src/Augur.ts:556](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L556)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getAccountTransactionHistory›[2] |

**Returns:** *ReturnType‹typeof getAccountTransactionHistory›*

___

###  getCategoryStats

▸ **getCategoryStats**(`params`: Parameters‹typeof getCategoryStats›[2]): *ReturnType‹typeof getCategoryStats›*

*Defined in [packages/augur-sdk/src/Augur.ts:578](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L578)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getCategoryStats›[2] |

**Returns:** *ReturnType‹typeof getCategoryStats›*

___

###  getDisputeWindow

▸ **getDisputeWindow**(`params`: [GetDisputeWindowParams](../interfaces/_augur_sdk_src_api_hotloading_.getdisputewindowparams.md)): *Promise‹[DisputeWindow](../interfaces/_augur_sdk_src_api_hotloading_.disputewindow.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:594](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L594)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [GetDisputeWindowParams](../interfaces/_augur_sdk_src_api_hotloading_.getdisputewindowparams.md) |

**Returns:** *Promise‹[DisputeWindow](../interfaces/_augur_sdk_src_api_hotloading_.disputewindow.md)›*

___

###  getEthBalance

▸ **getEthBalance**(`address`: string): *Promise‹string›*

*Defined in [packages/augur-sdk/src/Augur.ts:229](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Promise‹string›*

___

###  getExchangeRate

▸ **getExchangeRate**(`max?`: Boolean): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:306](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L306)*

**Parameters:**

Name | Type |
------ | ------ |
`max?` | Boolean |

**Returns:** *Promise‹BigNumber›*

___

###  getGasConfirmEstimate

▸ **getGasConfirmEstimate**(): *Promise‹60 | 180 | 1800›*

*Defined in [packages/augur-sdk/src/Augur.ts:265](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L265)*

**Returns:** *Promise‹60 | 180 | 1800›*

___

###  getGasPrice

▸ **getGasPrice**(): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:234](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L234)*

**Returns:** *Promise‹BigNumber›*

___

###  getMarket

▸ **getMarket**(`address`: string): *Market*

*Defined in [packages/augur-sdk/src/Augur.ts:286](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L286)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Market*

___

###  getMarketLiquidityRanking

▸ **getMarketLiquidityRanking**(`params`: Parameters‹typeof getMarketLiquidityRanking›[2]): *ReturnType‹typeof getMarketLiquidityRanking›*

*Defined in [packages/augur-sdk/src/Augur.ts:473](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L473)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getMarketLiquidityRanking›[2] |

**Returns:** *ReturnType‹typeof getMarketLiquidityRanking›*

___

###  getMarketOrderBook

▸ **getMarketOrderBook**(`params`: Parameters‹typeof getMarketOrderBook›[2]): *ReturnType‹typeof getMarketOrderBook›*

*Defined in [packages/augur-sdk/src/Augur.ts:461](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L461)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getMarketOrderBook›[2] |

**Returns:** *ReturnType‹typeof getMarketOrderBook›*

___

###  getMarketOutcomeBestOffer

▸ **getMarketOutcomeBestOffer**(`params`: Parameters‹typeof getMarketOutcomeBestOffer›[2]): *ReturnType‹typeof getMarketOutcomeBestOffer›*

*Defined in [packages/augur-sdk/src/Augur.ts:600](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L600)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getMarketOutcomeBestOffer›[2] |

**Returns:** *ReturnType‹typeof getMarketOutcomeBestOffer›*

___

###  getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(`params`: Parameters‹typeof getMarketPriceCandlesticks›[2]): *ReturnType‹typeof getMarketPriceCandlesticks›*

*Defined in [packages/augur-sdk/src/Augur.ts:467](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L467)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getMarketPriceCandlesticks›[2] |

**Returns:** *ReturnType‹typeof getMarketPriceCandlesticks›*

___

###  getMarkets

▸ **getMarkets**(`params`: Parameters‹typeof getMarkets›[2]): *ReturnType‹typeof getMarkets›*

*Defined in [packages/augur-sdk/src/Augur.ts:417](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L417)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getMarkets›[2] |

**Returns:** *ReturnType‹typeof getMarkets›*

___

###  getMarketsInfo

▸ **getMarketsInfo**(`params`: Parameters‹typeof getMarketsInfo›[2]): *ReturnType‹typeof getMarketsInfo›*

*Defined in [packages/augur-sdk/src/Augur.ts:423](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L423)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getMarketsInfo›[2] |

**Returns:** *ReturnType‹typeof getMarketsInfo›*

___

###  getMarketsLiquidityPools

▸ **getMarketsLiquidityPools**(`params`: Parameters‹typeof getMarketsLiquidityPools›[2]): *ReturnType‹typeof getMarketsLiquidityPools›*

*Defined in [packages/augur-sdk/src/Augur.ts:606](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L606)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getMarketsLiquidityPools›[2] |

**Returns:** *ReturnType‹typeof getMarketsLiquidityPools›*

___

###  getMostRecentWarpSync

▸ **getMostRecentWarpSync**(): *ReturnType‹typeof getMostRecentWarpSync›*

*Defined in [packages/augur-sdk/src/Augur.ts:497](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L497)*

**Returns:** *ReturnType‹typeof getMostRecentWarpSync›*

___

###  getOrder

▸ **getOrder**(`params`: Parameters‹typeof getZeroXOrder›[2]): *ReturnType‹typeof getZeroXOrder›*

*Defined in [packages/augur-sdk/src/Augur.ts:584](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L584)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getZeroXOrder›[2] |

**Returns:** *ReturnType‹typeof getZeroXOrder›*

___

###  getOrders

▸ **getOrders**(): *Orders*

*Defined in [packages/augur-sdk/src/Augur.ts:290](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L290)*

**Returns:** *Orders*

___

###  getPayoutFromWarpSyncHash

▸ **getPayoutFromWarpSyncHash**(`hash`: string): *Promise‹BigNumber[]›*

*Defined in [packages/augur-sdk/src/Augur.ts:509](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L509)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *Promise‹BigNumber[]›*

___

###  getPlatformActivityStats

▸ **getPlatformActivityStats**(`params`: Parameters‹typeof getPlatformActivityStats›[2]): *ReturnType‹typeof getPlatformActivityStats›*

*Defined in [packages/augur-sdk/src/Augur.ts:573](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L573)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getPlatformActivityStats›[2] |

**Returns:** *ReturnType‹typeof getPlatformActivityStats›*

___

###  getProfitLoss

▸ **getProfitLoss**(`params`: Parameters‹typeof getProfitLoss›[2]): *ReturnType‹typeof getProfitLoss›*

*Defined in [packages/augur-sdk/src/Augur.ts:522](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L522)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getProfitLoss›[2] |

**Returns:** *ReturnType‹typeof getProfitLoss›*

___

###  getProfitLossSummary

▸ **getProfitLossSummary**(`params`: Parameters‹typeof getProfitLossSummary›[2]): *ReturnType‹typeof getProfitLossSummary›*

*Defined in [packages/augur-sdk/src/Augur.ts:527](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L527)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getProfitLossSummary›[2] |

**Returns:** *ReturnType‹typeof getProfitLossSummary›*

___

###  getSyncData

▸ **getSyncData**(): *Promise‹[SyncData](../interfaces/_augur_sdk_src_state_getter_status_.syncdata.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:429](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L429)*

**Returns:** *Promise‹[SyncData](../interfaces/_augur_sdk_src_state_getter_status_.syncdata.md)›*

___

###  getTimestamp

▸ **getTimestamp**(): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:225](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L225)*

**Returns:** *Promise‹BigNumber›*

___

###  getTotalOnChainFrozenFunds

▸ **getTotalOnChainFrozenFunds**(`params`: Parameters‹typeof getTotalOnChainFrozenFunds›[2]): *ReturnType‹typeof getTotalOnChainFrozenFunds›*

*Defined in [packages/augur-sdk/src/Augur.ts:551](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L551)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getTotalOnChainFrozenFunds›[2] |

**Returns:** *ReturnType‹typeof getTotalOnChainFrozenFunds›*

___

###  getTradingHistory

▸ **getTradingHistory**(`params`: Parameters‹typeof getTradingHistory›[2]): *ReturnType‹typeof getTradingHistory›*

*Defined in [packages/augur-sdk/src/Augur.ts:451](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L451)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getTradingHistory›[2] |

**Returns:** *ReturnType‹typeof getTradingHistory›*

___

###  getTradingOrders

▸ **getTradingOrders**(`params`: Parameters‹typeof getOpenOrders›[2]): *ReturnType‹typeof getOpenOrders›*

*Defined in [packages/augur-sdk/src/Augur.ts:456](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L456)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getOpenOrders›[2] |

**Returns:** *ReturnType‹typeof getOpenOrders›*

___

###  getTransaction

▸ **getTransaction**(`hash`: string): *Promise‹TransactionResponse›*

*Defined in [packages/augur-sdk/src/Augur.ts:212](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L212)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *Promise‹TransactionResponse›*

___

###  getUniverse

▸ **getUniverse**(`address`: string): *Universe*

*Defined in [packages/augur-sdk/src/Augur.ts:282](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L282)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Universe*

___

###  getUniverseChildren

▸ **getUniverseChildren**(`params`: Parameters‹typeof getUniverseChildren›[2]): *ReturnType‹typeof getUniverseChildren›*

*Defined in [packages/augur-sdk/src/Augur.ts:666](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L666)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getUniverseChildren›[2] |

**Returns:** *ReturnType‹typeof getUniverseChildren›*

___

###  getUserAccountData

▸ **getUserAccountData**(`params`: Parameters‹typeof getUserAccountData›[2]): *ReturnType‹typeof getUserAccountData›*

*Defined in [packages/augur-sdk/src/Augur.ts:539](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L539)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getUserAccountData›[2] |

**Returns:** *ReturnType‹typeof getUserAccountData›*

___

###  getUserCurrentDisputeStake

▸ **getUserCurrentDisputeStake**(`params`: Parameters‹typeof getUserCurrentDisputeStake›[2]): *ReturnType‹typeof getUserCurrentDisputeStake›*

*Defined in [packages/augur-sdk/src/Augur.ts:568](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L568)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getUserCurrentDisputeStake›[2] |

**Returns:** *ReturnType‹typeof getUserCurrentDisputeStake›*

___

###  getUserFrozenFundsBreakdown

▸ **getUserFrozenFundsBreakdown**(`params`: Parameters‹typeof getUserFrozenFundsBreakdown›[2]): *ReturnType‹typeof getUserFrozenFundsBreakdown›*

*Defined in [packages/augur-sdk/src/Augur.ts:491](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L491)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getUserFrozenFundsBreakdown›[2] |

**Returns:** *ReturnType‹typeof getUserFrozenFundsBreakdown›*

___

###  getUserOpenOrders

▸ **getUserOpenOrders**(`params`: Parameters‹typeof getUserOpenOrders›[2]): *ReturnType‹typeof getUserOpenOrders›*

*Defined in [packages/augur-sdk/src/Augur.ts:485](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L485)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getUserOpenOrders›[2] |

**Returns:** *ReturnType‹typeof getUserOpenOrders›*

___

###  getUserPositionsPlus

▸ **getUserPositionsPlus**(`params`: Parameters‹typeof getUserPositionsPlus›[2]): *ReturnType‹typeof getUserPositionsPlus›*

*Defined in [packages/augur-sdk/src/Augur.ts:545](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L545)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getUserPositionsPlus›[2] |

**Returns:** *ReturnType‹typeof getUserPositionsPlus›*

___

###  getUserTradingPositions

▸ **getUserTradingPositions**(`params`: Parameters‹typeof getUserTradingPositions›[2]): *ReturnType‹typeof getUserTradingPositions›*

*Defined in [packages/augur-sdk/src/Augur.ts:479](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L479)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getUserTradingPositions›[2] |

**Returns:** *ReturnType‹typeof getUserTradingPositions›*

___

###  getWarpSyncHashFromPayout

▸ **getWarpSyncHashFromPayout**(`payout`: BigNumber[]): *string*

*Defined in [packages/augur-sdk/src/Augur.ts:513](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L513)*

**Parameters:**

Name | Type |
------ | ------ |
`payout` | BigNumber[] |

**Returns:** *string*

___

###  getWarpSyncMarket

▸ **getWarpSyncMarket**(`universe`: string): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/Augur.ts:517](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L517)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |

**Returns:** *Promise‹Market›*

___

###  getWarpSyncStatus

▸ **getWarpSyncStatus**(): *ReturnType‹typeof getWarpSyncStatus›*

*Defined in [packages/augur-sdk/src/Augur.ts:503](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L503)*

**Returns:** *ReturnType‹typeof getWarpSyncStatus›*

___

###  getZeroXOrders

▸ **getZeroXOrders**(`params`: Parameters‹typeof getZeroXOrders›[2]): *Promise‹ZeroXOrders›*

*Defined in [packages/augur-sdk/src/Augur.ts:433](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L433)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Parameters‹typeof getZeroXOrders›[2] |

**Returns:** *Promise‹ZeroXOrders›*

___

###  hotloadMarket

▸ **hotloadMarket**(`marketId`: string): *Promise‹[HotLoadMarketInfo](../interfaces/_augur_sdk_src_api_hotloading_.hotloadmarketinfo.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:590](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L590)*

**Parameters:**

Name | Type |
------ | ------ |
`marketId` | string |

**Returns:** *Promise‹[HotLoadMarketInfo](../interfaces/_augur_sdk_src_api_hotloading_.hotloadmarketinfo.md)›*

___

###  listAccounts

▸ **listAccounts**(): *Promise‹string[]›*

*Defined in [packages/augur-sdk/src/Augur.ts:217](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L217)*

**Returns:** *Promise‹string[]›*

___

###  off

▸ **off**(`eventName`: SubscriptionEventName | TXEventName | string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:391](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L391)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; TXEventName &#124; string |

**Returns:** *Promise‹void›*

___

###  on

▸ **on**(`eventName`: SubscriptionEventName | TXEventName | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback) | [TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:370](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L370)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; TXEventName &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) &#124; [TXStatusCallback](../modules/_augur_sdk_src_events_.md#txstatuscallback) |

**Returns:** *Promise‹void›*

___

###  pinHashByGatewayUrl

▸ **pinHashByGatewayUrl**(`url`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:618](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L618)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *Promise‹void›*

___

###  placeTrade

▸ **placeTrade**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/Augur.ts:622](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L622)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹boolean›*

___

###  registerTransactionStatusCallback

▸ **registerTransactionStatusCallback**(`key`: string, `callback`: TransactionStatusCallback): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:330](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L330)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`callback` | TransactionStatusCallback |

**Returns:** *void*

___

### `Private` registerTransactionStatusEvents

▸ **registerTransactionStatusEvents**(): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:672](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L672)*

**Returns:** *void*

___

###  sendETH

▸ **sendETH**(`address`: string, `value`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/Augur.ts:255](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L255)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`value` | BigNumber |

**Returns:** *Promise‹void›*

___

###  setLoggerLevel

▸ **setLoggerLevel**(`logLevel`: LoggerLevels): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:364](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L364)*

**Parameters:**

Name | Type |
------ | ------ |
`logLevel` | LoggerLevels |

**Returns:** *void*

___

###  setProvider

▸ **setProvider**(`provider`: JsonRpcProvider): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:447](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L447)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | JsonRpcProvider |

**Returns:** *void*

___

###  signMessage

▸ **signMessage**(`message`: Arrayish): *Promise‹string›*

*Defined in [packages/augur-sdk/src/Augur.ts:221](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L221)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Arrayish |

**Returns:** *Promise‹string›*

___

###  simulateTrade

▸ **simulateTrade**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹[SimulateTradeData](../interfaces/_augur_sdk_src_api_trade_.simulatetradedata.md)›*

*Defined in [packages/augur-sdk/src/Augur.ts:612](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L612)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹[SimulateTradeData](../interfaces/_augur_sdk_src_api_trade_.simulatetradedata.md)›*

___

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/Augur.ts:660](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L660)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹BigNumber›*

___

###  txSuccessCallback

▸ **txSuccessCallback**(...`args`: TXStatus[]): *void*

*Defined in [packages/augur-sdk/src/Augur.ts:411](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L411)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | TXStatus[] |

**Returns:** *void*

___

### `Static` create

▸ **create**‹**TProvider**›(`provider`: TProvider, `dependencies`: ContractDependenciesEthers, `config`: SDKConfiguration, `connector`: [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md), `zeroX`: [ZeroX](_augur_sdk_src_api_zerox_.zerox.md), `enableFlexSearch`: boolean): *Promise‹[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)››*

*Defined in [packages/augur-sdk/src/Augur.ts:188](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/Augur.ts#L188)*

**Type parameters:**

▪ **TProvider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | TProvider | - |
`dependencies` | ContractDependenciesEthers | - |
`config` | SDKConfiguration | - |
`connector` | [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md) | new SingleThreadConnector() |
`zeroX` | [ZeroX](_augur_sdk_src_api_zerox_.zerox.md) | null |
`enableFlexSearch` | boolean | false |

**Returns:** *Promise‹[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)››*

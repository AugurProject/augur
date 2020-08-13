[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/Contracts"](../modules/_augur_sdk_src_api_contracts_.md) › [Contracts](_augur_sdk_src_api_contracts_.contracts.md)

# Class: Contracts

## Hierarchy

* **Contracts**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_contracts_.contracts.md#constructor)

### Properties

* [ZeroXTrade](_augur_sdk_src_api_contracts_.contracts.md#zeroxtrade)
* [affiliateValidator](_augur_sdk_src_api_contracts_.contracts.md#affiliatevalidator)
* [affiliates](_augur_sdk_src_api_contracts_.contracts.md#affiliates)
* [auditFunds](_augur_sdk_src_api_contracts_.contracts.md#auditfunds)
* [augur](_augur_sdk_src_api_contracts_.contracts.md#augur)
* [augurTrading](_augur_sdk_src_api_contracts_.contracts.md#augurtrading)
* [augurWalletRegistry](_augur_sdk_src_api_contracts_.contracts.md#augurwalletregistry)
* [buyParticipationTokens](_augur_sdk_src_api_contracts_.contracts.md#buyparticipationtokens)
* [cancelOrder](_augur_sdk_src_api_contracts_.contracts.md#cancelorder)
* [cash](_augur_sdk_src_api_contracts_.contracts.md#cash)
* [createOrder](_augur_sdk_src_api_contracts_.contracts.md#createorder)
* [dependencies](_augur_sdk_src_api_contracts_.contracts.md#private-readonly-dependencies)
* [ethExchange](_augur_sdk_src_api_contracts_.contracts.md#ethexchange)
* [fillOrder](_augur_sdk_src_api_contracts_.contracts.md#fillorder)
* [hotLoading](_augur_sdk_src_api_contracts_.contracts.md#hotloading)
* [legacyReputationToken](_augur_sdk_src_api_contracts_.contracts.md#legacyreputationtoken)
* [orders](_augur_sdk_src_api_contracts_.contracts.md#orders)
* [profitLoss](_augur_sdk_src_api_contracts_.contracts.md#profitloss)
* [redeemStake](_augur_sdk_src_api_contracts_.contracts.md#redeemstake)
* [relayHub](_augur_sdk_src_api_contracts_.contracts.md#relayhub)
* [reputationToken](_augur_sdk_src_api_contracts_.contracts.md#reputationtoken)
* [shareToken](_augur_sdk_src_api_contracts_.contracts.md#sharetoken)
* [simulateTrade](_augur_sdk_src_api_contracts_.contracts.md#simulatetrade)
* [time](_augur_sdk_src_api_contracts_.contracts.md#time)
* [trade](_augur_sdk_src_api_contracts_.contracts.md#trade)
* [uniswap](_augur_sdk_src_api_contracts_.contracts.md#uniswap)
* [uniswapV2Factory](_augur_sdk_src_api_contracts_.contracts.md#uniswapv2factory)
* [universe](_augur_sdk_src_api_contracts_.contracts.md#universe)
* [usdc](_augur_sdk_src_api_contracts_.contracts.md#usdc)
* [usdt](_augur_sdk_src_api_contracts_.contracts.md#usdt)
* [warpSync](_augur_sdk_src_api_contracts_.contracts.md#warpsync)
* [weth](_augur_sdk_src_api_contracts_.contracts.md#weth)
* [zeroXExchange](_augur_sdk_src_api_contracts_.contracts.md#zeroxexchange)

### Methods

* [augurWalletFromAddress](_augur_sdk_src_api_contracts_.contracts.md#augurwalletfromaddress)
* [disputeWindowFromAddress](_augur_sdk_src_api_contracts_.contracts.md#disputewindowfromaddress)
* [getInitialReporter](_augur_sdk_src_api_contracts_.contracts.md#getinitialreporter)
* [getReportingParticipant](_augur_sdk_src_api_contracts_.contracts.md#getreportingparticipant)
* [getReputationToken](_augur_sdk_src_api_contracts_.contracts.md#getreputationtoken)
* [getTime](_augur_sdk_src_api_contracts_.contracts.md#gettime)
* [isTimeControlled](_augur_sdk_src_api_contracts_.contracts.md#istimecontrolled)
* [marketFromAddress](_augur_sdk_src_api_contracts_.contracts.md#marketfromaddress)
* [reputationTokenFromAddress](_augur_sdk_src_api_contracts_.contracts.md#reputationtokenfromaddress)
* [setReputationToken](_augur_sdk_src_api_contracts_.contracts.md#setreputationtoken)
* [shareTokenFromAddress](_augur_sdk_src_api_contracts_.contracts.md#sharetokenfromaddress)
* [uniswapExchangeFromAddress](_augur_sdk_src_api_contracts_.contracts.md#uniswapexchangefromaddress)
* [universeFromAddress](_augur_sdk_src_api_contracts_.contracts.md#universefromaddress)

## Constructors

###  constructor

\+ **new Contracts**(`addresses`: ContractAddresses, `dependencies`: ContractDependenciesEthers): *[Contracts](_augur_sdk_src_api_contracts_.contracts.md)*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:47](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`addresses` | ContractAddresses |
`dependencies` | ContractDependenciesEthers |

**Returns:** *[Contracts](_augur_sdk_src_api_contracts_.contracts.md)*

## Properties

###  ZeroXTrade

• **ZeroXTrade**: *ZeroXTrade*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:29](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L29)*

___

###  affiliateValidator

• **affiliateValidator**: *AffiliateValidator*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:35](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L35)*

___

###  affiliates

• **affiliates**: *Affiliates*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L34)*

___

###  auditFunds

• **auditFunds**: *AuditFunds*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:44](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L44)*

___

###  augur

• **augur**: *Augur*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:14](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L14)*

___

###  augurTrading

• **augurTrading**: *AugurTrading*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:15](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L15)*

___

###  augurWalletRegistry

• **augurWalletRegistry**: *AugurWalletRegistry*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L40)*

___

###  buyParticipationTokens

• **buyParticipationTokens**: *BuyParticipationTokens*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:30](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L30)*

___

###  cancelOrder

• **cancelOrder**: *CancelOrder*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:22](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L22)*

___

###  cash

• **cash**: *Cash*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L17)*

___

###  createOrder

• **createOrder**: *CreateOrder*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L21)*

___

### `Private` `Readonly` dependencies

• **dependencies**: *ContractDependenciesEthers*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:47](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L47)*

___

###  ethExchange

• **ethExchange**: *UniswapV2Pair*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:38](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L38)*

___

###  fillOrder

• **fillOrder**: *FillOrder*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L23)*

___

###  hotLoading

• **hotLoading**: *HotLoading*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L32)*

___

###  legacyReputationToken

• **legacyReputationToken**: *LegacyReputationToken*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:27](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L27)*

___

###  orders

• **orders**: *Orders*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:20](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L20)*

___

###  profitLoss

• **profitLoss**: *ProfitLoss*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:36](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L36)*

___

###  redeemStake

• **redeemStake**: *RedeemStake*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:31](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L31)*

___

###  relayHub

• **relayHub**: *RelayHub*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:41](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L41)*

___

###  reputationToken

• **reputationToken**: *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken) | null* = null

*Defined in [packages/augur-sdk/src/api/Contracts.ts:46](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L46)*

___

###  shareToken

• **shareToken**: *ShareToken*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:25](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L25)*

___

###  simulateTrade

• **simulateTrade**: *SimulateTrade*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:28](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L28)*

___

###  time

• **time**: *[SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime) | void*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:26](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L26)*

___

###  trade

• **trade**: *Trade*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:24](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L24)*

___

###  uniswap

• **uniswap**: *UniswapV2Router02*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:43](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L43)*

___

###  uniswapV2Factory

• **uniswapV2Factory**: *UniswapV2Factory*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L37)*

___

###  universe

• **universe**: *Universe*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L16)*

___

###  usdc

• **usdc**: *USDC*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L18)*

___

###  usdt

• **usdt**: *USDT*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L19)*

___

###  warpSync

• **warpSync**: *WarpSync*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:39](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L39)*

___

###  weth

• **weth**: *WETH9*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:42](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L42)*

___

###  zeroXExchange

• **zeroXExchange**: *Exchange*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:33](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L33)*

## Methods

###  augurWalletFromAddress

▸ **augurWalletFromAddress**(`address`: string): *AugurWallet*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:241](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L241)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *AugurWallet*

___

###  disputeWindowFromAddress

▸ **disputeWindowFromAddress**(`address`: string): *DisputeWindow*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:211](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L211)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *DisputeWindow*

___

###  getInitialReporter

▸ **getInitialReporter**(`initialReporterAddress`: string): *InitialReporter*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:215](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L215)*

**Parameters:**

Name | Type |
------ | ------ |
`initialReporterAddress` | string |

**Returns:** *InitialReporter*

___

###  getReportingParticipant

▸ **getReportingParticipant**(`reportingParticipantAddress`: string): *DisputeCrowdsourcer*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:224](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L224)*

**Parameters:**

Name | Type |
------ | ------ |
`reportingParticipantAddress` | string |

**Returns:** *DisputeCrowdsourcer*

___

###  getReputationToken

▸ **getReputationToken**(): *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:176](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L176)*

**Returns:** *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

___

###  getTime

▸ **getTime**(): *[SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime)*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:166](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L166)*

**Returns:** *[SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime)*

___

###  isTimeControlled

▸ **isTimeControlled**(`contract`: [SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime)): *contract is TimeControlled*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:233](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L233)*

**Parameters:**

Name | Type |
------ | ------ |
`contract` | [SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime) |

**Returns:** *contract is TimeControlled*

___

###  marketFromAddress

▸ **marketFromAddress**(`address`: string): *Market*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:203](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Market*

___

###  reputationTokenFromAddress

▸ **reputationTokenFromAddress**(`address`: string, `networkId`: string): *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:191](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`networkId` | string |

**Returns:** *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

___

###  setReputationToken

▸ **setReputationToken**(`networkId`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:186](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L186)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹void›*

___

###  shareTokenFromAddress

▸ **shareTokenFromAddress**(`address`: string): *ShareToken*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:207](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L207)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *ShareToken*

___

###  uniswapExchangeFromAddress

▸ **uniswapExchangeFromAddress**(`address`: string): *UniswapV2Pair*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:245](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L245)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *UniswapV2Pair*

___

###  universeFromAddress

▸ **universeFromAddress**(`address`: string): *Universe*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:199](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Contracts.ts#L199)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Universe*

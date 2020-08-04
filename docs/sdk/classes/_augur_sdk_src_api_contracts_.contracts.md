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
* [dependencies](_augur_sdk_src_api_contracts_.contracts.md#private-dependencies)
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

*Defined in [packages/augur-sdk/src/api/Contracts.ts:42](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`addresses` | ContractAddresses |
`dependencies` | ContractDependenciesEthers |

**Returns:** *[Contracts](_augur_sdk_src_api_contracts_.contracts.md)*

## Properties

###  ZeroXTrade

• **ZeroXTrade**: *ZeroXTrade*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L23)*

___

###  affiliateValidator

• **affiliateValidator**: *AffiliateValidator*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:30](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L30)*

___

###  affiliates

• **affiliates**: *Affiliates*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:29](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L29)*

___

###  auditFunds

• **auditFunds**: *AuditFunds*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:39](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L39)*

___

###  augur

• **augur**: *Augur*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:10](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L10)*

___

###  augurTrading

• **augurTrading**: *AugurTrading*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L11)*

___

###  augurWalletRegistry

• **augurWalletRegistry**: *AugurWalletRegistry*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L35)*

___

###  buyParticipationTokens

• **buyParticipationTokens**: *BuyParticipationTokens*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L24)*

___

###  cancelOrder

• **cancelOrder**: *CancelOrder*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L16)*

___

###  cash

• **cash**: *Cash*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:13](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L13)*

___

###  createOrder

• **createOrder**: *CreateOrder*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L15)*

___

### `Private` dependencies

• **dependencies**: *ContractDependenciesEthers*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:42](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L42)*

___

###  ethExchange

• **ethExchange**: *UniswapV2Pair*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:33](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L33)*

___

###  fillOrder

• **fillOrder**: *FillOrder*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L17)*

___

###  hotLoading

• **hotLoading**: *HotLoading*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L27)*

___

###  legacyReputationToken

• **legacyReputationToken**: *LegacyReputationToken*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L21)*

___

###  orders

• **orders**: *Orders*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L14)*

___

###  profitLoss

• **profitLoss**: *ProfitLoss*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:31](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L31)*

___

###  redeemStake

• **redeemStake**: *RedeemStake*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:25](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L25)*

___

###  relayHub

• **relayHub**: *RelayHub*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:36](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L36)*

___

###  reputationToken

• **reputationToken**: *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken) | null* = null

*Defined in [packages/augur-sdk/src/api/Contracts.ts:41](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L41)*

___

###  shareToken

• **shareToken**: *ShareToken*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L19)*

___

###  simulateTrade

• **simulateTrade**: *SimulateTrade*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L22)*

___

###  time

• **time**: *[SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime) | void*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L20)*

___

###  trade

• **trade**: *Trade*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L18)*

___

###  uniswap

• **uniswap**: *UniswapV2Router02*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:38](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L38)*

___

###  uniswapV2Factory

• **uniswapV2Factory**: *UniswapV2Factory*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:32](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L32)*

___

###  universe

• **universe**: *Universe*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L12)*

___

###  warpSync

• **warpSync**: *WarpSync*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:34](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L34)*

___

###  weth

• **weth**: *WETH9*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:37](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L37)*

___

###  zeroXExchange

• **zeroXExchange**: *Exchange*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:28](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L28)*

## Methods

###  augurWalletFromAddress

▸ **augurWalletFromAddress**(`address`: string): *AugurWallet*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:139](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L139)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *AugurWallet*

___

###  disputeWindowFromAddress

▸ **disputeWindowFromAddress**(`address`: string): *DisputeWindow*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:123](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *DisputeWindow*

___

###  getInitialReporter

▸ **getInitialReporter**(`initialReporterAddress`: string): *InitialReporter*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:127](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L127)*

**Parameters:**

Name | Type |
------ | ------ |
`initialReporterAddress` | string |

**Returns:** *InitialReporter*

___

###  getReportingParticipant

▸ **getReportingParticipant**(`reportingParticipantAddress`: string): *DisputeCrowdsourcer*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:131](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`reportingParticipantAddress` | string |

**Returns:** *DisputeCrowdsourcer*

___

###  getReputationToken

▸ **getReputationToken**(): *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:93](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L93)*

**Returns:** *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

___

###  getTime

▸ **getTime**(): *[SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime)*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:85](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L85)*

**Returns:** *[SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime)*

___

###  isTimeControlled

▸ **isTimeControlled**(`contract`: [SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime)): *contract is TimeControlled*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:135](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L135)*

**Parameters:**

Name | Type |
------ | ------ |
`contract` | [SomeTime](../modules/_augur_sdk_src_api_contracts_.md#sometime) |

**Returns:** *contract is TimeControlled*

___

###  marketFromAddress

▸ **marketFromAddress**(`address`: string): *Market*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:115](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Market*

___

###  reputationTokenFromAddress

▸ **reputationTokenFromAddress**(`address`: string, `networkId`: string): *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:106](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`networkId` | string |

**Returns:** *[SomeRepToken](../modules/_augur_sdk_src_api_contracts_.md#somereptoken)*

___

###  setReputationToken

▸ **setReputationToken**(`networkId`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:101](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹void›*

___

###  shareTokenFromAddress

▸ **shareTokenFromAddress**(`address`: string): *ShareToken*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:119](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *ShareToken*

___

###  uniswapExchangeFromAddress

▸ **uniswapExchangeFromAddress**(`address`: string): *UniswapV2Pair*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:143](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L143)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *UniswapV2Pair*

___

###  universeFromAddress

▸ **universeFromAddress**(`address`: string): *Universe*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:111](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Contracts.ts#L111)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Universe*

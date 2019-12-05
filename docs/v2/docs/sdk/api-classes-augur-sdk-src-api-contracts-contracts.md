---
id: api-classes-augur-sdk-src-api-contracts-contracts
title: Contracts
sidebar_label: Contracts
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/Contracts Module]](api-modules-augur-sdk-src-api-contracts-module.md) > [Contracts](api-classes-augur-sdk-src-api-contracts-contracts.md)

## Class

## Hierarchy

**Contracts**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-contracts-contracts.md#constructor)

### Properties

* [ZeroXTrade](api-classes-augur-sdk-src-api-contracts-contracts.md#zeroxtrade)
* [affiliateValidator](api-classes-augur-sdk-src-api-contracts-contracts.md#affiliatevalidator)
* [affiliates](api-classes-augur-sdk-src-api-contracts-contracts.md#affiliates)
* [augur](api-classes-augur-sdk-src-api-contracts-contracts.md#augur)
* [augurTrading](api-classes-augur-sdk-src-api-contracts-contracts.md#augurtrading)
* [buyParticipationTokens](api-classes-augur-sdk-src-api-contracts-contracts.md#buyparticipationtokens)
* [cancelOrder](api-classes-augur-sdk-src-api-contracts-contracts.md#cancelorder)
* [cash](api-classes-augur-sdk-src-api-contracts-contracts.md#cash)
* [cashFaucet](api-classes-augur-sdk-src-api-contracts-contracts.md#cashfaucet)
* [createOrder](api-classes-augur-sdk-src-api-contracts-contracts.md#createorder)
* [dependencies](api-classes-augur-sdk-src-api-contracts-contracts.md#dependencies)
* [fillOrder](api-classes-augur-sdk-src-api-contracts-contracts.md#fillorder)
* [gnosisSafe](api-classes-augur-sdk-src-api-contracts-contracts.md#gnosissafe)
* [gnosisSafeRegistry](api-classes-augur-sdk-src-api-contracts-contracts.md#gnosissaferegistry)
* [hotLoading](api-classes-augur-sdk-src-api-contracts-contracts.md#hotloading)
* [legacyReputationToken](api-classes-augur-sdk-src-api-contracts-contracts.md#legacyreputationtoken)
* [orders](api-classes-augur-sdk-src-api-contracts-contracts.md#orders)
* [proxyFactory](api-classes-augur-sdk-src-api-contracts-contracts.md#proxyfactory)
* [redeemStake](api-classes-augur-sdk-src-api-contracts-contracts.md#redeemstake)
* [reputationToken](api-classes-augur-sdk-src-api-contracts-contracts.md#reputationtoken)
* [shareToken](api-classes-augur-sdk-src-api-contracts-contracts.md#sharetoken)
* [simulateTrade](api-classes-augur-sdk-src-api-contracts-contracts.md#simulatetrade)
* [time](api-classes-augur-sdk-src-api-contracts-contracts.md#time)
* [trade](api-classes-augur-sdk-src-api-contracts-contracts.md#trade)
* [universe](api-classes-augur-sdk-src-api-contracts-contracts.md#universe)
* [zeroXExchange](api-classes-augur-sdk-src-api-contracts-contracts.md#zeroxexchange)

### Methods

* [disputeWindowFromAddress](api-classes-augur-sdk-src-api-contracts-contracts.md#disputewindowfromaddress)
* [getInitialReporter](api-classes-augur-sdk-src-api-contracts-contracts.md#getinitialreporter)
* [getReportingParticipant](api-classes-augur-sdk-src-api-contracts-contracts.md#getreportingparticipant)
* [getReputationToken](api-classes-augur-sdk-src-api-contracts-contracts.md#getreputationtoken)
* [getTime](api-classes-augur-sdk-src-api-contracts-contracts.md#gettime)
* [gnosisSafeFromAddress](api-classes-augur-sdk-src-api-contracts-contracts.md#gnosissafefromaddress)
* [isTimeControlled](api-classes-augur-sdk-src-api-contracts-contracts.md#istimecontrolled)
* [marketFromAddress](api-classes-augur-sdk-src-api-contracts-contracts.md#marketfromaddress)
* [reputationTokenFromAddress](api-classes-augur-sdk-src-api-contracts-contracts.md#reputationtokenfromaddress)
* [setReputationToken](api-classes-augur-sdk-src-api-contracts-contracts.md#setreputationtoken)
* [shareTokenFromAddress](api-classes-augur-sdk-src-api-contracts-contracts.md#sharetokenfromaddress)
* [universeFromAddress](api-classes-augur-sdk-src-api-contracts-contracts.md#universefromaddress)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Contracts**(addresses: *`ContractAddresses`*, dependencies: *`ContractDependenciesEthers`*): [Contracts](api-classes-augur-sdk-src-api-contracts-contracts.md)

*Defined in [augur-sdk/src/api/Contracts.ts:35](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L35)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| addresses | `ContractAddresses` |
| dependencies | `ContractDependenciesEthers` |

**Returns:** [Contracts](api-classes-augur-sdk-src-api-contracts-contracts.md)

___

## Properties

<a id="zeroxtrade"></a>

###  ZeroXTrade

**● ZeroXTrade**: *`ZeroXTrade`*

*Defined in [augur-sdk/src/api/Contracts.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L24)*

___
<a id="affiliatevalidator"></a>

###  affiliateValidator

**● affiliateValidator**: *`AffiliateValidator`*

*Defined in [augur-sdk/src/api/Contracts.ts:32](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L32)*

___
<a id="affiliates"></a>

###  affiliates

**● affiliates**: *`Affiliates`*

*Defined in [augur-sdk/src/api/Contracts.ts:31](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L31)*

___
<a id="augur"></a>

###  augur

**● augur**: *`Augur`*

*Defined in [augur-sdk/src/api/Contracts.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L9)*

___
<a id="augurtrading"></a>

###  augurTrading

**● augurTrading**: *`AugurTrading`*

*Defined in [augur-sdk/src/api/Contracts.ts:10](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L10)*

___
<a id="buyparticipationtokens"></a>

###  buyParticipationTokens

**● buyParticipationTokens**: *`BuyParticipationTokens`*

*Defined in [augur-sdk/src/api/Contracts.ts:25](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L25)*

___
<a id="cancelorder"></a>

###  cancelOrder

**● cancelOrder**: *`CancelOrder`*

*Defined in [augur-sdk/src/api/Contracts.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L15)*

___
<a id="cash"></a>

###  cash

**● cash**: *`Cash`*

*Defined in [augur-sdk/src/api/Contracts.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L12)*

___
<a id="cashfaucet"></a>

###  cashFaucet

**● cashFaucet**: *`CashFaucet`*

*Defined in [augur-sdk/src/api/Contracts.ts:27](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L27)*

___
<a id="createorder"></a>

###  createOrder

**● createOrder**: *`CreateOrder`*

*Defined in [augur-sdk/src/api/Contracts.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L14)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesEthers`*

*Defined in [augur-sdk/src/api/Contracts.ts:35](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L35)*

___
<a id="fillorder"></a>

###  fillOrder

**● fillOrder**: *`FillOrder`*

*Defined in [augur-sdk/src/api/Contracts.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L16)*

___
<a id="gnosissafe"></a>

###  gnosisSafe

**● gnosisSafe**: *`GnosisSafe`*

*Defined in [augur-sdk/src/api/Contracts.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L22)*

___
<a id="gnosissaferegistry"></a>

###  gnosisSafeRegistry

**● gnosisSafeRegistry**: *`GnosisSafeRegistry`*

*Defined in [augur-sdk/src/api/Contracts.ts:28](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L28)*

___
<a id="hotloading"></a>

###  hotLoading

**● hotLoading**: *`HotLoading`*

*Defined in [augur-sdk/src/api/Contracts.ts:29](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L29)*

___
<a id="legacyreputationtoken"></a>

###  legacyReputationToken

**● legacyReputationToken**: *`LegacyReputationToken`*

*Defined in [augur-sdk/src/api/Contracts.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L20)*

___
<a id="orders"></a>

###  orders

**● orders**: *`Orders`*

*Defined in [augur-sdk/src/api/Contracts.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L13)*

___
<a id="proxyfactory"></a>

###  proxyFactory

**● proxyFactory**: *`ProxyFactory`*

*Defined in [augur-sdk/src/api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L23)*

___
<a id="redeemstake"></a>

###  redeemStake

**● redeemStake**: *`RedeemStake`*

*Defined in [augur-sdk/src/api/Contracts.ts:26](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L26)*

___
<a id="reputationtoken"></a>

###  reputationToken

**● reputationToken**: *[SomeRepToken](api-modules-augur-sdk-src-api-contracts-module.md#somereptoken) \| `null`* =  null

*Defined in [augur-sdk/src/api/Contracts.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L34)*

___
<a id="sharetoken"></a>

###  shareToken

**● shareToken**: *`ShareToken`*

*Defined in [augur-sdk/src/api/Contracts.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L18)*

___
<a id="simulatetrade"></a>

###  simulateTrade

**● simulateTrade**: *`SimulateTrade`*

*Defined in [augur-sdk/src/api/Contracts.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L21)*

___
<a id="time"></a>

###  time

**● time**: *[SomeTime](api-modules-augur-sdk-src-api-contracts-module.md#sometime) \| `void`*

*Defined in [augur-sdk/src/api/Contracts.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L19)*

___
<a id="trade"></a>

###  trade

**● trade**: *`Trade`*

*Defined in [augur-sdk/src/api/Contracts.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L17)*

___
<a id="universe"></a>

###  universe

**● universe**: *`Universe`*

*Defined in [augur-sdk/src/api/Contracts.ts:11](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L11)*

___
<a id="zeroxexchange"></a>

###  zeroXExchange

**● zeroXExchange**: *`Exchange`*

*Defined in [augur-sdk/src/api/Contracts.ts:30](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L30)*

___

## Methods

<a id="disputewindowfromaddress"></a>

###  disputeWindowFromAddress

▸ **disputeWindowFromAddress**(address: *`string`*): `DisputeWindow`

*Defined in [augur-sdk/src/api/Contracts.ts:110](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L110)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `DisputeWindow`

___
<a id="getinitialreporter"></a>

###  getInitialReporter

▸ **getInitialReporter**(initialReporterAddress: *`string`*): `InitialReporter`

*Defined in [augur-sdk/src/api/Contracts.ts:114](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L114)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| initialReporterAddress | `string` |

**Returns:** `InitialReporter`

___
<a id="getreportingparticipant"></a>

###  getReportingParticipant

▸ **getReportingParticipant**(reportingParticipantAddress: *`string`*): `DisputeCrowdsourcer`

*Defined in [augur-sdk/src/api/Contracts.ts:118](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L118)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| reportingParticipantAddress | `string` |

**Returns:** `DisputeCrowdsourcer`

___
<a id="getreputationtoken"></a>

###  getReputationToken

▸ **getReputationToken**(): [SomeRepToken](api-modules-augur-sdk-src-api-contracts-module.md#somereptoken)

*Defined in [augur-sdk/src/api/Contracts.ts:80](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L80)*

**Returns:** [SomeRepToken](api-modules-augur-sdk-src-api-contracts-module.md#somereptoken)

___
<a id="gettime"></a>

###  getTime

▸ **getTime**(): [SomeTime](api-modules-augur-sdk-src-api-contracts-module.md#sometime)

*Defined in [augur-sdk/src/api/Contracts.ts:72](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L72)*

**Returns:** [SomeTime](api-modules-augur-sdk-src-api-contracts-module.md#sometime)

___
<a id="gnosissafefromaddress"></a>

###  gnosisSafeFromAddress

▸ **gnosisSafeFromAddress**(address: *`string`*): `GnosisSafe`

*Defined in [augur-sdk/src/api/Contracts.ts:126](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L126)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `GnosisSafe`

___
<a id="istimecontrolled"></a>

###  isTimeControlled

▸ **isTimeControlled**(contract: *[SomeTime](api-modules-augur-sdk-src-api-contracts-module.md#sometime)*): `boolean`

*Defined in [augur-sdk/src/api/Contracts.ts:122](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L122)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contract | [SomeTime](api-modules-augur-sdk-src-api-contracts-module.md#sometime) |

**Returns:** `boolean`

___
<a id="marketfromaddress"></a>

###  marketFromAddress

▸ **marketFromAddress**(address: *`string`*): `Market`

*Defined in [augur-sdk/src/api/Contracts.ts:102](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L102)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Market`

___
<a id="reputationtokenfromaddress"></a>

###  reputationTokenFromAddress

▸ **reputationTokenFromAddress**(address: *`string`*, networkId: *`string`*): [SomeRepToken](api-modules-augur-sdk-src-api-contracts-module.md#somereptoken)

*Defined in [augur-sdk/src/api/Contracts.ts:93](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |
| networkId | `string` |

**Returns:** [SomeRepToken](api-modules-augur-sdk-src-api-contracts-module.md#somereptoken)

___
<a id="setreputationtoken"></a>

###  setReputationToken

▸ **setReputationToken**(networkId: *`string`*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/Contracts.ts:88](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |

**Returns:** `Promise`<`void`>

___
<a id="sharetokenfromaddress"></a>

###  shareTokenFromAddress

▸ **shareTokenFromAddress**(address: *`string`*): `ShareToken`

*Defined in [augur-sdk/src/api/Contracts.ts:106](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L106)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ShareToken`

___
<a id="universefromaddress"></a>

###  universeFromAddress

▸ **universeFromAddress**(address: *`string`*): `Universe`

*Defined in [augur-sdk/src/api/Contracts.ts:98](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Contracts.ts#L98)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Universe`

___


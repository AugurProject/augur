---
id: api-classes-packages-augur-sdk-src-api-contracts-contracts
title: Contracts
sidebar_label: Contracts
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/api/Contracts Module]](api-modules-packages-augur-sdk-src-api-contracts-module.md) > [Contracts](api-classes-packages-augur-sdk-src-api-contracts-contracts.md)

## Class

## Hierarchy

**Contracts**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#augur)
* [cancelOrder](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#cancelorder)
* [cash](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#cash)
* [claimTradingProceeds](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#claimtradingproceeds)
* [completeSets](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#completesets)
* [createOrder](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#createorder)
* [dependencies](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#dependencies)
* [fillOrder](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#fillorder)
* [gnosisSafe](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#gnosissafe)
* [legacyReputationToken](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#legacyreputationtoken)
* [orders](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#orders)
* [proxyFactory](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#proxyfactory)
* [reputationToken](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#reputationtoken)
* [simulateTrade](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#simulatetrade)
* [time](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#time)
* [trade](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#trade)
* [universe](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#universe)

### Methods

* [disputeWindowFromAddress](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#disputewindowfromaddress)
* [getInitialReporter](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#getinitialreporter)
* [getReportingParticipant](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#getreportingparticipant)
* [getReputationToken](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#getreputationtoken)
* [getTime](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#gettime)
* [gnosisSafeFromAddress](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#gnosissafefromaddress)
* [isTimeControlled](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#istimecontrolled)
* [marketFromAddress](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#marketfromaddress)
* [reputationTokenFromAddress](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#reputationtokenfromaddress)
* [setReputationToken](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#setreputationtoken)
* [shareTokenFromAddress](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#sharetokenfromaddress)
* [universeFromAddress](api-classes-packages-augur-sdk-src-api-contracts-contracts.md#universefromaddress)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Contracts**(addresses: *`ContractAddresses`*, dependencies: *`ContractDependenciesEthers`*): [Contracts](api-classes-packages-augur-sdk-src-api-contracts-contracts.md)

*Defined in [packages/augur-sdk/src/api/Contracts.ts:26](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| addresses | `ContractAddresses` |
| dependencies | `ContractDependenciesEthers` |

**Returns:** [Contracts](api-classes-packages-augur-sdk-src-api-contracts-contracts.md)

___

## Properties

<a id="augur"></a>

###  augur

**● augur**: *`Augur`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:9](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L9)*

___
<a id="cancelorder"></a>

###  cancelOrder

**● cancelOrder**: *`CancelOrder`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:14](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L14)*

___
<a id="cash"></a>

###  cash

**● cash**: *`Cash`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:11](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L11)*

___
<a id="claimtradingproceeds"></a>

###  claimTradingProceeds

**● claimTradingProceeds**: *`ClaimTradingProceeds`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:18](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L18)*

___
<a id="completesets"></a>

###  completeSets

**● completeSets**: *`CompleteSets`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:17](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L17)*

___
<a id="createorder"></a>

###  createOrder

**● createOrder**: *`CreateOrder`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:13](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L13)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesEthers`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:26](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L26)*

___
<a id="fillorder"></a>

###  fillOrder

**● fillOrder**: *`FillOrder`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:15](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L15)*

___
<a id="gnosissafe"></a>

###  gnosisSafe

**● gnosisSafe**: *`GnosisSafe`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:22](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L22)*

___
<a id="legacyreputationtoken"></a>

###  legacyReputationToken

**● legacyReputationToken**: *`LegacyReputationToken`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:20](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L20)*

___
<a id="orders"></a>

###  orders

**● orders**: *`Orders`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:12](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L12)*

___
<a id="proxyfactory"></a>

###  proxyFactory

**● proxyFactory**: *`ProxyFactory`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L23)*

___
<a id="reputationtoken"></a>

###  reputationToken

**● reputationToken**: *[SomeRepToken](api-modules-packages-augur-sdk-src-api-contracts-module.md#somereptoken) \| `null`* =  null

*Defined in [packages/augur-sdk/src/api/Contracts.ts:25](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L25)*

___
<a id="simulatetrade"></a>

###  simulateTrade

**● simulateTrade**: *`SimulateTrade`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:21](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L21)*

___
<a id="time"></a>

###  time

**● time**: *[SomeTime](api-modules-packages-augur-sdk-src-api-contracts-module.md#sometime) \| `void`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:19](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L19)*

___
<a id="trade"></a>

###  trade

**● trade**: *`Trade`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:16](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L16)*

___
<a id="universe"></a>

###  universe

**● universe**: *`Universe`*

*Defined in [packages/augur-sdk/src/api/Contracts.ts:10](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L10)*

___

## Methods

<a id="disputewindowfromaddress"></a>

###  disputeWindowFromAddress

▸ **disputeWindowFromAddress**(address: *`string`*): `DisputeWindow`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:91](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L91)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `DisputeWindow`

___
<a id="getinitialreporter"></a>

###  getInitialReporter

▸ **getInitialReporter**(initialReporterAddress: *`string`*): `InitialReporter`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:95](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L95)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| initialReporterAddress | `string` |

**Returns:** `InitialReporter`

___
<a id="getreportingparticipant"></a>

###  getReportingParticipant

▸ **getReportingParticipant**(reportingParticipantAddress: *`string`*): `DisputeCrowdsourcer`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:99](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L99)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| reportingParticipantAddress | `string` |

**Returns:** `DisputeCrowdsourcer`

___
<a id="getreputationtoken"></a>

###  getReputationToken

▸ **getReputationToken**(): [SomeRepToken](api-modules-packages-augur-sdk-src-api-contracts-module.md#somereptoken)

*Defined in [packages/augur-sdk/src/api/Contracts.ts:61](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L61)*

**Returns:** [SomeRepToken](api-modules-packages-augur-sdk-src-api-contracts-module.md#somereptoken)

___
<a id="gettime"></a>

###  getTime

▸ **getTime**(): [SomeTime](api-modules-packages-augur-sdk-src-api-contracts-module.md#sometime)

*Defined in [packages/augur-sdk/src/api/Contracts.ts:53](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L53)*

**Returns:** [SomeTime](api-modules-packages-augur-sdk-src-api-contracts-module.md#sometime)

___
<a id="gnosissafefromaddress"></a>

###  gnosisSafeFromAddress

▸ **gnosisSafeFromAddress**(address: *`string`*): `GnosisSafe`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:107](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L107)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `GnosisSafe`

___
<a id="istimecontrolled"></a>

###  isTimeControlled

▸ **isTimeControlled**(contract: *[SomeTime](api-modules-packages-augur-sdk-src-api-contracts-module.md#sometime)*): `boolean`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:103](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L103)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contract | [SomeTime](api-modules-packages-augur-sdk-src-api-contracts-module.md#sometime) |

**Returns:** `boolean`

___
<a id="marketfromaddress"></a>

###  marketFromAddress

▸ **marketFromAddress**(address: *`string`*): `Market`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:83](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L83)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Market`

___
<a id="reputationtokenfromaddress"></a>

###  reputationTokenFromAddress

▸ **reputationTokenFromAddress**(address: *`string`*, networkId: *`string`*): [SomeRepToken](api-modules-packages-augur-sdk-src-api-contracts-module.md#somereptoken)

*Defined in [packages/augur-sdk/src/api/Contracts.ts:74](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L74)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |
| networkId | `string` |

**Returns:** [SomeRepToken](api-modules-packages-augur-sdk-src-api-contracts-module.md#somereptoken)

___
<a id="setreputationtoken"></a>

###  setReputationToken

▸ **setReputationToken**(networkId: *`string`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/api/Contracts.ts:69](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L69)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |

**Returns:** `Promise`<`void`>

___
<a id="sharetokenfromaddress"></a>

###  shareTokenFromAddress

▸ **shareTokenFromAddress**(address: *`string`*): `ShareToken`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:87](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L87)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ShareToken`

___
<a id="universefromaddress"></a>

###  universeFromAddress

▸ **universeFromAddress**(address: *`string`*): `Universe`

*Defined in [packages/augur-sdk/src/api/Contracts.ts:79](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Contracts.ts#L79)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Universe`

___


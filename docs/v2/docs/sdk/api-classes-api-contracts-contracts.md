---
id: api-classes-api-contracts-contracts
title: Contracts
sidebar_label: Contracts
---

[@augurproject/sdk](api-readme.md) > [[api/Contracts Module]](api-modules-api-contracts-module.md) > [Contracts](api-classes-api-contracts-contracts.md)

## Class

## Hierarchy

**Contracts**

### Constructors

* [constructor](api-classes-api-contracts-contracts.md#constructor)

### Properties

* [augur](api-classes-api-contracts-contracts.md#augur)
* [cancelOrder](api-classes-api-contracts-contracts.md#cancelorder)
* [cash](api-classes-api-contracts-contracts.md#cash)
* [claimTradingProceeds](api-classes-api-contracts-contracts.md#claimtradingproceeds)
* [completeSets](api-classes-api-contracts-contracts.md#completesets)
* [createOrder](api-classes-api-contracts-contracts.md#createorder)
* [dependencies](api-classes-api-contracts-contracts.md#dependencies)
* [fillOrder](api-classes-api-contracts-contracts.md#fillorder)
* [legacyReputationToken](api-classes-api-contracts-contracts.md#legacyreputationtoken)
* [orders](api-classes-api-contracts-contracts.md#orders)
* [reputationToken](api-classes-api-contracts-contracts.md#reputationtoken)
* [time](api-classes-api-contracts-contracts.md#time)
* [trade](api-classes-api-contracts-contracts.md#trade)
* [universe](api-classes-api-contracts-contracts.md#universe)

### Methods

* [disputeWindowFromAddress](api-classes-api-contracts-contracts.md#disputewindowfromaddress)
* [getInitialReporter](api-classes-api-contracts-contracts.md#getinitialreporter)
* [getReportingParticipant](api-classes-api-contracts-contracts.md#getreportingparticipant)
* [getReputationToken](api-classes-api-contracts-contracts.md#getreputationtoken)
* [getTime](api-classes-api-contracts-contracts.md#gettime)
* [isTimeControlled](api-classes-api-contracts-contracts.md#istimecontrolled)
* [marketFromAddress](api-classes-api-contracts-contracts.md#marketfromaddress)
* [reputationTokenFromAddress](api-classes-api-contracts-contracts.md#reputationtokenfromaddress)
* [setReputationToken](api-classes-api-contracts-contracts.md#setreputationtoken)
* [shareTokenFromAddress](api-classes-api-contracts-contracts.md#sharetokenfromaddress)
* [universeFromAddress](api-classes-api-contracts-contracts.md#universefromaddress)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Contracts**(addresses: *`ContractAddresses`*, dependencies: *`ContractDependenciesEthers`*): [Contracts](api-classes-api-contracts-contracts.md)

*Defined in [api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| addresses | `ContractAddresses` |
| dependencies | `ContractDependenciesEthers` |

**Returns:** [Contracts](api-classes-api-contracts-contracts.md)

___

## Properties

<a id="augur"></a>

###  augur

**● augur**: *`ContractInterfaces.Augur`*

*Defined in [api/Contracts.ts:9](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L9)*

___
<a id="cancelorder"></a>

###  cancelOrder

**● cancelOrder**: *`ContractInterfaces.CancelOrder`*

*Defined in [api/Contracts.ts:14](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L14)*

___
<a id="cash"></a>

###  cash

**● cash**: *`ContractInterfaces.Cash`*

*Defined in [api/Contracts.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L11)*

___
<a id="claimtradingproceeds"></a>

###  claimTradingProceeds

**● claimTradingProceeds**: *`ContractInterfaces.ClaimTradingProceeds`*

*Defined in [api/Contracts.ts:18](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L18)*

___
<a id="completesets"></a>

###  completeSets

**● completeSets**: *`ContractInterfaces.CompleteSets`*

*Defined in [api/Contracts.ts:17](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L17)*

___
<a id="createorder"></a>

###  createOrder

**● createOrder**: *`ContractInterfaces.CreateOrder`*

*Defined in [api/Contracts.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L13)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesEthers`*

*Defined in [api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L23)*

___
<a id="fillorder"></a>

###  fillOrder

**● fillOrder**: *`ContractInterfaces.FillOrder`*

*Defined in [api/Contracts.ts:15](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L15)*

___
<a id="legacyreputationtoken"></a>

###  legacyReputationToken

**● legacyReputationToken**: *`ContractInterfaces.LegacyReputationToken`*

*Defined in [api/Contracts.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L20)*

___
<a id="orders"></a>

###  orders

**● orders**: *`ContractInterfaces.Orders`*

*Defined in [api/Contracts.ts:12](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L12)*

___
<a id="reputationtoken"></a>

###  reputationToken

**● reputationToken**: *[SomeRepToken](api-modules-api-contracts-module.md#somereptoken) \| `null`* =  null

*Defined in [api/Contracts.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L22)*

___
<a id="time"></a>

###  time

**● time**: *[SomeTime](api-modules-api-contracts-module.md#sometime) \| `void`*

*Defined in [api/Contracts.ts:19](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L19)*

___
<a id="trade"></a>

###  trade

**● trade**: *`ContractInterfaces.Trade`*

*Defined in [api/Contracts.ts:16](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L16)*

___
<a id="universe"></a>

###  universe

**● universe**: *`ContractInterfaces.Universe`*

*Defined in [api/Contracts.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L10)*

___

## Methods

<a id="disputewindowfromaddress"></a>

###  disputeWindowFromAddress

▸ **disputeWindowFromAddress**(address: *`string`*): `ContractInterfaces.DisputeWindow`

*Defined in [api/Contracts.ts:85](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.DisputeWindow`

___
<a id="getinitialreporter"></a>

###  getInitialReporter

▸ **getInitialReporter**(initialReporterAddress: *`string`*): `ContractInterfaces.InitialReporter`

*Defined in [api/Contracts.ts:89](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| initialReporterAddress | `string` |

**Returns:** `ContractInterfaces.InitialReporter`

___
<a id="getreportingparticipant"></a>

###  getReportingParticipant

▸ **getReportingParticipant**(reportingParticipantAddress: *`string`*): `ContractInterfaces.DisputeCrowdsourcer`

*Defined in [api/Contracts.ts:93](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| reportingParticipantAddress | `string` |

**Returns:** `ContractInterfaces.DisputeCrowdsourcer`

___
<a id="getreputationtoken"></a>

###  getReputationToken

▸ **getReputationToken**(): [SomeRepToken](api-modules-api-contracts-module.md#somereptoken)

*Defined in [api/Contracts.ts:55](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L55)*

**Returns:** [SomeRepToken](api-modules-api-contracts-module.md#somereptoken)

___
<a id="gettime"></a>

###  getTime

▸ **getTime**(): [SomeTime](api-modules-api-contracts-module.md#sometime)

*Defined in [api/Contracts.ts:47](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L47)*

**Returns:** [SomeTime](api-modules-api-contracts-module.md#sometime)

___
<a id="istimecontrolled"></a>

###  isTimeControlled

▸ **isTimeControlled**(contract: *[SomeTime](api-modules-api-contracts-module.md#sometime)*): `boolean`

*Defined in [api/Contracts.ts:97](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contract | [SomeTime](api-modules-api-contracts-module.md#sometime) |

**Returns:** `boolean`

___
<a id="marketfromaddress"></a>

###  marketFromAddress

▸ **marketFromAddress**(address: *`string`*): `ContractInterfaces.Market`

*Defined in [api/Contracts.ts:77](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L77)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.Market`

___
<a id="reputationtokenfromaddress"></a>

###  reputationTokenFromAddress

▸ **reputationTokenFromAddress**(address: *`string`*, networkId: *`string`*): [SomeRepToken](api-modules-api-contracts-module.md#somereptoken)

*Defined in [api/Contracts.ts:68](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L68)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |
| networkId | `string` |

**Returns:** [SomeRepToken](api-modules-api-contracts-module.md#somereptoken)

___
<a id="setreputationtoken"></a>

###  setReputationToken

▸ **setReputationToken**(networkId: *`string`*): `Promise`<`void`>

*Defined in [api/Contracts.ts:63](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L63)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |

**Returns:** `Promise`<`void`>

___
<a id="sharetokenfromaddress"></a>

###  shareTokenFromAddress

▸ **shareTokenFromAddress**(address: *`string`*): `ContractInterfaces.ShareToken`

*Defined in [api/Contracts.ts:81](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.ShareToken`

___
<a id="universefromaddress"></a>

###  universeFromAddress

▸ **universeFromAddress**(address: *`string`*): `ContractInterfaces.Universe`

*Defined in [api/Contracts.ts:73](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Contracts.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.Universe`

___


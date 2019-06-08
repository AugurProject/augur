[@augurproject/sdk](../README.md) > ["api/Contracts"](../modules/_api_contracts_.md) > [Contracts](../classes/_api_contracts_.contracts.md)

# Class: Contracts

## Hierarchy

**Contracts**

## Index

### Constructors

* [constructor](_api_contracts_.contracts.md#constructor)

### Properties

* [augur](_api_contracts_.contracts.md#augur)
* [cancelOrder](_api_contracts_.contracts.md#cancelorder)
* [cash](_api_contracts_.contracts.md#cash)
* [claimTradingProceeds](_api_contracts_.contracts.md#claimtradingproceeds)
* [completeSets](_api_contracts_.contracts.md#completesets)
* [createOrder](_api_contracts_.contracts.md#createorder)
* [dependencies](_api_contracts_.contracts.md#dependencies)
* [fillOrder](_api_contracts_.contracts.md#fillorder)
* [legacyReputationToken](_api_contracts_.contracts.md#legacyreputationtoken)
* [orders](_api_contracts_.contracts.md#orders)
* [reputationToken](_api_contracts_.contracts.md#reputationtoken)
* [time](_api_contracts_.contracts.md#time)
* [trade](_api_contracts_.contracts.md#trade)
* [universe](_api_contracts_.contracts.md#universe)

### Methods

* [disputeWindowFromAddress](_api_contracts_.contracts.md#disputewindowfromaddress)
* [getInitialReporter](_api_contracts_.contracts.md#getinitialreporter)
* [getReportingParticipant](_api_contracts_.contracts.md#getreportingparticipant)
* [getReputationToken](_api_contracts_.contracts.md#getreputationtoken)
* [getTime](_api_contracts_.contracts.md#gettime)
* [isTimeControlled](_api_contracts_.contracts.md#istimecontrolled)
* [marketFromAddress](_api_contracts_.contracts.md#marketfromaddress)
* [reputationTokenFromAddress](_api_contracts_.contracts.md#reputationtokenfromaddress)
* [setReputationToken](_api_contracts_.contracts.md#setreputationtoken)
* [shareTokenFromAddress](_api_contracts_.contracts.md#sharetokenfromaddress)
* [universeFromAddress](_api_contracts_.contracts.md#universefromaddress)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Contracts**(addresses: *`ContractAddresses`*, dependencies: *`ContractDependenciesEthers`*): [Contracts](_api_contracts_.contracts.md)

*Defined in [api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| addresses | `ContractAddresses` |
| dependencies | `ContractDependenciesEthers` |

**Returns:** [Contracts](_api_contracts_.contracts.md)

___

## Properties

<a id="augur"></a>

###  augur

**● augur**: *`ContractInterfaces.Augur`*

*Defined in [api/Contracts.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L9)*

___
<a id="cancelorder"></a>

###  cancelOrder

**● cancelOrder**: *`ContractInterfaces.CancelOrder`*

*Defined in [api/Contracts.ts:14](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L14)*

___
<a id="cash"></a>

###  cash

**● cash**: *`ContractInterfaces.Cash`*

*Defined in [api/Contracts.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L11)*

___
<a id="claimtradingproceeds"></a>

###  claimTradingProceeds

**● claimTradingProceeds**: *`ContractInterfaces.ClaimTradingProceeds`*

*Defined in [api/Contracts.ts:18](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L18)*

___
<a id="completesets"></a>

###  completeSets

**● completeSets**: *`ContractInterfaces.CompleteSets`*

*Defined in [api/Contracts.ts:17](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L17)*

___
<a id="createorder"></a>

###  createOrder

**● createOrder**: *`ContractInterfaces.CreateOrder`*

*Defined in [api/Contracts.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L13)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesEthers`*

*Defined in [api/Contracts.ts:23](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L23)*

___
<a id="fillorder"></a>

###  fillOrder

**● fillOrder**: *`ContractInterfaces.FillOrder`*

*Defined in [api/Contracts.ts:15](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L15)*

___
<a id="legacyreputationtoken"></a>

###  legacyReputationToken

**● legacyReputationToken**: *`ContractInterfaces.LegacyReputationToken`*

*Defined in [api/Contracts.ts:20](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L20)*

___
<a id="orders"></a>

###  orders

**● orders**: *`ContractInterfaces.Orders`*

*Defined in [api/Contracts.ts:12](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L12)*

___
<a id="reputationtoken"></a>

###  reputationToken

**● reputationToken**: *[SomeRepToken](../modules/_api_contracts_.md#somereptoken) \| `null`* =  null

*Defined in [api/Contracts.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L22)*

___
<a id="time"></a>

###  time

**● time**: *[SomeTime](../modules/_api_contracts_.md#sometime) \| `void`*

*Defined in [api/Contracts.ts:19](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L19)*

___
<a id="trade"></a>

###  trade

**● trade**: *`ContractInterfaces.Trade`*

*Defined in [api/Contracts.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L16)*

___
<a id="universe"></a>

###  universe

**● universe**: *`ContractInterfaces.Universe`*

*Defined in [api/Contracts.ts:10](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L10)*

___

## Methods

<a id="disputewindowfromaddress"></a>

###  disputeWindowFromAddress

▸ **disputeWindowFromAddress**(address: *`string`*): `ContractInterfaces.DisputeWindow`

*Defined in [api/Contracts.ts:85](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.DisputeWindow`

___
<a id="getinitialreporter"></a>

###  getInitialReporter

▸ **getInitialReporter**(initialReporterAddress: *`string`*): `ContractInterfaces.InitialReporter`

*Defined in [api/Contracts.ts:89](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| initialReporterAddress | `string` |

**Returns:** `ContractInterfaces.InitialReporter`

___
<a id="getreportingparticipant"></a>

###  getReportingParticipant

▸ **getReportingParticipant**(reportingParticipantAddress: *`string`*): `ContractInterfaces.DisputeCrowdsourcer`

*Defined in [api/Contracts.ts:93](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| reportingParticipantAddress | `string` |

**Returns:** `ContractInterfaces.DisputeCrowdsourcer`

___
<a id="getreputationtoken"></a>

###  getReputationToken

▸ **getReputationToken**(): [SomeRepToken](../modules/_api_contracts_.md#somereptoken)

*Defined in [api/Contracts.ts:55](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L55)*

**Returns:** [SomeRepToken](../modules/_api_contracts_.md#somereptoken)

___
<a id="gettime"></a>

###  getTime

▸ **getTime**(): [SomeTime](../modules/_api_contracts_.md#sometime)

*Defined in [api/Contracts.ts:47](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L47)*

**Returns:** [SomeTime](../modules/_api_contracts_.md#sometime)

___
<a id="istimecontrolled"></a>

###  isTimeControlled

▸ **isTimeControlled**(contract: *[SomeTime](../modules/_api_contracts_.md#sometime)*): `boolean`

*Defined in [api/Contracts.ts:97](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contract | [SomeTime](../modules/_api_contracts_.md#sometime) |

**Returns:** `boolean`

___
<a id="marketfromaddress"></a>

###  marketFromAddress

▸ **marketFromAddress**(address: *`string`*): `ContractInterfaces.Market`

*Defined in [api/Contracts.ts:77](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L77)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.Market`

___
<a id="reputationtokenfromaddress"></a>

###  reputationTokenFromAddress

▸ **reputationTokenFromAddress**(address: *`string`*, networkId: *`string`*): [SomeRepToken](../modules/_api_contracts_.md#somereptoken)

*Defined in [api/Contracts.ts:68](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L68)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |
| networkId | `string` |

**Returns:** [SomeRepToken](../modules/_api_contracts_.md#somereptoken)

___
<a id="setreputationtoken"></a>

###  setReputationToken

▸ **setReputationToken**(networkId: *`string`*): `Promise`<`void`>

*Defined in [api/Contracts.ts:63](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L63)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |

**Returns:** `Promise`<`void`>

___
<a id="sharetokenfromaddress"></a>

###  shareTokenFromAddress

▸ **shareTokenFromAddress**(address: *`string`*): `ContractInterfaces.ShareToken`

*Defined in [api/Contracts.ts:81](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.ShareToken`

___
<a id="universefromaddress"></a>

###  universeFromAddress

▸ **universeFromAddress**(address: *`string`*): `ContractInterfaces.Universe`

*Defined in [api/Contracts.ts:73](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Contracts.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.Universe`

___


---
id: api-classes-augur-augur
title: Augur
sidebar_label: Augur
---

[@augurproject/sdk](api-readme.md) > [[Augur Module]](api-modules-augur-module.md) > [Augur](api-classes-augur-augur.md)

## Class

## Type parameters
#### TProvider :  [Provider](api-interfaces-ethereum-provider-provider.md)
## Hierarchy

**Augur**

### Constructors

* [constructor](api-classes-augur-augur.md#constructor)

### Properties

* [addresses](api-classes-augur-augur.md#addresses)
* [contracts](api-classes-augur-augur.md#contracts)
* [customEvents](api-classes-augur-augur.md#customevents)
* [dependencies](api-classes-augur-augur.md#dependencies)
* [events](api-classes-augur-augur.md#events)
* [genericEventNames](api-classes-augur-augur.md#genericeventnames)
* [getMarkets](api-classes-augur-augur.md#getmarkets)
* [getSyncData](api-classes-augur-augur.md#getsyncdata)
* [networkId](api-classes-augur-augur.md#networkid)
* [provider](api-classes-augur-augur.md#provider)
* [trade](api-classes-augur-augur.md#trade)
* [userSpecificEvents](api-classes-augur-augur.md#userspecificevents)
* [connector](api-classes-augur-augur.md#connector)

### Methods

* [bindTo](api-classes-augur-augur.md#bindto)
* [connect](api-classes-augur-augur.md#connect)
* [deRegisterAllTransactionStatusCallbacks](api-classes-augur-augur.md#deregisteralltransactionstatuscallbacks)
* [deRegisterTransactionStatusCallback](api-classes-augur-augur.md#deregistertransactionstatuscallback)
* [disconnect](api-classes-augur-augur.md#disconnect)
* [getAccount](api-classes-augur-augur.md#getaccount)
* [getMarket](api-classes-augur-augur.md#getmarket)
* [getOrders](api-classes-augur-augur.md#getorders)
* [off](api-classes-augur-augur.md#off)
* [on](api-classes-augur-augur.md#on)
* [registerTransactionStatusCallback](api-classes-augur-augur.md#registertransactionstatuscallback)
* [create](api-classes-augur-augur.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Augur**(provider: *`TProvider`*, dependencies: *`ContractDependenciesEthers`*, networkId: *`NetworkId`*, addresses: *`ContractAddresses`*, connector?: *[Connector](api-classes-connector-connector-connector.md)*): [Augur](api-classes-augur-augur.md)

*Defined in [Augur.ts:90](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L90)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesEthers` | - |
| networkId | `NetworkId` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [Connector](api-classes-connector-connector-connector.md) |  new EmptyConnector() |

**Returns:** [Augur](api-classes-augur-augur.md)

___

## Properties

<a id="addresses"></a>

###  addresses

**● addresses**: *`ContractAddresses`*

*Defined in [Augur.ts:31](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L31)*

___
<a id="contracts"></a>

###  contracts

**● contracts**: *[Contracts](api-classes-api-contracts-contracts.md)*

*Defined in [Augur.ts:32](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L32)*

___
<a id="customevents"></a>

###  customEvents

**● customEvents**: *`Array`<[CustomEvent](api-interfaces-augur-customevent.md)>* =  [
    {
      "name": "CurrentOrders",
      "eventName": "OrderEvent",
      "idFields": ["orderId"]
    },
  ]

*Defined in [Augur.ts:64](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L64)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesEthers`*

*Defined in [Augur.ts:27](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L27)*

___
<a id="events"></a>

###  events

**● events**: *[Events](api-classes-api-events-events.md)*

*Defined in [Augur.ts:30](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L30)*

___
<a id="genericeventnames"></a>

###  genericEventNames

**● genericEventNames**: *`Array`<`string`>* =  [
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
    "OrderEvent",
    "ParticipationTokensRedeemed",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "TradingProceedsClaimed",
    "UniverseCreated",
    "UniverseForked",
  ]

*Defined in [Augur.ts:38](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L38)*

___
<a id="getmarkets"></a>

###  getMarkets

**● getMarkets**: *`function`* =  this.bindTo(Markets.getMarkets)

*Defined in [Augur.ts:167](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L167)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="getsyncdata"></a>

###  getSyncData

**● getSyncData**: *`function`* =  this.bindTo(SyncData.getSyncData)

*Defined in [Augur.ts:168](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L168)*

#### Type declaration
▸(params: *`P`*): `Promise`<`R`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | `P` |

**Returns:** `Promise`<`R`>

___
<a id="networkid"></a>

###  networkId

**● networkId**: *`NetworkId`*

*Defined in [Augur.ts:29](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L29)*

___
<a id="provider"></a>

###  provider

**● provider**: *`TProvider`*

*Defined in [Augur.ts:26](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L26)*

___
<a id="trade"></a>

###  trade

**● trade**: *[Trade](api-classes-api-trade-trade.md)*

*Defined in [Augur.ts:33](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L33)*

___
<a id="userspecificevents"></a>

###  userSpecificEvents

**● userSpecificEvents**: *`Array`<[UserSpecificEvent](api-interfaces-augur-userspecificevent.md)>* =  [
    {
      "name": "TokensTransferred",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [1, 2],
    },
    {
      "name": "ProfitLossChanged",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [2],
    },
    {
      "name": "TokenBalanceChanged",
      "numAdditionalTopics": 2,
      "userTopicIndicies": [1],
      "idFields": ["token"]
    },
  ]

*Defined in [Augur.ts:73](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L73)*

___
<a id="connector"></a>

### `<Static>` connector

**● connector**: *[Connector](api-classes-connector-connector-connector.md)*

*Defined in [Augur.ts:34](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L34)*

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [Augur.ts:151](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L151)*

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

▸ **connect**(ethNodeUrl: *`string`*, account?: *`undefined` \| `string`*): `Promise`<`any`>

*Defined in [Augur.ts:143](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L143)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ethNodeUrl | `string` |
| `Optional` account | `undefined` \| `string` |

**Returns:** `Promise`<`any`>

___
<a id="deregisteralltransactionstatuscallbacks"></a>

###  deRegisterAllTransactionStatusCallbacks

▸ **deRegisterAllTransactionStatusCallbacks**(): `void`

*Defined in [Augur.ts:139](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L139)*

**Returns:** `void`

___
<a id="deregistertransactionstatuscallback"></a>

###  deRegisterTransactionStatusCallback

▸ **deRegisterTransactionStatusCallback**(key: *`string`*): `void`

*Defined in [Augur.ts:135](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L135)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `void`

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Defined in [Augur.ts:147](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L147)*

**Returns:** `Promise`<`any`>

___
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(): `Promise`<`string`>

*Defined in [Augur.ts:119](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L119)*

**Returns:** `Promise`<`string`>

___
<a id="getmarket"></a>

###  getMarket

▸ **getMarket**(address: *`string`*): `ContractInterfaces.Market`

*Defined in [Augur.ts:123](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L123)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.Market`

___
<a id="getorders"></a>

###  getOrders

▸ **getOrders**(): `ContractInterfaces.Orders`

*Defined in [Augur.ts:127](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L127)*

**Returns:** `ContractInterfaces.Orders`

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*): `void`

*Defined in [Augur.ts:161](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L161)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |

**Returns:** `void`

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*, callback: *[Callback](api-modules-connector-connector-module.md#callback)*): `void`

*Defined in [Augur.ts:155](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L155)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |
| callback | [Callback](api-modules-connector-connector-module.md#callback) |

**Returns:** `void`

___
<a id="registertransactionstatuscallback"></a>

###  registerTransactionStatusCallback

▸ **registerTransactionStatusCallback**(key: *`string`*, callback: *`TransactionStatusCallback`*): `void`

*Defined in [Augur.ts:131](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L131)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| callback | `TransactionStatusCallback` |

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**<`TProvider`>(provider: *`TProvider`*, dependencies: *`ContractDependenciesEthers`*, addresses: *`ContractAddresses`*, connector?: *[Connector](api-classes-connector-connector-connector.md)*): `Promise`<[Augur](api-classes-augur-augur.md)>

*Defined in [Augur.ts:106](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/Augur.ts#L106)*

**Type parameters:**

#### TProvider :  [Provider](api-interfaces-ethereum-provider-provider.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesEthers` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [Connector](api-classes-connector-connector-connector.md) |  new EmptyConnector() |

**Returns:** `Promise`<[Augur](api-classes-augur-augur.md)>

___


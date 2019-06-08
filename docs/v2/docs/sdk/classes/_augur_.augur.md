[@augurproject/sdk](../README.md) > ["Augur"](../modules/_augur_.md) > [Augur](../classes/_augur_.augur.md)

# Class: Augur

## Type parameters
#### TProvider :  [Provider](../interfaces/_ethereum_provider_.provider.md)
## Hierarchy

**Augur**

## Index

### Constructors

* [constructor](_augur_.augur.md#constructor)

### Properties

* [addresses](_augur_.augur.md#addresses)
* [contracts](_augur_.augur.md#contracts)
* [customEvents](_augur_.augur.md#customevents)
* [dependencies](_augur_.augur.md#dependencies)
* [events](_augur_.augur.md#events)
* [genericEventNames](_augur_.augur.md#genericeventnames)
* [getMarkets](_augur_.augur.md#getmarkets)
* [getSyncData](_augur_.augur.md#getsyncdata)
* [networkId](_augur_.augur.md#networkid)
* [provider](_augur_.augur.md#provider)
* [trade](_augur_.augur.md#trade)
* [userSpecificEvents](_augur_.augur.md#userspecificevents)
* [connector](_augur_.augur.md#connector)

### Methods

* [bindTo](_augur_.augur.md#bindto)
* [connect](_augur_.augur.md#connect)
* [deRegisterAllTransactionStatusCallbacks](_augur_.augur.md#deregisteralltransactionstatuscallbacks)
* [deRegisterTransactionStatusCallback](_augur_.augur.md#deregistertransactionstatuscallback)
* [disconnect](_augur_.augur.md#disconnect)
* [getAccount](_augur_.augur.md#getaccount)
* [getMarket](_augur_.augur.md#getmarket)
* [getOrders](_augur_.augur.md#getorders)
* [off](_augur_.augur.md#off)
* [on](_augur_.augur.md#on)
* [registerTransactionStatusCallback](_augur_.augur.md#registertransactionstatuscallback)
* [create](_augur_.augur.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Augur**(provider: *`TProvider`*, dependencies: *`ContractDependenciesEthers`*, networkId: *`NetworkId`*, addresses: *`ContractAddresses`*, connector?: *[Connector](_connector_connector_.connector.md)*): [Augur](_augur_.augur.md)

*Defined in [Augur.ts:90](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L90)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesEthers` | - |
| networkId | `NetworkId` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [Connector](_connector_connector_.connector.md) |  new EmptyConnector() |

**Returns:** [Augur](_augur_.augur.md)

___

## Properties

<a id="addresses"></a>

###  addresses

**● addresses**: *`ContractAddresses`*

*Defined in [Augur.ts:31](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L31)*

___
<a id="contracts"></a>

###  contracts

**● contracts**: *[Contracts](_api_contracts_.contracts.md)*

*Defined in [Augur.ts:32](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L32)*

___
<a id="customevents"></a>

###  customEvents

**● customEvents**: *`Array`<[CustomEvent](../interfaces/_augur_.customevent.md)>* =  [
    {
      "name": "CurrentOrders",
      "eventName": "OrderEvent",
      "idFields": ["orderId"]
    },
  ]

*Defined in [Augur.ts:64](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L64)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesEthers`*

*Defined in [Augur.ts:27](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L27)*

___
<a id="events"></a>

###  events

**● events**: *[Events](_api_events_.events.md)*

*Defined in [Augur.ts:30](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L30)*

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

*Defined in [Augur.ts:38](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L38)*

___
<a id="getmarkets"></a>

###  getMarkets

**● getMarkets**: *`function`* =  this.bindTo(Markets.getMarkets)

*Defined in [Augur.ts:167](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L167)*

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

*Defined in [Augur.ts:168](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L168)*

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

*Defined in [Augur.ts:29](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L29)*

___
<a id="provider"></a>

###  provider

**● provider**: *`TProvider`*

*Defined in [Augur.ts:26](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L26)*

___
<a id="trade"></a>

###  trade

**● trade**: *[Trade](_api_trade_.trade.md)*

*Defined in [Augur.ts:33](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L33)*

___
<a id="userspecificevents"></a>

###  userSpecificEvents

**● userSpecificEvents**: *`Array`<[UserSpecificEvent](../interfaces/_augur_.userspecificevent.md)>* =  [
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

*Defined in [Augur.ts:73](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L73)*

___
<a id="connector"></a>

### `<Static>` connector

**● connector**: *[Connector](_connector_connector_.connector.md)*

*Defined in [Augur.ts:34](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L34)*

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [Augur.ts:151](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L151)*

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

*Defined in [Augur.ts:143](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L143)*

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

*Defined in [Augur.ts:139](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L139)*

**Returns:** `void`

___
<a id="deregistertransactionstatuscallback"></a>

###  deRegisterTransactionStatusCallback

▸ **deRegisterTransactionStatusCallback**(key: *`string`*): `void`

*Defined in [Augur.ts:135](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L135)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `void`

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Defined in [Augur.ts:147](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L147)*

**Returns:** `Promise`<`any`>

___
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(): `Promise`<`string`>

*Defined in [Augur.ts:119](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L119)*

**Returns:** `Promise`<`string`>

___
<a id="getmarket"></a>

###  getMarket

▸ **getMarket**(address: *`string`*): `ContractInterfaces.Market`

*Defined in [Augur.ts:123](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L123)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `ContractInterfaces.Market`

___
<a id="getorders"></a>

###  getOrders

▸ **getOrders**(): `ContractInterfaces.Orders`

*Defined in [Augur.ts:127](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L127)*

**Returns:** `ContractInterfaces.Orders`

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*): `void`

*Defined in [Augur.ts:161](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L161)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |

**Returns:** `void`

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*, callback: *[Callback](../modules/_connector_connector_.md#callback)*): `void`

*Defined in [Augur.ts:155](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L155)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |
| callback | [Callback](../modules/_connector_connector_.md#callback) |

**Returns:** `void`

___
<a id="registertransactionstatuscallback"></a>

###  registerTransactionStatusCallback

▸ **registerTransactionStatusCallback**(key: *`string`*, callback: *`TransactionStatusCallback`*): `void`

*Defined in [Augur.ts:131](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L131)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| callback | `TransactionStatusCallback` |

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**<`TProvider`>(provider: *`TProvider`*, dependencies: *`ContractDependenciesEthers`*, addresses: *`ContractAddresses`*, connector?: *[Connector](_connector_connector_.connector.md)*): `Promise`<[Augur](_augur_.augur.md)>

*Defined in [Augur.ts:106](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/Augur.ts#L106)*

**Type parameters:**

#### TProvider :  [Provider](../interfaces/_ethereum_provider_.provider.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| provider | `TProvider` | - |
| dependencies | `ContractDependenciesEthers` | - |
| addresses | `ContractAddresses` | - |
| `Default value` connector | [Connector](_connector_connector_.connector.md) |  new EmptyConnector() |

**Returns:** `Promise`<[Augur](_augur_.augur.md)>

___


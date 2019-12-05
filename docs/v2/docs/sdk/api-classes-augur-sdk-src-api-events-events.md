---
id: api-classes-augur-sdk-src-api-events-events
title: Events
sidebar_label: Events
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/Events Module]](api-modules-augur-sdk-src-api-events-module.md) > [Events](api-classes-augur-sdk-src-api-events-events.md)

## Class

## Hierarchy

**Events**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-events-events.md#constructor)

### Properties

* [augurAddress](api-classes-augur-sdk-src-api-events-events.md#auguraddress)
* [augurTradingAddress](api-classes-augur-sdk-src-api-events-events.md#augurtradingaddress)
* [contractAddressToName](api-classes-augur-sdk-src-api-events-events.md#contractaddresstoname)
* [provider](api-classes-augur-sdk-src-api-events-events.md#provider)
* [shareTokenAddress](api-classes-augur-sdk-src-api-events-events.md#sharetokenaddress)

### Methods

* [getEventContractAddress](api-classes-augur-sdk-src-api-events-events.md#geteventcontractaddress)
* [getEventContractName](api-classes-augur-sdk-src-api-events-events.md#geteventcontractname)
* [getEventTopics](api-classes-augur-sdk-src-api-events-events.md#geteventtopics)
* [getLogs](api-classes-augur-sdk-src-api-events-events.md#getlogs)
* [parseLogs](api-classes-augur-sdk-src-api-events-events.md#parselogs)

### Object literals

* [eventNameToContractName](api-classes-augur-sdk-src-api-events-events.md#eventnametocontractname)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Events**(provider: *[Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)*, augurAddress: *`string`*, augurTradingAddress: *`string`*, shareTokenAddress: *`string`*): [Events](api-classes-augur-sdk-src-api-events-events.md)

*Defined in [augur-sdk/src/api/Events.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | [Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md) |
| augurAddress | `string` |
| augurTradingAddress | `string` |
| shareTokenAddress | `string` |

**Returns:** [Events](api-classes-augur-sdk-src-api-events-events.md)

___

## Properties

<a id="auguraddress"></a>

### `<Private>` augurAddress

**● augurAddress**: *`string`*

*Defined in [augur-sdk/src/api/Events.ts:7](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L7)*

___
<a id="augurtradingaddress"></a>

### `<Private>` augurTradingAddress

**● augurTradingAddress**: *`string`*

*Defined in [augur-sdk/src/api/Events.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L8)*

___
<a id="contractaddresstoname"></a>

### `<Private>` contractAddressToName

**● contractAddressToName**: *`object`*

*Defined in [augur-sdk/src/api/Events.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L19)*

#### Type declaration

___
<a id="provider"></a>

### `<Private>` provider

**● provider**: *[Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)*

*Defined in [augur-sdk/src/api/Events.ts:6](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L6)*

___
<a id="sharetokenaddress"></a>

### `<Private>` shareTokenAddress

**● shareTokenAddress**: *`string`*

*Defined in [augur-sdk/src/api/Events.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L9)*

___

## Methods

<a id="geteventcontractaddress"></a>

###  getEventContractAddress

▸ **getEventContractAddress**(eventName: *`string`*): `string`

*Defined in [augur-sdk/src/api/Events.ts:48](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L48)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string`

___
<a id="geteventcontractname"></a>

###  getEventContractName

▸ **getEventContractName**(eventName: *`string`*): `any`

*Defined in [augur-sdk/src/api/Events.ts:43](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `any`

___
<a id="geteventtopics"></a>

###  getEventTopics

▸ **getEventTopics**(eventName: *`string`*): `string`[]

*Defined in [augur-sdk/src/api/Events.ts:55](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L55)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string`[]

___
<a id="getlogs"></a>

###  getLogs

▸ **getLogs**(eventName: *`string`*, fromBlock: *`number`*, toBlock: *`number` \| "latest"*, additionalTopics?: *`Array`<`string` \| `string`[]>*): `Promise`<[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]>

*Defined in [augur-sdk/src/api/Events.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| fromBlock | `number` |
| toBlock | `number` \| "latest" |
| `Optional` additionalTopics | `Array`<`string` \| `string`[]> |

**Returns:** `Promise`<[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]>

___
<a id="parselogs"></a>

###  parseLogs

▸ **parseLogs**(logs: *[Log](api-interfaces-augur-types-types-logs-log.md)[]*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]

*Defined in [augur-sdk/src/api/Events.ts:59](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | [Log](api-interfaces-augur-types-types-logs-log.md)[] |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]

___

## Object literals

<a id="eventnametocontractname"></a>

### `<Private>` eventNameToContractName

**eventNameToContractName**: *`object`*

*Defined in [augur-sdk/src/api/Events.ts:11](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L11)*

<a id="eventnametocontractname.marketvolumechanged"></a>

####  MarketVolumeChanged

**● MarketVolumeChanged**: *`string`* = "AugurTrading"

*Defined in [augur-sdk/src/api/Events.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L16)*

___
<a id="eventnametocontractname.orderevent"></a>

####  OrderEvent

**● OrderEvent**: *`string`* = "AugurTrading"

*Defined in [augur-sdk/src/api/Events.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L14)*

___
<a id="eventnametocontractname.profitlosschanged"></a>

####  ProfitLossChanged

**● ProfitLossChanged**: *`string`* = "AugurTrading"

*Defined in [augur-sdk/src/api/Events.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L15)*

___
<a id="eventnametocontractname.transferbatch"></a>

####  TransferBatch

**● TransferBatch**: *`string`* = "ShareToken"

*Defined in [augur-sdk/src/api/Events.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L13)*

___
<a id="eventnametocontractname.transfersingle"></a>

####  TransferSingle

**● TransferSingle**: *`string`* = "ShareToken"

*Defined in [augur-sdk/src/api/Events.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Events.ts#L12)*

___

___


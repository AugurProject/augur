---
id: api-classes-packages-augur-sdk-src-api-events-events
title: Events
sidebar_label: Events
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/api/Events Module]](api-modules-packages-augur-sdk-src-api-events-module.md) > [Events](api-classes-packages-augur-sdk-src-api-events-events.md)

## Class

## Hierarchy

**Events**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-api-events-events.md#constructor)

### Properties

* [augurAddress](api-classes-packages-augur-sdk-src-api-events-events.md#auguraddress)
* [provider](api-classes-packages-augur-sdk-src-api-events-events.md#provider)

### Methods

* [getEventTopics](api-classes-packages-augur-sdk-src-api-events-events.md#geteventtopics)
* [getLogs](api-classes-packages-augur-sdk-src-api-events-events.md#getlogs)
* [parseLogs](api-classes-packages-augur-sdk-src-api-events-events.md#parselogs)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Events**(provider: *[Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)*, augurAddress: *`string`*): [Events](api-classes-packages-augur-sdk-src-api-events-events.md)

*Defined in [packages/augur-sdk/src/api/Events.ts:7](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/api/Events.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | [Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md) |
| augurAddress | `string` |

**Returns:** [Events](api-classes-packages-augur-sdk-src-api-events-events.md)

___

## Properties

<a id="auguraddress"></a>

### `<Private>` augurAddress

**● augurAddress**: *`string`*

*Defined in [packages/augur-sdk/src/api/Events.ts:7](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/api/Events.ts#L7)*

___
<a id="provider"></a>

### `<Private>` provider

**● provider**: *[Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)*

*Defined in [packages/augur-sdk/src/api/Events.ts:6](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/api/Events.ts#L6)*

___

## Methods

<a id="geteventtopics"></a>

###  getEventTopics

▸ **getEventTopics**(eventName: *`string`*): `string`[]

*Defined in [packages/augur-sdk/src/api/Events.ts:24](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/api/Events.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string`[]

___
<a id="getlogs"></a>

###  getLogs

▸ **getLogs**(eventName: *`string`*, fromBlock: *`number`*, toBlock: *`number`*, additionalTopics?: *`Array`<`string` \| `Array`<`string`>>*): `Promise`<`Array`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)>>

*Defined in [packages/augur-sdk/src/api/Events.ts:15](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/api/Events.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| fromBlock | `number` |
| toBlock | `number` |
| `Optional` additionalTopics | `Array`<`string` \| `Array`<`string`>> |

**Returns:** `Promise`<`Array`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)>>

___
<a id="parselogs"></a>

###  parseLogs

▸ **parseLogs**(logs: *`Array`<[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)>*): `Array`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)>

*Defined in [packages/augur-sdk/src/api/Events.ts:28](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/api/Events.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | `Array`<[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)> |

**Returns:** `Array`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)>

___


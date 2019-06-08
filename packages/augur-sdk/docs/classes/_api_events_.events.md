[@augurproject/sdk](../README.md) > ["api/Events"](../modules/_api_events_.md) > [Events](../classes/_api_events_.events.md)

# Class: Events

## Hierarchy

**Events**

## Index

### Constructors

* [constructor](_api_events_.events.md#constructor)

### Properties

* [augurAddress](_api_events_.events.md#auguraddress)
* [provider](_api_events_.events.md#provider)

### Methods

* [getEventTopics](_api_events_.events.md#geteventtopics)
* [getLogs](_api_events_.events.md#getlogs)
* [parseLogs](_api_events_.events.md#parselogs)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Events**(provider: *[Provider](../interfaces/_ethereum_provider_.provider.md)*, augurAddress: *`string`*): [Events](_api_events_.events.md)

*Defined in [api/Events.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Events.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | [Provider](../interfaces/_ethereum_provider_.provider.md) |
| augurAddress | `string` |

**Returns:** [Events](_api_events_.events.md)

___

## Properties

<a id="auguraddress"></a>

### `<Private>` augurAddress

**● augurAddress**: *`string`*

*Defined in [api/Events.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Events.ts#L7)*

___
<a id="provider"></a>

### `<Private>` provider

**● provider**: *[Provider](../interfaces/_ethereum_provider_.provider.md)*

*Defined in [api/Events.ts:6](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Events.ts#L6)*

___

## Methods

<a id="geteventtopics"></a>

###  getEventTopics

▸ **getEventTopics**(eventName: *`string`*): `any`[]

*Defined in [api/Events.ts:24](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Events.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `any`[]

___
<a id="getlogs"></a>

###  getLogs

▸ **getLogs**(eventName: *`string`*, fromBlock: *`number`*, toBlock: *`number`*, additionalTopics?: *`Array`<`string` \| `Array`<`string`>>*): `Promise`<`Array`<`ParsedLog`>>

*Defined in [api/Events.ts:15](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Events.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| fromBlock | `number` |
| toBlock | `number` |
| `Optional` additionalTopics | `Array`<`string` \| `Array`<`string`>> |

**Returns:** `Promise`<`Array`<`ParsedLog`>>

___
<a id="parselogs"></a>

###  parseLogs

▸ **parseLogs**(logs: *`Array`<[Log](../interfaces/_state_logs_types_.log.md)>*): `Array`<`ParsedLog`>

*Defined in [api/Events.ts:28](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Events.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | `Array`<[Log](../interfaces/_state_logs_types_.log.md)> |

**Returns:** `Array`<`ParsedLog`>

___


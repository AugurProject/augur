---
id: api-classes-packages-augur-sdk-src-subscriptions-subscriptions
title: Subscriptions
sidebar_label: Subscriptions
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/subscriptions Module]](api-modules-packages-augur-sdk-src-subscriptions-module.md) > [Subscriptions](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md)

## Class

## Hierarchy

 `EventEmitter`

**↳ Subscriptions**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#constructor)

### Properties

* [parentEmitter](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#parentemitter)
* [defaultMaxListeners](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#defaultmaxlisteners)

### Methods

* [addListener](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#addlistener)
* [emit](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#emit)
* [eventNames](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#eventnames)
* [getMaxListeners](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#getmaxlisteners)
* [listenerCount](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#listenercount)
* [listeners](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#listeners)
* [off](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#off)
* [on](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#on)
* [once](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#once)
* [prependListener](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#prependlistener)
* [prependOnceListener](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#prependoncelistener)
* [rawListeners](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#rawlisteners)
* [removeAllListeners](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#removealllisteners)
* [removeListener](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#removelistener)
* [setMaxListeners](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#setmaxlisteners)
* [subscribe](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#subscribe)
* [subscribeToEvent](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#subscribetoevent)
* [unsubscribe](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#unsubscribe)
* [listenerCount](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Subscriptions**(parentEmitter: *`EventEmitter`*): [Subscriptions](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md)

*Defined in [packages/augur-sdk/src/subscriptions.ts:5](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/subscriptions.ts#L5)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| parentEmitter | `EventEmitter` |

**Returns:** [Subscriptions](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md)

___

## Properties

<a id="parentemitter"></a>

### `<Private>` parentEmitter

**● parentEmitter**: *`EventEmitter`*

*Defined in [packages/augur-sdk/src/subscriptions.ts:5](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/subscriptions.ts#L5)*

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in node_modules/@types/node/events.d.ts:9*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in node_modules/@types/node/events.d.ts:11*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *`string` \| `symbol`*, ...args: *`any`[]*): `boolean`

*Inherited from EventEmitter.emit*

*Overrides EventEmitter.emit*

*Defined in node_modules/@types/node/events.d.ts:23*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`<`string` \| `symbol`>

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in node_modules/@types/node/events.d.ts:24*

**Returns:** `Array`<`string` \| `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in node_modules/@types/node/events.d.ts:20*

**Returns:** `number`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in node_modules/@types/node/events.d.ts:25*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` \| `symbol` |

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: *`string` \| `symbol`*): `Function`[]

*Inherited from EventEmitter.listeners*

*Overrides EventEmitter.listeners*

*Defined in node_modules/@types/node/events.d.ts:21*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="off"></a>

###  off

▸ **off**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.off*

*Overrides EventEmitter.off*

*Defined in node_modules/@types/node/events.d.ts:17*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="on"></a>

###  on

▸ **on**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.on*

*Overrides EventEmitter.on*

*Defined in node_modules/@types/node/events.d.ts:12*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.once*

*Overrides EventEmitter.once*

*Defined in node_modules/@types/node/events.d.ts:13*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in node_modules/@types/node/events.d.ts:14*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in node_modules/@types/node/events.d.ts:15*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="rawlisteners"></a>

###  rawListeners

▸ **rawListeners**(event: *`string` \| `symbol`*): `Function`[]

*Inherited from EventEmitter.rawListeners*

*Overrides EventEmitter.rawListeners*

*Defined in node_modules/@types/node/events.d.ts:22*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(eventName?: *`string` \| `symbol`*): `this`

*Overrides EventEmitter.removeAllListeners*

*Defined in [packages/augur-sdk/src/subscriptions.ts:21](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/subscriptions.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` eventName | `string` \| `symbol` |

**Returns:** `this`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in node_modules/@types/node/events.d.ts:16*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

*Inherited from EventEmitter.setMaxListeners*

*Overrides EventEmitter.setMaxListeners*

*Defined in node_modules/@types/node/events.d.ts:19*

**Parameters:**

| Name | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="subscribe"></a>

###  subscribe

▸ **subscribe**(eventName: *`string`*, publish: *`function`*): `string`

*Defined in [packages/augur-sdk/src/subscriptions.ts:13](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/subscriptions.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| publish | `function` |

**Returns:** `string`

___
<a id="subscribetoevent"></a>

### `<Private>` subscribeToEvent

▸ **subscribeToEvent**(eventName: *`string`*, publish: *`function`*): `string`

*Defined in [packages/augur-sdk/src/subscriptions.ts:26](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/subscriptions.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| publish | `function` |

**Returns:** `string`

___
<a id="unsubscribe"></a>

###  unsubscribe

▸ **unsubscribe**(subscription: *`string`*): `void`

*Defined in [packages/augur-sdk/src/subscriptions.ts:17](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/subscriptions.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| subscription | `string` |

**Returns:** `void`

___
<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: *`EventEmitter`*, event: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in node_modules/@types/node/events.d.ts:8*

*__deprecated__*: since v4.0.0

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event | `string` \| `symbol` |

**Returns:** `number`

___


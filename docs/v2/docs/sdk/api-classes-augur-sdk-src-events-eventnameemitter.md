---
id: api-classes-augur-sdk-src-events-eventnameemitter
title: EventNameEmitter
sidebar_label: EventNameEmitter
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/events Module]](api-modules-augur-sdk-src-events-module.md) > [EventNameEmitter](api-classes-augur-sdk-src-events-eventnameemitter.md)

## Class

## Hierarchy

 `EventEmitter`

**↳ EventNameEmitter**

### Properties

* [defaultMaxListeners](api-classes-augur-sdk-src-events-eventnameemitter.md#defaultmaxlisteners)

### Methods

* [addListener](api-classes-augur-sdk-src-events-eventnameemitter.md#addlistener)
* [emit](api-classes-augur-sdk-src-events-eventnameemitter.md#emit)
* [eventNames](api-classes-augur-sdk-src-events-eventnameemitter.md#eventnames)
* [getMaxListeners](api-classes-augur-sdk-src-events-eventnameemitter.md#getmaxlisteners)
* [listenerCount](api-classes-augur-sdk-src-events-eventnameemitter.md#listenercount)
* [listeners](api-classes-augur-sdk-src-events-eventnameemitter.md#listeners)
* [off](api-classes-augur-sdk-src-events-eventnameemitter.md#off)
* [on](api-classes-augur-sdk-src-events-eventnameemitter.md#on)
* [once](api-classes-augur-sdk-src-events-eventnameemitter.md#once)
* [prependListener](api-classes-augur-sdk-src-events-eventnameemitter.md#prependlistener)
* [prependOnceListener](api-classes-augur-sdk-src-events-eventnameemitter.md#prependoncelistener)
* [rawListeners](api-classes-augur-sdk-src-events-eventnameemitter.md#rawlisteners)
* [removeAllListeners](api-classes-augur-sdk-src-events-eventnameemitter.md#removealllisteners)
* [removeListener](api-classes-augur-sdk-src-events-eventnameemitter.md#removelistener)
* [setMaxListeners](api-classes-augur-sdk-src-events-eventnameemitter.md#setmaxlisteners)
* [listenerCount](api-classes-augur-sdk-src-events-eventnameemitter.md#listenercount-1)

---

## Properties

<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:18*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:20*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="emit"></a>

###  emit

▸ **emit**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*, ...args: *`any`[]*): `boolean`

*Overrides EventEmitter.emit*

*Defined in [augur-sdk/src/events.ts:11](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/events.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`<`string` \| `symbol`>

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:33*

**Returns:** `Array`<`string` \| `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:29*

**Returns:** `number`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:34*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:30*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:26*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:21*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:22*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:23*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:24*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:31*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: *`string` \| `symbol`*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Overrides EventEmitter.removeAllListeners*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:27*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` event | `string` \| `symbol` |

**Returns:** `this`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:25*

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

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:28*

**Parameters:**

| Name | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: *`EventEmitter`*, event: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@types/node/events.d.ts:17*

*__deprecated__*: since v4.0.0

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event | `string` \| `symbol` |

**Returns:** `number`

___


---
id: api-classes-augur-sdk-src-connector-baseconnector-baseconnector
title: BaseConnector
sidebar_label: BaseConnector
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/connector/baseConnector Module]](api-modules-augur-sdk-src-connector-baseconnector-module.md) > [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)

## Class

## Hierarchy

**BaseConnector**

↳  [EmptyConnector](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md)

↳  [HTTPConnector](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md)

↳  [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md)

↳  [DirectConnector](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md)

↳  [WebsocketConnector](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md)

### Properties

* [subscriptions](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#bindto)
* [callbackWrapper](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#callbackwrapper)
* [connect](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#connect)
* [disconnect](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#disconnect)
* [off](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#off)
* [on](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#on)

---

## Properties

<a id="subscriptions"></a>

###  subscriptions

**● subscriptions**: *`object`*

*Defined in [augur-sdk/src/connector/baseConnector.ts:5](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L5)*

#### Type declaration

[event: `string`]: `object`

 callback: [Callback](api-modules-augur-sdk-src-events-module.md#callback)

 id: `string`

___

## Methods

<a id="bindto"></a>

### `<Abstract>` bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [augur-sdk/src/connector/baseConnector.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L12)*

**Type parameters:**

#### R 
#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| f | `function` |

**Returns:** `function`

___
<a id="callbackwrapper"></a>

### `<Protected>` callbackWrapper

▸ **callbackWrapper**<`T`>(callback: *[Callback](api-modules-augur-sdk-src-events-module.md#callback)*): `function`

*Defined in [augur-sdk/src/connector/baseConnector.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L17)*

**Type parameters:**

#### T :  [SubscriptionType](api-modules-augur-sdk-src-event-handlers-module.md#subscriptiontype)
**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |

**Returns:** `function`

___
<a id="connect"></a>

### `<Abstract>` connect

▸ **connect**(ethNodeUrl: *`string`*, account?: *`string`*): `Promise`<`any`>

*Defined in [augur-sdk/src/connector/baseConnector.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ethNodeUrl | `string` |
| `Optional` account | `string` |

**Returns:** `Promise`<`any`>

___
<a id="disconnect"></a>

### `<Abstract>` disconnect

▸ **disconnect**(): `Promise`<`any`>

*Defined in [augur-sdk/src/connector/baseConnector.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L9)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

### `<Abstract>` off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*): `Promise`<`void`>

*Defined in [augur-sdk/src/connector/baseConnector.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

### `<Abstract>` on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*, callback: *[Callback](api-modules-augur-sdk-src-events-module.md#callback)*): `Promise`<`void`>

*Defined in [augur-sdk/src/connector/baseConnector.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |

**Returns:** `Promise`<`void`>

___


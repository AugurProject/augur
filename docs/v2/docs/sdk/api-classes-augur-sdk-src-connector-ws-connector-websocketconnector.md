---
id: api-classes-augur-sdk-src-connector-ws-connector-websocketconnector
title: WebsocketConnector
sidebar_label: WebsocketConnector
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/connector/ws-connector Module]](api-modules-augur-sdk-src-connector-ws-connector-module.md) > [WebsocketConnector](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md)

## Class

## Hierarchy

 [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)

**↳ WebsocketConnector**

### Constructors

* [constructor](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#constructor)

### Properties

* [endpoint](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#endpoint)
* [socket](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#socket)
* [subscriptions](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#bindto)
* [callbackWrapper](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#callbackwrapper)
* [connect](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#connect)
* [disconnect](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#disconnect)
* [messageReceived](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#messagereceived)
* [off](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#off)
* [on](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md#on)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new WebsocketConnector**(endpoint: *`string`*): [WebsocketConnector](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md)

*Defined in [augur-sdk/src/connector/ws-connector.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| endpoint | `string` |

**Returns:** [WebsocketConnector](api-classes-augur-sdk-src-connector-ws-connector-websocketconnector.md)

___

## Properties

<a id="endpoint"></a>

###  endpoint

**● endpoint**: *`string`*

*Defined in [augur-sdk/src/connector/ws-connector.ts:10](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L10)*

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`WebSocketAsPromised`*

*Defined in [augur-sdk/src/connector/ws-connector.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L8)*

___
<a id="subscriptions"></a>

###  subscriptions

**● subscriptions**: *`object`*

*Inherited from [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[subscriptions](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#subscriptions)*

*Defined in [augur-sdk/src/connector/baseConnector.ts:5](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/baseConnector.ts#L5)*

#### Type declaration

[event: `string`]: `object`

 callback: [Callback](api-modules-augur-sdk-src-events-module.md#callback)

 id: `string`

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[bindTo](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#bindto)*

*Defined in [augur-sdk/src/connector/ws-connector.ts:53](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L53)*

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

*Inherited from [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[callbackWrapper](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#callbackwrapper)*

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

###  connect

▸ **connect**(ethNodeUrl: *`string`*, account?: *`string`*): `Promise`<`any`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[connect](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#connect)*

*Defined in [augur-sdk/src/connector/ws-connector.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ethNodeUrl | `string` |
| `Optional` account | `string` |

**Returns:** `Promise`<`any`>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[disconnect](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#disconnect)*

*Defined in [augur-sdk/src/connector/ws-connector.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L49)*

**Returns:** `Promise`<`any`>

___
<a id="messagereceived"></a>

###  messageReceived

▸ **messageReceived**(message: *`any`*): `void`

*Defined in [augur-sdk/src/connector/ws-connector.ts:41](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `any` |

**Returns:** `void`

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[off](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#off)*

*Defined in [augur-sdk/src/connector/ws-connector.ts:81](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**<`T`>(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*, callback: *[Callback](api-modules-augur-sdk-src-events-module.md#callback)*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[on](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#on)*

*Defined in [augur-sdk/src/connector/ws-connector.ts:65](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/ws-connector.ts#L65)*

**Type parameters:**

#### T :  [SubscriptionType](api-modules-augur-sdk-src-event-handlers-module.md#subscriptiontype)
**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |

**Returns:** `Promise`<`void`>

___


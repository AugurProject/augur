---
id: api-classes-connector-ws-connector-websocketconnector
title: WebsocketConnector
sidebar_label: WebsocketConnector
---

[@augurproject/sdk](api-readme.md) > [[connector/ws-connector Module]](api-modules-connector-ws-connector-module.md) > [WebsocketConnector](api-classes-connector-ws-connector-websocketconnector.md)

## Class

## Hierarchy

 [Connector](api-classes-connector-connector-connector.md)

**↳ WebsocketConnector**

### Constructors

* [constructor](api-classes-connector-ws-connector-websocketconnector.md#constructor)

### Properties

* [endpoint](api-classes-connector-ws-connector-websocketconnector.md#endpoint)
* [socket](api-classes-connector-ws-connector-websocketconnector.md#socket)
* [subscriptions](api-classes-connector-ws-connector-websocketconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-connector-ws-connector-websocketconnector.md#bindto)
* [connect](api-classes-connector-ws-connector-websocketconnector.md#connect)
* [disconnect](api-classes-connector-ws-connector-websocketconnector.md#disconnect)
* [off](api-classes-connector-ws-connector-websocketconnector.md#off)
* [on](api-classes-connector-ws-connector-websocketconnector.md#on)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new WebsocketConnector**(endpoint: *`string`*): [WebsocketConnector](api-classes-connector-ws-connector-websocketconnector.md)

*Defined in [connector/ws-connector.ts:7](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| endpoint | `string` |

**Returns:** [WebsocketConnector](api-classes-connector-ws-connector-websocketconnector.md)

___

## Properties

<a id="endpoint"></a>

###  endpoint

**● endpoint**: *`string`*

*Defined in [connector/ws-connector.ts:9](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L9)*

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`WebSocketAsPromised`*

*Defined in [connector/ws-connector.ts:7](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L7)*

___
<a id="subscriptions"></a>

### `<Protected>` subscriptions

**● subscriptions**: *`object`*

*Inherited from [Connector](api-classes-connector-connector-connector.md).[subscriptions](api-classes-connector-connector-connector.md#subscriptions)*

*Defined in [connector/connector.ts:6](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/connector.ts#L6)*

#### Type declaration

[event: `string`]: `object`

 callback: [Callback](api-modules-connector-connector-module.md#callback)

 id: `string`

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Overrides [Connector](api-classes-connector-connector-connector.md).[bindTo](api-classes-connector-connector-connector.md#bindto)*

*Defined in [connector/ws-connector.ts:55](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L55)*

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

*Overrides [Connector](api-classes-connector-connector-connector.md).[connect](api-classes-connector-connector-connector.md#connect)*

*Defined in [connector/ws-connector.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ethNodeUrl | `string` |
| `Optional` account | `undefined` \| `string` |

**Returns:** `Promise`<`any`>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Overrides [Connector](api-classes-connector-connector-connector.md).[disconnect](api-classes-connector-connector-connector.md#disconnect)*

*Defined in [connector/ws-connector.ts:51](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L51)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*): `void`

*Overrides [Connector](api-classes-connector-connector-connector.md).[off](api-classes-connector-connector-connector.md#off)*

*Defined in [connector/ws-connector.ts:67](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |

**Returns:** `void`

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*, callback: *[Callback](api-modules-connector-connector-module.md#callback)*): `void`

*Overrides [Connector](api-classes-connector-connector-connector.md).[on](api-classes-connector-connector-connector.md#on)*

*Defined in [connector/ws-connector.ts:61](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/ws-connector.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |
| callback | [Callback](api-modules-connector-connector-module.md#callback) |

**Returns:** `void`

___


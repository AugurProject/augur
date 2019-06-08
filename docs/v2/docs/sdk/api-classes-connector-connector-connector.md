---
id: api-classes-connector-connector-connector
title: Connector
sidebar_label: Connector
---

[@augurproject/sdk](api-readme.md) > [[connector/connector Module]](api-modules-connector-connector-module.md) > [Connector](api-classes-connector-connector-connector.md)

## Class

## Hierarchy

**Connector**

↳  [EmptyConnector](api-classes-connector-empty-connector-emptyconnector.md)

↳  [HTTPConnector](api-classes-connector-http-connector-httpconnector.md)

↳  [SEOConnector](api-classes-connector-seo-connector-seoconnector.md)

↳  [WebsocketConnector](api-classes-connector-ws-connector-websocketconnector.md)

### Properties

* [subscriptions](api-classes-connector-connector-connector.md#subscriptions)

### Methods

* [bindTo](api-classes-connector-connector-connector.md#bindto)
* [connect](api-classes-connector-connector-connector.md#connect)
* [disconnect](api-classes-connector-connector-connector.md#disconnect)
* [off](api-classes-connector-connector-connector.md#off)
* [on](api-classes-connector-connector-connector.md#on)

---

## Properties

<a id="subscriptions"></a>

### `<Protected>` subscriptions

**● subscriptions**: *`object`*

*Defined in [connector/connector.ts:6](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/connector.ts#L6)*

#### Type declaration

[event: `string`]: `object`

 callback: [Callback](api-modules-connector-connector-module.md#callback)

 id: `string`

___

## Methods

<a id="bindto"></a>

### `<Abstract>` bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [connector/connector.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/connector.ts#L13)*

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

### `<Abstract>` connect

▸ **connect**(ethNodeUrl: *`string`*, account?: *`undefined` \| `string`*): `Promise`<`any`>

*Defined in [connector/connector.ts:9](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/connector.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ethNodeUrl | `string` |
| `Optional` account | `undefined` \| `string` |

**Returns:** `Promise`<`any`>

___
<a id="disconnect"></a>

### `<Abstract>` disconnect

▸ **disconnect**(): `Promise`<`any`>

*Defined in [connector/connector.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/connector.ts#L10)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

### `<Abstract>` off

▸ **off**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*): `void`

*Defined in [connector/connector.ts:16](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/connector.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |

**Returns:** `void`

___
<a id="on"></a>

### `<Abstract>` on

▸ **on**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*, callback: *[Callback](api-modules-connector-connector-module.md#callback)*): `void`

*Defined in [connector/connector.ts:15](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/connector.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |
| callback | [Callback](api-modules-connector-connector-module.md#callback) |

**Returns:** `void`

___


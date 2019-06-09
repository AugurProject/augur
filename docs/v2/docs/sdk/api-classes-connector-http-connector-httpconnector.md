---
id: api-classes-connector-http-connector-httpconnector
title: HTTPConnector
sidebar_label: HTTPConnector
---

[@augurproject/sdk](api-readme.md) > [[connector/http-connector Module]](api-modules-connector-http-connector-module.md) > [HTTPConnector](api-classes-connector-http-connector-httpconnector.md)

## Class

## Hierarchy

 [Connector](api-classes-connector-connector-connector.md)

**↳ HTTPConnector**

### Constructors

* [constructor](api-classes-connector-http-connector-httpconnector.md#constructor)

### Properties

* [endpoint](api-classes-connector-http-connector-httpconnector.md#endpoint)
* [subscriptions](api-classes-connector-http-connector-httpconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-connector-http-connector-httpconnector.md#bindto)
* [connect](api-classes-connector-http-connector-httpconnector.md#connect)
* [disconnect](api-classes-connector-http-connector-httpconnector.md#disconnect)
* [off](api-classes-connector-http-connector-httpconnector.md#off)
* [on](api-classes-connector-http-connector-httpconnector.md#on)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HTTPConnector**(endpoint: *`string`*): [HTTPConnector](api-classes-connector-http-connector-httpconnector.md)

*Defined in [connector/http-connector.ts:5](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/http-connector.ts#L5)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| endpoint | `string` |

**Returns:** [HTTPConnector](api-classes-connector-http-connector-httpconnector.md)

___

## Properties

<a id="endpoint"></a>

###  endpoint

**● endpoint**: *`string`*

*Defined in [connector/http-connector.ts:7](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/http-connector.ts#L7)*

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

▸ **bindTo**<`R`,`P`>(f: *`function`*): `(Anonymous function)`

*Overrides [Connector](api-classes-connector-connector-connector.md).[bindTo](api-classes-connector-connector-connector.md#bindto)*

*Defined in [connector/http-connector.ts:19](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/http-connector.ts#L19)*

**Type parameters:**

#### R 
#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| f | `function` |

**Returns:** `(Anonymous function)`

___
<a id="connect"></a>

###  connect

▸ **connect**(params?: *`any`*): `Promise`<`any`>

*Overrides [Connector](api-classes-connector-connector-connector.md).[connect](api-classes-connector-connector-connector.md#connect)*

*Defined in [connector/http-connector.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/http-connector.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` params | `any` |

**Returns:** `Promise`<`any`>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Overrides [Connector](api-classes-connector-connector-connector.md).[disconnect](api-classes-connector-connector-connector.md#disconnect)*

*Defined in [connector/http-connector.ts:15](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/http-connector.ts#L15)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*): `void`

*Overrides [Connector](api-classes-connector-connector-connector.md).[off](api-classes-connector-connector-connector.md#off)*

*Defined in [connector/http-connector.ts:30](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/http-connector.ts#L30)*

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

*Defined in [connector/http-connector.ts:29](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/http-connector.ts#L29)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |
| callback | [Callback](api-modules-connector-connector-module.md#callback) |

**Returns:** `void`

___


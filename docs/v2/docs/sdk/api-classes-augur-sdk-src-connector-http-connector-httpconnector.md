---
id: api-classes-augur-sdk-src-connector-http-connector-httpconnector
title: HTTPConnector
sidebar_label: HTTPConnector
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/connector/http-connector Module]](api-modules-augur-sdk-src-connector-http-connector-module.md) > [HTTPConnector](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md)

## Class

## Hierarchy

 [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)

**↳ HTTPConnector**

### Constructors

* [constructor](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#constructor)

### Properties

* [endpoint](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#endpoint)
* [subscriptions](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#bindto)
* [callbackWrapper](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#callbackwrapper)
* [connect](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#connect)
* [disconnect](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#disconnect)
* [off](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#off)
* [on](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md#on)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HTTPConnector**(endpoint: *`string`*): [HTTPConnector](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md)

*Defined in [augur-sdk/src/connector/http-connector.ts:6](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/http-connector.ts#L6)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| endpoint | `string` |

**Returns:** [HTTPConnector](api-classes-augur-sdk-src-connector-http-connector-httpconnector.md)

___

## Properties

<a id="endpoint"></a>

###  endpoint

**● endpoint**: *`string`*

*Defined in [augur-sdk/src/connector/http-connector.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/http-connector.ts#L8)*

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

*Defined in [augur-sdk/src/connector/http-connector.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/http-connector.ts#L20)*

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

▸ **connect**(params?: *`any`*): `Promise`<`any`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[connect](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#connect)*

*Defined in [augur-sdk/src/connector/http-connector.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/http-connector.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` params | `any` |

**Returns:** `Promise`<`any`>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[disconnect](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#disconnect)*

*Defined in [augur-sdk/src/connector/http-connector.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/http-connector.ts#L16)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[off](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#off)*

*Defined in [augur-sdk/src/connector/http-connector.ts:31](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/http-connector.ts#L31)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*, callback: *[Callback](api-modules-augur-sdk-src-events-module.md#callback)*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[on](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#on)*

*Defined in [augur-sdk/src/connector/http-connector.ts:30](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/http-connector.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |

**Returns:** `Promise`<`void`>

___


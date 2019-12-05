---
id: api-classes-augur-sdk-src-connector-empty-connector-emptyconnector
title: EmptyConnector
sidebar_label: EmptyConnector
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/connector/empty-connector Module]](api-modules-augur-sdk-src-connector-empty-connector-module.md) > [EmptyConnector](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md)

## Class

## Hierarchy

 [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)

**↳ EmptyConnector**

### Properties

* [subscriptions](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md#bindto)
* [callbackWrapper](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md#callbackwrapper)
* [connect](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md#connect)
* [disconnect](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md#disconnect)
* [off](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md#off)
* [on](api-classes-augur-sdk-src-connector-empty-connector-emptyconnector.md#on)

---

## Properties

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

*Defined in [augur-sdk/src/connector/empty-connector.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/empty-connector.ts#L14)*

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

*Defined in [augur-sdk/src/connector/empty-connector.ts:6](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/empty-connector.ts#L6)*

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

*Defined in [augur-sdk/src/connector/empty-connector.ts:10](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/empty-connector.ts#L10)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md)*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[off](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#off)*

*Defined in [augur-sdk/src/connector/empty-connector.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/empty-connector.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*, callback: *[Callback](api-modules-augur-sdk-src-events-module.md#callback)*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[on](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#on)*

*Defined in [augur-sdk/src/connector/empty-connector.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/empty-connector.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |

**Returns:** `Promise`<`void`>

___


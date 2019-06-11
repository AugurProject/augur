---
id: api-classes-connector-empty-connector-emptyconnector
title: EmptyConnector
sidebar_label: EmptyConnector
---

[@augurproject/sdk](api-readme.md) > [[connector/empty-connector Module]](api-modules-connector-empty-connector-module.md) > [EmptyConnector](api-classes-connector-empty-connector-emptyconnector.md)

## Class

## Hierarchy

 [Connector](api-classes-connector-connector-connector.md)

**↳ EmptyConnector**

### Properties

* [subscriptions](api-classes-connector-empty-connector-emptyconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-connector-empty-connector-emptyconnector.md#bindto)
* [connect](api-classes-connector-empty-connector-emptyconnector.md#connect)
* [disconnect](api-classes-connector-empty-connector-emptyconnector.md#disconnect)
* [off](api-classes-connector-empty-connector-emptyconnector.md#off)
* [on](api-classes-connector-empty-connector-emptyconnector.md#on)

---

## Properties

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

*Defined in [connector/empty-connector.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/empty-connector.ts#L13)*

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

▸ **connect**(params?: *`any`*): `Promise`<`any`>

*Overrides [Connector](api-classes-connector-connector-connector.md).[connect](api-classes-connector-connector-connector.md#connect)*

*Defined in [connector/empty-connector.ts:5](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/empty-connector.ts#L5)*

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

*Defined in [connector/empty-connector.ts:9](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/empty-connector.ts#L9)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md)*): `void`

*Overrides [Connector](api-classes-connector-connector-connector.md).[off](api-classes-connector-connector-connector.md#off)*

*Defined in [connector/empty-connector.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/empty-connector.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) |

**Returns:** `void`

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md)*, callback: *[Callback](api-modules-connector-connector-module.md#callback)*): `void`

*Overrides [Connector](api-classes-connector-connector-connector.md).[on](api-classes-connector-connector-connector.md#on)*

*Defined in [connector/empty-connector.ts:19](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/empty-connector.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) |
| callback | [Callback](api-modules-connector-connector-module.md#callback) |

**Returns:** `void`

___


---
id: api-classes-augur-sdk-src-connector-direct-connector-directconnector
title: DirectConnector
sidebar_label: DirectConnector
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/connector/direct-connector Module]](api-modules-augur-sdk-src-connector-direct-connector-module.md) > [DirectConnector](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md)

## Class

## Hierarchy

 [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md)

**↳ DirectConnector**

### Properties

* [augur](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#augur)
* [db](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#db)
* [subscriptions](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#bindto)
* [callbackWrapper](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#callbackwrapper)
* [connect](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#connect)
* [disconnect](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#disconnect)
* [initialize](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#initialize)
* [off](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#off)
* [on](api-classes-augur-sdk-src-connector-direct-connector-directconnector.md#on)

---

## Properties

<a id="augur"></a>

###  augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/connector/direct-connector.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L8)*

___
<a id="db"></a>

###  db

**● db**: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*

*Defined in [augur-sdk/src/connector/direct-connector.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L9)*

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

*Defined in [augur-sdk/src/connector/direct-connector.ts:25](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L25)*

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

*Defined in [augur-sdk/src/connector/direct-connector.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L16)*

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

*Defined in [augur-sdk/src/connector/direct-connector.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L20)*

**Returns:** `Promise`<`any`>

___
<a id="initialize"></a>

###  initialize

▸ **initialize**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `void`

*Defined in [augur-sdk/src/connector/direct-connector.ts:11](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `void`

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[off](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#off)*

*Defined in [augur-sdk/src/connector/direct-connector.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L34)*

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

*Defined in [augur-sdk/src/connector/direct-connector.ts:31](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/direct-connector.ts#L31)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |

**Returns:** `Promise`<`void`>

___


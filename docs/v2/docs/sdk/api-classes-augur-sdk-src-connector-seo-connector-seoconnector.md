---
id: api-classes-augur-sdk-src-connector-seo-connector-seoconnector
title: SEOConnector
sidebar_label: SEOConnector
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/connector/seo-connector Module]](api-modules-augur-sdk-src-connector-seo-connector-module.md) > [SEOConnector](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md)

## Class

## Hierarchy

↳  [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md)

**↳ SEOConnector**

### Properties

* [api](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#api)
* [events](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#events)
* [subscriptions](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#bindto)
* [callbackWrapper](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#callbackwrapper)
* [connect](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#connect)
* [disconnect](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#disconnect)
* [off](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#off)
* [on](api-classes-augur-sdk-src-connector-seo-connector-seoconnector.md#on)

---

## Properties

<a id="api"></a>

### `<Protected>` api

**● api**: *`Promise`<[API](api-classes-augur-sdk-src-state-getter-api-api.md)>*

*Inherited from [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md).[api](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md#api)*

*Defined in [augur-sdk/src/connector/single-thread-connector.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/single-thread-connector.ts#L9)*

___
<a id="events"></a>

### `<Protected>` events

**● events**: *`any`*

*Inherited from [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md).[events](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md#events)*

*Defined in [augur-sdk/src/connector/single-thread-connector.ts:10](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/single-thread-connector.ts#L10)*

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

*Inherited from [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md).[bindTo](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md#bindto)*

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[bindTo](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#bindto)*

*Defined in [augur-sdk/src/connector/single-thread-connector.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/single-thread-connector.ts#L24)*

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

*Overrides [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md).[connect](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md#connect)*

*Defined in [augur-sdk/src/connector/seo-connector.ts:6](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/seo-connector.ts#L6)*

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

*Inherited from [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md).[disconnect](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md#disconnect)*

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[disconnect](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#disconnect)*

*Defined in [augur-sdk/src/connector/single-thread-connector.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/single-thread-connector.ts#L19)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*): `Promise`<`void`>

*Inherited from [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md).[off](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md#off)*

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[off](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#off)*

*Defined in [augur-sdk/src/connector/single-thread-connector.ts:37](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/single-thread-connector.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*, callback: *[Callback](api-modules-augur-sdk-src-events-module.md#callback)*): `Promise`<`void`>

*Inherited from [SingleThreadConnector](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md).[on](api-classes-augur-sdk-src-connector-single-thread-connector-singlethreadconnector.md#on)*

*Overrides [BaseConnector](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md).[on](api-classes-augur-sdk-src-connector-baseconnector-baseconnector.md#on)*

*Defined in [augur-sdk/src/connector/single-thread-connector.ts:30](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/connector/single-thread-connector.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| callback | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |

**Returns:** `Promise`<`void`>

___


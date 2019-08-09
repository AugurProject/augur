---
id: api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector
title: SEOConnector
sidebar_label: SEOConnector
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/connector/seo-connector Module]](api-modules-packages-augur-sdk-src-connector-seo-connector-module.md) > [SEOConnector](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md)

## Class

## Hierarchy

 [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md)

**↳ SEOConnector**

### Properties

* [api](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#api)
* [events](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#events)
* [subscriptions](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#bindto)
* [callbackWrapper](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#callbackwrapper)
* [connect](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#connect)
* [disconnect](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#disconnect)
* [off](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#off)
* [on](api-classes-packages-augur-sdk-src-connector-seo-connector-seoconnector.md#on)

---

## Properties

<a id="api"></a>

### `<Private>` api

**● api**: *[API](api-classes-packages-augur-sdk-src-state-getter-api-api.md)*

*Defined in [packages/augur-sdk/src/connector/seo-connector.ts:9](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/seo-connector.ts#L9)*

___
<a id="events"></a>

### `<Private>` events

**● events**: *[Subscriptions](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md)* =  new Subscriptions(augurEmitter)

*Defined in [packages/augur-sdk/src/connector/seo-connector.ts:10](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/seo-connector.ts#L10)*

___
<a id="subscriptions"></a>

###  subscriptions

**● subscriptions**: *`object`*

*Inherited from [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md).[subscriptions](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md#subscriptions)*

*Defined in [packages/augur-sdk/src/connector/baseConnector.ts:5](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/baseConnector.ts#L5)*

#### Type declaration

[event: `string`]: `object`

 callback: [Callback](api-modules-packages-augur-sdk-src-events-module.md#callback)

 id: `string`

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Overrides [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md).[bindTo](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md#bindto)*

*Defined in [packages/augur-sdk/src/connector/seo-connector.ts:19](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/seo-connector.ts#L19)*

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

▸ **callbackWrapper**<`T`>(callback: *[Callback](api-modules-packages-augur-sdk-src-events-module.md#callback)*): `function`

*Inherited from [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md).[callbackWrapper](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md#callbackwrapper)*

*Defined in [packages/augur-sdk/src/connector/baseConnector.ts:17](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/baseConnector.ts#L17)*

**Type parameters:**

#### T :  [SubscriptionType](api-modules-packages-augur-sdk-src-event-handlers-module.md#subscriptiontype)
**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | [Callback](api-modules-packages-augur-sdk-src-events-module.md#callback) |

**Returns:** `function`

___
<a id="connect"></a>

###  connect

▸ **connect**(ethNodeUrl: *`string`*, account?: *`string`*): `Promise`<`any`>

*Overrides [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md).[connect](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md#connect)*

*Defined in [packages/augur-sdk/src/connector/seo-connector.ts:12](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/seo-connector.ts#L12)*

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

*Overrides [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md).[disconnect](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md#disconnect)*

*Defined in [packages/augur-sdk/src/connector/seo-connector.ts:16](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/seo-connector.ts#L16)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md).[off](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md#off)*

*Defined in [packages/augur-sdk/src/connector/seo-connector.ts:32](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/seo-connector.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |

**Returns:** `Promise`<`void`>

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| `string`*, callback: *[Callback](api-modules-packages-augur-sdk-src-events-module.md#callback)*): `Promise`<`void`>

*Overrides [BaseConnector](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md).[on](api-classes-packages-augur-sdk-src-connector-baseconnector-baseconnector.md#on)*

*Defined in [packages/augur-sdk/src/connector/seo-connector.ts:25](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/connector/seo-connector.ts#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md) \| `string` |
| callback | [Callback](api-modules-packages-augur-sdk-src-events-module.md#callback) |

**Returns:** `Promise`<`void`>

___


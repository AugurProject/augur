---
id: api-classes-connector-seo-connector-seoconnector
title: SEOConnector
sidebar_label: SEOConnector
---

[@augurproject/sdk](api-readme.md) > [[connector/seo-connector Module]](api-modules-connector-seo-connector-module.md) > [SEOConnector](api-classes-connector-seo-connector-seoconnector.md)

## Class

## Hierarchy

 [Connector](api-classes-connector-connector-connector.md)

**↳ SEOConnector**

### Properties

* [api](api-classes-connector-seo-connector-seoconnector.md#api)
* [events](api-classes-connector-seo-connector-seoconnector.md#events)
* [subscriptions](api-classes-connector-seo-connector-seoconnector.md#subscriptions)

### Methods

* [bindTo](api-classes-connector-seo-connector-seoconnector.md#bindto)
* [connect](api-classes-connector-seo-connector-seoconnector.md#connect)
* [disconnect](api-classes-connector-seo-connector-seoconnector.md#disconnect)
* [off](api-classes-connector-seo-connector-seoconnector.md#off)
* [on](api-classes-connector-seo-connector-seoconnector.md#on)

---

## Properties

<a id="api"></a>

### `<Private>` api

**● api**: *[API](api-classes-state-getter-api-api.md)*

*Defined in [connector/seo-connector.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/seo-connector.ts#L10)*

___
<a id="events"></a>

### `<Private>` events

**● events**: *[Subscriptions](api-classes-subscriptions-subscriptions.md)* =  new Subscriptions(augurEmitter)

*Defined in [connector/seo-connector.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/seo-connector.ts#L11)*

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

*Defined in [connector/seo-connector.ts:21](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/seo-connector.ts#L21)*

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

*Defined in [connector/seo-connector.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/seo-connector.ts#L13)*

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

*Defined in [connector/seo-connector.ts:17](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/seo-connector.ts#L17)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string`*): `void`

*Overrides [Connector](api-classes-connector-connector-connector.md).[off](api-classes-connector-connector-connector.md#off)*

*Defined in [connector/seo-connector.ts:32](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/seo-connector.ts#L32)*

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

*Defined in [connector/seo-connector.ts:27](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/connector/seo-connector.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](api-enums-constants-subscriptioneventnames.md) \| `string` |
| callback | [Callback](api-modules-connector-connector-module.md#callback) |

**Returns:** `void`

___


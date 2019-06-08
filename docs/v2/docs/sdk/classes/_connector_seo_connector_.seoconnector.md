[@augurproject/sdk](../README.md) > ["connector/seo-connector"](../modules/_connector_seo_connector_.md) > [SEOConnector](../classes/_connector_seo_connector_.seoconnector.md)

# Class: SEOConnector

## Hierarchy

 [Connector](_connector_connector_.connector.md)

**↳ SEOConnector**

## Index

### Properties

* [api](_connector_seo_connector_.seoconnector.md#api)
* [events](_connector_seo_connector_.seoconnector.md#events)
* [subscriptions](_connector_seo_connector_.seoconnector.md#subscriptions)

### Methods

* [bindTo](_connector_seo_connector_.seoconnector.md#bindto)
* [connect](_connector_seo_connector_.seoconnector.md#connect)
* [disconnect](_connector_seo_connector_.seoconnector.md#disconnect)
* [off](_connector_seo_connector_.seoconnector.md#off)
* [on](_connector_seo_connector_.seoconnector.md#on)

---

## Properties

<a id="api"></a>

### `<Private>` api

**● api**: *[API](_state_getter_api_.api.md)*

*Defined in [connector/seo-connector.ts:10](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/seo-connector.ts#L10)*

___
<a id="events"></a>

### `<Private>` events

**● events**: *[Subscriptions](_subscriptions_.subscriptions.md)* =  new Subscriptions(augurEmitter)

*Defined in [connector/seo-connector.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/seo-connector.ts#L11)*

___
<a id="subscriptions"></a>

### `<Protected>` subscriptions

**● subscriptions**: *`object`*

*Inherited from [Connector](_connector_connector_.connector.md).[subscriptions](_connector_connector_.connector.md#subscriptions)*

*Defined in [connector/connector.ts:6](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/connector.ts#L6)*

#### Type declaration

[event: `string`]: `object`

 callback: [Callback](../modules/_connector_connector_.md#callback)

 id: `string`

___

## Methods

<a id="bindto"></a>

###  bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Overrides [Connector](_connector_connector_.connector.md).[bindTo](_connector_connector_.connector.md#bindto)*

*Defined in [connector/seo-connector.ts:21](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/seo-connector.ts#L21)*

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

*Overrides [Connector](_connector_connector_.connector.md).[connect](_connector_connector_.connector.md#connect)*

*Defined in [connector/seo-connector.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/seo-connector.ts#L13)*

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

*Overrides [Connector](_connector_connector_.connector.md).[disconnect](_connector_connector_.connector.md#disconnect)*

*Defined in [connector/seo-connector.ts:17](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/seo-connector.ts#L17)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*): `void`

*Overrides [Connector](_connector_connector_.connector.md).[off](_connector_connector_.connector.md#off)*

*Defined in [connector/seo-connector.ts:32](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/seo-connector.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |

**Returns:** `void`

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*, callback: *[Callback](../modules/_connector_connector_.md#callback)*): `void`

*Overrides [Connector](_connector_connector_.connector.md).[on](_connector_connector_.connector.md#on)*

*Defined in [connector/seo-connector.ts:27](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/seo-connector.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |
| callback | [Callback](../modules/_connector_connector_.md#callback) |

**Returns:** `void`

___


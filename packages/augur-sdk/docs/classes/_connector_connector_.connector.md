[@augurproject/sdk](../README.md) > ["connector/connector"](../modules/_connector_connector_.md) > [Connector](../classes/_connector_connector_.connector.md)

# Class: Connector

## Hierarchy

**Connector**

↳  [EmptyConnector](_connector_empty_connector_.emptyconnector.md)

↳  [HTTPConnector](_connector_http_connector_.httpconnector.md)

↳  [SEOConnector](_connector_seo_connector_.seoconnector.md)

↳  [WebsocketConnector](_connector_ws_connector_.websocketconnector.md)

## Index

### Properties

* [subscriptions](_connector_connector_.connector.md#subscriptions)

### Methods

* [bindTo](_connector_connector_.connector.md#bindto)
* [connect](_connector_connector_.connector.md#connect)
* [disconnect](_connector_connector_.connector.md#disconnect)
* [off](_connector_connector_.connector.md#off)
* [on](_connector_connector_.connector.md#on)

---

## Properties

<a id="subscriptions"></a>

### `<Protected>` subscriptions

**● subscriptions**: *`object`*

*Defined in [connector/connector.ts:6](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/connector.ts#L6)*

#### Type declaration

[event: `string`]: `object`

 callback: [Callback](../modules/_connector_connector_.md#callback)

 id: `string`

___

## Methods

<a id="bindto"></a>

### `<Abstract>` bindTo

▸ **bindTo**<`R`,`P`>(f: *`function`*): `function`

*Defined in [connector/connector.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/connector.ts#L13)*

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

*Defined in [connector/connector.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/connector.ts#L9)*

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

*Defined in [connector/connector.ts:10](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/connector.ts#L10)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

### `<Abstract>` off

▸ **off**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*): `void`

*Defined in [connector/connector.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/connector.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |

**Returns:** `void`

___
<a id="on"></a>

### `<Abstract>` on

▸ **on**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*, callback: *[Callback](../modules/_connector_connector_.md#callback)*): `void`

*Defined in [connector/connector.ts:15](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/connector.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |
| callback | [Callback](../modules/_connector_connector_.md#callback) |

**Returns:** `void`

___


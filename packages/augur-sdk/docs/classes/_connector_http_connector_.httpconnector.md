[@augurproject/sdk](../README.md) > ["connector/http-connector"](../modules/_connector_http_connector_.md) > [HTTPConnector](../classes/_connector_http_connector_.httpconnector.md)

# Class: HTTPConnector

## Hierarchy

 [Connector](_connector_connector_.connector.md)

**↳ HTTPConnector**

## Index

### Constructors

* [constructor](_connector_http_connector_.httpconnector.md#constructor)

### Properties

* [endpoint](_connector_http_connector_.httpconnector.md#endpoint)
* [subscriptions](_connector_http_connector_.httpconnector.md#subscriptions)

### Methods

* [bindTo](_connector_http_connector_.httpconnector.md#bindto)
* [connect](_connector_http_connector_.httpconnector.md#connect)
* [disconnect](_connector_http_connector_.httpconnector.md#disconnect)
* [off](_connector_http_connector_.httpconnector.md#off)
* [on](_connector_http_connector_.httpconnector.md#on)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HTTPConnector**(endpoint: *`string`*): [HTTPConnector](_connector_http_connector_.httpconnector.md)

*Defined in [connector/http-connector.ts:5](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/http-connector.ts#L5)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| endpoint | `string` |

**Returns:** [HTTPConnector](_connector_http_connector_.httpconnector.md)

___

## Properties

<a id="endpoint"></a>

###  endpoint

**● endpoint**: *`string`*

*Defined in [connector/http-connector.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/http-connector.ts#L7)*

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

▸ **bindTo**<`R`,`P`>(f: *`function`*): `(Anonymous function)`

*Overrides [Connector](_connector_connector_.connector.md).[bindTo](_connector_connector_.connector.md#bindto)*

*Defined in [connector/http-connector.ts:19](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/http-connector.ts#L19)*

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

*Overrides [Connector](_connector_connector_.connector.md).[connect](_connector_connector_.connector.md#connect)*

*Defined in [connector/http-connector.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/http-connector.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` params | `any` |

**Returns:** `Promise`<`any`>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(): `Promise`<`any`>

*Overrides [Connector](_connector_connector_.connector.md).[disconnect](_connector_connector_.connector.md#disconnect)*

*Defined in [connector/http-connector.ts:15](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/http-connector.ts#L15)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*): `void`

*Overrides [Connector](_connector_connector_.connector.md).[off](_connector_connector_.connector.md#off)*

*Defined in [connector/http-connector.ts:30](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/http-connector.ts#L30)*

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

*Defined in [connector/http-connector.ts:29](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/http-connector.ts#L29)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |
| callback | [Callback](../modules/_connector_connector_.md#callback) |

**Returns:** `void`

___


[@augurproject/sdk](../README.md) > ["connector/ws-connector"](../modules/_connector_ws_connector_.md) > [WebsocketConnector](../classes/_connector_ws_connector_.websocketconnector.md)

# Class: WebsocketConnector

## Hierarchy

 [Connector](_connector_connector_.connector.md)

**↳ WebsocketConnector**

## Index

### Constructors

* [constructor](_connector_ws_connector_.websocketconnector.md#constructor)

### Properties

* [endpoint](_connector_ws_connector_.websocketconnector.md#endpoint)
* [socket](_connector_ws_connector_.websocketconnector.md#socket)
* [subscriptions](_connector_ws_connector_.websocketconnector.md#subscriptions)

### Methods

* [bindTo](_connector_ws_connector_.websocketconnector.md#bindto)
* [connect](_connector_ws_connector_.websocketconnector.md#connect)
* [disconnect](_connector_ws_connector_.websocketconnector.md#disconnect)
* [off](_connector_ws_connector_.websocketconnector.md#off)
* [on](_connector_ws_connector_.websocketconnector.md#on)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new WebsocketConnector**(endpoint: *`string`*): [WebsocketConnector](_connector_ws_connector_.websocketconnector.md)

*Defined in [connector/ws-connector.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| endpoint | `string` |

**Returns:** [WebsocketConnector](_connector_ws_connector_.websocketconnector.md)

___

## Properties

<a id="endpoint"></a>

###  endpoint

**● endpoint**: *`string`*

*Defined in [connector/ws-connector.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L9)*

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`WebSocketAsPromised`*

*Defined in [connector/ws-connector.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L7)*

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

*Defined in [connector/ws-connector.ts:55](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L55)*

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

*Defined in [connector/ws-connector.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L13)*

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

*Defined in [connector/ws-connector.ts:51](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L51)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string`*): `void`

*Overrides [Connector](_connector_connector_.connector.md).[off](_connector_connector_.connector.md#off)*

*Defined in [connector/ws-connector.ts:67](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L67)*

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

*Defined in [connector/ws-connector.ts:61](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/ws-connector.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) \| `string` |
| callback | [Callback](../modules/_connector_connector_.md#callback) |

**Returns:** `void`

___


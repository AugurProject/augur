[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/connector/ws-connector"](../modules/_augur_sdk_src_connector_ws_connector_.md) › [WebsocketConnector](_augur_sdk_src_connector_ws_connector_.websocketconnector.md)

# Class: WebsocketConnector

## Hierarchy

* [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md)

  ↳ **WebsocketConnector**

## Index

### Constructors

* [constructor](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#constructor)

### Properties

* [socket](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#private-socket)
* [subscriptions](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#subscriptions)

### Accessors

* [client](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#client)

### Methods

* [bindTo](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#bindto)
* [callbackWrapper](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#protected-callbackwrapper)
* [connect](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#connect)
* [disconnect](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#disconnect)
* [messageReceived](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#messagereceived)
* [off](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#off)
* [on](_augur_sdk_src_connector_ws_connector_.websocketconnector.md#on)

## Constructors

###  constructor

\+ **new WebsocketConnector**(): *[WebsocketConnector](_augur_sdk_src_connector_ws_connector_.websocketconnector.md)*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:12](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L12)*

**Returns:** *[WebsocketConnector](_augur_sdk_src_connector_ws_connector_.websocketconnector.md)*

## Properties

### `Private` socket

• **socket**: *WebSocketAsPromised*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:12](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L12)*

___

###  subscriptions

• **subscriptions**: *object*

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[subscriptions](_augur_sdk_src_connector_base_connector_.baseconnector.md#subscriptions)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L18)*

#### Type declaration:

* \[ **event**: *string*\]: object

* **callback**: *[Callback](../modules/_augur_sdk_src_events_.md#callback)*

* **id**: *string*

## Accessors

###  client

• **get client**(): *[Augur](_augur_sdk_src_augur_.augur.md)*

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[client](_augur_sdk_src_connector_base_connector_.baseconnector.md#client)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L11)*

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)*

• **set client**(`client`: [Augur](_augur_sdk_src_augur_.augur.md)): *void*

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[client](_augur_sdk_src_connector_base_connector_.baseconnector.md#client)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:14](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *void*

## Methods

###  bindTo

▸ **bindTo**‹**R**, **P**›(`f`: function): *function*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[bindTo](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-bindto)*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:58](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L58)*

**Type parameters:**

▪ **R**

▪ **P**

**Parameters:**

▪ **f**: *function*

▸ (`db`: any, `augur`: any, `params`: P): *Promise‹R›*

**Parameters:**

Name | Type |
------ | ------ |
`db` | any |
`augur` | any |
`params` | P |

**Returns:** *function*

▸ (`params`: P): *Promise‹R›*

**Parameters:**

Name | Type |
------ | ------ |
`params` | P |

___

### `Protected` callbackWrapper

▸ **callbackWrapper**‹**T**›(`eventName`: string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *function*

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[callbackWrapper](_augur_sdk_src_connector_base_connector_.baseconnector.md#protected-callbackwrapper)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:38](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L38)*

**Type parameters:**

▪ **T**: *SubscriptionType*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *function*

▸ (...`args`: SubscriptionType[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | SubscriptionType[] |

___

###  connect

▸ **connect**(`config`: SDKConfiguration, `account?`: string): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[connect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-connect)*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`account?` | string |

**Returns:** *Promise‹void›*

___

###  disconnect

▸ **disconnect**(): *Promise‹any›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[disconnect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-disconnect)*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:54](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L54)*

**Returns:** *Promise‹any›*

___

###  messageReceived

▸ **messageReceived**(`message`: any): *void*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:45](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  off

▸ **off**(`eventName`: SubscriptionEventName | string): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[off](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-off)*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:87](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |

**Returns:** *Promise‹void›*

___

###  on

▸ **on**‹**T**›(`eventName`: SubscriptionEventName | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[on](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-on)*

*Defined in [packages/augur-sdk/src/connector/ws-connector.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/ws-connector.ts#L71)*

**Type parameters:**

▪ **T**: *SubscriptionType*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *Promise‹void›*

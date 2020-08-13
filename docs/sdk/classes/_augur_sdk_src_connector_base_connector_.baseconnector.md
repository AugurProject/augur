[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/connector/base-connector"](../modules/_augur_sdk_src_connector_base_connector_.md) › [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md)

# Class: BaseConnector

## Hierarchy

* **BaseConnector**

  ↳ [EmptyConnector](_augur_sdk_src_connector_empty_connector_.emptyconnector.md)

  ↳ [HTTPConnector](_augur_sdk_src_connector_http_connector_.httpconnector.md)

  ↳ [DirectConnector](_augur_sdk_src_connector_direct_connector_.directconnector.md)

  ↳ [SingleThreadConnector](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md)

  ↳ [WebsocketConnector](_augur_sdk_src_connector_ws_connector_.websocketconnector.md)

## Index

### Properties

* [_client](_augur_sdk_src_connector_base_connector_.baseconnector.md#private-_client)
* [subscriptions](_augur_sdk_src_connector_base_connector_.baseconnector.md#subscriptions)

### Accessors

* [client](_augur_sdk_src_connector_base_connector_.baseconnector.md#client)

### Methods

* [bindTo](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-bindto)
* [callbackWrapper](_augur_sdk_src_connector_base_connector_.baseconnector.md#protected-callbackwrapper)
* [connect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-connect)
* [disconnect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-disconnect)
* [off](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-off)
* [on](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-on)

## Properties

### `Private` _client

• **_client**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:10](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L10)*

___

###  subscriptions

• **subscriptions**: *object*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L18)*

#### Type declaration:

* \[ **event**: *string*\]: object

* **callback**: *[Callback](../modules/_augur_sdk_src_events_.md#callback)*

* **id**: *string*

## Accessors

###  client

• **get client**(): *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L11)*

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)*

• **set client**(`client`: [Augur](_augur_sdk_src_augur_.augur.md)): *void*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:14](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *void*

## Methods

### `Abstract` bindTo

▸ **bindTo**‹**R**, **P**›(`f`: function): *function*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:28](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L28)*

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

### `Abstract` connect

▸ **connect**(`config`: SDKConfiguration, `account?`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`account?` | string |

**Returns:** *Promise‹void›*

___

### `Abstract` disconnect

▸ **disconnect**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:25](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L25)*

**Returns:** *Promise‹void›*

___

### `Abstract` off

▸ **off**(`eventName`: SubscriptionEventName | string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:36](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |

**Returns:** *Promise‹void›*

___

### `Abstract` on

▸ **on**(`eventName`: SubscriptionEventName | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/base-connector.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *Promise‹void›*

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

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:7](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L7)*

___

###  subscriptions

• **subscriptions**: *object*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L15)*

#### Type declaration:

* \[ **event**: *string*\]: object

* **callback**: *[Callback](../modules/_augur_sdk_src_events_.md#callback)*

* **id**: *string*

## Accessors

###  client

• **get client**(): *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L8)*

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)*

• **set client**(`client`: [Augur](_augur_sdk_src_augur_.augur.md)): *void*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *void*

## Methods

### `Abstract` bindTo

▸ **bindTo**<**R**, **P**>(`f`: function): *function*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L22)*

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

▸ **callbackWrapper**<**T**>(`eventName`: string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *function*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L27)*

**Type parameters:**

▪ **T**: *[SubscriptionType](../modules/_augur_sdk_src_event_handlers_.md#subscriptiontype)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *function*

▸ (...`args`: [SubscriptionType](../modules/_augur_sdk_src_event_handlers_.md#subscriptiontype)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | [SubscriptionType](../modules/_augur_sdk_src_event_handlers_.md#subscriptiontype)[] |

___

### `Abstract` connect

▸ **connect**(`config`: SDKConfiguration, `account?`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`account?` | string |

**Returns:** *Promise‹void›*

___

### `Abstract` disconnect

▸ **disconnect**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L19)*

**Returns:** *Promise‹void›*

___

### `Abstract` off

▸ **off**(`eventName`: [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) | string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:25](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) &#124; string |

**Returns:** *Promise‹void›*

___

### `Abstract` on

▸ **on**(`eventName`: [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *Promise‹void›*

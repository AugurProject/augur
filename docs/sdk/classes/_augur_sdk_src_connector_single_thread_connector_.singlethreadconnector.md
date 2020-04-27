[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/connector/single-thread-connector"](../modules/_augur_sdk_src_connector_single_thread_connector_.md) › [SingleThreadConnector](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md)

# Class: SingleThreadConnector

## Hierarchy

* [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md)

  ↳ **SingleThreadConnector**

## Index

### Properties

* [_api](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#private-_api)
* [subscriptions](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#subscriptions)

### Accessors

* [api](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#api)
* [client](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#client)
* [events](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#private-events)

### Methods

* [bindTo](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#bindto)
* [callbackWrapper](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#protected-callbackwrapper)
* [connect](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#connect)
* [disconnect](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#disconnect)
* [off](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#off)
* [on](_augur_sdk_src_connector_single_thread_connector_.singlethreadconnector.md#on)

## Properties

### `Private` _api

• **_api**: *[API](_augur_sdk_src_state_getter_api_.api.md)*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L14)*

___

###  subscriptions

• **subscriptions**: *object*

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[subscriptions](_augur_sdk_src_connector_base_connector_.baseconnector.md#subscriptions)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L15)*

#### Type declaration:

* \[ **event**: *string*\]: object

* **callback**: *[Callback](../modules/_augur_sdk_src_events_.md#callback)*

* **id**: *string*

## Accessors

###  api

• **get api**(): *[API](_augur_sdk_src_state_getter_api_.api.md)‹›*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L15)*

**Returns:** *[API](_augur_sdk_src_state_getter_api_.api.md)‹›*

___

###  client

• **get client**(): *[Augur](_augur_sdk_src_augur_.augur.md)*

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[client](_augur_sdk_src_connector_base_connector_.baseconnector.md#client)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L8)*

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)*

• **set client**(`client`: [Augur](_augur_sdk_src_augur_.augur.md)): *void*

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[client](_augur_sdk_src_connector_base_connector_.baseconnector.md#client)*

*Defined in [packages/augur-sdk/src/connector/base-connector.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/base-connector.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *void*

___

### `Private` events

• **get events**(): *[Subscriptions](_augur_sdk_src_subscriptions_.subscriptions.md)*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:10](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L10)*

**Returns:** *[Subscriptions](_augur_sdk_src_subscriptions_.subscriptions.md)*

## Methods

###  bindTo

▸ **bindTo**<**R**, **P**>(`f`: function): *function*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[bindTo](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-bindto)*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L27)*

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

*Inherited from [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[callbackWrapper](_augur_sdk_src_connector_base_connector_.baseconnector.md#protected-callbackwrapper)*

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

###  connect

▸ **connect**(`config`: SDKConfiguration, `account?`: string): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[connect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-connect)*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`account?` | string |

**Returns:** *Promise‹void›*

___

###  disconnect

▸ **disconnect**(): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[disconnect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-disconnect)*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:23](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L23)*

**Returns:** *Promise‹void›*

___

###  off

▸ **off**(`eventName`: [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) | string): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[off](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-off)*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:39](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) &#124; string |

**Returns:** *Promise‹void›*

___

###  on

▸ **on**(`eventName`: [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[on](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-on)*

*Defined in [packages/augur-sdk/src/connector/single-thread-connector.ts:33](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/connector/single-thread-connector.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *Promise‹void›*

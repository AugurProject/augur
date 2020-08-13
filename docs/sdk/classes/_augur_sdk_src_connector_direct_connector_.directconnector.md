[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/connector/direct-connector"](../modules/_augur_sdk_src_connector_direct_connector_.md) › [DirectConnector](_augur_sdk_src_connector_direct_connector_.directconnector.md)

# Class: DirectConnector

## Hierarchy

* [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md)

  ↳ **DirectConnector**

## Index

### Properties

* [db](_augur_sdk_src_connector_direct_connector_.directconnector.md#db)
* [subscriptions](_augur_sdk_src_connector_direct_connector_.directconnector.md#subscriptions)

### Accessors

* [client](_augur_sdk_src_connector_direct_connector_.directconnector.md#client)

### Methods

* [bindTo](_augur_sdk_src_connector_direct_connector_.directconnector.md#bindto)
* [callbackWrapper](_augur_sdk_src_connector_direct_connector_.directconnector.md#protected-callbackwrapper)
* [connect](_augur_sdk_src_connector_direct_connector_.directconnector.md#connect)
* [disconnect](_augur_sdk_src_connector_direct_connector_.directconnector.md#disconnect)
* [initialize](_augur_sdk_src_connector_direct_connector_.directconnector.md#initialize)
* [off](_augur_sdk_src_connector_direct_connector_.directconnector.md#off)
* [on](_augur_sdk_src_connector_direct_connector_.directconnector.md#on)

## Properties

###  db

• **db**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Defined in [packages/augur-sdk/src/connector/direct-connector.ts:9](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/direct-connector.ts#L9)*

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

*Defined in [packages/augur-sdk/src/connector/direct-connector.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/direct-connector.ts#L21)*

**Type parameters:**

▪ **R**

▪ **P**

**Parameters:**

▪ **f**: *function*

▸ (`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: P): *Promise‹R›*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
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

*Defined in [packages/augur-sdk/src/connector/direct-connector.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/direct-connector.ts#L16)*

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

*Defined in [packages/augur-sdk/src/connector/direct-connector.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/direct-connector.ts#L18)*

**Returns:** *Promise‹void›*

___

###  initialize

▸ **initialize**(`client`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md)): *void*

*Defined in [packages/augur-sdk/src/connector/direct-connector.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/direct-connector.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *void*

___

###  off

▸ **off**(`eventName`: SubscriptionEventName | string): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[off](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-off)*

*Defined in [packages/augur-sdk/src/connector/direct-connector.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/direct-connector.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |

**Returns:** *Promise‹void›*

___

###  on

▸ **on**(`eventName`: SubscriptionEventName | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[on](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-on)*

*Defined in [packages/augur-sdk/src/connector/direct-connector.ts:29](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/direct-connector.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *Promise‹void›*

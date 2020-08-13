[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/connector/http-connector"](../modules/_augur_sdk_src_connector_http_connector_.md) › [HTTPConnector](_augur_sdk_src_connector_http_connector_.httpconnector.md)

# Class: HTTPConnector

## Hierarchy

* [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md)

  ↳ **HTTPConnector**

## Index

### Constructors

* [constructor](_augur_sdk_src_connector_http_connector_.httpconnector.md#constructor)

### Properties

* [endpoint](_augur_sdk_src_connector_http_connector_.httpconnector.md#readonly-endpoint)
* [subscriptions](_augur_sdk_src_connector_http_connector_.httpconnector.md#subscriptions)

### Accessors

* [client](_augur_sdk_src_connector_http_connector_.httpconnector.md#client)

### Methods

* [bindTo](_augur_sdk_src_connector_http_connector_.httpconnector.md#bindto)
* [callbackWrapper](_augur_sdk_src_connector_http_connector_.httpconnector.md#protected-callbackwrapper)
* [connect](_augur_sdk_src_connector_http_connector_.httpconnector.md#connect)
* [disconnect](_augur_sdk_src_connector_http_connector_.httpconnector.md#disconnect)
* [off](_augur_sdk_src_connector_http_connector_.httpconnector.md#off)
* [on](_augur_sdk_src_connector_http_connector_.httpconnector.md#on)

## Constructors

###  constructor

\+ **new HTTPConnector**(`endpoint`: string): *[HTTPConnector](_augur_sdk_src_connector_http_connector_.httpconnector.md)*

*Defined in [packages/augur-sdk/src/connector/http-connector.ts:6](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/http-connector.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`endpoint` | string |

**Returns:** *[HTTPConnector](_augur_sdk_src_connector_http_connector_.httpconnector.md)*

## Properties

### `Readonly` endpoint

• **endpoint**: *string*

*Defined in [packages/augur-sdk/src/connector/http-connector.ts:7](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/http-connector.ts#L7)*

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

*Defined in [packages/augur-sdk/src/connector/http-connector.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/http-connector.ts#L19)*

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

▸ **connect**(`params?`: any): *Promise‹any›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[connect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-connect)*

*Defined in [packages/augur-sdk/src/connector/http-connector.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/http-connector.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`params?` | any |

**Returns:** *Promise‹any›*

___

###  disconnect

▸ **disconnect**(): *Promise‹any›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[disconnect](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-disconnect)*

*Defined in [packages/augur-sdk/src/connector/http-connector.ts:15](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/http-connector.ts#L15)*

**Returns:** *Promise‹any›*

___

###  off

▸ **off**(`eventName`: SubscriptionEventName | string): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[off](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-off)*

*Defined in [packages/augur-sdk/src/connector/http-connector.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/http-connector.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |

**Returns:** *Promise‹void›*

___

###  on

▸ **on**(`eventName`: SubscriptionEventName | string, `callback`: [Callback](../modules/_augur_sdk_src_events_.md#callback)): *Promise‹void›*

*Overrides [BaseConnector](_augur_sdk_src_connector_base_connector_.baseconnector.md).[on](_augur_sdk_src_connector_base_connector_.baseconnector.md#abstract-on)*

*Defined in [packages/augur-sdk/src/connector/http-connector.ts:36](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/connector/http-connector.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | SubscriptionEventName &#124; string |
`callback` | [Callback](../modules/_augur_sdk_src_events_.md#callback) |

**Returns:** *Promise‹void›*

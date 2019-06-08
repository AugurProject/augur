[@augurproject/sdk](../README.md) > ["connector/empty-connector"](../modules/_connector_empty_connector_.md) > [EmptyConnector](../classes/_connector_empty_connector_.emptyconnector.md)

# Class: EmptyConnector

## Hierarchy

 [Connector](_connector_connector_.connector.md)

**↳ EmptyConnector**

## Index

### Properties

* [subscriptions](_connector_empty_connector_.emptyconnector.md#subscriptions)

### Methods

* [bindTo](_connector_empty_connector_.emptyconnector.md#bindto)
* [connect](_connector_empty_connector_.emptyconnector.md#connect)
* [disconnect](_connector_empty_connector_.emptyconnector.md#disconnect)
* [off](_connector_empty_connector_.emptyconnector.md#off)
* [on](_connector_empty_connector_.emptyconnector.md#on)

---

## Properties

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

*Defined in [connector/empty-connector.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/empty-connector.ts#L13)*

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

▸ **connect**(params?: *`any`*): `Promise`<`any`>

*Overrides [Connector](_connector_connector_.connector.md).[connect](_connector_connector_.connector.md#connect)*

*Defined in [connector/empty-connector.ts:5](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/empty-connector.ts#L5)*

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

*Defined in [connector/empty-connector.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/empty-connector.ts#L9)*

**Returns:** `Promise`<`any`>

___
<a id="off"></a>

###  off

▸ **off**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md)*): `void`

*Overrides [Connector](_connector_connector_.connector.md).[off](_connector_connector_.connector.md#off)*

*Defined in [connector/empty-connector.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/empty-connector.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) |

**Returns:** `void`

___
<a id="on"></a>

###  on

▸ **on**(eventName: *[SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md)*, callback: *[Callback](../modules/_connector_connector_.md#callback)*): `void`

*Overrides [Connector](_connector_connector_.connector.md).[on](_connector_connector_.connector.md#on)*

*Defined in [connector/empty-connector.ts:19](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/connector/empty-connector.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md) |
| callback | [Callback](../modules/_connector_connector_.md#callback) |

**Returns:** `void`

___


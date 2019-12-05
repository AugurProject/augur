---
id: api-modules-augur-sdk-src-events-module
title: augur-sdk/src/events Module
sidebar_label: augur-sdk/src/events
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/events Module]](api-modules-augur-sdk-src-events-module.md)

## Module

### Classes

* [EventNameEmitter](api-classes-augur-sdk-src-events-eventnameemitter.md)

### Type aliases

* [Callback](api-modules-augur-sdk-src-events-module.md#callback)
* [TXStatusCallback](api-modules-augur-sdk-src-events-module.md#txstatuscallback)

### Variables

* [augurEmitter](api-modules-augur-sdk-src-events-module.md#auguremitter)

---

## Type aliases

<a id="callback"></a>

###  Callback

**Ƭ Callback**: *`function`*

*Defined in [augur-sdk/src/events.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/events.ts#L20)*

#### Type declaration
▸(...args: *[SubscriptionType](api-modules-augur-sdk-src-event-handlers-module.md#subscriptiontype)[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | [SubscriptionType](api-modules-augur-sdk-src-event-handlers-module.md#subscriptiontype)[] |

**Returns:** `void`

___
<a id="txstatuscallback"></a>

###  TXStatusCallback

**Ƭ TXStatusCallback**: *`function`*

*Defined in [augur-sdk/src/events.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/events.ts#L21)*

#### Type declaration
▸(...args: *[TXStatus](api-interfaces-augur-sdk-src-event-handlers-txstatus.md)[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | [TXStatus](api-interfaces-augur-sdk-src-event-handlers-txstatus.md)[] |

**Returns:** `void`

___

## Variables

<a id="auguremitter"></a>

### `<Const>` augurEmitter

**● augurEmitter**: *[EventNameEmitter](api-classes-augur-sdk-src-events-eventnameemitter.md)* =  new EventNameEmitter()

*Defined in [augur-sdk/src/events.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/events.ts#L16)*

___


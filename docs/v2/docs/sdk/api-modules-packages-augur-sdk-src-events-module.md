---
id: api-modules-packages-augur-sdk-src-events-module
title: packages/augur-sdk/src/events Module
sidebar_label: packages/augur-sdk/src/events
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/events Module]](api-modules-packages-augur-sdk-src-events-module.md)

## Module

### Classes

* [EventNameEmitter](api-classes-packages-augur-sdk-src-events-eventnameemitter.md)

### Type aliases

* [Callback](api-modules-packages-augur-sdk-src-events-module.md#callback)
* [TXStatusCallback](api-modules-packages-augur-sdk-src-events-module.md#txstatuscallback)

### Variables

* [augurEmitter](api-modules-packages-augur-sdk-src-events-module.md#auguremitter)

---

## Type aliases

<a id="callback"></a>

###  Callback

**Ƭ Callback**: *`function`*

*Defined in [packages/augur-sdk/src/events.ts:20](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/events.ts#L20)*

#### Type declaration
▸(...args: *[SubscriptionType](api-modules-packages-augur-sdk-src-event-handlers-module.md#subscriptiontype)[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | [SubscriptionType](api-modules-packages-augur-sdk-src-event-handlers-module.md#subscriptiontype)[] |

**Returns:** `void`

___
<a id="txstatuscallback"></a>

###  TXStatusCallback

**Ƭ TXStatusCallback**: *`function`*

*Defined in [packages/augur-sdk/src/events.ts:21](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/events.ts#L21)*

#### Type declaration
▸(...args: *[TXStatus](api-interfaces-packages-augur-sdk-src-event-handlers-txstatus.md)[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | [TXStatus](api-interfaces-packages-augur-sdk-src-event-handlers-txstatus.md)[] |

**Returns:** `void`

___

## Variables

<a id="auguremitter"></a>

### `<Const>` augurEmitter

**● augurEmitter**: *[EventNameEmitter](api-classes-packages-augur-sdk-src-events-eventnameemitter.md)* =  new EventNameEmitter()

*Defined in [packages/augur-sdk/src/events.ts:16](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/events.ts#L16)*

___


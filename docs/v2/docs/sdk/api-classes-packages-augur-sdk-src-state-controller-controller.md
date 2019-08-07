---
id: api-classes-packages-augur-sdk-src-state-controller-controller
title: Controller
sidebar_label: Controller
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/Controller Module]](api-modules-packages-augur-sdk-src-state-controller-module.md) > [Controller](api-classes-packages-augur-sdk-src-state-controller-controller.md)

## Class

## Hierarchy

**Controller**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-controller-controller.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-state-controller-controller.md#augur)
* [blockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-controller-controller.md#blockandlogstreamerlistener)
* [db](api-classes-packages-augur-sdk-src-state-controller-controller.md#db)
* [events](api-classes-packages-augur-sdk-src-state-controller-controller.md#events)
* [latestBlock](api-classes-packages-augur-sdk-src-state-controller-controller.md#latestblock)
* [throttled](api-classes-packages-augur-sdk-src-state-controller-controller.md#throttled)

### Methods

* [getLatestBlock](api-classes-packages-augur-sdk-src-state-controller-controller.md#getlatestblock)
* [notifyNewBlockEvent](api-classes-packages-augur-sdk-src-state-controller-controller.md#notifynewblockevent)
* [run](api-classes-packages-augur-sdk-src-state-controller-controller.md#run)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Controller**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *`Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>*, blockAndLogStreamerListener: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*): [Controller](api-classes-packages-augur-sdk-src-state-controller-controller.md)

*Defined in [packages/augur-sdk/src/state/Controller.ts:16](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)> |
| blockAndLogStreamerListener | [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md) |

**Returns:** [Controller](api-classes-packages-augur-sdk-src-state-controller-controller.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/state/Controller.ts:19](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L19)*

___
<a id="blockandlogstreamerlistener"></a>

### `<Private>` blockAndLogStreamerListener

**● blockAndLogStreamerListener**: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*

*Defined in [packages/augur-sdk/src/state/Controller.ts:21](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L21)*

___
<a id="db"></a>

### `<Private>` db

**● db**: *`Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>*

*Defined in [packages/augur-sdk/src/state/Controller.ts:20](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L20)*

___
<a id="events"></a>

### `<Private>` events

**● events**: *[Subscriptions](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md)* =  new Subscriptions(augurEmitter)

*Defined in [packages/augur-sdk/src/state/Controller.ts:16](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L16)*

___
<a id="latestblock"></a>

### `<Static>``<Private>` latestBlock

**● latestBlock**: *`Block`*

*Defined in [packages/augur-sdk/src/state/Controller.ts:13](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L13)*

___
<a id="throttled"></a>

### `<Static>``<Private>` throttled

**● throttled**: *`any`*

*Defined in [packages/augur-sdk/src/state/Controller.ts:14](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L14)*

___

## Methods

<a id="getlatestblock"></a>

### `<Private>` getLatestBlock

▸ **getLatestBlock**(): `Promise`<`Block`>

*Defined in [packages/augur-sdk/src/state/Controller.ts:67](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L67)*

**Returns:** `Promise`<`Block`>

___
<a id="notifynewblockevent"></a>

### `<Private>` notifyNewBlockEvent

▸ **notifyNewBlockEvent**(): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/Controller.ts:42](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L42)*

**Returns:** `Promise`<`void`>

___
<a id="run"></a>

###  run

▸ **run**(): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/Controller.ts:26](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/Controller.ts#L26)*

**Returns:** `Promise`<`void`>

___


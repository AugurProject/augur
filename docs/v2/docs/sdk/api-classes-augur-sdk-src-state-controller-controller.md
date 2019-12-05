---
id: api-classes-augur-sdk-src-state-controller-controller
title: Controller
sidebar_label: Controller
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/Controller Module]](api-modules-augur-sdk-src-state-controller-module.md) > [Controller](api-classes-augur-sdk-src-state-controller-controller.md)

## Class

## Hierarchy

**Controller**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-controller-controller.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-state-controller-controller.md#augur)
* [blockAndLogStreamerListener](api-classes-augur-sdk-src-state-controller-controller.md#blockandlogstreamerlistener)
* [db](api-classes-augur-sdk-src-state-controller-controller.md#db)
* [events](api-classes-augur-sdk-src-state-controller-controller.md#events)
* [latestBlock](api-classes-augur-sdk-src-state-controller-controller.md#latestblock)
* [throttled](api-classes-augur-sdk-src-state-controller-controller.md#throttled)

### Methods

* [getLatestBlock](api-classes-augur-sdk-src-state-controller-controller.md#getlatestblock)
* [notifyNewBlockEvent](api-classes-augur-sdk-src-state-controller-controller.md#notifynewblockevent)
* [run](api-classes-augur-sdk-src-state-controller-controller.md#run)
* [updateMarketsData](api-classes-augur-sdk-src-state-controller-controller.md#updatemarketsdata)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Controller**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *`Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>*, blockAndLogStreamerListener: *[BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)*): [Controller](api-classes-augur-sdk-src-state-controller-controller.md)

*Defined in [augur-sdk/src/state/Controller.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | `Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)> |
| blockAndLogStreamerListener | [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md) |

**Returns:** [Controller](api-classes-augur-sdk-src-state-controller-controller.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/state/Controller.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L20)*

___
<a id="blockandlogstreamerlistener"></a>

### `<Private>` blockAndLogStreamerListener

**● blockAndLogStreamerListener**: *[BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)*

*Defined in [augur-sdk/src/state/Controller.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L22)*

___
<a id="db"></a>

### `<Private>` db

**● db**: *`Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>*

*Defined in [augur-sdk/src/state/Controller.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L21)*

___
<a id="events"></a>

### `<Private>` events

**● events**: *`any`*

*Defined in [augur-sdk/src/state/Controller.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L17)*

___
<a id="latestblock"></a>

### `<Static>``<Private>` latestBlock

**● latestBlock**: *`Block`*

*Defined in [augur-sdk/src/state/Controller.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L14)*

___
<a id="throttled"></a>

### `<Static>``<Private>` throttled

**● throttled**: *`any`*

*Defined in [augur-sdk/src/state/Controller.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L15)*

___

## Methods

<a id="getlatestblock"></a>

### `<Private>` getLatestBlock

▸ **getLatestBlock**(): `Promise`<`Block`>

*Defined in [augur-sdk/src/state/Controller.ts:87](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L87)*

**Returns:** `Promise`<`Block`>

___
<a id="notifynewblockevent"></a>

### `<Private>` notifyNewBlockEvent

▸ **notifyNewBlockEvent**(): `Promise`<`void`>

*Defined in [augur-sdk/src/state/Controller.ts:64](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L64)*

**Returns:** `Promise`<`void`>

___
<a id="run"></a>

###  run

▸ **run**(): `Promise`<`void`>

*Defined in [augur-sdk/src/state/Controller.ts:27](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L27)*

**Returns:** `Promise`<`void`>

___
<a id="updatemarketsdata"></a>

### `<Private>` updateMarketsData

▸ **updateMarketsData**(blockNumber: *`number`*, allLogs: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/Controller.ts:44](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Controller.ts#L44)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |
| allLogs | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[] |

**Returns:** `Promise`<`void`>

___


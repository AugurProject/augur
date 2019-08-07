---
id: api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies
title: BlockAndLogStreamerListenerDependencies
sidebar_label: BlockAndLogStreamerListenerDependencies
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerListenerDependencies](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)

## Interface

## Hierarchy

**BlockAndLogStreamerListenerDependencies**

### Properties

* [address](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#address)
* [blockAndLogStreamer](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#blockandlogstreamer)
* [eventLogDBRouter](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#eventlogdbrouter)
* [getBlockByHash](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#getblockbyhash)
* [getEventTopics](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#geteventtopics)
* [listenForNewBlocks](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#listenfornewblocks)

---

## Properties

<a id="address"></a>

###  address

**● address**: *`string`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:18](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L18)*

___
<a id="blockandlogstreamer"></a>

###  blockAndLogStreamer

**● blockAndLogStreamer**: *[BlockAndLogStreamerInterface](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)<`Block`, `ExtendedLog`>*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:19](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L19)*

___
<a id="eventlogdbrouter"></a>

###  eventLogDBRouter

**● eventLogDBRouter**: *[EventLogDBRouter](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md)*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:21](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L21)*

___
<a id="getblockbyhash"></a>

###  getBlockByHash

**● getBlockByHash**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:20](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L20)*

#### Type declaration
▸(hashOrTag: *`string`*): `Promise`<`Block`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| hashOrTag | `string` |

**Returns:** `Promise`<`Block`>

___
<a id="geteventtopics"></a>

###  getEventTopics

**● getEventTopics**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:22](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L22)*

#### Type declaration
▸(eventName: *`string`*): `string`[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string`[]

___
<a id="listenfornewblocks"></a>

###  listenForNewBlocks

**● listenForNewBlocks**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:24](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L24)*

#### Type declaration
▸(callback: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___


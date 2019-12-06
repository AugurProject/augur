---
id: api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies
title: BlockAndLogStreamerListenerDependencies
sidebar_label: BlockAndLogStreamerListenerDependencies
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerListenerDependencies](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)

## Interface

## Hierarchy

**BlockAndLogStreamerListenerDependencies**

### Properties

* [blockAndLogStreamer](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#blockandlogstreamer)
* [getBlockByHash](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#getblockbyhash)
* [getEventContractAddress](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#geteventcontractaddress)
* [getEventTopics](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#geteventtopics)
* [getLogs](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#getlogs)
* [listenForNewBlocks](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#listenfornewblocks)
* [parseLogs](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md#parselogs)

---

## Properties

<a id="blockandlogstreamer"></a>

###  blockAndLogStreamer

**● blockAndLogStreamer**: *[BlockAndLogStreamerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)<`Block`, `ExtendedLog`>*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:42](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L42)*

___
<a id="getblockbyhash"></a>

###  getBlockByHash

**● getBlockByHash**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:43](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L43)*

#### Type declaration
▸(hashOrTag: *`string`*): `Promise`<`Block`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| hashOrTag | `string` |

**Returns:** `Promise`<`Block`>

___
<a id="geteventcontractaddress"></a>

###  getEventContractAddress

**● getEventContractAddress**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:48](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L48)*

#### Type declaration
▸(eventName: *`string`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string`

___
<a id="geteventtopics"></a>

###  getEventTopics

**● getEventTopics**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:45](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L45)*

#### Type declaration
▸(eventName: *`string`*): `string`[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string`[]

___
<a id="getlogs"></a>

###  getLogs

**● getLogs**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:44](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L44)*

#### Type declaration
▸(filter: *[Filter](api-interfaces-augur-types-types-logs-filter.md)*): `Promise`<[Log](api-interfaces-augur-types-types-logs-log.md)[]>

**Parameters:**

| Name | Type |
| ------ | ------ |
| filter | [Filter](api-interfaces-augur-types-types-logs-filter.md) |

**Returns:** `Promise`<[Log](api-interfaces-augur-types-types-logs-log.md)[]>

___
<a id="listenfornewblocks"></a>

###  listenForNewBlocks

**● listenForNewBlocks**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:47](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L47)*

#### Type declaration
▸(callback: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="parselogs"></a>

###  parseLogs

**● parseLogs**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:46](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L46)*

#### Type declaration
▸(logs: *[Log](api-interfaces-augur-types-types-logs-log.md)[]*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | [Log](api-interfaces-augur-types-types-logs-log.md)[] |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]

___


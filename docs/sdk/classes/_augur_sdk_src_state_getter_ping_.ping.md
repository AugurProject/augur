[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Ping"](../modules/_augur_sdk_src_state_getter_ping_.md) › [Ping](_augur_sdk_src_state_getter_ping_.ping.md)

# Class: Ping

## Hierarchy

* **Ping**

## Index

### Properties

* [PingParams](_augur_sdk_src_state_getter_ping_.ping.md#static-pingparams)

### Methods

* [ping](_augur_sdk_src_state_getter_ping_.ping.md#static-ping)

## Properties

### `Static` PingParams

▪ **PingParams**: *TypeC‹object›* = t.type({})

*Defined in [packages/augur-sdk/src/state/getter/Ping.ts:10](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Ping.ts#L10)*

## Methods

### `Static` ping

▸ **ping**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof PingParams›): *Promise‹[Pong](../interfaces/_augur_sdk_src_state_getter_ping_.pong.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Ping.ts:13](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Ping.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof PingParams› |

**Returns:** *Promise‹[Pong](../interfaces/_augur_sdk_src_state_getter_ping_.pong.md)›*

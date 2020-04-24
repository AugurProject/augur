[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/ZeroXOrders"](_augur_sdk_src_state_db_zeroxorders_.md)

# Module: "augur-sdk/src/state/db/ZeroXOrders"

## Index

### Classes

* [ZeroXOrders](../classes/_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)

### Interfaces

* [Document](../interfaces/_augur_sdk_src_state_db_zeroxorders_.document.md)
* [OrderData](../interfaces/_augur_sdk_src_state_db_zeroxorders_.orderdata.md)
* [ParsedAssetDataResults](../interfaces/_augur_sdk_src_state_db_zeroxorders_.parsedassetdataresults.md)
* [SnapshotCounterDocument](../interfaces/_augur_sdk_src_state_db_zeroxorders_.snapshotcounterdocument.md)
* [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)
* [StoredSignedOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedsignedorder.md)

### Variables

* [DEFAULT_TRADE_INTERVAL](_augur_sdk_src_state_db_zeroxorders_.md#const-default_trade_interval)
* [EXPECTED_ASSET_DATA_LENGTH](_augur_sdk_src_state_db_zeroxorders_.md#const-expected_asset_data_length)
* [erc1155AssetDataAbi](_augur_sdk_src_state_db_zeroxorders_.md#const-erc1155assetdataabi)
* [multiAssetDataAbi](_augur_sdk_src_state_db_zeroxorders_.md#const-multiassetdataabi)

## Variables

### `Const` DEFAULT_TRADE_INTERVAL

• **DEFAULT_TRADE_INTERVAL**: *BigNumber‹›* = new BigNumber(10**17)

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L22)*

___

### `Const` EXPECTED_ASSET_DATA_LENGTH

• **EXPECTED_ASSET_DATA_LENGTH**: *2122* = 2122

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L20)*

___

### `Const` erc1155AssetDataAbi

• **erc1155AssetDataAbi**: *ParamType[]* = [
  { name: 'address', type: 'address' },
  { name: 'ids', type: 'uint256[]' },
  { name: 'values', type: 'uint256[]' },
  { name: 'callbackData', type: 'bytes' },
]

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:46](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L46)*

___

### `Const` multiAssetDataAbi

• **multiAssetDataAbi**: *ParamType[]* = [
  { name: 'amounts', type: 'uint256[]' },
  { name: 'nestedAssetData', type: 'bytes[]' },
]

*Defined in [packages/augur-sdk/src/state/db/ZeroXOrders.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L24)*

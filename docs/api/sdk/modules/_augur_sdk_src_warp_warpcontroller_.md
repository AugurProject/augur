[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/warp/WarpController"](_augur_sdk_src_warp_warpcontroller_.md)

# Module: "augur-sdk/src/warp/WarpController"

## Index

### Classes

* [WarpController](../classes/_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)

### Interfaces

* [CheckpointInterface](../interfaces/_augur_sdk_src_warp_warpcontroller_.checkpointinterface.md)
* [IPFSObject](../interfaces/_augur_sdk_src_warp_warpcontroller_.ipfsobject.md)

### Type aliases

* [AllDBNames](_augur_sdk_src_warp_warpcontroller_.md#alldbnames)
* [AllDbs](_augur_sdk_src_warp_warpcontroller_.md#alldbs)
* [Db](_augur_sdk_src_warp_warpcontroller_.md#db)
* [DbExpander](_augur_sdk_src_warp_warpcontroller_.md#dbexpander)
* [NameOfType](_augur_sdk_src_warp_warpcontroller_.md#nameoftype)
* [RollupDescription](_augur_sdk_src_warp_warpcontroller_.md#rollupdescription)

### Variables

* [FILE_FETCH_TIMEOUT](_augur_sdk_src_warp_warpcontroller_.md#const-file_fetch_timeout)
* [WARPSYNC_VERSION](_augur_sdk_src_warp_warpcontroller_.md#const-warpsync_version)
* [databasesToSync](_augur_sdk_src_warp_warpcontroller_.md#const-databasestosync)

## Type aliases

###  AllDBNames

Ƭ **AllDBNames**: *[NameOfType](_augur_sdk_src_warp_warpcontroller_.md#nameoftype)‹[DB](../classes/_augur_sdk_src_state_db_db_.db.md), Table‹Log, unknown››*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L32)*

___

###  AllDbs

Ƭ **AllDbs**: *object*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:33](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L33)*

#### Type declaration:

___

###  Db

Ƭ **Db**: *[DbExpander](_augur_sdk_src_warp_warpcontroller_.md#dbexpander)‹keyof AllDbs, keyof AllDbs›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:56](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L56)*

___

###  DbExpander

Ƭ **DbExpander**: *P extends keyof AllDbs ? object : never*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:39](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L39)*

___

###  NameOfType

Ƭ **NameOfType**: *object[keyof T]*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:28](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L28)*

___

###  RollupDescription

Ƭ **RollupDescription**: *Readonly‹[Db](_augur_sdk_src_warp_warpcontroller_.md#db)[]›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:57](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L57)*

## Variables

### `Const` FILE_FETCH_TIMEOUT

• **FILE_FETCH_TIMEOUT**: *10000* = 10000

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:26](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L26)*

___

### `Const` WARPSYNC_VERSION

• **WARPSYNC_VERSION**: *"1"* = "1"

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:25](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L25)*

___

### `Const` databasesToSync

• **databasesToSync**: *[RollupDescription](_augur_sdk_src_warp_warpcontroller_.md#rollupdescription)* = [
  { databaseName: 'CompleteSetsPurchased' },
  { databaseName: 'CompleteSetsSold' },
  { databaseName: 'DisputeCrowdsourcerContribution' },
  { databaseName: 'DisputeCrowdsourcerCompleted' },
  { databaseName: 'DisputeCrowdsourcerCreated' },
  { databaseName: 'DisputeCrowdsourcerRedeemed' },
  { databaseName: 'DisputeWindowCreated' },
  { databaseName: 'InitialReporterRedeemed' },
  { databaseName: 'InitialReportSubmitted' },
  { databaseName: 'InitialReporterTransferred' },
  { databaseName: 'MarketCreated' },
  { databaseName: 'MarketFinalized' },
  { databaseName: 'MarketMigrated' },
  { databaseName: 'MarketParticipantsDisavowed' },
  { databaseName: 'MarketTransferred' },
  { databaseName: 'MarketVolumeChanged' },
  { databaseName: 'MarketOIChanged' },
  { databaseName: 'OrderEvent' },
  { databaseName: 'ParticipationTokensRedeemed' },
  { databaseName: 'ProfitLossChanged' },
  { databaseName: 'ReportingParticipantDisavowed' },
  { databaseName: 'TimestampSet' },
  { databaseName: 'TokenBalanceChanged' },
  { databaseName: 'TokensMinted' },
  { databaseName: 'TokensTransferred' },
  { databaseName: 'TradingProceedsClaimed' },
  { databaseName: 'UniverseCreated' },
  { databaseName: 'UniverseForked' },
  { databaseName: 'TransferSingle' },
  { databaseName: 'TransferBatch' },
  { databaseName: 'ShareTokenBalanceChanged' },
]

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:65](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/WarpController.ts#L65)*

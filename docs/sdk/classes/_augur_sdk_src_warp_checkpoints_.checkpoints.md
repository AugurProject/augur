[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/warp/Checkpoints"](../modules/_augur_sdk_src_warp_checkpoints_.md) › [Checkpoints](_augur_sdk_src_warp_checkpoints_.checkpoints.md)

# Class: Checkpoints

## Hierarchy

* **Checkpoints**

## Index

### Constructors

* [constructor](_augur_sdk_src_warp_checkpoints_.checkpoints.md#constructor)

### Properties

* [provider](_augur_sdk_src_warp_checkpoints_.checkpoints.md#private-provider)

### Methods

* [calculateBoundary](_augur_sdk_src_warp_checkpoints_.checkpoints.md#calculateboundary)
* [calculateBoundaryByMarkets](_augur_sdk_src_warp_checkpoints_.checkpoints.md#calculateboundarybymarkets)
* [compareTimestamp](_augur_sdk_src_warp_checkpoints_.checkpoints.md#comparetimestamp)
* [isValidBlockRangeForTimeStamp](_augur_sdk_src_warp_checkpoints_.checkpoints.md#isvalidblockrangefortimestamp)

## Constructors

###  constructor

\+ **new Checkpoints**(`provider`: [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)): *[Checkpoints](_augur_sdk_src_warp_checkpoints_.checkpoints.md)*

*Defined in [packages/augur-sdk/src/warp/Checkpoints.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/Checkpoints.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md) |

**Returns:** *[Checkpoints](_augur_sdk_src_warp_checkpoints_.checkpoints.md)*

## Properties

### `Private` provider

• **provider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

*Defined in [packages/augur-sdk/src/warp/Checkpoints.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/Checkpoints.ts#L18)*

## Methods

###  calculateBoundary

▸ **calculateBoundary**(`timestamp`: number, `beginBlock?`: Block, `endBlock?`: Block): *Promise‹[Block, Block]›*

*Defined in [packages/augur-sdk/src/warp/Checkpoints.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/Checkpoints.ts#L34)*

**`description`** Given a timestamp

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | number |
`beginBlock?` | Block |
`endBlock?` | Block |

**Returns:** *Promise‹[Block, Block]›*

___

###  calculateBoundaryByMarkets

▸ **calculateBoundaryByMarkets**(`firstMarket`: [MarketWithEndTime](../modules/_augur_sdk_src_warp_checkpoints_.md#marketwithendtime), `secondMarket`: [MarketWithEndTime](../modules/_augur_sdk_src_warp_checkpoints_.md#marketwithendtime)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/warp/Checkpoints.ts:20](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/Checkpoints.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`firstMarket` | [MarketWithEndTime](../modules/_augur_sdk_src_warp_checkpoints_.md#marketwithendtime) |
`secondMarket` | [MarketWithEndTime](../modules/_augur_sdk_src_warp_checkpoints_.md#marketwithendtime) |

**Returns:** *Promise‹void›*

___

###  compareTimestamp

▸ **compareTimestamp**(`timestamp`: number, `begin`: Block, `middle`: Block, `end`: Block): *[Block, Block]*

*Defined in [packages/augur-sdk/src/warp/Checkpoints.ts:64](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/Checkpoints.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | number |
`begin` | Block |
`middle` | Block |
`end` | Block |

**Returns:** *[Block, Block]*

___

###  isValidBlockRangeForTimeStamp

▸ **isValidBlockRangeForTimeStamp**(`timestamp`: number, `begin`: Block, `end`: Block): *boolean*

*Defined in [packages/augur-sdk/src/warp/Checkpoints.ts:77](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/warp/Checkpoints.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | number |
`begin` | Block |
`end` | Block |

**Returns:** *boolean*

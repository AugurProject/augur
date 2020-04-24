[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/WarpSync"](../modules/_augur_sdk_src_api_warpsync_.md) › [WarpSync](_augur_sdk_src_api_warpsync_.warpsync.md)

# Class: WarpSync

## Hierarchy

* **WarpSync**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_warpsync_.warpsync.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_warpsync_.warpsync.md#private-augur)

### Methods

* [getLastWarpSyncData](_augur_sdk_src_api_warpsync_.warpsync.md#getlastwarpsyncdata)
* [getPayoutFromWarpSyncHash](_augur_sdk_src_api_warpsync_.warpsync.md#getpayoutfromwarpsynchash)
* [getWarpSyncHashFromMarket](_augur_sdk_src_api_warpsync_.warpsync.md#getwarpsynchashfrommarket)
* [getWarpSyncHashFromPayout](_augur_sdk_src_api_warpsync_.warpsync.md#getwarpsynchashfrompayout)
* [getWarpSyncMarket](_augur_sdk_src_api_warpsync_.warpsync.md#getwarpsyncmarket)
* [initializeUniverse](_augur_sdk_src_api_warpsync_.warpsync.md#initializeuniverse)

## Constructors

###  constructor

\+ **new WarpSync**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[WarpSync](_augur_sdk_src_api_warpsync_.warpsync.md)*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[WarpSync](_augur_sdk_src_api_warpsync_.warpsync.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L14)*

## Methods

###  getLastWarpSyncData

▸ **getLastWarpSyncData**(`universe`: string): *Promise‹[WarpSyncData](../interfaces/_augur_sdk_src_api_warpsync_.warpsyncdata.md)›*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:53](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |

**Returns:** *Promise‹[WarpSyncData](../interfaces/_augur_sdk_src_api_warpsync_.warpsyncdata.md)›*

___

###  getPayoutFromWarpSyncHash

▸ **getPayoutFromWarpSyncHash**(`warpSyncHash`: string): *Promise‹BigNumber[]›*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:45](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`warpSyncHash` | string |

**Returns:** *Promise‹BigNumber[]›*

___

###  getWarpSyncHashFromMarket

▸ **getWarpSyncHashFromMarket**(`market`: Market): *Promise‹string›*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:31](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`market` | Market |

**Returns:** *Promise‹string›*

___

###  getWarpSyncHashFromPayout

▸ **getWarpSyncHashFromPayout**(`payout`: BigNumber): *string*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:38](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`payout` | BigNumber |

**Returns:** *string*

___

###  getWarpSyncMarket

▸ **getWarpSyncMarket**(`universe`: string): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:25](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |

**Returns:** *Promise‹Market›*

___

###  initializeUniverse

▸ **initializeUniverse**(`universe`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/WarpSync.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/WarpSync.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |

**Returns:** *Promise‹void›*

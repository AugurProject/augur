[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/HotLoading"](../modules/_augur_sdk_src_api_hotloading_.md) › [HotLoading](_augur_sdk_src_api_hotloading_.hotloading.md)

# Class: HotLoading

## Hierarchy

* **HotLoading**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_hotloading_.hotloading.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_hotloading_.hotloading.md#private-augur)

### Methods

* [getCurrentDisputeWindowData](_augur_sdk_src_api_hotloading_.hotloading.md#getcurrentdisputewindowdata)
* [getMarketDataParams](_augur_sdk_src_api_hotloading_.hotloading.md#getmarketdataparams)

## Constructors

###  constructor

\+ **new HotLoading**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[HotLoading](_augur_sdk_src_api_hotloading_.hotloading.md)*

*Defined in [packages/augur-sdk/src/api/HotLoading.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/HotLoading.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[HotLoading](_augur_sdk_src_api_hotloading_.hotloading.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/HotLoading.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/HotLoading.ts#L61)*

## Methods

###  getCurrentDisputeWindowData

▸ **getCurrentDisputeWindowData**(`params`: [GetDisputeWindowParams](../interfaces/_augur_sdk_src_api_hotloading_.getdisputewindowparams.md)): *Promise‹[DisputeWindow](../interfaces/_augur_sdk_src_api_hotloading_.disputewindow.md)›*

*Defined in [packages/augur-sdk/src/api/HotLoading.ts:198](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/HotLoading.ts#L198)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [GetDisputeWindowParams](../interfaces/_augur_sdk_src_api_hotloading_.getdisputewindowparams.md) |

**Returns:** *Promise‹[DisputeWindow](../interfaces/_augur_sdk_src_api_hotloading_.disputewindow.md)›*

___

###  getMarketDataParams

▸ **getMarketDataParams**(`params`: [GetMarketDataParams](../interfaces/_augur_sdk_src_api_hotloading_.getmarketdataparams.md)): *Promise‹[HotLoadMarketInfo](../interfaces/_augur_sdk_src_api_hotloading_.hotloadmarketinfo.md)›*

*Defined in [packages/augur-sdk/src/api/HotLoading.ts:67](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/HotLoading.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [GetMarketDataParams](../interfaces/_augur_sdk_src_api_hotloading_.getmarketdataparams.md) |

**Returns:** *Promise‹[HotLoadMarketInfo](../interfaces/_augur_sdk_src_api_hotloading_.hotloadmarketinfo.md)›*

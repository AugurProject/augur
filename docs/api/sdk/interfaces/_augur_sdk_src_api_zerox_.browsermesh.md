[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/ZeroX"](../modules/_augur_sdk_src_api_zerox_.md) › [BrowserMesh](_augur_sdk_src_api_zerox_.browsermesh.md)

# Interface: BrowserMesh

## Hierarchy

* **BrowserMesh**

## Index

### Methods

* [addOrdersAsync](_augur_sdk_src_api_zerox_.browsermesh.md#addordersasync)
* [getOrdersAsync](_augur_sdk_src_api_zerox_.browsermesh.md#getordersasync)
* [getStatsAsync](_augur_sdk_src_api_zerox_.browsermesh.md#getstatsasync)
* [onError](_augur_sdk_src_api_zerox_.browsermesh.md#onerror)
* [onOrderEvents](_augur_sdk_src_api_zerox_.browsermesh.md#onorderevents)
* [startAsync](_augur_sdk_src_api_zerox_.browsermesh.md#startasync)

## Methods

###  addOrdersAsync

▸ **addOrdersAsync**(`orders`: [SignedOrder](_augur_sdk_src_api_zerox_.signedorder.md)[], `pinned?`: boolean): *Promise‹ValidationResults›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:66](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | [SignedOrder](_augur_sdk_src_api_zerox_.signedorder.md)[] |
`pinned?` | boolean |

**Returns:** *Promise‹ValidationResults›*

___

###  getOrdersAsync

▸ **getOrdersAsync**(): *Promise‹GetOrdersResponse›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:70](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L70)*

**Returns:** *Promise‹GetOrdersResponse›*

___

###  getStatsAsync

▸ **getStatsAsync**(): *Promise‹Stats›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L71)*

**Returns:** *Promise‹Stats›*

___

###  onError

▸ **onError**(`handler`: function): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:64](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L64)*

**Parameters:**

▪ **handler**: *function*

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *void*

___

###  onOrderEvents

▸ **onOrderEvents**(`handler`: function): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:65](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L65)*

**Parameters:**

▪ **handler**: *function*

▸ (`events`: OrderEvent[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`events` | OrderEvent[] |

**Returns:** *void*

___

###  startAsync

▸ **startAsync**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:63](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L63)*

**Returns:** *Promise‹void›*

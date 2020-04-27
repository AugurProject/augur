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

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:53](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | [SignedOrder](_augur_sdk_src_api_zerox_.signedorder.md)[] |
`pinned?` | boolean |

**Returns:** *Promise‹ValidationResults›*

___

###  getOrdersAsync

▸ **getOrdersAsync**(): *Promise‹GetOrdersResponse›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:57](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L57)*

**Returns:** *Promise‹GetOrdersResponse›*

___

###  getStatsAsync

▸ **getStatsAsync**(): *Promise‹Stats›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:58](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L58)*

**Returns:** *Promise‹Stats›*

___

###  onError

▸ **onError**(`handler`: function): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:51](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L51)*

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

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:52](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L52)*

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

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:50](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L50)*

**Returns:** *Promise‹void›*

---
id: api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo
title: DisputeInfo
sidebar_label: DisputeInfo
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Markets Module]](api-modules-packages-augur-sdk-src-state-getter-markets-module.md) > [DisputeInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md)

## Interface

## Hierarchy

**DisputeInfo**

### Properties

* [bondSizeOfNewStake](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md#bondsizeofnewstake)
* [disputePacingOn](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md#disputepacingon)
* [disputeWindow](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md#disputewindow)
* [stakeCompletedTotal](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md#stakecompletedtotal)
* [stakes](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md#stakes)

---

## Properties

<a id="bondsizeofnewstake"></a>

###  bondSizeOfNewStake

**● bondSizeOfNewStake**: *`string`*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:167](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L167)*

___
<a id="disputepacingon"></a>

###  disputePacingOn

**● disputePacingOn**: *`boolean`*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:165](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L165)*

___
<a id="disputewindow"></a>

###  disputeWindow

**● disputeWindow**: *`object`*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:160](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L160)*

#### Type declaration

 address: [Address](api-interfaces-packages-augur-sdk-src-event-handlers-tradingproceedsclaimed.md#address)

 endTime: [Timestamp](api-modules-packages-augur-sdk-src-state-logs-types-module.md#timestamp) \| `null`

 startTime: [Timestamp](api-modules-packages-augur-sdk-src-state-logs-types-module.md#timestamp) \| `null`

___
<a id="stakecompletedtotal"></a>

###  stakeCompletedTotal

**● stakeCompletedTotal**: *`string`*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:166](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L166)*

___
<a id="stakes"></a>

###  stakes

**● stakes**: *[StakeDetails](api-interfaces-packages-augur-sdk-src-state-getter-markets-stakedetails.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:168](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L168)*

___


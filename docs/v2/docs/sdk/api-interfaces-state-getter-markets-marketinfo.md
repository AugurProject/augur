---
id: api-interfaces-state-getter-markets-marketinfo
title: MarketInfo
sidebar_label: MarketInfo
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Markets Module]](api-modules-state-getter-markets-module.md) > [MarketInfo](api-interfaces-state-getter-markets-marketinfo.md)

## Interface

## Hierarchy

**MarketInfo**

### Properties

* [author](api-interfaces-state-getter-markets-marketinfo.md#author)
* [category](api-interfaces-state-getter-markets-marketinfo.md#category)
* [consensus](api-interfaces-state-getter-markets-marketinfo.md#consensus)
* [creationBlock](api-interfaces-state-getter-markets-marketinfo.md#creationblock)
* [cumulativeScale](api-interfaces-state-getter-markets-marketinfo.md#cumulativescale)
* [description](api-interfaces-state-getter-markets-marketinfo.md#description)
* [details](api-interfaces-state-getter-markets-marketinfo.md#details)
* [endTime](api-interfaces-state-getter-markets-marketinfo.md#endtime)
* [finalizationBlockNumber](api-interfaces-state-getter-markets-marketinfo.md#finalizationblocknumber)
* [finalizationTime](api-interfaces-state-getter-markets-marketinfo.md#finalizationtime)
* [id](api-interfaces-state-getter-markets-marketinfo.md#id)
* [marketType](api-interfaces-state-getter-markets-marketinfo.md#markettype)
* [maxPrice](api-interfaces-state-getter-markets-marketinfo.md#maxprice)
* [minPrice](api-interfaces-state-getter-markets-marketinfo.md#minprice)
* [needsMigration](api-interfaces-state-getter-markets-marketinfo.md#needsmigration)
* [numOutcomes](api-interfaces-state-getter-markets-marketinfo.md#numoutcomes)
* [numTicks](api-interfaces-state-getter-markets-marketinfo.md#numticks)
* [openInterest](api-interfaces-state-getter-markets-marketinfo.md#openinterest)
* [outcomes](api-interfaces-state-getter-markets-marketinfo.md#outcomes)
* [reportingState](api-interfaces-state-getter-markets-marketinfo.md#reportingstate)
* [resolutionSource](api-interfaces-state-getter-markets-marketinfo.md#resolutionsource)
* [scalarDenomination](api-interfaces-state-getter-markets-marketinfo.md#scalardenomination)
* [tickSize](api-interfaces-state-getter-markets-marketinfo.md#ticksize)
* [universe](api-interfaces-state-getter-markets-marketinfo.md#universe)
* [volume](api-interfaces-state-getter-markets-marketinfo.md#volume)

---

## Properties

<a id="author"></a>

###  author

**● author**: *`string`*

*Defined in [state/getter/Markets.ts:75](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L75)*

___
<a id="category"></a>

###  category

**● category**: *`string`*

*Defined in [state/getter/Markets.ts:77](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L77)*

___
<a id="consensus"></a>

###  consensus

**● consensus**: *`Array`<`string`> \| `null`*

*Defined in [state/getter/Markets.ts:91](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L91)*

___
<a id="creationblock"></a>

###  creationBlock

**● creationBlock**: *`number`*

*Defined in [state/getter/Markets.ts:76](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L76)*

___
<a id="cumulativescale"></a>

###  cumulativeScale

**● cumulativeScale**: *`string`*

*Defined in [state/getter/Markets.ts:74](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L74)*

___
<a id="description"></a>

###  description

**● description**: *`string`*

*Defined in [state/getter/Markets.ts:85](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L85)*

___
<a id="details"></a>

###  details

**● details**: *`string` \| `null`*

*Defined in [state/getter/Markets.ts:87](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L87)*

___
<a id="endtime"></a>

###  endTime

**● endTime**: *`number`*

*Defined in [state/getter/Markets.ts:82](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L82)*

___
<a id="finalizationblocknumber"></a>

###  finalizationBlockNumber

**● finalizationBlockNumber**: *`number` \| `null`*

*Defined in [state/getter/Markets.ts:83](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L83)*

___
<a id="finalizationtime"></a>

###  finalizationTime

**● finalizationTime**: *`number` \| `null`*

*Defined in [state/getter/Markets.ts:84](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L84)*

___
<a id="id"></a>

###  id

**● id**: *`string`*

*Defined in [state/getter/Markets.ts:68](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L68)*

___
<a id="markettype"></a>

###  marketType

**● marketType**: *[MarketType](api-enums-state-logs-types-markettype.md)*

*Defined in [state/getter/Markets.ts:70](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L70)*

___
<a id="maxprice"></a>

###  maxPrice

**● maxPrice**: *`string`*

*Defined in [state/getter/Markets.ts:73](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L73)*

___
<a id="minprice"></a>

###  minPrice

**● minPrice**: *`string`*

*Defined in [state/getter/Markets.ts:72](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L72)*

___
<a id="needsmigration"></a>

###  needsMigration

**● needsMigration**: *`boolean`*

*Defined in [state/getter/Markets.ts:81](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L81)*

___
<a id="numoutcomes"></a>

###  numOutcomes

**● numOutcomes**: *`number`*

*Defined in [state/getter/Markets.ts:71](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L71)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`string`*

*Defined in [state/getter/Markets.ts:89](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L89)*

___
<a id="openinterest"></a>

###  openInterest

**● openInterest**: *`string`*

*Defined in [state/getter/Markets.ts:79](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L79)*

___
<a id="outcomes"></a>

###  outcomes

**● outcomes**: *`Array`<[MarketInfoOutcome](api-interfaces-state-getter-markets-marketinfooutcome.md)>*

*Defined in [state/getter/Markets.ts:92](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L92)*

___
<a id="reportingstate"></a>

###  reportingState

**● reportingState**: *`string`*

*Defined in [state/getter/Markets.ts:80](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L80)*

___
<a id="resolutionsource"></a>

###  resolutionSource

**● resolutionSource**: *`string` \| `null`*

*Defined in [state/getter/Markets.ts:88](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L88)*

___
<a id="scalardenomination"></a>

###  scalarDenomination

**● scalarDenomination**: *`string` \| `null`*

*Defined in [state/getter/Markets.ts:86](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L86)*

___
<a id="ticksize"></a>

###  tickSize

**● tickSize**: *`string`*

*Defined in [state/getter/Markets.ts:90](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L90)*

___
<a id="universe"></a>

###  universe

**● universe**: *`string`*

*Defined in [state/getter/Markets.ts:69](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L69)*

___
<a id="volume"></a>

###  volume

**● volume**: *`string`*

*Defined in [state/getter/Markets.ts:78](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L78)*

___


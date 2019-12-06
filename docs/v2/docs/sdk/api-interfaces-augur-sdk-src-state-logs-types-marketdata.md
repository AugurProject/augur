---
id: api-interfaces-augur-sdk-src-state-logs-types-marketdata
title: MarketData
sidebar_label: MarketData
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

**↳ MarketData**

### Properties

* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#blocknumber)
* [designatedReporter](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#designatedreporter)
* [disavowed](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#disavowed)
* [disputeRound](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#disputeround)
* [endTime](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#endtime)
* [extraInfo](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#extrainfo)
* [feeDivisor](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#feedivisor)
* [feePerCashInAttoCash](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#feepercashinattocash)
* [feePercent](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#feepercent)
* [finalizationBlockNumber](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#finalizationblocknumber)
* [finalizationTime](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#finalizationtime)
* [finalized](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#finalized)
* [hasRecentlyDepletedLiquidity](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#hasrecentlydepletedliquidity)
* [invalidFilter](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#invalidfilter)
* [isTemplate](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#istemplate)
* [liquidity](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#liquidity)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#market)
* [marketCreator](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#marketcreator)
* [marketOI](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#marketoi)
* [marketType](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#markettype)
* [nextWindowEndTime](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#nextwindowendtime)
* [nextWindowStartTime](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#nextwindowstarttime)
* [noShowBond](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#noshowbond)
* [numTicks](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#numticks)
* [outcomeVolumes](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#outcomevolumes)
* [outcomes](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#outcomes)
* [pacingOn](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#pacingon)
* [prices](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#prices)
* [reportingState](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#reportingstate)
* [tentativeWinningPayoutNumerators](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#tentativewinningpayoutnumerators)
* [timestamp](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#timestamp)
* [totalRepStakedInMarket](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#totalrepstakedinmarket)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#universe)
* [volume](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#volume)
* [winningPayoutNumerators](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md#winningpayoutnumerators)

---

## Properties

<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L21)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="designatedreporter"></a>

###  designatedReporter

**● designatedReporter**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:402](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L402)*

___
<a id="disavowed"></a>

###  disavowed

**● disavowed**: *`boolean`*

*Defined in [augur-sdk/src/state/logs/types.ts:427](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L427)*

___
<a id="disputeround"></a>

###  disputeRound

**● disputeRound**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:422](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L422)*

___
<a id="endtime"></a>

###  endTime

**● endTime**: *[Timestamp](api-modules-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Defined in [augur-sdk/src/state/logs/types.ts:398](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L398)*

___
<a id="extrainfo"></a>

###  extraInfo

**● extraInfo**: *[ExtraInfo](api-interfaces-augur-sdk-src-state-logs-types-extrainfo.md)*

*Defined in [augur-sdk/src/state/logs/types.ts:399](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L399)*

___
<a id="feedivisor"></a>

###  feeDivisor

**● feeDivisor**: *`number`*

*Defined in [augur-sdk/src/state/logs/types.ts:414](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L414)*

___
<a id="feepercashinattocash"></a>

###  feePerCashInAttoCash

**● feePerCashInAttoCash**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:403](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L403)*

___
<a id="feepercent"></a>

###  feePercent

**● feePercent**: *`number`*

*Defined in [augur-sdk/src/state/logs/types.ts:429](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L429)*

___
<a id="finalizationblocknumber"></a>

###  finalizationBlockNumber

**● finalizationBlockNumber**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:416](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L416)*

___
<a id="finalizationtime"></a>

###  finalizationTime

**● finalizationTime**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:417](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L417)*

___
<a id="finalized"></a>

###  finalized

**● finalized**: *`boolean`*

*Defined in [augur-sdk/src/state/logs/types.ts:430](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L430)*

___
<a id="hasrecentlydepletedliquidity"></a>

###  hasRecentlyDepletedLiquidity

**● hasRecentlyDepletedLiquidity**: *`boolean`*

*Defined in [augur-sdk/src/state/logs/types.ts:415](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L415)*

___
<a id="invalidfilter"></a>

###  invalidFilter

**● invalidFilter**: *`boolean`*

*Defined in [augur-sdk/src/state/logs/types.ts:412](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L412)*

___
<a id="istemplate"></a>

###  isTemplate

**● isTemplate**: *`boolean`*

*Defined in [augur-sdk/src/state/logs/types.ts:428](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L428)*

___
<a id="liquidity"></a>

###  liquidity

**● liquidity**: *[LiquidityData](api-interfaces-augur-sdk-src-state-logs-types-liquiditydata.md)*

*Defined in [augur-sdk/src/state/logs/types.ts:413](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L413)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L24)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:400](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L400)*

___
<a id="marketcreator"></a>

###  marketCreator

**● marketCreator**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:401](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L401)*

___
<a id="marketoi"></a>

###  marketOI

**● marketOI**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:411](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L411)*

___
<a id="markettype"></a>

###  marketType

**● marketType**: *[MarketType](api-enums-augur-sdk-src-state-logs-types-markettype.md)*

*Defined in [augur-sdk/src/state/logs/types.ts:405](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L405)*

___
<a id="nextwindowendtime"></a>

###  nextWindowEndTime

**● nextWindowEndTime**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:424](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L424)*

___
<a id="nextwindowstarttime"></a>

###  nextWindowStartTime

**● nextWindowStartTime**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:423](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L423)*

___
<a id="noshowbond"></a>

###  noShowBond

**● noShowBond**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:426](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L426)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:406](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L406)*

___
<a id="outcomevolumes"></a>

###  outcomeVolumes

**● outcomeVolumes**: *`string`[]*

*Defined in [augur-sdk/src/state/logs/types.ts:410](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L410)*

___
<a id="outcomes"></a>

###  outcomes

**● outcomes**: *`string`[]*

*Defined in [augur-sdk/src/state/logs/types.ts:407](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L407)*

___
<a id="pacingon"></a>

###  pacingOn

**● pacingOn**: *`boolean`*

*Defined in [augur-sdk/src/state/logs/types.ts:425](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L425)*

___
<a id="prices"></a>

###  prices

**● prices**: *`string`[]*

*Defined in [augur-sdk/src/state/logs/types.ts:404](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L404)*

___
<a id="reportingstate"></a>

###  reportingState

**● reportingState**: *[MarketReportingState](api-enums-augur-sdk-src-constants-marketreportingstate.md)*

*Defined in [augur-sdk/src/state/logs/types.ts:419](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L419)*

___
<a id="tentativewinningpayoutnumerators"></a>

###  tentativeWinningPayoutNumerators

**● tentativeWinningPayoutNumerators**: *`string`[]*

*Defined in [augur-sdk/src/state/logs/types.ts:420](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L420)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:408](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L408)*

___
<a id="totalrepstakedinmarket"></a>

###  totalRepStakedInMarket

**● totalRepStakedInMarket**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:421](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L421)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L23)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L22)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:397](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L397)*

___
<a id="volume"></a>

###  volume

**● volume**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:409](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L409)*

___
<a id="winningpayoutnumerators"></a>

###  winningPayoutNumerators

**● winningPayoutNumerators**: *`string`[]*

*Defined in [augur-sdk/src/state/logs/types.ts:418](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L418)*

___


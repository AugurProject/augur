[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](../modules/_augur_sdk_src_state_logs_types_.md) › [MarketData](_augur_sdk_src_state_logs_types_.marketdata.md)

# Interface: MarketData

## Hierarchy

* [Log](_augur_sdk_src_state_logs_types_.log.md)

  ↳ **MarketData**

## Index

### Properties

* [blockHash](_augur_sdk_src_state_logs_types_.marketdata.md#blockhash)
* [blockNumber](_augur_sdk_src_state_logs_types_.marketdata.md#blocknumber)
* [creationTime](_augur_sdk_src_state_logs_types_.marketdata.md#creationtime)
* [designatedReporter](_augur_sdk_src_state_logs_types_.marketdata.md#designatedreporter)
* [disavowed](_augur_sdk_src_state_logs_types_.marketdata.md#disavowed)
* [disputeRound](_augur_sdk_src_state_logs_types_.marketdata.md#disputeround)
* [endTime](_augur_sdk_src_state_logs_types_.marketdata.md#endtime)
* [extraInfo](_augur_sdk_src_state_logs_types_.marketdata.md#extrainfo)
* [feeDivisor](_augur_sdk_src_state_logs_types_.marketdata.md#feedivisor)
* [feePerCashInAttoCash](_augur_sdk_src_state_logs_types_.marketdata.md#feepercashinattocash)
* [feePercent](_augur_sdk_src_state_logs_types_.marketdata.md#feepercent)
* [finalizationBlockNumber](_augur_sdk_src_state_logs_types_.marketdata.md#finalizationblocknumber)
* [finalizationTime](_augur_sdk_src_state_logs_types_.marketdata.md#finalizationtime)
* [finalized](_augur_sdk_src_state_logs_types_.marketdata.md#finalized)
* [hasRecentlyDepletedLiquidity](_augur_sdk_src_state_logs_types_.marketdata.md#hasrecentlydepletedliquidity)
* [invalidFilter](_augur_sdk_src_state_logs_types_.marketdata.md#invalidfilter)
* [isTemplate](_augur_sdk_src_state_logs_types_.marketdata.md#istemplate)
* [isWarpSync](_augur_sdk_src_state_logs_types_.marketdata.md#iswarpsync)
* [lastPassingLiquidityCheck](_augur_sdk_src_state_logs_types_.marketdata.md#lastpassingliquiditycheck)
* [lastTradedTimestamp](_augur_sdk_src_state_logs_types_.marketdata.md#lasttradedtimestamp)
* [liquidity](_augur_sdk_src_state_logs_types_.marketdata.md#liquidity)
* [liquidityDirty](_augur_sdk_src_state_logs_types_.marketdata.md#liquiditydirty)
* [logIndex](_augur_sdk_src_state_logs_types_.marketdata.md#logindex)
* [market](_augur_sdk_src_state_logs_types_.marketdata.md#market)
* [marketCreator](_augur_sdk_src_state_logs_types_.marketdata.md#marketcreator)
* [marketOI](_augur_sdk_src_state_logs_types_.marketdata.md#marketoi)
* [marketType](_augur_sdk_src_state_logs_types_.marketdata.md#markettype)
* [nextWindowEndTime](_augur_sdk_src_state_logs_types_.marketdata.md#nextwindowendtime)
* [nextWindowStartTime](_augur_sdk_src_state_logs_types_.marketdata.md#nextwindowstarttime)
* [noShowBond](_augur_sdk_src_state_logs_types_.marketdata.md#noshowbond)
* [numTicks](_augur_sdk_src_state_logs_types_.marketdata.md#numticks)
* [outcomeVolumes](_augur_sdk_src_state_logs_types_.marketdata.md#outcomevolumes)
* [outcomes](_augur_sdk_src_state_logs_types_.marketdata.md#outcomes)
* [pacingOn](_augur_sdk_src_state_logs_types_.marketdata.md#pacingon)
* [prices](_augur_sdk_src_state_logs_types_.marketdata.md#prices)
* [reportingState](_augur_sdk_src_state_logs_types_.marketdata.md#reportingstate)
* [tentativeWinningPayoutNumerators](_augur_sdk_src_state_logs_types_.marketdata.md#tentativewinningpayoutnumerators)
* [timestamp](_augur_sdk_src_state_logs_types_.marketdata.md#timestamp)
* [totalRepStakedInMarket](_augur_sdk_src_state_logs_types_.marketdata.md#totalrepstakedinmarket)
* [transactionHash](_augur_sdk_src_state_logs_types_.marketdata.md#transactionhash)
* [transactionIndex](_augur_sdk_src_state_logs_types_.marketdata.md#transactionindex)
* [universe](_augur_sdk_src_state_logs_types_.marketdata.md#universe)
* [volume](_augur_sdk_src_state_logs_types_.marketdata.md#volume)
* [winningPayoutNumerators](_augur_sdk_src_state_logs_types_.marketdata.md#winningpayoutnumerators)

## Properties

###  blockHash

• **blockHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockHash](_augur_sdk_src_state_logs_types_.log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L18)*

___

###  blockNumber

• **blockNumber**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockNumber](_augur_sdk_src_state_logs_types_.log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L17)*

___

###  creationTime

• **creationTime**: *[UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:436](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L436)*

___

###  designatedReporter

• **designatedReporter**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:429](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L429)*

___

###  disavowed

• **disavowed**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:457](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L457)*

___

###  disputeRound

• **disputeRound**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:452](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L452)*

___

###  endTime

• **endTime**: *[UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:425](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L425)*

___

###  extraInfo

• **extraInfo**: *[ExtraInfo](_augur_sdk_src_state_logs_types_.extrainfo.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:426](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L426)*

___

###  feeDivisor

• **feeDivisor**: *number*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:442](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L442)*

___

###  feePerCashInAttoCash

• **feePerCashInAttoCash**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:430](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L430)*

___

###  feePercent

• **feePercent**: *number*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:459](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L459)*

___

###  finalizationBlockNumber

• **finalizationBlockNumber**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:446](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L446)*

___

###  finalizationTime

• **finalizationTime**: *[UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:447](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L447)*

___

###  finalized

• **finalized**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:460](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L460)*

___

###  hasRecentlyDepletedLiquidity

• **hasRecentlyDepletedLiquidity**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:443](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L443)*

___

###  invalidFilter

• **invalidFilter**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:440](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L440)*

___

###  isTemplate

• **isTemplate**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:458](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L458)*

___

###  isWarpSync

• **isWarpSync**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:462](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L462)*

___

###  lastPassingLiquidityCheck

• **lastPassingLiquidityCheck**: *number*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:444](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L444)*

___

###  lastTradedTimestamp

• **lastTradedTimestamp**: *[UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:461](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L461)*

___

###  liquidity

• **liquidity**: *[LiquidityData](_augur_sdk_src_state_logs_types_.liquiditydata.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:441](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L441)*

___

###  liquidityDirty

• **liquidityDirty**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:445](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L445)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[logIndex](_augur_sdk_src_state_logs_types_.log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L21)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:427](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L427)*

___

###  marketCreator

• **marketCreator**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:428](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L428)*

___

###  marketOI

• **marketOI**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:439](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L439)*

___

###  marketType

• **marketType**: *[MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:432](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L432)*

___

###  nextWindowEndTime

• **nextWindowEndTime**: *[UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:454](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L454)*

___

###  nextWindowStartTime

• **nextWindowStartTime**: *[UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:453](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L453)*

___

###  noShowBond

• **noShowBond**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:456](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L456)*

___

###  numTicks

• **numTicks**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:433](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L433)*

___

###  outcomeVolumes

• **outcomeVolumes**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:438](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L438)*

___

###  outcomes

• **outcomes**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:434](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L434)*

___

###  pacingOn

• **pacingOn**: *boolean*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:455](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L455)*

___

###  prices

• **prices**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:431](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L431)*

___

###  reportingState

• **reportingState**: *[MarketReportingState](../enums/_augur_sdk_src_constants_.marketreportingstate.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:449](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L449)*

___

###  tentativeWinningPayoutNumerators

• **tentativeWinningPayoutNumerators**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:450](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L450)*

___

###  timestamp

• **timestamp**: *[UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:435](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L435)*

___

###  totalRepStakedInMarket

• **totalRepStakedInMarket**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:451](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L451)*

___

###  transactionHash

• **transactionHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionHash](_augur_sdk_src_state_logs_types_.log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L20)*

___

###  transactionIndex

• **transactionIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionIndex](_augur_sdk_src_state_logs_types_.log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L19)*

___

###  universe

• **universe**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:424](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L424)*

___

###  volume

• **volume**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:437](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L437)*

___

###  winningPayoutNumerators

• **winningPayoutNumerators**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:448](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L448)*

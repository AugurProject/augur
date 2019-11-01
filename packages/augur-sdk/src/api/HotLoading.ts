import { BigNumber } from "bignumber.js";
import { Augur } from "../Augur";
import { augurEmitter } from '../events';
import { SubscriptionEventName, MarketReportingState } from '../constants';
import { Address } from "../logs/types";
import { MarketInfoOutcome } from "../state/getter/Markets";
import {
    convertOnChainAmountToDisplayAmount,
    convertOnChainPriceToDisplayPrice,
    marketTypeToName,
    numTicksToTickSize,
    QUINTILLION
  } from "../index";
  import { calculatePayoutNumeratorsValue, getOutcomeValue, PayoutNumeratorValue } from "../utils";



export interface GetMarketDataParams {
  market: string;
}

export interface HotLoadMarketInfo {
    id: Address;
    universe: Address;
    marketType: string;
    numOutcomes: number;
    minPrice: string;
    maxPrice: string;
    cumulativeScale: string;
    author: string;
    designatedReporter: string;
    volume: string;
    openInterest: string;
    reportingState: string;
    endTime: number;
    description: string;
    scalarDenomination: string | null;
    details: string | null;
    numTicks: string;
    tickSize: string;
    consensus: PayoutNumeratorValue;
    outcomes: MarketInfoOutcome[];
    marketCreatorFeeRate: string;
    settlementFee: string;
    reportingFeeRate: string;
    categories: string[];
  }

export class HotLoading {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }

  async getMarketDataParams(params: GetMarketDataParams): Promise<void> {
    const augur = this.augur.addresses.Augur;
    const fillorder = this.augur.addresses.FillOrder;
    const orders = this.augur.addresses.Orders;

    const marketData = await this.augur.contracts.hotLoading.getMarketData_(augur, params.market, fillorder, orders);

    const extraInfoString = marketData[0];
    const author = marketData[1];
    const outcomes = marketData[3];

    const marketType = marketTypeToName(marketData[4]);
    let displayPrices = marketData[5];
    if (displayPrices.length == 0) {
        displayPrices = [0, QUINTILLION];
    }
    const designatedReporter = marketData[6];s
    const reportingStateNumber: number = marketData[7];
    const winningPayout = marketData[9];
    const volume = new BigNumber(marketData[10]._hex).dividedBy(QUINTILLION).toFixed();
    const openInterest = new BigNumber(marketData[11]._hex).dividedBy(QUINTILLION).toFixed();
    const lastTradedPrices = marketData[12];
    const universe = marketData[13];
    const numTicks = new BigNumber(marketData[14]._hex);
    const feeDivisor = marketData[15];
    const endTime = new BigNumber(marketData[17]._hex).toNumber();
    const numOutcomes = new BigNumber(marketData[18]._hex).toNumber();

    const reportingState = MarketReportingState[reportingStateNumber];

    const minPrice = new BigNumber(displayPrices[0]._hex);
    const maxPrice = new BigNumber(displayPrices[1]._hex);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const displayMinPrice = minPrice.dividedBy(QUINTILLION);
    const displayMaxPrice = maxPrice.dividedBy(QUINTILLION);
    const cumulativeScale = displayMaxPrice.minus(displayMinPrice);

    let consensus = null;

    if (winningPayout) {
        let payouts = [];
        for (let i = 0; i < winningPayout.length; i++) {
            payouts[i] = new BigNumber(winningPayout[i]).toString(10);
        }
        consensus = calculatePayoutNumeratorsValue(String(displayMaxPrice), String(displayMinPrice), String(numTicks), marketType, payouts);
    }

    let categories:string[] = [];
    let description = null;
    let details = null;
    let scalarDenomination = null;
    if (extraInfoString) {
      try {
        let extraInfo = JSON.parse(extraInfoString);
        categories = extraInfo.categories ? extraInfo.categories : [];
        description = extraInfo.description ? extraInfo.description : null;
        details = extraInfo.longDescription
          ? extraInfo.longDescription
          : null;
        scalarDenomination = extraInfo._scalarDenomination
          ? extraInfo._scalarDenomination
          : null;
      } catch (err) {
          console.log(`Bad extraInfo string on market ${params.market}: ${extraInfoString}`);
      }
    }

    const marketCreatorFeeRate = new BigNumber(feeDivisor._hex).dividedBy(QUINTILLION);
    const reportingFeeRate = new BigNumber(reportingFeeDivisor._hex).dividedBy(QUINTILLION);
    const settlementFee = marketCreatorFeeRate.plus(reportingFeeRate);

    const marketsInfo: HotLoadMarketInfo = {
        id: params.market,
        author,
        designatedReporter,
        universe,
        marketType,
        numOutcomes,
        volume,
        openInterest,
        numTicks: numTicks.toFixed(),
        tickSize: tickSize.toFixed(),
        endTime,
        consensus,
        categories,
        description,
        details,
        scalarDenomination,
        reportingState,
        minPrice: displayMinPrice.toFixed(),
        maxPrice: displayMaxPrice.toFixed(),
        cumulativeScale: cumulativeScale.toFixed(),
        marketCreatorFeeRate: marketCreatorFeeRate.toFixed(),
        reportingFeeRate: reportingFeeRate.toFixed(),
        settlementFee: settlementFee.toFixed(),
    }

    augurEmitter.emit(SubscriptionEventName.MarketsUpdated, { marketsInfo });
  }
}

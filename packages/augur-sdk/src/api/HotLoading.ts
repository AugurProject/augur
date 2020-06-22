import {
  calculatePayoutNumeratorsValue,
  Address,
  ExtraInfoTemplate,
  MarketReportingStateByNum,
  MarketTypeName,
  PayoutNumeratorValue,
  SubscriptionEventName,
} from '@augurproject/sdk-lite';
import { MarketInfoOutcome } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import { Augur } from '../Augur';
import {
  convertOnChainPriceToDisplayPrice,
  marketTypeToName,
  numTicksToTickSize,
  QUINTILLION,
} from '../index';

export interface GetDisputeWindowParams {
  augur: Address;
  universe: Address;
}

export interface DisputeWindow {
  address: Address;
  startTime: number;
  endTime: number;
  purchased: string;
  fees: string;
}

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
  template: ExtraInfoTemplate;
}

export class HotLoading {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }

  async getMarketDataParams(
    params: GetMarketDataParams
  ): Promise<HotLoadMarketInfo> {
    const augur = this.augur.config.addresses.Augur;
    const fillorder = this.augur.config.addresses.FillOrder;
    const orders = this.augur.config.addresses.Orders;

    let marketData = null;
    try {
      marketData = await this.augur.contracts.hotLoading.getMarketData_(
        augur,
        params.market,
        fillorder,
        orders
      );
    } catch (e) {
      console.error('Can not hotload market', e);
    }
    if (!marketData) return null;
    const extraInfoString = marketData[0];
    const author = marketData[1];
    const outcomes = marketData[3];

    const marketType = marketTypeToName(marketData[4]);
    let displayPrices = marketData[5];
    if (displayPrices.length == 0) {
      displayPrices = [0, QUINTILLION];
    } else {
      displayPrices = displayPrices.map(price => new BigNumber(price._hex));
    }
    const designatedReporter = marketData[6];
    const reportingStateNumber: number = marketData[7];
    const winningPayout = marketData[9];
    const volume = new BigNumber(marketData[10]._hex)
      .dividedBy(QUINTILLION)
      .toFixed();
    const openInterest = new BigNumber(marketData[11]._hex)
      .dividedBy(QUINTILLION)
      .toFixed();
    const lastTradedPrices = marketData[12];
    const universe = marketData[13];
    const numTicks = new BigNumber(marketData[14]._hex);
    const feeDivisor = marketData[15];
    const endTime = new BigNumber(marketData[17]._hex).toNumber();
    const numOutcomes = new BigNumber(marketData[18]._hex).toNumber();
    const reportingFeeDivisor = marketData[20];
    const outcomeVolumes = marketData[21];

    const reportingState: string =
      MarketReportingStateByNum[reportingStateNumber];

    const minPrice = new BigNumber(displayPrices[0]);
    const maxPrice = new BigNumber(displayPrices[1]);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const displayMinPrice = minPrice.dividedBy(QUINTILLION);
    const displayMaxPrice = maxPrice.dividedBy(QUINTILLION);
    const cumulativeScale = displayMaxPrice.minus(displayMinPrice);

    let consensus = null;

    if (reportingState === 'Finalized') {
      const payouts = [];
      for (let i = 0; i < winningPayout.length; i++) {
        payouts[i] = new BigNumber(winningPayout[i]).toString(10);
      }
      consensus = calculatePayoutNumeratorsValue(
        String(displayMaxPrice),
        String(displayMinPrice),
        String(numTicks),
        marketType,
        payouts
      );
    }

    let categories: string[] = [];
    let description = null;
    let details = null;
    let scalarDenomination = null;
    let template = null;
    if (extraInfoString) {
      try {
        const extraInfo = JSON.parse(extraInfoString);
        categories = extraInfo.categories ? extraInfo.categories : [];
        description = extraInfo.description ? extraInfo.description : null;
        details = extraInfo.longDescription ? extraInfo.longDescription : null;
        scalarDenomination = extraInfo._scalarDenomination
          ? extraInfo._scalarDenomination
          : null;
        template = extraInfo.template ? extraInfo.template : null;
      } catch (err) {
        console.log(
          `Bad extraInfo string on market ${params.market}: ${extraInfoString}`
        );
      }
    }

    const marketCreatorFeeRate = new BigNumber(1).dividedBy(feeDivisor._hex);
    const reportingFeeRate = new BigNumber(1).dividedBy(
      reportingFeeDivisor._hex
    );
    const settlementFee = marketCreatorFeeRate.plus(reportingFeeRate);

    const outcomeInfo = [];
    for (let i = 0; i < numOutcomes; i++) {
      let description = 'Invalid';
      if (i > 0) {
        if (marketType === MarketTypeName.YesNo) {
          description = i == 1 ? 'No' : 'Yes';
        } else if (marketType === MarketTypeName.Categorical) {
          description = Buffer.from(outcomes[i - 1].substr(2), 'hex')
            .toString()
            .replace(/\0/g, '');
        } else {
          description = scalarDenomination;
        }
      }
      outcomeInfo[i] = {
        id: i,
        price:
          lastTradedPrices.length > 0
            ? convertOnChainPriceToDisplayPrice(
                new BigNumber(lastTradedPrices[i]._hex),
                minPrice,
                tickSize
              ).toFixed()
            : 0,
        description,
        volume:
          outcomeVolumes.length > 0
            ? new BigNumber(outcomeVolumes[i]._hex)
                .dividedBy(QUINTILLION)
                .toFixed()
            : 0,
      };
    }

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
      outcomes: outcomeInfo,
      template,
    };

    this.augur.events.emit(SubscriptionEventName.MarketsUpdated, {
      marketsInfo,
    });
    return marketsInfo;
  }

  async getCurrentDisputeWindowData(
    params: GetDisputeWindowParams
  ): Promise<DisputeWindow> {
    const disputeWindowData = await this.augur.contracts.hotLoading.getCurrentDisputeWindowData_(
      params.augur,
      params.universe
    );
    return {
      address:
        disputeWindowData[0] == '0x0000000000000000000000000000000000000000'
          ? ''
          : disputeWindowData[0],
      startTime: disputeWindowData[1].toNumber(),
      endTime: disputeWindowData[2].toNumber(),
      purchased: disputeWindowData[3].toString(),
      fees: disputeWindowData[4].toString(),
    };
  }
}

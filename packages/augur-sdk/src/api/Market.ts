import { ContractInterfaces } from '@augurproject/core';
import { NULL_ADDRESS } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import { Augur } from '../Augur';

export interface CreateYesNoMarketParams {
  endTime: BigNumber;
  feePerCashInAttoCash: BigNumber;
  affiliateValidator?: string;
  affiliateFeeDivisor: BigNumber;
  designatedReporter: string;
  extraInfo: string;
}

export interface CreateCategoricalMarketParams {
  endTime: BigNumber;
  feePerCashInAttoCash: BigNumber;
  affiliateValidator?: string;
  affiliateFeeDivisor: BigNumber;
  designatedReporter: string;
  outcomes: string[];
  extraInfo: string;
}

export interface CreateScalarMarketParams {
  endTime: BigNumber;
  feePerCashInAttoCash: BigNumber;
  affiliateValidator?: string;
  affiliateFeeDivisor: BigNumber;
  designatedReporter: string;
  extraInfo: string;
  prices: BigNumber[];
  numTicks: BigNumber;
}

export class Market {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }

  async createYesNoMarket(
    params: CreateYesNoMarketParams
  ): Promise<ContractInterfaces.Market> {
    const universe = this.augur.contracts.universe;
    // TODO
    const affiliateValidator = params.affiliateValidator || NULL_ADDRESS;

    const events = await universe.createYesNoMarket(
      params.endTime,
      params.feePerCashInAttoCash,
      affiliateValidator,
      params.affiliateFeeDivisor,
      params.designatedReporter,
      params.extraInfo
    );
    const marketId = this.extractMarketIdFromEvents(events);
    return this.augur.contracts.marketFromAddress(marketId);
  }

  async createCategoricalMarket(
    params: CreateCategoricalMarketParams
  ): Promise<ContractInterfaces.Market> {
    const universe = this.augur.contracts.universe;
    // TODO
    const affiliateValidator = params.affiliateValidator || NULL_ADDRESS;

    const events = await universe.createCategoricalMarket(
      params.endTime,
      params.feePerCashInAttoCash,
      affiliateValidator,
      params.affiliateFeeDivisor,
      params.designatedReporter,
      params.outcomes,
      params.extraInfo
    );
    const marketId = this.extractMarketIdFromEvents(events);
    return this.augur.contracts.marketFromAddress(marketId);
  }

  async createScalarMarket(
    params: CreateScalarMarketParams
  ): Promise<ContractInterfaces.Market> {
    const universe = this.augur.contracts.universe;
    // TODO
    const affiliateValidator = params.affiliateValidator || NULL_ADDRESS;

    const events = await universe.createScalarMarket(
      params.endTime,
      params.feePerCashInAttoCash,
      affiliateValidator,
      params.affiliateFeeDivisor,
      params.designatedReporter,
      params.prices,
      params.numTicks,
      params.extraInfo
    );
    const marketId = this.extractMarketIdFromEvents(events);
    return this.augur.contracts.marketFromAddress(marketId);
  }

  extractMarketIdFromEvents(events): string {
    let marketId = '';
    for (const ev of events) {
      if (ev.name === 'MarketCreated') {
        interface HasMarket {
          market: string;
        }
        marketId = (ev.parameters as HasMarket).market;
      }
    }

    return marketId;
  }
}

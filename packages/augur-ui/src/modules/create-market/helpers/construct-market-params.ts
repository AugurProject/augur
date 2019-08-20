import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';
import { NewMarket } from "modules/types";
import { createBigNumber } from "utils/create-big-number";
import {
  CreateYesNoMarketParams,
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  stringTo32ByteHex,
  QUINTILLION,
  tickSizeToNumTickWithDisplayPrices,
} from '@augurproject/sdk';
import { BigNumber } from 'bignumber.js';
import {
  SCALAR,
  CATEGORICAL,
  TEN_TO_THE_EIGHTEENTH_POWER,
} from 'modules/common/constants';

export function generateTxParameters(newMarket: NewMarket, copyReturn: Boolean): TransactionMetadataParams {
  const fee = new BigNumber(newMarket.settlementFee || 0).div(new BigNumber(100))
  const feePerCashInAttoCash = fee.multipliedBy(TEN_TO_THE_EIGHTEENTH_POWER);
  const affiliateFeeDivisor = new BigNumber(newMarket.affiliateFee || 0);
  const marketEndTime = new BigNumber(newMarket.endTime);
  const extraInfo = JSON.stringify({
    categories: newMarket.categories,
    description: newMarket.description,
    longDescription: newMarket.detailsText,
    resolutionSource: newMarket.expirySource,
    backupSource: newMarket.backupSource,
    _scalarDenomination: newMarket.scalarDenomination,
    offsetName: newMarket.offsetName,
  });

  let baseParams: CreateYesNoMarketParams = {
    endTime: marketEndTime,
    feePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter: newMarket.designatedReporterAddress,
    extraInfo,
  };
  
  if (copyReturn) {
  	baseParams = {
	    _endTime: marketEndTime,
	    _feePerCashInAttoCash: feePerCashInAttoCash,
	    _affiliateFeeDivisor: affiliateFeeDivisor,
	    _designatedReporter: newMarket.designatedReporterAddress,
	    _extraInfo: extraInfo,
  	};
  };

   switch (newMarket.marketType) {
    case SCALAR: {
      const prices = [
        new BigNumber(newMarket.minPrice).multipliedBy(QUINTILLION),
        new BigNumber(newMarket.maxPrice).multipliedBy(QUINTILLION),
      ];
      const numTicks = tickSizeToNumTickWithDisplayPrices(new BigNumber(newMarket.tickSize), new BigNumber(newMarket.minPrice), new BigNumber(newMarket.maxPrice));
      let params: CreateScalarMarketParams = Object.assign(baseParams, {
        prices,
        numTicks,
      });

      if (copyReturn) {
        params = Object.assign(baseParams, {
          _prices: prices,
          _numTicks: numTicks,
        });
      }
	    return params;
    }
    case CATEGORICAL: {
      let params: CreateCategoricalMarketParams = Object.assign(baseParams, {
        outcomes: newMarket.outcomes.map(o => stringTo32ByteHex(o)),
      });
      if (copyReturn) {
        params = Object.assign(baseParams, {
          _outcomes: newMarket.outcomes.map(o => stringTo32ByteHex(o)),
        });
      }
	    return params;
    }
    default: {
      return baseParams;
    }
  }
}
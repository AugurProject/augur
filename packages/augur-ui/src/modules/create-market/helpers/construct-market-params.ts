import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';
import { NewMarket } from 'modules/types';
import {
  CreateYesNoMarketParams,
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  stringTo32ByteHex,
  tickSizeToNumTickWithDisplayPrices,
  convertDisplayValuetoAttoValue,
} from '@augurproject/sdk';
import { BigNumber } from 'bignumber.js';
import {
  SCALAR,
  CATEGORICAL,
  TEN_TO_THE_EIGHTEENTH_POWER,
} from 'modules/common/constants';
import { CreateNewMarketParams } from 'modules/contracts/actions/contractCalls';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';

export function constructMarketParams(
  newMarket: CreateNewMarketParams,
  isRetry: Boolean
):
  | CreateYesNoMarketParams
  | CreateScalarMarketParams
  | CreateCategoricalMarketParams {
  const fee = new BigNumber(newMarket.settlementFee || 0).div(
    new BigNumber(100)
  );
  const feePerCashInAttoCash = fee.multipliedBy(TEN_TO_THE_EIGHTEENTH_POWER);
  const affiliateFeeDivisor = new BigNumber(newMarket.affiliateFee || 0);
  const marketEndTime = new BigNumber(newMarket.endTime ? newMarket.endTime : newMarket.endTimeFormatted.timestamp);
  const extraInfo = JSON.stringify({
    categories: newMarket.categories,
    description: newMarket.description,
    longDescription: newMarket.detailsText,
    _scalarDenomination: newMarket.scalarDenomination,
    offsetName: newMarket.offsetName,
    template: newMarket.template,
  });

  const baseParams: CreateYesNoMarketParams = {
    endTime: marketEndTime,
    feePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter: newMarket.designatedReporterAddress,
    extraInfo,
  };

  switch (newMarket.marketType) {
    case SCALAR: {
      const prices = isRetry
        ? [new BigNumber(newMarket.minPrice), new BigNumber(newMarket.maxPrice)]
        : [
            convertDisplayValuetoAttoValue(new BigNumber(newMarket.minPrice)),
            convertDisplayValuetoAttoValue(new BigNumber(newMarket.maxPrice)),
          ];
      const numTicks = newMarket.numTicks
        ? new BigNumber(newMarket.numTicks)
        : tickSizeToNumTickWithDisplayPrices(
            new BigNumber(newMarket.tickSize),
            new BigNumber(newMarket.minPrice),
            new BigNumber(newMarket.maxPrice)
          );
      const params: CreateScalarMarketParams = Object.assign(baseParams, {
        prices,
        numTicks,
      });

      return params;
    }
    case CATEGORICAL: {
      const params: CreateCategoricalMarketParams = Object.assign(baseParams, {
        outcomes: newMarket.outcomes.map(o =>
          isRetry ? o : stringTo32ByteHex(o)
        ),
      });
      return params;
    }
    default: {
      return baseParams;
    }
  }
}

export function getConstructedMarketId(
  newMarket: NewMarket
): string {
  const params: TransactionMetadataParams = {
    description: newMarket.description,
  };
  return generateTxParameterId(params);
}

export function getDeconstructedMarketId(
  marketParameters
): string {
  const extraInfo = JSON.parse(marketParameters._extraInfo);

  const params: TransactionMetadataParams = {
    description: extraInfo.description,
  };

  return generateTxParameterId(params);
}

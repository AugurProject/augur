import { ZERO } from 'modules/common/constants';
import noop from 'utils/noop';
import { sortOrders } from 'modules/orders/helpers/liquidity';
import { NodeStyleCallback, NewMarket, CreateMarketData } from 'modules/types';
import {
  createMarket,
  approveToTrade,
} from 'modules/contracts/actions/contractCalls';
import {
  getConstructedMarketId,
  getDeconstructedMarketId,
} from 'modules/create-market/helpers/construct-market-params';
import { createMarketRetry } from 'modules/contracts/actions/contractCalls';
import { buildResolutionDetails } from 'modules/create-market/get-template';
import type {
  TemplateInput,
} from '@augurproject/templates';
import {
  TemplateInputType,
  UserInputDateTime,
} from '@augurproject/templates';
import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';

export const submitNewMarket = async (
  market: NewMarket,
  callback: NodeStyleCallback = noop
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  market.orderBook = sortOrders(market.orderBook);
  market.endTime = market.endTimeFormatted.timestamp;
  market.designatedReporterAddress =
    market.designatedReporterAddress === ''
      ? address
      : market.designatedReporterAddress;

  const hasOrders = market.orderBook && Object.keys(market.orderBook).length;
  const sortOrderBook = hasOrders && sortOrders(market.orderBook);
  const hashId = getConstructedMarketId(market);

  if (!!hasOrders) {
    PendingOrders.actions.addLiquidity({
      txParamHash: hashId,
      liquidityOrders: sortOrderBook,
    });
  }
  let extraInfoTemplate = null;
  if (market.template) {
    const { template } = market;

    const inputs = template.inputs.reduce(
      (p, i: TemplateInput) =>
        i.userInput
          ? [
              ...p,
              {
                id: i.id,
                value: i.userInput.trim(),
                type: i.type,
                timestamp:
                  (i.type === TemplateInputType.DATETIME &&
                    !!i.userInputObject) ||
                  (i.type === TemplateInputType.ESTDATETIME &&
                    !!i.userInputObject)
                    ? (i.userInputObject as UserInputDateTime).endTimeFormatted
                        .timestamp
                    : ((i.type === TemplateInputType.DATESTART ||
                        i.type === TemplateInputType.DATEYEAR) &&
                        i.setEndTime) ||
                      null,
              },
            ]
          : p,
      []
    );
    extraInfoTemplate = {
      hash: template.hash,
      question: market.template.question,
      inputs,
    };
  }

  let err = null;
  try {
    await createMarket(
      {
        outcomes: market.outcomes,
        scalarDenomination: market.scalarDenomination,
        description: market.description,
        designatedReporterAddress: market.designatedReporterAddress,
        minPrice: market.minPrice,
        maxPrice: market.maxPrice,
        endTime: market.endTime,
        tickSize: market.tickSize,
        marketType: market.marketType,
        detailsText: market.template
          ? buildResolutionDetails(
              market.detailsText,
              market.template.resolutionRules
            )
          : market.detailsText,
        categories: market.categories,
        settlementFee: market.settlementFee,
        affiliateFee: market.affiliateFee,
        offsetName: market.offsetName,
        template: extraInfoTemplate,
      },
      false
    );
  } catch (e) {
    err = e;
  }
  if (callback) callback(err);
};

export function retrySubmitMarket(
  market: CreateMarketData,
  callback: NodeStyleCallback = noop
) {
  return async () => {
    const hasOrders = market.orderBook && Object.keys(market.orderBook).length;
    const sortOrderBook = hasOrders && sortOrders(market.orderBook);
    const txParamHash = getDeconstructedMarketId(market.txParams);

    if (hasOrders) {
      PendingOrders.actions.addLiquidity({
        txParamHash,
        liquidityOrders: sortOrderBook,
      });
    }
    let err = null;
    try {
      createMarketRetry(market);
    } catch (e) {
      err = e;
    }

    if (callback) callback(err);
  };
}

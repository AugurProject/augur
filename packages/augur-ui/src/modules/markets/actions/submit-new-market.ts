import { ZERO } from 'modules/common/constants';
import noop from 'utils/noop';
import { sortOrders } from 'modules/orders/helpers/liquidity';
import { addMarketLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { AppState } from 'appStore';
import { NodeStyleCallback, NewMarket, CreateMarketData } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
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

export function submitNewMarket(
  market: NewMarket,
  callback: NodeStyleCallback = noop
) {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { loginAccount, appStatus } = getState();

    market.orderBook = sortOrders(market.orderBook);
    market.endTime = market.endTimeFormatted?.timestamp || market.endTime;
    market.designatedReporterAddress =
      market.designatedReporterAddress === ''
        ? loginAccount.address
        : market.designatedReporterAddress;

    const hasOrders = market.orderBook && Object.keys(market.orderBook).length;
    const sortOrderBook = hasOrders && sortOrders(market.orderBook);
    const hashId = getConstructedMarketId(market);


    // If GSN is enabled no need to call the below since this will be handled by the proxy contract during initalization
    if (!appStatus.gsnEnabled && loginAccount.allowance.lte(ZERO)) {
      await approveToTrade();
    }

    if (!!hasOrders) {
      dispatch(
        addMarketLiquidityOrders({
          txParamHash: hashId,
          liquidityOrders: sortOrderBook,
        })
      );
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
                      ? (i.userInputObject as UserInputDateTime)
                          .endTimeFormatted.timestamp
                      : ((i.type === TemplateInputType.DATEYEAR) &&
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
}

export function retrySubmitMarket(
  market: CreateMarketData,
  callback: NodeStyleCallback = noop
) {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    const hasOrders = market.orderBook && Object.keys(market.orderBook).length;
    const sortOrderBook = hasOrders && sortOrders(market.orderBook);
    const txParamHash = getDeconstructedMarketId(market.txParams);

    if (hasOrders) {
      dispatch(
        addMarketLiquidityOrders({
          txParamHash,
          liquidityOrders: sortOrderBook,
        })
      );
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

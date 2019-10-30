import { ZERO } from 'modules/common/constants';
import noop from 'utils/noop';
import { sortOrders } from 'modules/orders/helpers/liquidity';
import { addMarketLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { AppState } from 'store';
import {
  NodeStyleCallback,
  NewMarket,
  CreateMarketData,
  TemplateInput,
} from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  createMarket,
  approveToTrade,
} from 'modules/contracts/actions/contractCalls';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import { constructMarketParamsReturn } from 'modules/create-market/helpers/construct-market-params';
import { createMarketRetry } from 'modules/contracts/actions/contractCalls';
import { buildResolutionDetails } from 'modules/create-market/get-template';

export function submitNewMarket(
  market: NewMarket,
  callback: NodeStyleCallback = noop
) {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { loginAccount } = getState();

    market.orderBook = sortOrders(market.orderBook);
    market.endTime = market.endTimeFormatted.timestamp;
    market.designatedReporterAddress =
      market.designatedReporterAddress === ''
        ? loginAccount.address
        : market.designatedReporterAddress;

    const hasOrders = market.orderBook && Object.keys(market.orderBook).length;
    const sortOrderBook = hasOrders && sortOrders(market.orderBook);
    const parameters = constructMarketParamsReturn(market);
    const txParamHash = generateTxParameterId(parameters);

    if (loginAccount.allowance.lte(ZERO)) {
      await approveToTrade();
    }

    if (hasOrders) {
      dispatch(
        addMarketLiquidityOrders({
          txParamHash,
          liquidityOrders: sortOrderBook,
        })
      );
    }
    let extraInfoTemplate = null;
    if (market.template) {
      const { template } = market;
      const inputs = template.inputs.reduce(
        (p, i: TemplateInput) =>
          i.userInput ? [...p, { id: i.id, value: i.userInput }] : p,
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
      createMarket(
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
    const txParamHash = generateTxParameterId(market.txParams);

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

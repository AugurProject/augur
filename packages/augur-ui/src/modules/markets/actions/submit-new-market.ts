import { MODAL_ACCOUNT_APPROVAL, ZERO } from 'modules/common/constants';
import noop from 'utils/noop';
import { createBigNumber } from 'utils/create-big-number';
import { updateModal } from 'modules/modal/actions/update-modal';
import { sortOrders } from 'modules/orders/helpers/liquidity';
import { addMarketLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { AppState } from 'store';
import { NodeStyleCallback, NewMarket, CreateMarketData } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { createMarket } from 'modules/contracts/actions/contractCalls';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import { constructMarketParamsReturn } from 'modules/create-market/helpers/construct-market-params';
import { createMarketRetry } from 'modules/contracts/actions/contractCalls';

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
    console.log('create market txParamHash', txParamHash);
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
      createMarket(
        {
          outcomes: market.outcomes,
          scalarDenomination: market.scalarDenomination,
          description: market.description,
          expirySource: market.expirySource,
          designatedReporterAddress: market.designatedReporterAddress,
          minPrice: market.minPrice,
          maxPrice: market.maxPrice,
          backupSource: market.backupSource,
          endTime: market.endTime,
          tickSize: market.tickSize,
          marketType: market.marketType,
          detailsText: market.detailsText,
          categories: market.categories,
          settlementFee: market.settlementFee,
          affiliateFee: market.affiliateFee,
          offsetName: market.offsetName,
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
    console.log('create market txParamHash', txParamHash);
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

function getHasApproval(hasOrders: Boolean, callback: NodeStyleCallback) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { loginAccount } = getState();
    if (hasOrders && createBigNumber(loginAccount.allowance).lte(ZERO)) {
      dispatch(checkAccountAllowance());
      dispatch(
        updateModal({
          type: MODAL_ACCOUNT_APPROVAL,
          continueDefault: true,
          approveOnSent: noop,
          approveCallback: (err: any, res: any) => {
            if (err) return callback(err);
            callback(null);
          },
        })
      );
    } else {
      callback(null);
    }
  };
}

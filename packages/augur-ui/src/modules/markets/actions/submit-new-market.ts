import {
  invalidateMarketCreation,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import {
  MODAL_ACCOUNT_APPROVAL,
  ZERO
} from "modules/common/constants";
import makePath from "modules/routes/helpers/make-path";
import noop from "utils/noop";
import { createBigNumber } from "utils/create-big-number";
import { updateModal } from "modules/modal/actions/update-modal";
import { MY_POSITIONS } from "modules/routes/constants/views";
import { sortOrders } from "modules/orders/helpers/liquidity";
import { addMarketLiquidityOrders, clearMarketLiquidityOrders } from "modules/orders/actions/liquidity-management";
import { AppState } from "store";
import { NodeStyleCallback, NewMarket, CreateMarketData } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { createMarket } from "modules/contracts/actions/contractCalls";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import { constructMarketParamsReturn } from 'modules/create-market/helpers/construct-market-params';
import { createMarketRetry } from "modules/contracts/actions/contractCalls";

export function submitNewMarket(
  market: NewMarket,
  callback: NodeStyleCallback = noop
) {
  return async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const { loginAccount } = getState();

    market.orderBook = sortOrders(market.orderBook);
    market.endTime = market.endTimeFormatted.timestamp;
    market.designatedReporterAddress = market.designatedReporterAddress === '' ? loginAccount.address : market.designatedReporterAddress;

    const hasOrders = market.orderBook && Object.keys(market.orderBook).length
    const sortOrderBook = hasOrders && sortOrders(market.orderBook);
    const pendingId = generateTxParameterId(constructMarketParamsReturn(market))

    if (hasOrders) {
      dispatch(
        addMarketLiquidityOrders({
          marketId: pendingId,
          liquidityOrders: sortOrderBook
        })
      );
    }

    const marketResult = await createMarket({
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
    }, false);

    if (hasOrders) {
      dispatch(clearMarketLiquidityOrders(pendingId));
      dispatch(
        addMarketLiquidityOrders({
          marketId: marketResult.address,
          liquidityOrders: sortOrderBook
        })
      );
    }
  };
}

export function retrySubmitMarket(
  market: CreateMarketData,
  callback: NodeStyleCallback = noop
) {
  return async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const { loginAccount } = getState();

    const hasOrders = market.orderBook && Object.keys(market.orderBook).length
    const sortOrderBook = hasOrders && sortOrders(market.orderBook);
    const pendingId = generateTxParameterId(market.txParams);

    if (hasOrders) {
      dispatch(
        addMarketLiquidityOrders({
          marketId: pendingId,
          liquidityOrders: sortOrderBook
        })
      );
    }

    const marketResult = await createMarketRetry(market);
    if (hasOrders) {
      dispatch(clearMarketLiquidityOrders(pendingId));
      dispatch(
        addMarketLiquidityOrders({
          marketId: marketResult.address,
          liquidityOrders: sortOrderBook
        })
      );
    }
  };
}


function getHasApproval(hasOrders: Boolean, callback: NodeStyleCallback) {
  return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
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
          }
        })
      );
    } else {
      callback(null);
    }
  };
}

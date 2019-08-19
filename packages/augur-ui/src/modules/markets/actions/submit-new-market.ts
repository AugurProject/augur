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
import { addMarketLiquidityOrders } from "modules/orders/actions/liquidity-management";
import { AppState } from "store";
import { NodeStyleCallback, NewMarket } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { createMarket } from "modules/contracts/actions/contractCalls";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";

export function submitNewMarket(
  newMarket: NewMarket,
  callback: NodeStyleCallback = noop
) {
  return async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const { loginAccount } = getState();
    const hasOrders = Object.keys(newMarket.orderBook).length;
    newMarket.orderBook = sortOrders(newMarket.orderBook);

    const market = await createMarket({
      outcomes: newMarket.outcomes,
      scalarSmallNum: newMarket.minPrice,
      scalarBigNum: newMarket.maxPrice,
      scalarDenomination: newMarket.scalarDenomination,
      description: newMarket.description,
      expirySource: newMarket.expirySource,
      designatedReporterAddress:
        newMarket.designatedReporterAddress === ''
          ? loginAccount.address
          : newMarket.designatedReporterAddress,
      minPrice: newMarket.minPrice,
      maxPrice: newMarket.maxPrice,
      backupSource: newMarket.backupSource,
      endTime: newMarket.endTimeFormatted.timestamp,
      tickSize: newMarket.tickSize,
      marketType: newMarket.marketType,
      detailsText: newMarket.detailsText,
      categories: newMarket.categories,
      settlementFee: newMarket.settlementFee,
      affiliateFee: newMarket.affiliateFee,
      offsetName: newMarket.offsetName,
    });
    if (hasOrders) {
      dispatch(
        addMarketLiquidityOrders({
          marketId: market.address,
          liquidityOrders: newMarket.orderBook
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

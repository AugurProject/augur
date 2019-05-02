import {
  invalidateMarketCreation,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import {
  MODAL_ACCOUNT_APPROVAL,
  ZERO
} from "modules/common-elements/constants";
import makePath from "modules/routes/helpers/make-path";
import noop from "utils/noop";
import { createBigNumber } from "utils/create-big-number";
import { updateModal } from "modules/modal/actions/update-modal";
import { MY_POSITIONS } from "modules/routes/constants/views";
import { buildCreateMarket } from "modules/markets/helpers/build-create-market";
import { sortOrders } from "modules/orders/helpers/liquidity";
import { addMarketLiquidityOrders } from "modules/orders/actions/liquidity-management";

export function submitNewMarket(newMarket, history, callback = noop) {
  return (dispatch, getState) => {
    const { universe, loginAccount, contractAddresses } = getState();
    const { createMarket, formattedNewMarket } = buildCreateMarket(
      newMarket,
      false,
      universe,
      loginAccount,
      contractAddresses
    );
    const hasOrders = Object.keys(newMarket.orderBook).length;
    newMarket.orderBook = sortOrders(newMarket.orderBook);

    dispatch(
      getHasApproval(hasOrders, err => {
        if (err) return callback(err);
        createMarket({
          ...formattedNewMarket,
          meta: loginAccount.meta,
          onSent: res => {
            history.push(makePath(MY_POSITIONS));
            dispatch(clearNewMarket());
            if (hasOrders) {
              dispatch(
                addMarketLiquidityOrders({
                  marketId: res.callReturn,
                  liquidityOrders: newMarket.orderBook
                })
              );
              // orders submission will be kicked off from handleMarketCreatedLog event
            }
          },
          onSuccess: res => {
            const marketId = res.callReturn;
            if (callback) callback(null, marketId);
          },
          onFailed: err => {
            console.error("ERROR create market failed:", err);
            callback(err);
            dispatch(invalidateMarketCreation(err.message));
          }
        });
      })
    );
  };
}

function getHasApproval(hasOrders, callback) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    if (hasOrders && createBigNumber(loginAccount.allowance).lte(ZERO)) {
      dispatch(
        updateModal({
          type: MODAL_ACCOUNT_APPROVAL,
          continueDefault: true,
          approveOnSent: noop,
          approveCallback: (err, res) => {
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

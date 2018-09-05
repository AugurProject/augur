import {
  invalidateMarketCreation,
  clearNewMarket
} from "modules/create-market/actions/update-new-market";
import { addNewMarketCreationTransactions } from "modules/transactions/actions/add-transactions";
import { ZERO } from "modules/trade/constants/numbers";
import { MODAL_ACCOUNT_APPROVAL } from "modules/modal/constants/modal-types";
import makePath from "modules/routes/helpers/make-path";
import noop from "utils/noop";
import { createBigNumber } from "utils/create-big-number";
import { updateModal } from "modules/modal/actions/update-modal";
import { TRANSACTIONS } from "modules/routes/constants/views";
import { buildCreateMarket } from "modules/create-market/helpers/build-create-market";
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
        if (err) return console.error("ERROR: ", err);
        createMarket({
          ...formattedNewMarket,
          meta: loginAccount.meta,
          onSent: res => {
            dispatch(
              addNewMarketCreationTransactions({
                ...formattedNewMarket,
                ...res
              })
            );
            history.push(makePath(TRANSACTIONS));
            dispatch(clearNewMarket());
          },
          onSuccess: res => {
            const marketId = res.callReturn;
            if (hasOrders) {
              dispatch(
                addMarketLiquidityOrders({
                  marketId,
                  liquidityOrders: newMarket.orderBook
                })
              );
              // orders submission will be kicked off from handleMarketCreatedLog event
            }
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

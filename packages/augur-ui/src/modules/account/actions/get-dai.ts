import { augur } from "services/augurjs";
import { updateAlert } from "modules/alerts/actions/alerts";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds as getTime } from "src/select-state";
import { CONFIRMED, FAILED } from "modules/common-elements/constants";
import logError from "utils/log-error";
import noop from "utils/noop";

export default function(callback = logError) {
  return (dispatch: Function, getState: Function) => {
    const { loginAccount } = getState();
    const update = (id: String, status: String) =>
      dispatch(
        updateAlert(id, {
          id,
          status,
          timestamp: getTime(getState())
        })
      );
    augur.api.Cash.faucet({
      tx: { to: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash },
      _amount: 1000000000000000000000,
      meta: loginAccount.meta,
      onSent: noop,
      onSuccess: (res: any) => {
        update(res.hash, CONFIRMED);
        dispatch(updateAssets());
        callback(null);
      },
      onFailed: (res: any) => {
        update(res.hash, FAILED);
        logError(res);
      }
    });
  };
}

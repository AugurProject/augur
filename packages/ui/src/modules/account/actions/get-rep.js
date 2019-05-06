import { augur } from "services/augurjs";
import { updateAlert } from "modules/alerts/actions/alerts";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { UNIVERSE_ID } from "modules/common-elements/constants";
import logError from "utils/log-error";
import noop from "utils/noop";

export default function(callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState();
    const universeID = universe.id || UNIVERSE_ID;

    augur.api.Universe.getReputationToken(
      { tx: { to: universeID } },
      (err, reputationTokenAddress) => {
        if (err) return callback(err);
        augur.api.TestNetReputationToken.faucet({
          tx: { to: reputationTokenAddress },
          _amount: 0,
          meta: loginAccount.meta,
          onSent: noop,
          onSuccess: res => {
            // Trigger the alert updates in the callback functions
            // because Augur Node does not emit an event for TokensMinted.
            dispatch(
              updateAlert(res.hash, {
                id: res.hash,
                status: "Confirmed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
            dispatch(updateAssets());
            callback(null);
          },
          onFailed: res => {
            dispatch(
              updateAlert(res.hash, {
                id: res.hash,
                status: "Failed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
            logError(res);
          }
        });
      }
    );
  };
}

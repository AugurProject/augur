import { augur } from "services/augurjs";
import {
  updateNotification,
  addNotification
} from "modules/notifications/actions";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { UNIVERSE_ID } from "modules/app/constants/network";
import logError from "utils/log-error";

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
          onSent: res => {
            dispatch(
              addNotification({
                id: res.hash,
                status: "Pending",
                params: {
                  type: "faucet"
                },
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          },
          onSuccess: res => {
            dispatch(
              updateNotification(res.hash, {
                id: res.hash,
                status: "Confirmed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
            dispatch(updateAssets());
            callback(null);
          },
          onFailed: callback
        });
      }
    );
  };
}

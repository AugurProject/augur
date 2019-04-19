import speedomatic from "speedomatic";
import { augur } from "services/augurjs";
import { UNIVERSE_ID } from "modules/common-elements/constants";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { updateEtherBalance } from "modules/auth/actions/update-ether-balance";
import logError from "utils/log-error";

export function updateAssets(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount, universe } = getState();
    const universeID = universe.id || UNIVERSE_ID;
    const balances = { eth: undefined, rep: undefined };

    if (!loginAccount.address) return dispatch(updateLoginAccount(balances));
    augur.api.Universe.getReputationToken(
      { tx: { to: universeID } },
      (err, reputationTokenAddress) => {
        if (err) return callback(err);
        augur.api.ReputationToken.balanceOf(
          {
            tx: { to: reputationTokenAddress },
            _owner: loginAccount.address
          },
          (err, attoRepBalance) => {
            if (err) return callback(err);
            const repBalance = speedomatic.unfix(attoRepBalance, "string");
            balances.rep = repBalance;
            if (!loginAccount.rep || loginAccount.rep !== repBalance) {
              dispatch(updateLoginAccount({ rep: repBalance }));
            }
          }
        );
        dispatch(
          updateEtherBalance((err, etherBalance) => {
            if (err) return callback(err);
            balances.eth = etherBalance;
            callback(null, balances);
          })
        );
      }
    );
  };
}

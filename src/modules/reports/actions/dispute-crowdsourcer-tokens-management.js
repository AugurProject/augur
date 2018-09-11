import noop from "utils/noop";
import logError from "utils/log-error";
import { augur } from "services/augurjs";
import { UNIVERSE_ID } from "modules/app/constants/network";

export const UPDATE_DISPUTE_CROWDSOURCERS_DATA =
  "UPDATE_DISPUTE_CROWDSOURCERS_DATA";
export const UPDATE_DISPUTE_CROWDSOURCERS_BALANCE =
  "UPDATE_DISPUTE_CROWDSOURCERS_BALANCE";

export const updateDisputeCrowdsourcersData = disputeCrowdsourcersData => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_DATA,
  disputeCrowdsourcersData
});

export const updateDisputeCrowdsourcersBalance = (
  disputeCrowdsourcerID,
  balance
) => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_BALANCE,
  disputeCrowdsourcerID,
  balance
});
// TODO: Do we even reference this? Don't see a reference...
export const loadDisputeCrowdsourcerTokens = (callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount, universe } = getState();
  const universeID = universe.id || UNIVERSE_ID;

  augur.augurNode.submitRequest(
    "getDisputeTokens",
    { universe: universeID, account: loginAccount.address },
    (err, disputeCrowdsourcerTokens) => {
      if (err) return callback(err);
      dispatch(updateDisputeCrowdsourcersData(disputeCrowdsourcerTokens));
      Object.keys(disputeCrowdsourcerTokens).forEach(disputeCrowdsourcerID => {
        augur.api.DisputeCrowdsourcer.withdrawInEmergency({
          tx: { estimateGas: true, to: disputeCrowdsourcerID },
          meta: loginAccount.meta,
          onSent: noop,
          onFailed: callback
        });
      });
      callback(null, disputeCrowdsourcerTokens);
    }
  );
};

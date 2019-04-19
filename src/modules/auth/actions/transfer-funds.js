import speedomatic from "speedomatic";
import { augur } from "services/augurjs";
import { updateAlert, addAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { ETH, REP } from "modules/common-elements/constants";

export function transferFunds(amount, currency, toAddress) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState();
    const fromAddress = loginAccount.address;
    const to = speedomatic.formatEthereumAddress(toAddress);
    switch (currency) {
      case ETH:
        return augur.assets.sendEther({
          meta: loginAccount.meta,
          to,
          etherToSend: amount,
          from: fromAddress,
          onSent: tx => {
            // Trigger the alert addition/updates in the callback functions
            // because Augur Node does not emit an event for transferrring ETH.
            dispatch(
              addAlert({
                id: tx.hash,
                status: "Pending",
                params: {
                  etherToSend: amount,
                  to,
                  type: "sendEther"
                },
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          },
          onSuccess: tx => {
            dispatch(
              updateAlert(tx.hash, {
                id: tx.hash,
                status: "Confirmed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          },
          onFailed: tx => {
            dispatch(
              updateAlert(tx.hash, {
                status: "Failed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          }
        });
      case REP:
        return augur.assets.sendReputation({
          meta: loginAccount.meta,
          universe: universe.id,
          reputationToSend: amount,
          _to: to,
          onSent: tx => {
            // Trigger the alert addition/updates in the callback functions
            // because we only want to display this TokensTransferred event,
            // and not ones from other contracts.
            dispatch(
              addAlert({
                id: tx.hash,
                status: "Pending",
                params: {
                  universe: universe.id,
                  reputationToSend: amount,
                  _to: to,
                  type: "sendReputation"
                },
                timestamp: selectCurrentTimestampInSeconds(getState()),
                reputationToSend: amount,
                _to: to
              })
            );
          },
          onSuccess: tx => {
            dispatch(
              updateAlert(tx.hash, {
                id: tx.hash,
                status: "Confirmed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          },
          onFailed: tx => {
            dispatch(
              updateAlert(tx.hash, {
                id: tx.hash,
                status: "Failed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          }
        });
      default:
        console.error("transferFunds: unknown currency", currency);
    }
  };
}

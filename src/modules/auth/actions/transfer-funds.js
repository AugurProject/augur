import speedomatic from "speedomatic";
import { augur } from "services/augurjs";
import {
  updateNotification,
  addNotification
} from "modules/notifications/actions";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { ETH, REP } from "modules/account/constants/asset-types";

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
            dispatch(
              addNotification({
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
              updateNotification(tx.hash, {
                id: tx.hash,
                status: "Confirmed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          },
          onFailed: tx => {
            dispatch(
              updateNotification(tx.hash, {
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
            // Trigger the notification addition/updates in the callback functions
            // because we only want to display this TokensTransferred event,
            // and not ones from other contracts.
            dispatch(
              addNotification({
                id: tx.hash,
                status: "Pending",
                params: {
                  universe: universe.id,
                  reputationToSend: amount,
                  _to: to,
                  type: "sendReputation"
                },
                timestamp: selectCurrentTimestampInSeconds(getState()),
                universe: universe.id,
                reputationToSend: amount,
                _to: to
              })
            );
          },
          onSuccess: tx => {
            dispatch(
              updateNotification(tx.hash, {
                id: tx.hash,
                status: "Confirmed",
                timestamp: selectCurrentTimestampInSeconds(getState())
              })
            );
          },
          onFailed: tx => {
            dispatch(
              updateNotification(tx.hash, {
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

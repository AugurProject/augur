import * as speedomatic from "speedomatic";
import { augur } from "services/augurjs";
import { updateAlert, addAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds as getTime } from "store/select-state";
import { ETH, REP, CONFIRMED, FAILED } from "modules/common-elements/constants";

export function transferFunds(
  amount: string,
  currency: string,
  toAddress: string
) {
  return (dispatch: Function, getState: Function) => {
    const { universe, loginAccount } = getState();
    const fromAddress = loginAccount.address;
    const to = speedomatic.formatEthereumAddress(toAddress);
    const update = (id: string, status: string) => {
      dispatch(
        updateAlert(id, {
          id,
          status,
          timestamp: getTime(getState())
        })
      );
    };
    switch (currency) {
      case ETH:
        return augur.assets.sendEther({
          meta: loginAccount.meta,
          to,
          etherToSend: amount,
          from: fromAddress,
          onSent: (tx: any) => {
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
                timestamp: getTime(getState())
              })
            );
          },
          onSuccess: (tx: any) => update(tx.hash, CONFIRMED),
          onFailed: (tx: any) => update(tx.hash, FAILED)
        });
      case REP:
        return augur.assets.sendReputation({
          meta: loginAccount.meta,
          universe: universe.id,
          reputationToSend: amount,
          _to: to,
          onSent: (tx: any) => {
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
                timestamp: getTime(getState()),
                reputationToSend: amount,
                _to: to
              })
            );
          },
          onSuccess: (tx: any) => update(tx.hash, CONFIRMED),
          onFailed: (tx: any) => update(tx.hash, FAILED)
        });
      default:
        console.error("transferFunds: unknown currency", currency);
    }
  };
}

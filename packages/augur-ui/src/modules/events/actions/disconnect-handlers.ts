import { updateModal } from "modules/modal/actions/update-modal";
import {
  updateAugurNodeConnectionStatus,
  updateConnectionStatus
} from "modules/app/actions/update-connection";
import { reInitAugur } from "modules/app/actions/re-init-augur";
import { MODAL_NETWORK_DISCONNECTED } from "modules/common-elements/constants";

export const handleAugurNodeDisconnect = (history: any, event: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: Function
) => {
  console.warn("Disconnected from augur-node", event);
  const { connection, env } = getState();
  if (connection.isConnectedToAugurNode) {
    dispatch(
      updateModal({ type: MODAL_NETWORK_DISCONNECTED, connection, env })
    );
    dispatch(updateAugurNodeConnectionStatus(false));
  }
  dispatch(reInitAugur(history));
};

export const handleEthereumDisconnect = (history: any, event: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: Function
) => {
  console.warn("Disconnected from Ethereum", event);
  const { connection, env } = getState();
  if (connection.isConnected) {
    dispatch(
      updateModal({ type: MODAL_NETWORK_DISCONNECTED, connection, env })
    );
    dispatch(updateConnectionStatus(false));
  }
  dispatch(reInitAugur(history));
};

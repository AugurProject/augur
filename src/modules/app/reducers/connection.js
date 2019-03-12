import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_AUGUR_NODE_CONNECTION_STATUS,
  UPDATE_IS_RECONNECTION_PAUSED,
  UPDATE_AUGUR_NODE_NETWORK_ID,
  UPDATE_USE_WEBSOCKET_TO_CONNECT_AUGUR_NODE
} from "modules/app/actions/update-connection";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {
  isConnected: false,
  isConnectedToAugurNode: false,
  augurNodeNetworkId: null,
  useWebsocketToConnectAugurNode: true,
  isReconnectionPaused: false
};

export default function(connection = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_CONNECTION_STATUS: {
      const { isConnected } = data;
      return {
        ...connection,
        isConnected
      };
    }
    case UPDATE_AUGUR_NODE_CONNECTION_STATUS: {
      const { isConnectedToAugurNode } = data;
      return {
        ...connection,
        isConnectedToAugurNode
      };
    }
    case UPDATE_AUGUR_NODE_NETWORK_ID: {
      const { augurNodeNetworkId } = data;
      return {
        ...connection,
        augurNodeNetworkId
      };
    }
    case UPDATE_IS_RECONNECTION_PAUSED: {
      const { isReconnectionPaused } = data;
      return {
        ...connection,
        isReconnectionPaused
      };
    }
    case UPDATE_USE_WEBSOCKET_TO_CONNECT_AUGUR_NODE: {
      const { useWebsocketToConnectAugurNode } = data;
      return {
        ...connection,
        useWebsocketToConnectAugurNode
      };
    }

    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return connection;
  }
}

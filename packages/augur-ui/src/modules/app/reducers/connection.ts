import { Connection, BaseAction } from "modules/types";
import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_IS_RECONNECTION_PAUSED,
} from "modules/app/actions/update-connection";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE: Connection = {
  isConnected: false,
  isReconnectionPaused: false
};

export default function(
  connection: Connection = DEFAULT_STATE,
  { type, data }: BaseAction,
): Connection {
  switch (type) {
    case UPDATE_CONNECTION_STATUS: {
      const { isConnected } = data;
      return {
        ...connection,
        isConnected
      };
    }
    case UPDATE_IS_RECONNECTION_PAUSED: {
      const { isReconnectionPaused } = data;
      return {
        ...connection,
        isReconnectionPaused
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return connection;
  }
}

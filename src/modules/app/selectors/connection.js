import { createSelector } from "reselect";

export const selectConnection = ({ connection = {} }) => ({ ...connection });
export const selectUseWebsocketToConnectAugurNode = createSelector(
  selectConnection,
  connection => connection.useWebsocketToConnectAugurNode
);

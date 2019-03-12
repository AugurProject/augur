// TODO: Need to establish the criteria for identifying google bot crawler here.
export const isGoogleBot = () =>
  typeof window !== "undefined" &&
  !("WebSocket" in window || "MozWebSocket" in window);

export const UPDATE_ENV = "UPDATE_ENV";

interface DebugOptions {
  connect: Boolean;
  broadcast: Boolean;
}

interface EthereumNodeOptions {
  blockRetention: Number;
  connectionTimeout: Number;
  http: String | null;
  pollingIntervalMilliseconds: Number;
  ws: String | null;
}

interface EnvObject {
  "augur-node": String;
  "bug-bounty": Boolean;
  "bug-bounty-address": String | null;
  debug: DebugOptions;
  "ethereum-node": EthereumNodeOptions;
  universe: String | null;
  useWeb3Transport: Boolean;
}

export function updateEnv(env: EnvObject) {
  return {
    type: UPDATE_ENV,
    data: { env }
  };
}

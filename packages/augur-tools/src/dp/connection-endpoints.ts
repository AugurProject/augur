interface EthereumNode {
  http: string;
  pollingIntervalMilliseconds: number;
  blockRetention: number;
  connectionTimeout: number;
  ipc?: string;
  ws?: string;
};

export const ethereumNode: EthereumNode = {
  http: process.env.ETHEREUM_HTTP || "http://127.0.0.1:8545",
  pollingIntervalMilliseconds: 500,
  blockRetention: 100,
  connectionTimeout: 60000,
};

if (process.env.ETHEREUM_WS != null) ethereumNode.ws = process.env.ETHEREUM_WS;
if (process.env.ETHEREUM_IPC != null) ethereumNode.ipc = process.env.ETHEREUM_IPC;

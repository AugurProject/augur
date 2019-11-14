let ipfsWorker: Worker = null;
let startedNode = false;

const start = (config: { ethereumNetwork: string; senderAccount: string }) => {
  const { ethereumNetwork, senderAccount } = config;

  return new Promise(resolve => {
    if (ipfsWorker) return;

    ipfsWorker = new Worker('./IPFS.worker.ts', { type: 'module' });

    ipfsWorker.onmessage = (message: {
      data: { method: string; params: any[] };
    }) => {
      const { method } = message.data;

      if (method === 'IPFS:started') {
        startedNode = true;

        resolve();

        return;
      }
    };

    ipfsWorker.postMessage({
      method: 'IPFS:start',
      params: [ethereumNetwork, senderAccount],
    });
  });
};

const sendMessage = (data: object, channel: string) => {
  if (!startedNode) return;

  ipfsWorker.postMessage({
    method: 'IPFS:sendMessage',
    params: [data, channel],
  });
};

export default { start, sendMessage };

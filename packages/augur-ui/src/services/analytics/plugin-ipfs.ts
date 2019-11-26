import { IPFSWorkerProxy } from 'services/ipfs';

declare global {
  interface Window {
    ipfsIsLoaded?: boolean;
  }
}

const removeMetaCallbackOnPayload = payload => {
  if (payload.meta && payload.meta.callback) {
    delete payload.meta.callback;
  }
};

const ipfsPlugin = (userConfig: {
  ethereumNetwork: string;
  senderAccount: string;
}) => {
  return {
    name: 'ipfs-plugin',
    config: {},
    initialize: ({ config }) => {
      IPFSWorkerProxy.start(userConfig).then(() => {
        window.ipfsIsLoaded = true;
      });
    },
    page: ({ payload }) => {
      console.log('ipfsPlugin - page', payload);

      removeMetaCallbackOnPayload(payload);

      IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
    },
    track: ({ payload }) => {
      removeMetaCallbackOnPayload(payload);

      IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
    },
    identify: ({ payload }) => {
      removeMetaCallbackOnPayload(payload);

      IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
    },
    loaded: () => !!window.ipfsIsLoaded,
  };
};

export default ipfsPlugin;

import { IPFSWorkerProxy } from 'services/ipfs';
import store from 'store';
import {
  addAnalytic,
  removeAnalytic,
  SEND_DELAY_SECONDS,
} from 'modules/app/actions/analytics-management';

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
    page: ({payload}) => {
      removeMetaCallbackOnPayload(payload);
      const analyticId = `${payload.properties.hash}-${payload.meta.timestamp}`;
      store.dispatch(addAnalytic(payload, analyticId));

      setTimeout(() => {
        IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
        store.dispatch(removeAnalytic(analyticId));
      }, SEND_DELAY_SECONDS * 1000);
    },
    track: ({ payload }) => {
      removeMetaCallbackOnPayload(payload);
      const analyticId = `${payload.event}-${payload.meta.timestamp}`;
      store.dispatch(addAnalytic(payload, analyticId));

      setTimeout(() => {
        IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
        store.dispatch(removeAnalytic(analyticId));
      }, SEND_DELAY_SECONDS * 1000);
    },
    identify: ({ payload }) => {
      removeMetaCallbackOnPayload(payload);

      IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
    },
    loaded: () => !!window.ipfsIsLoaded,
  };
};

export default ipfsPlugin;

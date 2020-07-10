import { IPFSWorkerProxy } from 'services/ipfs';
import {
  SEND_DELAY_SECONDS,
} from 'modules/app/actions/analytics-management';
import { AppStatus } from 'modules/app/store/app-status';

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
  const { addAnalytic, removeAnalytic } = AppStatus.actions;
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
      
      addAnalytic(analyticId, payload);

      setTimeout(() => {
        IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
        removeAnalytic(analyticId);
      }, SEND_DELAY_SECONDS * 1000);
    },
    track: ({ payload }) => {
      removeMetaCallbackOnPayload(payload);
      const analyticId = `${payload.event}-${payload.meta.timestamp}`;
      addAnalytic(analyticId, payload);

      setTimeout(() => {
        IPFSWorkerProxy.sendMessage(payload, 'augur-analytics');
        removeAnalytic(analyticId);
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

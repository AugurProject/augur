import Analytics from 'analytics';
import ipfsPlugin from './plugin-ipfs';
import { isLocalHost } from 'utils/is-localhost';

const analytics = isLocalHost() ? {} : Analytics({
  app: 'augur-ui',
  version: 2,
  plugins: [
    ipfsPlugin({
      ethereumNetwork: process.env.ETHEREUM_NETWORK,
      senderAccount: 'augur-ui-tracker',
    }),
  ],
});

export { analytics };

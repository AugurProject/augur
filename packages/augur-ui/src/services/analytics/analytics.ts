import Analytics from 'analytics';
import ipfsPlugin from './plugin-ipfs';

const analytics = Analytics({
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

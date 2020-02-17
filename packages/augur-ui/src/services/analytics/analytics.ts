import Analytics from 'analytics';
import ipfsPlugin from './plugin-ipfs';
import { isLocalHost } from 'utils/is-localhost';
import segmentPlugin from '@analytics/segment';

/*
const analytics = isLocalHost() ? {} : Analytics({
  app: 'augur-ui',
  version: 3,
  plugins: [
    ipfsPlugin({
      ethereumNetwork: process.env.ETHEREUM_NETWORK,
      senderAccount: 'augur-ui-tracker',
    }),
    segmentPlugin({
      writeKey: "mTjvLsOUUyWObl8zkKUMAXc7TEAWqhPV"
    }),
  ],
});
*/

const analytics = {
  track: (name, data) => {},
  page: (data) => {},
  reset: () => {},
  identify: (name, data) => {}
};

export { analytics };

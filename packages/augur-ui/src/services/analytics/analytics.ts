import Analytics from 'analytics';
import ipfsPlugin from './plugin-ipfs';
import { isLocalHost } from 'utils/is-localhost';
import segmentPlugin from '@analytics/segment';

const analytics = isLocalHost() ? {} : Analytics({
  app: 'augur-ui',
  version: 3,
  plugins: [
    segmentPlugin({
      writeKey: "mTjvLsOUUyWObl8zkKUMAXc7TEAWqhPV"
    }),
  ],
});

export { analytics };

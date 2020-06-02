// These are helper methods to make adjustments to the config.
import {
  mergeConfig,
  SDKConfiguration,
  validConfigOrDie,
} from './configuration';

export function disableWarpSync(config: SDKConfiguration) {
  return validConfigOrDie(
    mergeConfig(config, {
      warpSync: {
        autoReport: false,
        enabled: false,
      },
    })
  );
}

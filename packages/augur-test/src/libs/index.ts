import { SDKConfiguration } from '@augurproject/utils';
import { mergeConfig, validConfigOrDie } from '@augurproject/utils';

export * from '@augurproject/tools/build/libs/LocalAugur';
export * from '@augurproject/tools/build/libs/MakeDbMock';
export * from './make-connector-mock';

export function enableZeroX(config: SDKConfiguration) {
  return validConfigOrDie(
    mergeConfig(config, {
      zeroX: { rpc: { enabled: false }, mesh: { enabled: true } },
    })
  );
}

export function disableZeroX({ zeroX, ...rest }: SDKConfiguration) {
  return validConfigOrDie(rest);
}

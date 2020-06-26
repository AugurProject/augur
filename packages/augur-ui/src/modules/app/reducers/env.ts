import type { SDKConfiguration } from '@augurproject/artifacts';
import { BaseAction } from 'modules/types';
import { UPDATE_ENV } from 'modules/app/actions/update-env';

export default function(env = process.env.CONFIGURATION, { type, data }: BaseAction): SDKConfiguration {
  switch (type) {
    case UPDATE_ENV:
      return data.env;
    default:
      return env;
  }
}

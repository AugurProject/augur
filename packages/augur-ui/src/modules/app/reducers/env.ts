import { BaseAction } from 'modules/types';
import { UPDATE_ENV } from 'modules/app/actions/update-env';
import { DEFAULT_SDK_CONFIGURATION, SDKConfiguration } from '@augurproject/artifacts';

const DEFAULT_STATE: SDKConfiguration = JSON.parse(JSON.stringify(DEFAULT_SDK_CONFIGURATION));

export default function(env = DEFAULT_STATE, { type, data }: BaseAction): SDKConfiguration {
  switch (type) {
    case UPDATE_ENV:
      return data.env;
    default:
      return env;
  }
}

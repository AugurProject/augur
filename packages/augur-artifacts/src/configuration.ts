import path from 'path';
import requireAll from 'require-all';
import { writeFile } from 'async-file';
import { ContractAddresses, DEFAULT_SDK_CONFIGURATION, RecursivePartial, NetworkId, SDKConfiguration, configFromEnvvars, serializeConfig, mergeConfig, validConfigOrDie } from '@augurproject/utils';

// Returns config for the provided network id. There can be multiple configuration "environments" per network id.
export function getConfigForNetwork(networkId: NetworkId, breakOnMulti=true, validate=true): SDKConfiguration {
  let targetConfig: SDKConfiguration = null;
  Object.values(environments).forEach((config) => {
    if (config.networkId === networkId) {
      if (breakOnMulti && targetConfig) throw Error(`Multiple environment configs for network "${networkId}"`);
      targetConfig = config;
    }
  });

  if (validate) {
    if (!targetConfig) {
      throw new Error(`No config for network "${networkId}". Existing configs: ${JSON.stringify(environments)}`);
    }
    if (!targetConfig.addresses) {
      throw new Error(`Config for network is missing addresses. Config: ${JSON.stringify(targetConfig)}`)
    }
    if (!targetConfig.uploadBlockNumber) {
      throw new Error(`Config for network is missing uploadBlockNumber. Config: ${JSON.stringify(targetConfig)}`)
    }
  }

  return targetConfig;
}

export function buildParaAddresses(config:SDKConfiguration): ContractAddresses {
  if(config.paraDeploy) {
    const paraDeployAddresses = config.paraDeploys[config.paraDeploy];
    if(!paraDeployAddresses) throw new Error('Specified ParaDeploy does not exist in config.');
    return {
      ...config.addresses,
      ...paraDeployAddresses.addresses
    };
  } else {
    return config.addresses;
  }
}

// Derives an SDKConfiguration instance from several sources, merged into a single object.
export function buildConfig(env: string, specified: RecursivePartial<SDKConfiguration> = {}): SDKConfiguration {
  const config: RecursivePartial<SDKConfiguration> = mergeConfig(
    DEFAULT_SDK_CONFIGURATION,
    environments[env] || {},
    specified,
    configFromEnvvars()
  );
  return validConfigOrDie(config);
}

// Writes to disk the given SDKConfiguration instance, in the standard place, both source and build locations.
export async function writeConfig(env: string, config: SDKConfiguration): Promise<void> {
  await Promise.all(['src', 'build'].map(async (dir: string) => {
    const filepath = path.join(__dirname, '..', dir, 'environments', `${env}.json`);
    await writeFile(filepath, serializeConfig(config), 'utf8');
  }));

  // Now that config is changed on filesystem, reflect it in the runtime.
  environments[env] = config;
}

// Merges the given config with the one on disk, then writes the result to disk.
export async function updateConfig(env: string, config: RecursivePartial<SDKConfiguration>): Promise<SDKConfiguration> {
  const original = environments[env] || {};
  const updated = mergeConfig(original, config);
  const valid = validConfigOrDie(updated);
  await writeConfig(env, valid);
  return valid;
}

// Loads the config from disk.
export function refreshSDKConfig(): void {
  // be sure to be in src dir, not build
  loadSDKConfigs('../src/environments');
}

function loadSDKConfigs(relativePath: string) {
  Object.keys(require.cache).forEach((id: string) => {
    if (/\/environments\/.*?\.json$/.test(id)) {
      console.log('deleting cache for module:', id);
      delete require.cache[id];
    }
  });

  if (process?.versions?.node) {
    const envs = requireAll({
      dirname: path.join(__dirname, relativePath),
      filter: /^(.+)\.json$/,
      recursive: false,
    });
    Object.keys(envs).forEach((key) => {
      environments[key] = envs[key];
    })
  } else {
    throw Error('Cannot reload SDK config files in browser')
  }
}

export const environments: {[network: string]: SDKConfiguration} = {};

if (process?.versions?.node) {
  loadSDKConfigs('./environments');
}


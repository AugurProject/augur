import path from 'path';
import requireAll from 'require-all';
import { writeFile } from 'async-file';
import { DEFAULT_SDK_CONFIGURATION, RecursivePartial, NetworkId, SDKConfiguration, configFromEnvvars, serializeConfig, mergeConfig, validConfigOrDie } from '@augurproject/utils';

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

export function buildConfig(env: string, specified: RecursivePartial<SDKConfiguration> = {}): SDKConfiguration {
  const config: RecursivePartial<SDKConfiguration> = mergeConfig(
    DEFAULT_SDK_CONFIGURATION,
    environments[env] || {},
    specified,
    configFromEnvvars()
  );
  return validConfigOrDie(config);
}

export async function writeConfig(env: string, config: SDKConfiguration): Promise<void> {
  await Promise.all(['src', 'build'].map(async (dir: string) => {
    const filepath = path.join(__dirname, '..', dir, 'environments', `${env}.json`);
    await writeFile(filepath, serializeConfig(config), 'utf8');
  }));

  // Now that config is changed on filesystem, reflect it in the runtime.
  environments[env] = config;
}


export async function updateConfig(env: string, config: RecursivePartial<SDKConfiguration>): Promise<SDKConfiguration> {
  const original = environments[env] || {};
  const updated = mergeConfig(original, config);
  const valid = validConfigOrDie(updated);
  writeConfig(env, valid);
  return valid;
}

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


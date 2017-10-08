import Augur from 'augur.js';
import logError from 'utils/log-error';

export const connect = (env, callback = logError) => {
  const options = {
    httpAddresses: [],
    wsAddresses: []
  };
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isEnvHttps = (env.gethHttpURL && env.gethHttpURL.split('//')[0] === 'https:');
  const isEnvWss = (env.gethWebsocketsURL && env.gethWebsocketsURL.split('//')[0] === 'wss:');
  if (env.gethHttpURL && (!isHttps || isEnvHttps)) options.httpAddresses.push(env.gethHttpURL);
  if (env.gethWebsocketsURL && (!isHttps || isEnvWss)) options.wsAddresses.push(env.gethWebsocketsURL);
  if (env.networkID) options.networkID = env.networkID;
  if (env.hostedNodeFallback) options.httpAddresses.push('https://eth9000.augur.net');
  if (env.hostedNodeFallback) options.wsAddresses.push('wss://ws9000.augur.net');
  Object.keys(env.debug).forEach((opt) => { augur.options.debug[opt] = env.debug[opt]; });
  augur.connect({ ethereumNode: options, augurNode: env.augurNodeUrl }, (err, connectionInfo) => {
    if (err) return callback(err);
    console.log('connected:', connectionInfo);
    callback(null, connectionInfo.ethereumNode);
  });
};

export const augur = new Augur();
export const constants = augur.constants;

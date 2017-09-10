import Augur from 'augur.js';
import logError from 'utils/log-error';

export const connect = (env, callback) => {
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
  if (env.loadZeroVolumeMarkets != null) augur.options.loadZeroVolumeMarkets = env.loadZeroVolumeMarkets;
  augur.connect(options, (vitals) => {
    if (!vitals) return callback('could not connect to ethereum:' + JSON.stringify(vitals));
    console.log('connected:', vitals);
    callback(null, vitals);
  });
};

export const augur = new Augur();
export const constants = augur.constants;

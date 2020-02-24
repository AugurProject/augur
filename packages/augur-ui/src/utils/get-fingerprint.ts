import { formatBytes32String } from 'ethers/utils';
import Fingerprint2 from 'fingerprintjs2';

let fingerprint = null;
export const getFingerprint = (): string => {
  if (fingerprint) return fingerprint;
  // this gets called when app starts to cache fingerprint
  calculateFingerprint().then(value => {
    fingerprint = value
  });
  return formatBytes32String('');
};

async function calculateFingerprint(): Promise<string> {
  return await new Promise<string>(resolve =>
    setTimeout(() => {
      Fingerprint2.get(function(components) {
        var values = components.map(function(component) {
          return component.value;
        });
        var value = Fingerprint2.x64hash128(values.join(''), 31).substring(
          1,
          32
        );
        fingerprint = formatBytes32String(value);
        // console.log('fingerprint', fingerprint);
        resolve(fingerprint);
      });
    }, 500)
  );
}

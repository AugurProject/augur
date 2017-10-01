import { augur } from 'services/augurjs';
import { updateAssets } from 'modules/auth/actions/update-assets';
import LogError from 'utils/log-error';
import noop from 'utils/noop';

export function fundNewAccount(callback = LogError) {
  return (dispatch, getState) => {
    if (augur.rpc.getNetworkID() !== '1') {
      augur.api.LegacyRepContract.faucet({
        onSent: noop,
        onSuccess: (res) => {
          console.log('LegacyRepContract.faucet', res);
          dispatch(updateAssets());
          callback(null);
        },
        onFailed: callback
      });
    }
  };
}

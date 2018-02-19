import { augur } from 'services/augurjs'
import LogError from 'utils/log-error'

export function checkAccountAllowance(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    augur.api.Cash.allowance({
      _owner: loginAccount.address,
      _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Augur
    }, (err, allowance) => {
      if (err) callback(err)
      callback(null, allowance)
    });
  }
}

export function approveAugurForAccount(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    augur.accounts.approveAugur(loginAccount.address, loginAccount.auth, callback);
  }
}

// "augur-node": "ws://127.0.0.1:9001",
// "ethereum-node": {
//   "http": "http://127.0.0.1:8545",
//   "ws": "ws://127.0.0.1:8546"
// },

// augur.api.Cash.allowance({ _owner: state.loginAccount.address, _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Augur });
//
// augur.accounts.approveAugur(state.loginAccount.address, state.loginAccount.auth, function(err, res) { console.log(err, res); });

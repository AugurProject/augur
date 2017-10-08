import * as AugurJS from 'services/augurjs';
import { BRANCH_ID } from 'modules/app/constants/network';
import { updateEnv } from 'modules/app/actions/update-env';
import { updateConnectionStatus, updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection';
import { updateContractAddresses } from 'modules/contracts/actions/update-contract-addresses';
import { updateFunctionsAPI, updateEventsAPI } from 'modules/contracts/actions/update-contract-api';
import { setLoginAccount } from 'modules/auth/actions/set-login-account';
import { loadBranch } from 'modules/app/actions/load-branch';
import { registerTransactionRelay } from 'modules/transactions/actions/register-transaction-relay';
import logError from 'utils/log-error';

// fixes Reflect not being recognized in test or node 4.2
require('core-js/es6/reflect');

export function initAugur(callback = logError) {
  return (dispatch, getState) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          const env = JSON.parse(xhttp.responseText);
          dispatch(updateEnv(env));
          AugurJS.connect(env, (err, ethereumNodeConnectionInfo) => {
            if (err) return callback(err);
            dispatch(updateConnectionStatus(true));
            dispatch(updateContractAddresses(ethereumNodeConnectionInfo.contracts));
            dispatch(updateFunctionsAPI(ethereumNodeConnectionInfo.abi.functions));
            dispatch(updateEventsAPI(ethereumNodeConnectionInfo.abi.events));
            if (env.augurNodeUrl) dispatch(updateAugurNodeConnectionStatus(true));
            dispatch(registerTransactionRelay());
            dispatch(setLoginAccount(env.autoLogin, ethereumNodeConnectionInfo.coinbase));
            dispatch(loadBranch(env.branchID || BRANCH_ID));
            callback();
          });
        } else {
          callback(xhttp.statusText);
        }
      }
    };
    xhttp.open('GET', '/config/env.json', true);
    xhttp.send();
  };
}

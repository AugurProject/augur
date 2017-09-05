import { augur } from 'services/augurjs';
import { BRANCH_ID } from 'modules/app/constants/network';
import { updateEnv } from 'modules/app/actions/update-env';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { updateContractAddresses } from 'modules/contracts/actions/update-contract-addresses';
import { updateFunctionsAPI, updateEventsAPI } from 'modules/contracts/actions/update-contract-api';
import { loadChatMessages } from 'modules/chat/actions/load-chat-messages';
import { setLoginAccount } from 'modules/auth/actions/set-login-account';
import { loadBranch } from 'modules/app/actions/load-branch';
import { registerTransactionRelay } from 'modules/transactions/actions/register-transaction-relay';
import logError from 'utils/log-error';
import noop from 'utils/noop';

// fixes Reflect not being recognized in test or node 4.2
require('core-js/es6/reflect');

export function initAugur(cb) {
  return (dispatch, getState) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        const env = JSON.parse(xhttp.responseText);
        dispatch(updateEnv(env));
        augur.connect(env, (err, vitals) => {
          if (err) return console.error('connect failure:', err);
          dispatch(updateConnectionStatus(true));
          dispatch(updateContractAddresses(vitals.contracts));
          dispatch(updateFunctionsAPI(vitals.abi.functions));
          dispatch(updateEventsAPI(vitals.abi.events));
          dispatch(registerTransactionRelay());
          dispatch(loadChatMessages('augur'));
          dispatch(setLoginAccount(env.autoLogin, vitals.coinbase));
          dispatch(loadBranch(env.branchID || BRANCH_ID));
          cb && cb();
        });
      }
    };
    xhttp.open('GET', '/config/env.json', true);
    xhttp.send();
  };
}

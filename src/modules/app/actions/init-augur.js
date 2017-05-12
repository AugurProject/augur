import { augur, connect } from 'services/augurjs';
import { BRANCH_ID } from 'modules/app/constants/network';
import { updateEnv } from 'modules/app/actions/update-env';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { loadChatMessages } from 'modules/chat/actions/load-chat-messages';
import { setLoginAccount } from 'modules/auth/actions/set-login-account';
import { loadBranch } from 'modules/app/actions/load-branch';
import { registerTransactionRelay } from 'modules/transactions/actions/register-transaction-relay';
import { displayTopicsPage } from 'modules/link/actions/display-topics-page';

// for testing only
import { reportingTestSetup } from 'modules/reports/actions/reporting-test-setup';

// fixes Reflect not being recognized in test or node 4.2
require('core-js/es6/reflect');

export function initAugur() {
  return (dispatch, getState) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        const env = JSON.parse(xhttp.responseText);
        dispatch(updateEnv(env));
        connect(env, (err, connected) => {
          if (err) return console.error('connect failure:', err);
          dispatch(updateConnectionStatus(connected));
          dispatch(registerTransactionRelay());
          dispatch(loadChatMessages('augur'));
          dispatch(setLoginAccount(env.autoLogin));
          if (env.reportingTest) {

            // 127.0.0.1 only: configure for follow-on (multi-user) reporting testing
            if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' && env.reportingTest === true) {
              augur.getBranches((branches) => {
                console.debug(window.location.hostname, branches[branches.length - 1]);
                env.branchID = branches[branches.length - 1];
                env.reportingTest = false;
                if (getState().loginAccount.address) {
                  augur.fundNewAccount(env.branchID || BRANCH_ID, augur.utils.noop, () => {
                    dispatch(updateAssets());
                    dispatch(loadBranch(env.branchID || BRANCH_ID));
                    dispatch(displayTopicsPage());
                  }, e => console.error(e));
                } else {
                  dispatch(loadBranch(env.branchID || BRANCH_ID));
                }
              });

            } else {
              dispatch(reportingTestSetup(env.branchID));
            }
          } else {
            dispatch(loadBranch(env.branchID || BRANCH_ID));
            dispatch(displayTopicsPage());
          }
        });
      }
    };
    xhttp.open('GET', '/config/env.json', true);
    xhttp.send();
  };
}

import { augur } from 'services/augurjs';
import { BRANCH_ID } from 'modules/app/constants/network';
import { updateLoginAccount } from 'modules/auth/actions/update-login-account';
import { allAssetsLoaded } from 'modules/auth/selectors/balances';

export function updateAssets(cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.log('updateAssets:', e));
    const { loginAccount, branch } = getState();
    const balances = { ether: undefined, realEther: undefined, rep: undefined };
    if (!loginAccount.address) return dispatch(updateLoginAccount(balances));
    augur.loadAssets(branch.id || BRANCH_ID, loginAccount.address,
      (err, ether) => {
        if (err) return callback(err);
        balances.ether = ether;
        if (!loginAccount.ether || loginAccount.ether !== ether) {
          dispatch(updateLoginAccount({ ether }));
        }
        if (allAssetsLoaded(balances)) callback(null, balances);
      },
      (err, rep) => {
        if (err) return callback(err);
        balances.rep = rep;
        if (!loginAccount.rep || loginAccount.rep !== rep) {
          dispatch(updateLoginAccount({ rep }));
        }
        if (allAssetsLoaded(balances)) callback(null, balances);
      },
      (err, realEther) => {
        if (err) return callback(err);
        balances.realEther = realEther;
        if (!loginAccount.realEther || loginAccount.realEther !== realEther) {
          dispatch(updateLoginAccount({ realEther }));
        }
        if (allAssetsLoaded(balances)) callback(null, balances);
      }
    );
  };
}

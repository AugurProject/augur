import { NodeStyleCallback, AccountBalances } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance,
  getLegacyRepBalance,
} from 'modules/contracts/actions/contractCalls';
import { AppState } from 'appStore';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { addedDaiEvent } from 'services/analytics/helpers';
import { updateAppStatus, WALLET_STATUS } from 'modules/app/actions/update-app-status';
import { createBigNumber } from 'utils/create-big-number';
import { WALLET_STATUS_VALUES, FIVE, ETHER } from 'modules/common/constants';
import { addEthIncreaseAlert } from 'modules/alerts/actions/alerts';


export const updateAssets = (
  initialLogin: boolean = false,
): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, universe, appStatus } = getState();
  const { address, meta, balances } = loginAccount;
  const nonSafeWallet = await meta.signer?.getAddress();

  updateBalances(
    universe.id,
    address,
    nonSafeWallet,
    loginAccount.balances.signerBalances?.eth,
    initialLogin,
    balances,
    dispatch,
    (err, balances) => {
      let status = appStatus[WALLET_STATUS];
      if (createBigNumber(balances.dai).gt(FIVE) && (status !== WALLET_STATUS_VALUES.CREATED)) {
        dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.FUNDED_NEED_CREATE));
      }
    });
};

function updateBalances(
  universe: string,
  address: string,
  nonSafeWallet: string,
  ethNonSafeBalance: string,
  initialLogin: boolean,
  balances: AccountBalances,
  dispatch: ThunkDispatch<void, any, Action>,
  callback: NodeStyleCallback,
) {
  let allPromises = initialLogin
    ? Promise.all([
        getRepBalance(universe, address),
        getDaiBalance(address),
        getEthBalance(address),
        getLegacyRepBalance(address),
        getLegacyRepBalance(nonSafeWallet),
        getEthBalance(nonSafeWallet),
        getDaiBalance(nonSafeWallet),
        getRepBalance(universe, nonSafeWallet),
      ])
    : Promise.all([
        getRepBalance(universe, address),
        getDaiBalance(address),
        getEthBalance(address),
        null,
        null,
        getEthBalance(nonSafeWallet),
        null,
        null,
      ]);


  allPromises.then(async (amounts) => {
    const attoRep = String(amounts[0]);
    const dai = String(amounts[1]);
    const eth = amounts[2];
    const legacyAttoRep = initialLogin ? String(amounts[3]) : balances.legacyAttoRep;
    const legacyAttoRepNonSafe = initialLogin && String(amounts[4]);
    const rep = String(createBigNumber(attoRep).dividedBy(ETHER));
    const ethNonSafe = amounts[5];
    const daiNonSafe = initialLogin ? String(amounts[6]) : balances.signerBalances.dai;
    const repNonSafe = initialLogin
      ? String(createBigNumber(String(amounts[7])).dividedBy(ETHER))
      : balances.signerBalances.dai;
    const legacyRep = String(createBigNumber(String(legacyAttoRep)).dividedBy(ETHER));
    const legacyRepNonSafe = initialLogin
      ? String(createBigNumber(String(legacyAttoRepNonSafe)).dividedBy(ETHER))
      : balances.signerBalances.legacyRep;

    dispatch(addedDaiEvent(dai));
    dispatch(addEthIncreaseAlert(dai, ethNonSafeBalance, ethNonSafe));
    dispatch(
      updateLoginAccount({
        balances: {
          attoRep,
          rep,
          dai,
          eth,
          legacyAttoRep,
          legacyRep,
          signerBalances: {
            eth: ethNonSafe,
            dai: daiNonSafe,
            rep: repNonSafe,
            legacyRep: legacyRepNonSafe,
          }
        },
      })
    );
    return callback(null, { rep, dai, eth });
  });
}

import { updateLoginAccount } from 'modules/account/actions/login-account';
import {
  loadAccountData_exchangeRates,
} from 'modules/contracts/actions/contractCalls';
import { AppState } from 'appStore';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { addedDaiEvent } from 'services/analytics/helpers';
import {
  updateAppStatus,
  ETH_TO_DAI_RATE,
  REP_TO_DAI_RATE,
} from 'modules/app/actions/update-app-status';
import { createBigNumber } from 'utils/create-big-number';
import { ETHER } from 'modules/common/constants';
import { addEthIncreaseAlert } from 'modules/alerts/actions/alerts';
import { formatAttoDai } from 'utils/format-number';

export const updateAssets = (): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount } = getState();
  const { meta } = loginAccount;
  const nonSafeWallet = await meta.signer?.getAddress();

  const values = await loadAccountData_exchangeRates(nonSafeWallet);

  if (values) {
    const {
      attoDAIperREP,
      attoDAIperETH,
      signerETH,
      signerDAI,
      signerREP,
      signerLegacyREP,
      walletETH,
      walletDAI,
      walletREP,
      walletLegacyREP,
    } = values;
    dispatch(updateAppStatus(ETH_TO_DAI_RATE, formatAttoDai(attoDAIperETH)));
    dispatch(updateAppStatus(REP_TO_DAI_RATE, formatAttoDai(attoDAIperREP)));
    const dai = String(createBigNumber(String(walletDAI)).dividedBy(ETHER));
    const signerEthBalance = String(
      createBigNumber(String(signerETH)).dividedBy(ETHER)
    );
    dispatch(addedDaiEvent(dai));
    const ethNonSafeBalance = loginAccount.balances.signerBalances?.eth;
    dispatch(addEthIncreaseAlert(dai, ethNonSafeBalance, signerEthBalance));
    dispatch(
      updateLoginAccount({
        balances: {
          attoRep: String(walletREP),
          rep: String(createBigNumber(walletREP).dividedBy(ETHER)),
          dai,
          eth: String(createBigNumber(String(walletETH)).dividedBy(ETHER)),
          legacyAttoRep: String(walletLegacyREP),
          legacyRep: String(
            createBigNumber(String(walletLegacyREP)).dividedBy(ETHER)
          ),
          signerBalances: {
            eth: signerEthBalance,
            dai: String(createBigNumber(String(signerDAI)).dividedBy(ETHER)),
            rep: String(createBigNumber(String(signerREP)).dividedBy(ETHER)),
            legacyRep: String(
              createBigNumber(String(signerLegacyREP)).dividedBy(ETHER)
            ),
          },
        },
      })
    );
  }
};

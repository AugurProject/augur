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
  USDC_TO_DAI_RATE,
  USDT_TO_DAI_RATE,
  WALLET_STATUS,
} from 'modules/app/actions/update-app-status';
import { createBigNumber } from 'utils/create-big-number';
import { ETHER, WALLET_STATUS_VALUES, FIVE, ZERO, GWEI_CONVERSION } from 'modules/common/constants';
import { formatAttoDai } from 'utils/format-number';
import { augurSdk } from 'services/augursdk';


export const updateAssets = (): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, appStatus, env, gasPriceInfo } = getState();
  const { meta } = loginAccount;
  const nonSafeWallet = await meta.signer?.getAddress();

  const values = await loadAccountData_exchangeRates(nonSafeWallet);
  if (values) {
    const {
      attoDAIperREP,
      attoDAIperETH,
      attoDAIperUSDT,
      attoDAIperUSDC,
      signerETH,
      signerDAI,
      signerREP,
      signerUSDT,
      signerUSDC,
      signerLegacyREP,
      walletETH,
      walletDAI,
      walletREP,
      walletLegacyREP,
    } = values;
    const dai2Eth = formatAttoDai(attoDAIperETH);
    dispatch(updateAppStatus(ETH_TO_DAI_RATE, dai2Eth));
    dispatch(updateAppStatus(REP_TO_DAI_RATE, formatAttoDai(attoDAIperREP)));
    dispatch(updateAppStatus(USDT_TO_DAI_RATE, formatAttoDai(attoDAIperUSDT)));
    dispatch(updateAppStatus(USDC_TO_DAI_RATE, formatAttoDai(attoDAIperUSDC)));

    const daiBalance = String(createBigNumber(String(signerDAI)).dividedBy(ETHER));
    const signerEthBalance = String(
      createBigNumber(String(signerETH)).dividedBy(ETHER)
    );
    dispatch(addedDaiEvent(daiBalance));
    dispatch(
      updateLoginAccount({
        balances: {
          attoRep: String(signerREP),
          rep: String(createBigNumber(signerREP).dividedBy(ETHER)),
          dai: daiBalance,
          eth: String(createBigNumber(String(signerETH)).dividedBy(ETHER)),
          legacyAttoRep: String(signerLegacyREP),
          legacyRep: String(
            createBigNumber(String(signerLegacyREP)).dividedBy(ETHER)
          ),
          signerBalances: {
            eth: signerEthBalance,
            usdt: String(createBigNumber(String(signerUSDT)).dividedBy(10**6)),
            usdc: String(createBigNumber(String(signerUSDC)).dividedBy(10**6)),
            dai: String(createBigNumber(String(signerDAI)).dividedBy(ETHER)),
            rep: String(createBigNumber(String(signerREP)).dividedBy(ETHER)),
            legacyRep: String(
              createBigNumber(String(signerLegacyREP)).dividedBy(ETHER)
            ),
          },
        },
      })
    );
    let status = appStatus[WALLET_STATUS];
    if (createBigNumber(daiBalance).gte(FIVE) && (status !== WALLET_STATUS_VALUES.CREATED)) {
      dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.FUNDED_NEED_CREATE));
    }
  }
};

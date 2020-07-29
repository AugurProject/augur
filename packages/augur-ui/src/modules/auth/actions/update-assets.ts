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
  WALLET_STATUS,
} from 'modules/app/actions/update-app-status';
import { createBigNumber } from 'utils/create-big-number';
import { ETHER, WALLET_STATUS_VALUES, FIVE, ZERO, GWEI_CONVERSION } from 'modules/common/constants';
import { addEthIncreaseAlert } from 'modules/alerts/actions/alerts';
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
      signerETH,
      signerDAI,
      signerREP,
      signerLegacyREP,
      walletETH,
      walletDAI,
      walletREP,
      walletLegacyREP,
    } = values;
    const dai2Eth = formatAttoDai(attoDAIperETH);
    dispatch(updateAppStatus(ETH_TO_DAI_RATE, dai2Eth));
    dispatch(updateAppStatus(REP_TO_DAI_RATE, formatAttoDai(attoDAIperREP)));
    const daiBalance = String(createBigNumber(String(walletDAI)).dividedBy(ETHER));
    const signerEthBalance = String(
      createBigNumber(String(signerETH)).dividedBy(ETHER)
    );
    dispatch(addedDaiEvent(daiBalance));
    const ethNonSafeBalance = loginAccount.balances.signerBalances?.eth;
    dispatch(addEthIncreaseAlert(daiBalance, ethNonSafeBalance, signerEthBalance));
    dispatch(
      updateLoginAccount({
        balances: {
          attoRep: String(walletREP),
          rep: String(createBigNumber(walletREP).dividedBy(ETHER)),
          dai: daiBalance,
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
    let status = appStatus[WALLET_STATUS];
    if (createBigNumber(daiBalance).gte(FIVE) && (status !== WALLET_STATUS_VALUES.CREATED)) {
      dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.FUNDED_NEED_CREATE));
    }

    const feeReserveAmount = createBigNumber(env.gsn.desiredSignerBalanceInETH);
    const desiredEthBalance = feeReserveAmount.minus(signerEthBalance);
    let activateFeeReserve = true;
    if (desiredEthBalance.gt(ZERO)) {
      // gasPrice
      const gasPriceGwei = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average
      const gasPriceWei = createBigNumber(gasPriceGwei).times(createBigNumber(GWEI_CONVERSION));

      // convert worst cost tx in dai
      const dai2EthConvert = createBigNumber(dai2Eth.value);
      const desiredEthReserveInDai = desiredEthBalance.times(dai2EthConvert);
      const totalEstimatedMaxDai = dai2EthConvert.times((gasPriceWei.times(createBigNumber(6000000))).div(ETHER)); // Estimate of a very large tx with current gas price
      const totalWorstCaseDai = totalEstimatedMaxDai.plus(desiredEthReserveInDai);

      // calc if user has dai balance over desired dai balance after worst case tx dai costs
      const userBalAfterWorstCase = createBigNumber(daiBalance).minus(totalWorstCaseDai);
      const minDaiNeeded = createBigNumber(env.gsn.minDaiForSignerETHBalanceInDAI);
      activateFeeReserve = userBalAfterWorstCase.gte(minDaiNeeded);
    }
    augurSdk.client.setUseDesiredEthBalance(activateFeeReserve);
  }
};

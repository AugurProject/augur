import {
  loadAccountData_exchangeRates,
} from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import { ETHER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { addedDaiEvent } from 'services/analytics/helpers';
import { formatAttoDai } from 'utils/format-number';

export const updateAssets = async () => {
  const {
    loginAccount: {
      meta,
    },
  } = AppStatus.get();
  const nonSafeWallet = await meta.signer.getAddress();
  const values = await loadAccountData_exchangeRates(nonSafeWallet);

  if (values) {
    updateBalances(values);
  }
};

function updateBalances(values) {
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
  AppStatus.actions.updateDaiRates({
    ethToDaiRate: dai2Eth,
    repToDaiRate: formatAttoDai(attoDAIperREP),
    usdcToDaiRate: formatAttoDai(attoDAIperUSDC),
    usdtToDaiRate: formatAttoDai(attoDAIperUSDT)
  })

  const daiBalance = String(createBigNumber(String(signerDAI)).dividedBy(ETHER));
  const signerEthBalance = String(
    createBigNumber(String(signerETH)).dividedBy(ETHER)
  );
  addedDaiEvent(daiBalance);
  AppStatus.actions.updateLoginAccount({
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
  });

  addedDaiEvent(daiBalance);
  return {
    rep: String(createBigNumber(signerREP).dividedBy(ETHER)),
    dai: daiBalance,
    eth: String(createBigNumber(String(signerETH)).dividedBy(ETHER))
  };
}

import {
  loadAccountData_exchangeRates,
} from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import { ETHER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { addedDaiEvent } from 'services/analytics/helpers';
import { formatAttoDai } from 'utils/format-number';
import { augurSdk } from 'services/augursdk';

export const updateAssets = async () => {
  const {
    loginAccount: {
      meta,
    },
  } = AppStatus.get();
  const walletAddress = await meta.signer.getAddress();
  const accountLoaderBalances = await loadAccountData_exchangeRates(walletAddress);
  const { contracts } = augurSdk.get();
  const wethBalance = await contracts.weth.balanceOf_(walletAddress);

  if (accountLoaderBalances) {
    updateBalances(accountLoaderBalances, wethBalance);
  }
};

function updateBalances(accountLoaderBalances, wethBalance) {
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
  } = accountLoaderBalances;
  const dai2Eth = formatAttoDai(attoDAIperETH);
  AppStatus.actions.updateTokenRates({
    ethToDaiRate: dai2Eth,
    repToDaiRate: formatAttoDai(attoDAIperREP),
    usdcToDaiRate: formatAttoDai(attoDAIperUSDC),
    usdtToDaiRate: formatAttoDai(attoDAIperUSDT)
  })
  const daiBalance = String(createBigNumber(String(signerDAI)).dividedBy(ETHER));
  addedDaiEvent(daiBalance);
  AppStatus.actions.updateLoginAccount({
    balances: {
      attoRep: String(signerREP),
      rep: String(createBigNumber(signerREP).dividedBy(ETHER)),
      dai: String(createBigNumber(String(signerDAI)).dividedBy(ETHER)),
      weth: String(createBigNumber(wethBalance).dividedBy(ETHER)),
      eth: String(createBigNumber(String(signerETH)).dividedBy(ETHER)),
      usdt: String(createBigNumber(String(signerUSDT)).dividedBy(10**6)),
      usdc: String(createBigNumber(String(signerUSDC)).dividedBy(10**6)),
      legacyAttoRep: String(signerLegacyREP),
      legacyRep: String(
        createBigNumber(String(signerLegacyREP)).dividedBy(ETHER)
      ),
    },
  });

  addedDaiEvent(daiBalance);
  return {
    rep: String(createBigNumber(signerREP).dividedBy(ETHER)),
    dai: daiBalance,
    eth: String(createBigNumber(String(signerETH)).dividedBy(ETHER))
  };
}

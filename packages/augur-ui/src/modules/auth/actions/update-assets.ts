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
  const { ethToDaiRate, repToDaiRate, usdcToDaiRate, usdtToDaiRate, loginAccount: { balances } } = AppStatus.get();
  const dai2Eth = formatAttoDai(attoDAIperETH);
  const rep2Dai =  formatAttoDai(attoDAIperREP);
  const usdcToDai = formatAttoDai(attoDAIperUSDC);
  const usdtToDai = formatAttoDai(attoDAIperUSDT);

  if (
    ethToDaiRate?.fullPrecision !== dai2Eth.fullPrecision ||
    repToDaiRate?.fullPrecision !== rep2Dai.fullPrecision ||
    usdcToDaiRate?.fullPrecision !== usdcToDai.fullPrecision ||
    usdtToDaiRate?.fullPrecision !== usdtToDai.fullPrecision
  ) {
    AppStatus.actions.updateTokenRates({
      ethToDaiRate: dai2Eth,
      repToDaiRate: rep2Dai,
      usdcToDaiRate: usdcToDai,
      usdtToDaiRate: usdtToDai
    });
  }

  const daiBalance = String(createBigNumber(String(signerDAI)).dividedBy(ETHER));

  const Updates = {
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
  };

  if (JSON.stringify({ balances }) !== JSON.stringify(Updates)) {
    AppStatus.actions.updateLoginAccount(Updates);
  }

  addedDaiEvent(daiBalance);
  return {
    rep: String(createBigNumber(signerREP).dividedBy(ETHER)),
    dai: daiBalance,
    eth: String(createBigNumber(String(signerETH)).dividedBy(ETHER))
  };
}

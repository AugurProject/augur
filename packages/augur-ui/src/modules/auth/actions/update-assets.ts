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
  } = values;
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
    AppStatus.actions.updateDaiRates({
      ethToDaiRate: dai2Eth,
      repToDaiRate: rep2Dai,
      usdcToDaiRate: usdcToDai,
      usdtToDaiRate: usdtToDai
    });
  }
  

  const daiBalance = String(createBigNumber(String(signerDAI)).dividedBy(ETHER));
  const signerEthBalance = String(
    createBigNumber(String(signerETH)).dividedBy(ETHER)
  );
  const Updates = {
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

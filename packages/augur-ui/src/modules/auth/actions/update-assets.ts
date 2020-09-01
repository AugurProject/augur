import { NodeStyleCallback } from 'modules/types';
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance,
  getLegacyRepBalance,
} from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import { WALLET_STATUS_VALUES, FIVE, ETHER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { addedDaiEvent } from 'services/analytics/helpers';
import { addEthIncreaseAlert } from 'modules/alerts/actions/alerts';

export const updateAssets = async (initialLogin: boolean = false,) => {
  const {
    loginAccount: {
      address,
      meta,
      balances: {
        signerBalances: { eth },
      },
    },
  } = AppStatus.get();
  const nonSafeWallet = await meta.signer.getAddress();

  updateBalances(address, nonSafeWallet, String(eth), initialLogin, (err, balances) => {
    const { walletStatus } = AppStatus.get();
    // TODO: set min amount of DAI, for testing need a real values
    if (
      createBigNumber(balances.dai).gt(FIVE) &&
      walletStatus !== WALLET_STATUS_VALUES.CREATED
    ) {
      AppStatus.actions.setWalletStatus(
        WALLET_STATUS_VALUES.FUNDED_NEED_CREATE
      );
    }
  });
};

function updateBalances(
  address: string,
  nonSafeWallet: string,
  ethNonSafeBalance: string,
  initialLogin: boolean,
  callback: NodeStyleCallback
) {
  const {
    loginAccount: { balances },
    universe: { id: universe },
  } = AppStatus.get();
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
      : balances.signerBalances.rep;
    const legacyRep = String(createBigNumber(String(legacyAttoRep)).dividedBy(ETHER));
    const legacyRepNonSafe = initialLogin
      ? String(createBigNumber(String(legacyAttoRepNonSafe)).dividedBy(ETHER))
      : balances.signerBalances.legacyRep;

    const updatedBalances = {
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
      },
    };
    addedDaiEvent(dai);
    addEthIncreaseAlert(dai, ethNonSafeBalance, ethNonSafe);
    AppStatus.actions.updateLoginAccount({
      balances: updatedBalances,
    });
    return callback(null, { rep, dai, eth });
  });
}

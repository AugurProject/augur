import { augurSdk } from 'services/augursdk';
import { AppStatus } from 'modules/app/store/app-status';

export const loadAccountOpenOrders = async () => {
  const {
    loginAccount: { mixedCaseAddress: account },
    universe: { id: universe },
  } = AppStatus.get();
  const { refreshUserOpenOrders, updateLoginAccount } = AppStatus.actions;
  const Augur = augurSdk.get();
  const userOpenOrders = await Augur.getUserOpenOrders({
    universe,
    account,
  });
  refreshUserOpenOrders(userOpenOrders.orders);
  if (userOpenOrders.totalOpenOrdersFrozenFunds) {
    updateLoginAccount({
      totalOpenOrdersFrozenFunds: userOpenOrders.totalOpenOrdersFrozenFunds,
    });
  }
};

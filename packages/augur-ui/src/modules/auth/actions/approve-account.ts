import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { AppStatus } from 'modules/app/store/app-status';
import { approvalsNeededToTrade } from 'modules/contracts/actions/contractCalls';

export const checkAccountApproval = async (callback: NodeStyleCallback = logError) => {
  const {
    loginAccount
  } = AppStatus.get();

  if (!loginAccount.address) {
    console.log('User not logged in, check that wallet is connected');
    return callback(null, '0');
  }
  const neededApprovals = await approvalsNeededToTrade(loginAccount.address);
  AppStatus.actions.updateLoginAccount({
    tradingApproved: neededApprovals === 0
  });
};
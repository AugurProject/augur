import logError from 'utils/log-error';
import { getAllowance } from 'modules/contracts/actions/contractCalls';
import { NodeStyleCallback } from 'modules/types';
import { formatDai } from 'utils/format-number';
import { AppStatus } from 'modules/app/store/app-status';
import { approvalsNeededToTrade } from 'modules/contracts/actions/contractCalls';

export const checkAccountAllowance = async (callback: NodeStyleCallback = logError) => {
  const {
    loginAccount: { address, allowance: curAllowance },
  } = AppStatus.get();
  if (!address) {
    console.log('User not logged in, check that wallet is connected');
    return callback(null, '0');
  }
  const allowance = await getAllowance(address);
  callback(null, allowance);
  if (allowance.toFixed() !== curAllowance.toFixed())
    AppStatus.actions.updateLoginAccount({
      allowance,
      allowanceFormatted: formatDai(allowance),
    });
};

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
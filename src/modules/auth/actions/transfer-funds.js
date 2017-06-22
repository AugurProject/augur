import { abi, augur } from 'services/augurjs';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { addNotification } from 'modules/notifications/actions/update-notifications';

import trimString from 'utils/trim-string';

import { ETH, REP } from 'modules/account/constants/asset-types';

export function transferFunds(amount, currency, toAddress) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState();
    const fromAddress = loginAccount.address;
    const to = abi.format_address(toAddress);
    const onSent = r => console.log('transfer', currency, 'sent:', r);
    const onSuccess = (r) => {
      dispatch(updateAssets());
      console.log('transfer', currency, 'success:', r);
    };
    const onFailed = e => console.error('transfer', currency, 'failed:', e);
    switch (currency) {
      case ETH:
        return augur.assets.sendEther({
          signer: loginAccount.privateKey,
          to,
          value: amount,
          from: fromAddress,
          onSent: tx => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
              title: `Transfer Ether -- Pending`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: parseInt(Date.now() / 1000, 10),
            }));
          },
          onSuccess: tx => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
              title: `Transfer Ether -- Success`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: parseInt(Date.now() / 1000, 10),
          }));
          },
          onFailed: tx => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
              title: `Transfer Ether -- Failed`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: parseInt(Date.now() / 1000, 10),
          }));
          }
        });
      case REP:
        return augur.assets.sendReputation({
          _signer: loginAccount.privateKey,
          branch: branch.id,
          recver: to,
          value: amount,
          onSent,
          onSuccess,
          onFailed
        });
      default:
        console.error('transferFunds: unknown currency', currency);
    }
  };
}

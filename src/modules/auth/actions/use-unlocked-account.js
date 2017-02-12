import { augur } from '../../../services/augurjs';
import { loadFullAccountData } from '../../auth/actions/load-account-data';

// Use unlocked local address (if actually unlocked)
export const useUnlockedAccount = unlockedAddress => dispatch => {
  if (!unlockedAddress) return console.error('no account address');
  augur.rpc.unlocked(unlockedAddress, (isUnlocked) => {
    if (!isUnlocked || isUnlocked.error) {
      return console.warn('account is locked:', unlockedAddress, isUnlocked);
    }
    augur.accounts.logout(); // clear the client-side account
    console.info('using unlocked account:', unlockedAddress);
    dispatch(loadFullAccountData({ address: unlockedAddress, isUnlocked: true }));
  })
};

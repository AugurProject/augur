import { augur } from 'services/augurjs';

export function convertToEtherToken(value) {
  return (dispatch) => {
    augur.depositEther({ value });
  };
}

export function convertToEther(amount) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();

    if (loginAccount.address) {
      augur.withdrawEther(loginAccount.address, amount);
    }
  };
}

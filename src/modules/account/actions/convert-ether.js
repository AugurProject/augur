import { augur } from 'services/augurjs';

export function convertToToken(value) {
  return (dispatch) => {
    augur.depositEther({
      value,
      onSent: () => {},
      onSuccess: () => {},
      onFailed: () => {}
    });
  };
}

export function convertToEther(amount) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();

    if (loginAccount.address) {
      augur.withdrawEther(
        loginAccount.address,
        amount,
        () => {},
        () => {},
        () => {}
      );
    }
  };
}

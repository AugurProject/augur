import { augur, cash } from 'services/augurjs';

export function convertToEtherToken(value) {
  return (dispatch) => {
    augur.depositEther({
      value,
      onSent: (res) => { // onSent
        console.log('onSent -- ', res);
      },
      onSuccess: (res) => { // onSuccess
        console.log('onSuccess -- ', res);
      },
      onFailed: (res) => { // onFailed
        console.log('onFailed -- ', res);
      }
    });
  };
}

export function convertToEther(amount) {
  return (dispatch) => {

  };
}

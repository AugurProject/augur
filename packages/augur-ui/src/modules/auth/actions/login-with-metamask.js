import logError from "utils/log-error";
import { initAugur } from "src/modules/app/actions/init-augur";

export const loginWithMetaMask = (history, callback = logError) => dispatch => {
  dispatch(
    initAugur(
      history,
      {
        useWeb3Transport: true
      },
      callback
    )
  );
};

import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import TX from "ethereumjs-tx";
import { prefixHex } from "speedomatic";
import { augur } from "services/augurjs";

import { MODAL_TREZOR } from "modules/common-elements/constants";

const trezorSigner = async (connect, path, dispatch, rawTxArgs) => {
  function hex(num) {
    let str = prefixHex(num).slice(2);
    if (str.length % 2 !== 0) str = "0" + str;
    return str;
  }

  dispatch(
    updateModal({
      type: MODAL_TREZOR
    })
  );

  const tx = rawTxArgs[0];
  const callback = rawTxArgs[1];

  tx.gasLimit || (tx.gasLimit = tx.gas);

  const chain = augur.rpc.getNetworkID();

  const transaction = {
    to: tx.to.slice(2),
    value: hex(tx.value),
    data: hex(tx.data),
    chainId: parseInt(chain, 10),
    nonce: hex(tx.nonce),
    gasLimit: hex(tx.gas),
    gasPrice: hex(tx.gasPrice)
  };

  return connect
    .ethereumSignTransaction({
      path,
      transaction
    })
    .then(response => {
      if (response.success) {
        tx.r = response.payload.r;
        tx.s = response.payload.s;
        tx.v = response.payload.v;

        const signedTx = new TX(tx);
        const serialized = "0x" + signedTx.serialize().toString("hex");

        callback(null, serialized);
      } else {
        callback(response.error);
      }
      dispatch(closeModal());
    })
    .catch(err => {
      callback(err);

      dispatch(
        updateModal({
          type: MODAL_TREZOR,
          error: `Error signing transaction: "${err}"`
        })
      );
    });
};

export default trezorSigner;

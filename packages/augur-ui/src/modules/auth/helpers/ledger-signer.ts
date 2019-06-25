import { Signer, utils } from "ethers";
import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import { MODAL_LEDGER } from "modules/common/constants";
import { TransactionRequest } from "ethers/providers";
import { augurSdk } from "services/augursdk";
import { buildTransaction } from "./trezor-signer";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

export default class LedgerSigner extends Signer {
  readonly provider: any;
  private address: string;
  private dispatch: ThunkDispatch<void, any, Action>;
  private ledgerLib: any;
  private path: string | number[];

  constructor(address: string, path: string | number[], ledgerLib: any, dispatch: ThunkDispatch<void, any, Action>) {
    super();

    this.dispatch = dispatch;
    this.address = address;
    this.path = path;
    this.ledgerLib = ledgerLib;

    // TODO Update with proper get provider pattern
    // @ts-ignore
    const { provider } = augurSdk.sdk.dependencies;
    this.provider = provider;
  }

  openModal() {
    this.dispatch(
      updateModal({
        type: MODAL_LEDGER,
      })
    );
  }

  getAddress(): Promise < string > {
    return new Promise((resvole) => {
      resvole(this.address);
    });
  }

  signMessage(message: utils.Arrayish): Promise <string> {
    return new Promise(async (resolve, reject) => {
      // TODO implement for Edge
      reject("signMessage is not implemented");
    });
  }

  sign = async (transaction: TransactionRequest) => {
    this.openModal();

    const tx = await buildTransaction(transaction, this.address, this.provider);


    this.ledgerLib
    .signTransaction(this.path, tx)
    .then(res => {
      const sig = {
        v: parseInt(res.v.substring(2), 16),
        r: res.r,
        s: res.s,
      };

      this.dispatch(closeModal());
      return utils.serializeTransaction(tx, sig);
    })
    .catch(err => {
      this.dispatch(
        updateModal({
          type: MODAL_LEDGER,
          error: `Failed to Sign with "${err}" On Leger device, Make sure Contract data is Enabled`
        })
      );
      throw new Error(err);
    });
  };

  sendTransaction = async (transaction: TransactionRequest) => {
    const signedTx = await this.sign(transaction);
    return this.provider.sendTransaction(signedTx);
  }
}

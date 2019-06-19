import { Signer, utils } from "ethers";
import TrezorConnect from "trezor-connect";
import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import { MODAL_TREZOR } from "modules/common/constants";
import { getGasPrice } from "modules/contracts/actions/contractCalls";
import { TransactionRequest } from "ethers/providers";
import { augurSdk } from "services/augursdk";

export const buildTransaction = async(transaction, address, provider) => {
  if (transaction.value) {
    transaction.value = utils.hexlify(transaction.value as string);
  } else {
    transaction.value = utils.hexlify(utils.parseEther("0.0"));
  }

  if (transaction.gasPrice) {
    transaction.gasPrice = utils.hexlify(transaction.gasPrice as string);
  } else {
    const gasPrice = await getGasPrice();
    transaction.gasPrice = utils.hexlify(gasPrice.toNumber());
  }

  if (transaction.gasLimit) {
    transaction.gasLimit = utils.hexlify(transaction.gasLimit as string);
  } else {
    // TODO gasLimit returned by estimateGas is currently failing -- need to look into this
    // TODO for now using 1500000 as default gas limit
    // const gasLimit = await provider.estimateGas(transaction);
    transaction.gasLimit = utils.hexlify(1500000);
  }

  transaction.nonce = utils.hexlify(await provider.getTransactionCount(address));

  return transaction;
};

export default class TrezorSigner extends Signer {
  readonly provider: any;
  private address: string;
  private dispatch: any;
  private path: string | number[];

  constructor(address: string, path: string | number[], dispatch: any) {
    super();

    this.dispatch = dispatch;
    this.address = address;
    this.path = path;

    // TODO Update with proper get provider pattern
    // @ts-ignore
    const { provider } = augurSdk.sdk.dependencies;
    this.provider = provider;
  }

  openModal() {
    this.dispatch(
      updateModal({
        type: MODAL_TREZOR,
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
      const result = await TrezorConnect.ethereumSignMessage({
        path: this.path,
        message,
      });

      if (result.success) {
        resolve(result.payload.signature);
      }

      reject(result.payload.error);
    });
  }

  sign = async (transaction: TransactionRequest) => {
    this.openModal();

    const tx = await buildTransaction(transaction, this.address, this.provider);

    const result = await TrezorConnect.ethereumSignTransaction({
      path: this.path,
      transaction: tx,
    });

    if (result.success) {
      const sig = {
        v: parseInt(result.payload.v.substring(2), 16),
        r: result.payload.r,
        s: result.payload.s,
      };

      this.dispatch(closeModal());
      return utils.serializeTransaction(tx, sig);
    }

    this.dispatch(
      updateModal({
        type: MODAL_TREZOR,
        error: `Error signing transaction: "${result.payload.error}"`,
      })
    );
    throw new Error(result.payload.error);
  };

  sendTransaction = async (transaction: TransactionRequest) => {
    const signedTx = await this.sign(transaction);
    return this.provider.sendTransaction(signedTx);
  }
}

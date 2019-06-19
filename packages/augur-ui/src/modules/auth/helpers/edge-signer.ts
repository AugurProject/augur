import { Signer, utils } from "ethers";
import { prefixHex } from "speedomatic";
import { getGasPrice } from "modules/contracts/actions/contractCalls";
import { augurSdk } from "services/augursdk";
import { EthersProvider } from "@augurproject/ethersjs-provider/build";
import { TransactionRequest } from "ethers/providers";
import { EdgeUiAccount, EthereumWallet } from "modules/types";
import { buildTransaction } from "./trezor-signer";

export default class EdgeSigner extends Signer {
  readonly provider: EthersProvider;
  private address: string;
  private edgeUiAccount: EdgeUiAccount;
  private edgeId: string;

  constructor(edgeUiAccount: EdgeUiAccount, ethereumWallet: EthereumWallet) {
    super();

    const mixedCaseAddress: string = ethereumWallet.keys.ethereumAddress;
    const lowerCaseAddress: string = mixedCaseAddress.toLowerCase();

    // TODO Update with proper get provider pattern
    // @ts-ignore
    const { provider } = augurSdk.sdk.dependencies;

    this.edgeUiAccount = edgeUiAccount;
    this.address = lowerCaseAddress;
    this.edgeId = ethereumWallet.id;
    this.provider = provider;
  }


  signMessage(message: utils.Arrayish): Promise <string> {
    return new Promise(async (resolve, reject) => {
      // TODO implement for Edge
      reject("signMessage is not implemented");
    });
  }

  getAddress(): Promise < string > {
    return new Promise((resvole) => {
      resvole(this.address);
    });
  }

  sign = async (transaction: TransactionRequest) => {
    const tx = await buildTransaction(transaction, this.address, this.provider);

    const sig = await this.edgeUiAccount
      .signEthereumTransaction(this.edgeId, transaction)
      .then((signed: string) => {
        return prefixHex(signed);
    });

    if (sig) {
      return sig;
    }

    throw new Error(sig);
  };

  sendTransaction = async (transaction: TransactionRequest) => {
    const signedTx = await this.sign(transaction);
    return this.provider.sendTransaction(signedTx);
  }
}

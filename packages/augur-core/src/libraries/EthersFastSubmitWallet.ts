import { ethers } from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { ExternallyOwnedAccount } from '@ethersproject/abstract-signer';
import { SigningKey } from '@ethersproject/signing-key';


export class EthersFastSubmitWallet extends ethers.Wallet {
  private nonce = 0;
  private gasPrice = 35e9;

  static async create(
    privateKey: BytesLike | ExternallyOwnedAccount | SigningKey,
    provider: ethers.providers.Provider
  ): Promise<EthersFastSubmitWallet> {
    const wallet = new EthersFastSubmitWallet(privateKey, provider);
    const nonce = await provider.getTransactionCount(wallet.address, 'pending');
    wallet.setNonce(nonce);
    wallet.startGasPriceCheck(); // intentionally hanging promise
    return wallet;
  }

  setNonce(nonce: number): void {
    this.nonce = nonce;
  }

  async startGasPriceCheck(): Promise<void> {
    const gasPrice = await this.provider.getGasPrice();
    this.gasPrice = Math.round(gasPrice.toNumber() * 1.1);
    setTimeout(this.startGasPriceCheck.bind(this), 15000);
  }

  // If we ever have a use case for a different kind of message signing split this into `signMessage` (new) and `signBinaryMessage` (below)
  signMessage(message: BytesLike): Promise<string> {
    const hashmessage = ethers.utils.arrayify(message);
    return Promise.resolve(super.signMessage(hashmessage));
  }

  async sendTransaction(
    transaction: ethers.providers.TransactionRequest
  ): Promise<ethers.providers.TransactionResponse> {
    transaction = ethers.utils.shallowCopy(transaction);
    transaction.nonce = this.nonce;
    transaction.from = this.address;
    transaction.gasPrice = this.gasPrice;
    this.nonce++;

      // https://github.com/ethers-io/ethers.js/issues/321
    delete transaction.from;
    const populatedTx = await this.populateTransaction(transaction);
    const signedTransaction = await this.signTransaction(populatedTx);
    return this.provider.sendTransaction(signedTransaction);
  }
}

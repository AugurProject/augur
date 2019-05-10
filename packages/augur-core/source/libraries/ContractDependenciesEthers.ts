import {
  Dependencies,
  Transaction,
  TransactionReceipt,
  Address, Bytes, Bytes32
} from './GenericContractInterfaces';
import {ethers} from 'ethers'

export interface Provider {
  listAccounts(): Promise<Array<string>>
  call(transaction: ethers.providers.TransactionRequest): Promise<string>
  estimateGas(transaction: ethers.providers.TransactionRequest): Promise<ethers.utils.BigNumber>
  getTransactionCount(address: string): Promise<number>
}

export interface Signer {
  getAddress(): Promise<string>;
  sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
}

export class ContractDependenciesEthers implements Dependencies<ethers.utils.BigNumber> {
  public constructor(private readonly provider: Provider, private readonly signer: Signer, private readonly getGasPriceInNanoeth: () => Promise<number|undefined>) {}

  call = async (transaction: Transaction<ethers.utils.BigNumber>): Promise<Uint8Array> => {
    const ethersTransaction: ethers.providers.TransactionRequest = {
      from: await this.getSignerOrZero(),
      to: transaction.to.to0xString(),
      data: transaction.data.to0xString(),
      value: transaction.value
    }
    const stringResult = await this.provider.call(ethersTransaction)
    return Bytes.fromHexString(stringResult)
  }

  submitTransaction = async (transaction: Transaction<ethers.utils.BigNumber>): Promise<TransactionReceipt> => {
    const ethersTransaction: ethers.providers.TransactionRequest = {
      from: await this.signer.getAddress(),
      to: transaction.to.to0xString(),
      data: transaction.data.to0xString(),
      value: transaction.value
    }
    const gasEstimate = (await this.provider.estimateGas(ethersTransaction)).toNumber()
    // https://github.com/ethers-io/ethers.js/issues/321
    delete ethersTransaction.from
    // TODO: figure out a way to propagate a warning up to the user when we truncate the gas estimate, we don't currently have a mechanism for error propagation, so will require infrastructure work
    ethersTransaction.gasLimit = Math.min(Math.max(Math.round(gasEstimate * 1.3), 250000), 5000000)
    const gasPrice = await this.getGasPriceInNanoeth()
    Object.assign(ethersTransaction, (gasPrice !== undefined) ? { gasPrice: ethers.utils.bigNumberify(gasPrice * 1e9) } : {})
    const ethersReceipt = await (await this.signer.sendTransaction(ethersTransaction)).wait()
    // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
    const receipt: TransactionReceipt = {
      success: !!ethersReceipt.status,
      events: ethersReceipt.logs!.map(ethersEvent => ({
        topics: ethersEvent.topics.map(ethersTopic => Bytes32.fromHexString(ethersTopic)),
        data: Bytes.fromHexString(ethersEvent.data)
      }))
    }
    return receipt
  }

  isLargeInteger = (x: any): x is ethers.utils.BigNumber => x instanceof ethers.utils.BigNumber

  encodeLargeUnsignedInteger = (x: ethers.utils.BigNumber): Bytes32 => {
    const value = x as any as ethers.utils.BigNumber
    const result = new Bytes32()
    const stringified = ('0000000000000000000000000000000000000000000000000000000000000000' + value.toHexString().substring(2)).slice(-64)
    for (let i = 0; i < stringified.length; i += 2) {
      result[i/2] = Number.parseInt(stringified[i] + stringified[i+1], 16)
    }
    return result
  }

  encodeLargeSignedInteger = (x: ethers.utils.BigNumber): Bytes32 => {
    const value = x as any as ethers.utils.BigNumber
    const result = new Bytes32()
    const stringified = ('0000000000000000000000000000000000000000000000000000000000000000' + value.toTwos(256).toHexString().substring(2)).slice(-64)
    for (let i = 0; i < stringified.length; i += 2) {
      result[i/2] = Number.parseInt(stringified[i] + stringified[i+1], 16)
    }
    return result
  }

  decodeLargeUnsignedInteger = (data: Bytes32): ethers.utils.BigNumber => new ethers.utils.BigNumber(data)

  decodeLargeSignedInteger = (data: Bytes32): ethers.utils.BigNumber => new ethers.utils.BigNumber(data).fromTwos(256)

  /**
   * Get the address of the signer, or zero if the signer address can't be fetched (for example, if privacy mode is enabled in the signing tool).
   *
   * FIXME: some functions may require a legitimate from address, while others do not. this information is known by the developer who calls the contract, but not known to the rest of the system. we need a way for the caller to specify, 'if a user address is not available, then fail, otherwise use the 0 address'
   */
  private getSignerOrZero = async () => {
    try {
      return await this.signer.getAddress()
    } catch (error) {
      return new Address().to0xString()
    }
  }
}

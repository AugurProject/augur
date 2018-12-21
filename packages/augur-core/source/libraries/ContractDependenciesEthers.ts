import {Dependencies, AbiFunction, AbiParameter, Transaction, TransactionReceipt} from './GenericContractInterfaces';
import {ethers} from 'ethers'

export interface Provider {
    listAccounts(): Promise<Array<string>>

    call(transaction: ethers.providers.TransactionRequest): Promise<string>

    estimateGas(transaction: ethers.providers.TransactionRequest): Promise<ethers.utils.BigNumber>
}

export interface Signer {
    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
}

export class ContractDependenciesEthers implements Dependencies<ethers.utils.BigNumber> {
    public constructor(
        private readonly provider: Provider,
        private readonly signer: Signer
    ) {
    }

    keccak256 = (utf8String: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(utf8String));
    encodeParams = (abiFunction: AbiFunction, parameters: Array<any>) => new ethers.utils.AbiCoder().encode(abiFunction.inputs, parameters).substr(2)
    decodeParams = (abiParameters: Array<AbiParameter>, encoded: string) => new ethers.utils.AbiCoder().decode(abiParameters, encoded)
    getDefaultAddress = async () => (await this.provider.listAccounts())[0];
    call = async (transaction: Transaction<ethers.utils.BigNumber>) => await this.provider.call(transaction);
    submitTransaction = async (transaction: Transaction<ethers.utils.BigNumber>) => {
        // https://github.com/ethers-io/ethers.js/issues/321
        const gasEstimate = (await this.provider.estimateGas(transaction)).toNumber();
        const gasLimit = Math.min(Math.max(Math.round(gasEstimate * 1.3), 250000), 5000000);
        // TODO: figure out a way to propagate a warning up to the user in this scenario, we don't currently have a mechanism for error propagation, so will require infrastructure work
        transaction = Object.assign({}, transaction, {gasLimit: gasLimit});
        delete transaction.from;
        const receipt = await (await this.signer.sendTransaction(transaction)).wait();
        // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
        return <TransactionReceipt>receipt
    }
}

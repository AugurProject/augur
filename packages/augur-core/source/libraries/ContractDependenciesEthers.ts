import {Dependencies, AbiFunction, AbiParameter, Transaction, TransactionReceipt} from './GenericContractInterfaces';
import { BigNumber } from 'bignumber.js';
import {ethers} from 'ethers'
import * as _ from "lodash";

export interface Signer {
    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
}

export class ContractDependenciesEthers implements Dependencies<BigNumber> {
    public readonly provider: ethers.providers.JsonRpcProvider;
    public readonly signer: ethers.Signer;
    public readonly gasPrice: number;

    public constructor(provider: ethers.providers.JsonRpcProvider, signer: ethers.Signer, gasPrice: number) {
        this.provider = provider;
        this.signer = signer;
        this.gasPrice = gasPrice;
    }

    public transactionToEthersTransaction(transaction: Transaction<BigNumber>): Transaction<ethers.utils.BigNumber> {
        return {
            to: transaction.to,
            from: transaction.from,
            data: transaction.data,
            value: transaction.value ? new ethers.utils.BigNumber(transaction.value.toString()) : new ethers.utils.BigNumber(0)
        }
    }

    keccak256 = (utf8String: string) => {
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(utf8String));
    }

    encodeParams = (abiFunction: AbiFunction, parameters: Array<any>) => {
        const ethersParams = _.map(parameters, (param) => {
            if (param instanceof BigNumber) {
                return new ethers.utils.BigNumber(param.toFixed());
            } else if (param instanceof Array && param.length > 0 && param[0] instanceof BigNumber) {
                return _.map(param, (value) => new ethers.utils.BigNumber(value.toFixed()));
            }
            return param;
        });
        return new ethers.utils.AbiCoder().encode(abiFunction.inputs, ethersParams).substr(2);
    }

    decodeParams = (abiParameters: Array<AbiParameter>, encoded: string) => {
        const results = new ethers.utils.AbiCoder().decode(abiParameters, encoded);
        return _.map(results, (result) => {
            if (result instanceof ethers.utils.BigNumber) {
                return new BigNumber(result.toString());
            } else if (result instanceof Array && result.length > 0 && result[0] instanceof ethers.utils.BigNumber) {
                return _.map(result, (value) => new BigNumber(value.toString()));
            }
            return result;
        });
    }

    getDefaultAddress = async () => {
        return await this.signer.getAddress();
    }

    call = async (transaction: Transaction<BigNumber>) => {
        return await this.provider.call(this.transactionToEthersTransaction(transaction));
    }

    submitTransaction = async (transaction: Transaction<BigNumber>) => {
        // TODO: figure out a way to propagate a warning up to the user in this scenario, we don't currently have a mechanism for error propagation, so will require infrastructure work
        transaction = Object.assign({}, transaction, {gasPrice: this.gasPrice});
        const receipt = await (await this.signer.sendTransaction(this.transactionToEthersTransaction(transaction))).wait();
        // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
        return <TransactionReceipt>receipt
    }

    estimateGas = async (transaction: Transaction<BigNumber>): Promise<BigNumber> => {
      const gasEstimate = await this.provider.estimateGas(this.transactionToEthersTransaction(transaction));
      return new BigNumber(gasEstimate.toString());
    }
}

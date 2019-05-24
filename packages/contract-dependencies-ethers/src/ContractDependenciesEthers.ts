import { Dependencies, AbiFunction, AbiParameter, Transaction, TransactionReceipt } from 'contract-dependencies';
import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js';
import { TransactionRequest } from "ethers/providers";
import { isInstanceOfBigNumber, isInstanceOfEthersBigNumber, isInstanceOfArray } from "./utils";
import * as _ from "lodash";

export interface EthersSigner {
    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
    getAddress(): Promise<string>;
}

export interface EthersProvider {
    call(transaction: Transaction<ethers.utils.BigNumber>): Promise<string>;
    estimateGas(transaction: TransactionRequest): Promise<ethers.utils.BigNumber>;
    listAccounts(): Promise<string[]>;
}

export class ContractDependenciesEthers implements Dependencies<BigNumber> {
    public readonly provider: EthersProvider;
    public readonly signer?: EthersSigner;
    public readonly address?: string;

    private readonly abiCoder: ethers.utils.AbiCoder;

    public constructor(provider: EthersProvider, signer?: EthersSigner, address?: string) {
        this.provider = provider;
        if (this.signer && this.address) throw new Error("Must provide only one of signer or address")
        this.signer = signer;
        this.address = address;
        this.abiCoder = new ethers.utils.AbiCoder();
    }

    public transactionToEthersTransaction(transaction: Transaction<BigNumber>): Transaction<ethers.utils.BigNumber> {
        return {
            to: transaction.to,
            from: transaction.from,
            data: transaction.data,
            value: transaction.value ? new ethers.utils.BigNumber(transaction.value.toString()) : new ethers.utils.BigNumber(0)
        }
    }

    public keccak256(utf8String: string): string {
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(utf8String));
    }

    public encodeParams(abiFunction: AbiFunction, parameters: Array<any>) {
        const ethersParams = _.map(parameters, (param) => {
            if (isInstanceOfBigNumber(param)) {
                return new ethers.utils.BigNumber(param.toFixed());
            } else if (isInstanceOfArray(param) && param.length > 0 && isInstanceOfBigNumber(param[0])) {
                return _.map(param, (value) => new ethers.utils.BigNumber(value.toFixed()));
            }
            return param;
        });
        return this.abiCoder.encode(abiFunction.inputs, ethersParams).substr(2);
    }

    public decodeParams(abiParameters: Array<AbiParameter>, encoded: string) {
        const results = this.abiCoder.decode(abiParameters, encoded);
        return _.map(results, (result) => {
            if (isInstanceOfEthersBigNumber(result)) {
                return new BigNumber(result.toString());
            } else if (isInstanceOfArray(result) && result.length > 0 && isInstanceOfEthersBigNumber(result[0])) {
                return _.map(result, (value) => new BigNumber(value.toString()));
            }
            return result;
        });
    }

    public async call(transaction: Transaction<BigNumber>): Promise<string> {
        return await this.provider.call(this.transactionToEthersTransaction(transaction));
    }

    public async getDefaultAddress(): Promise<string> {
        if (this.signer) {
            return this.signer.getAddress();
        }

        const addresses = await this.provider.listAccounts();
        if (addresses.length > 0) return addresses[0];

        return <string>this.address;
    }

    public async submitTransaction(transaction: Transaction<BigNumber>): Promise<TransactionReceipt> {
        if (!this.signer) throw new Error("Attempting to sign a transaction while not providing a signer");
        // TODO: figure out a way to propagate a warning up to the user in this scenario, we don't currently have a mechanism for error propagation, so will require infrastructure work
        // TODO: https://github.com/ethers-io/ethers.js/issues/321
        const tx = this.transactionToEthersTransaction(transaction);
        delete tx.from;
        const receipt = await (await this.signer.sendTransaction(tx)).wait();
        // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
        return <TransactionReceipt>receipt
    }

    public async estimateGas(transaction: Transaction<BigNumber>): Promise<BigNumber> {
        const gasEstimate = await this.provider.estimateGas(this.transactionToEthersTransaction(transaction));
        return new BigNumber(gasEstimate.toString());
    }
}

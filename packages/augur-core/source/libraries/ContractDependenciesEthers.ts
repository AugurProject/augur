import {
    Bytes,
    Bytes32,
    Dependencies,
    Encodable,
    ParameterDescription,
    Transaction,
    TransactionReceipt
} from "./ContractInterfaces";
import { ethers } from "ethers";

export type EthersBigNumber = ethers.utils.BigNumber;

export interface Signer {
    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
}

export class ContractDependenciesEthers implements Dependencies<ethers.utils.BigNumber> {
    public constructor(
        public readonly provider: ethers.providers.JsonRpcProvider,
        public readonly signer: ethers.Signer,
        public readonly gasPrice: number
    ) {
    }

    public decodeLargeSignedInteger(data: Bytes32): ethers.utils.BigNumber {
        return new ethers.utils.BigNumber(data).fromTwos(256);
    }

    public keccak256(utf8String: string): string {
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(utf8String));
    }

    encodeParameters(descriptions: Array<ParameterDescription>, parameters: Array<any>): Uint8Array {
        const textEncoder = new TextEncoder();
        const encodedParamString = new ethers.utils.AbiCoder().encode(descriptions, parameters).substr(2);

        return textEncoder.encode(encodedParamString);
    }

    decodeParameters(descriptions: Array<ParameterDescription>, encodedParameters: Uint8Array): Array<Encodable<ethers.utils.BigNumber>> {
        return new ethers.utils.AbiCoder().decode(descriptions, encodedParameters);
    }

    isLargeInteger = (x: any): x is ethers.utils.BigNumber => x instanceof ethers.utils.BigNumber;

    encodeLargeUnsignedInteger = (x: ethers.utils.BigNumber): Bytes32 => {
        const value = x as any as ethers.utils.BigNumber;
        const result = new Bytes32();
        const stringified = ("0000000000000000000000000000000000000000000000000000000000000000" + value.toHexString().substring(2)).slice(-64);
        for (let i = 0; i < stringified.length; i += 2) {
            result[i / 2] = Number.parseInt(stringified[i] + stringified[i + 1], 16);
        }
        return result;
    };

    encodeLargeSignedInteger = (x: ethers.utils.BigNumber): Bytes32 => {
        const value = x as any as ethers.utils.BigNumber;
        const result = new Bytes32();
        const stringified = ("0000000000000000000000000000000000000000000000000000000000000000" + value.toTwos(256).toHexString().substring(2)).slice(-64);
        for (let i = 0; i < stringified.length; i += 2) {
            result[i / 2] = Number.parseInt(stringified[i] + stringified[i + 1], 16);
        }
        return result;
    };

    decodeLargeUnsignedInteger = (data: Bytes32): ethers.utils.BigNumber => new ethers.utils.BigNumber(data);

    call = async (transaction: Transaction<ethers.utils.BigNumber>): Promise<Uint8Array> => {
        const ethersTransaction: ethers.providers.TransactionRequest = {
            to: transaction.to.to0xString(),
            data: transaction.data.to0xString(),
            value: transaction.value
        };
        const stringResult = await this.provider.call(ethersTransaction);
        return new Bytes(stringResult.length / 2 - 1).from(stringResult);
    };

    submitTransaction = async (transaction: Transaction<ethers.utils.BigNumber>): Promise<TransactionReceipt> => {
        const ethersTransaction: ethers.providers.TransactionRequest = {
            to: transaction.to.to0xString(),
            data: transaction.data.to0xString(),
            value: transaction.value
        };
        // https://github.com/ethers-io/ethers.js/issues/321
        const gasEstimate = (await this.provider.estimateGas(ethersTransaction)).toNumber();
        // TODO: figure out a way to propagate a warning up to the user when we truncate the gas estimate, we don't currently have a mechanism for error propagation, so will require infrastructure work
        ethersTransaction.gasLimit = Math.min(Math.max(Math.round(gasEstimate * 1.3), 250000), 7500000);
        if (this.gasPrice) {
            ethersTransaction.gasPrice = ethers.utils.bigNumberify(this.gasPrice);
        }

        const ethersReceipt = await (await this.signer.sendTransaction(ethersTransaction)).wait();
        // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
        const receipt: TransactionReceipt = {
            success: !!ethersReceipt.status,
            events: ethersReceipt.logs!.map(ethersEvent => ({
                topics: ethersEvent.topics.map(ethersTopic => new Bytes32().from(ethersTopic)),
                data: new Bytes(ethersEvent.data.length / 2 - 1).from(ethersEvent.data)
            }))
        };
        return receipt;
    }
}

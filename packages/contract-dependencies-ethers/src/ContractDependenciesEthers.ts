import {Dependencies, AbiFunction, AbiParameter, Transaction, TransactionReceipt} from 'contract-dependencies';
import {ethers} from 'ethers'

export interface EthersSigner {
    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
    getAddress(): Promise<string>;
}

export interface EthersProvider {
    call(transaction: Transaction<ethers.utils.BigNumber>): Promise<string>;
    listAccounts(): Promise<string[]>;
}

export class ContractDependenciesEthers implements Dependencies<ethers.utils.BigNumber> {
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

    public keccak256(utf8String: string): string {
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(utf8String));
    }

    public encodeParams(abiFunction: AbiFunction, parameters: Array<any>): string {
        return this.abiCoder.encode(abiFunction.inputs, parameters).substr(2);
    }

    public decodeParams(abiParameters: Array<AbiParameter>, encoded: string): any[] {
        return this.abiCoder.decode(abiParameters, encoded);
    }

    public async call(transaction: Transaction<ethers.utils.BigNumber>): Promise<string> {
        return await this.provider.call(transaction);
    }

    public async getDefaultAddress(): Promise<string> {
        if (this.signer) {
            return await this.signer.getAddress();
        }
        
        const addresses = await this.provider.listAccounts();
        if (addresses.length > 0) return addresses[0];

        return <string>this.address;
    }

    public async submitTransaction(transaction: Transaction<ethers.utils.BigNumber>): Promise<TransactionReceipt> {
        if (!this.signer) throw new Error("Attempting to sign a transaction while not providing a signer");
        // TODO: figure out a way to propagate a warning up to the user in this scenario, we don't currently have a mechanism for error propagation, so will require infrastructure work
        const receipt = await (await this.signer.sendTransaction(transaction)).wait();
        // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
        return <TransactionReceipt>receipt
    }
}

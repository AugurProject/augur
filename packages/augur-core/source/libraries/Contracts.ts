import * as _ from 'lodash';
import { Abi } from 'ethereum';
import { CompilerOutput } from 'solc';

export class ContractData {
    public readonly relativeFilePath: string;
    public readonly contractName: string;
    public readonly abi: Abi;
    public readonly bytecode: Buffer;
    public address?: string;

    public constructor(relativeFilePath: string, contractName: string, abi: Abi, bytecode: Buffer) {
        this.relativeFilePath = relativeFilePath;
        this.contractName = contractName;
        this.abi = abi;
        this.bytecode = bytecode;
    }
}

export class Contracts implements Iterable<ContractData> {
    private readonly contracts = new Map<string, ContractData>();

    public constructor(compilerOutput: CompilerOutput) {
        console.log(`Processing ${_.size(compilerOutput.contracts)} contracts`);
        for (let relativeFilePath in compilerOutput.contracts) {
            for (let contractName in compilerOutput.contracts[relativeFilePath]) {
                console.log(`Processing contract: ${contractName}`);
                const bytecode = Buffer.from(compilerOutput.contracts[relativeFilePath][contractName].evm.bytecode.object, 'hex');
                const compiledContract = new ContractData(relativeFilePath, contractName, compilerOutput.contracts[relativeFilePath][contractName].abi, bytecode);
                this.contracts.set(contractName, compiledContract);
            }
        }
    }

    public has = (contractName: string): boolean => {
        return this.contracts.has(contractName);
    }

    public get = (contractName: string): ContractData => {
        if (!this.contracts.has(contractName)) throw new Error(`${contractName} does not exist.`);
        return this.contracts.get(contractName)!;
    }

    [Symbol.iterator](): Iterator<ContractData> {
        const contracts = this.contracts.values();
        return { next: contracts.next.bind(contracts) }
    }
}

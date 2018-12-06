import * as fs from "async-file";
import { ContractCompiler } from "./ContractCompiler";
import { CompilerOutput } from "solc";
import { CompilerConfiguration } from './CompilerConfiguration';

import { generateContractInterfaces }  from "solidity-typescript-generator";

export class ContractInterfaceGenerator {
    private readonly compiler: ContractCompiler;
    private readonly configuration: CompilerConfiguration;

    public constructor(configuration: CompilerConfiguration, compiler: ContractCompiler) {
        this.compiler = compiler;
        this.configuration = configuration;
    }

    public async generateContractInterfaces(): Promise<String> {
        const {contracts}: CompilerOutput = await this.compiler.compileContracts();
        const fileContents: String = generateContractInterfaces({
            contracts
        });
        await fs.writeFile(this.configuration.contractInterfacesOutputPath, fileContents);
        return fileContents;
    }
}

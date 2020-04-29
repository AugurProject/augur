import * as fs from "async-file";
import { ContractCompiler } from "./ContractCompiler";
import {GenerateReplacementTypesForGenerics} from "./GenerateReplacementTypesForGenerics";

import { CompilerOutput } from "solc";
import { CompilerConfiguration } from './CompilerConfiguration';

import { generateContractInterfaces }  from "@augurproject/solidity-typescript-generator";

export class ContractInterfaceGenerator {
    private readonly compiler: ContractCompiler;
    private readonly configuration: CompilerConfiguration;

    public constructor(configuration: CompilerConfiguration, compiler: ContractCompiler) {
        this.compiler = compiler;
        this.configuration = configuration;
    }

    public async generateContractInterfaces(): Promise<void> {
        const {contracts}: CompilerOutput = await this.compiler.compileContracts();
        const genericFileContents: string = generateContractInterfaces({
            contracts
        });

        const g = new GenerateReplacementTypesForGenerics();
        g.parse(genericFileContents);
        const fileContents = g.buildAliases(this.configuration.genericContractInterfacesOutputPath);

        await fs.writeFile(this.configuration.genericContractInterfacesOutputPath, genericFileContents);
        await fs.writeFile(this.configuration.contractInterfacesOutputPath, fileContents);
        return;
    }
}

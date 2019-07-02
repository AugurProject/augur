import * as path from 'path';

export class CompilerConfiguration {
    public readonly contractSourceRoot: string;
    public readonly outputRoot: string;
    public readonly genericContractInterfacesOutputPath: string;
    public readonly contractInterfacesOutputPath: string;
    public readonly abiOutputPath: string;
    public readonly contractOutputPath: string;
    public readonly fullContractOutputPath: string
    public readonly enableSdb: boolean;
    public readonly useFlattener: boolean;

    public constructor(contractSourceRoot: string, outputRoot: string, enableSdb: boolean = false, useFlattener: boolean = false) {
        const contractInterfacesFileName = 'ContractInterfaces.ts';

        this.contractSourceRoot = contractSourceRoot;
        this.outputRoot = outputRoot;

        this.genericContractInterfacesOutputPath = path.join(contractSourceRoot, '../libraries', `Generic${contractInterfacesFileName}`);
        this.contractInterfacesOutputPath = path.join(contractSourceRoot, '../libraries', contractInterfacesFileName);

        this.abiOutputPath = path.join(outputRoot, 'abi.json');
        this.contractOutputPath = path.join(outputRoot, 'contracts.json');
        this.fullContractOutputPath = path.join(outputRoot, 'contracts_full.json');
        this.enableSdb = enableSdb;
        this.useFlattener = useFlattener;
    }

    public static create(): CompilerConfiguration {
        const contractSourceRoot = (typeof process.env.INPUT_PATH === "undefined") ? path.join(__dirname, "../../source/contracts/") : path.join(__dirname, "../../coverageEnv/");
        const outputRoot = (typeof process.env.OUTPUT_PATH === "undefined") ? path.join(__dirname, "../../output/contracts/") : path.normalize(<string> process.env.OUTPUT_PATH);
        const useFlattener = (typeof process.env.TESTRPC === "undefined") ? true : process.env.TESTRPC !== "true";
        const enableSdb = (typeof process.env.ENABLE_SOLIDITY_DEBUG === "undefined") ? false : process.env.ENABLE_SOLIDITY_DEBUG === "true";

        return new CompilerConfiguration(contractSourceRoot, outputRoot, enableSdb, useFlattener);
    }
}

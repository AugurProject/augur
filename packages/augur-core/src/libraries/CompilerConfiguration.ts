import * as path from 'path';

export class CompilerConfiguration {
    readonly contractSourceRoot: string;
    readonly outputRoot: string;
    readonly genericContractInterfacesOutputPath: string;
    readonly contractInterfacesOutputPath: string;
    readonly abiOutputPath: string;
    readonly contractOutputPath: string;
    readonly fullContractOutputPath: string;
    readonly enableSdb: boolean;
    readonly useFlattener: boolean;

    constructor(
        contractSourceRoot: string,
        outputRoot: string,
        enableSdb = false,
        useFlattener = false
    ) {
        const contractInterfacesFileName = 'ContractInterfaces.ts';

        this.contractSourceRoot = contractSourceRoot;
        this.outputRoot = outputRoot;

        this.genericContractInterfacesOutputPath = path.join(
            contractSourceRoot,
            '../libraries',
            `Generic${contractInterfacesFileName}`
        );
        this.contractInterfacesOutputPath = path.join(
            contractSourceRoot,
            '../libraries',
            contractInterfacesFileName
        );

        this.abiOutputPath = path.join(outputRoot, 'abi.json');
        this.contractOutputPath = path.join(outputRoot, 'contracts.json');
        this.fullContractOutputPath = path.join(
            outputRoot,
            'contracts_full.json'
        );
        this.enableSdb = enableSdb;
        this.useFlattener = useFlattener;
    }

    static create(): CompilerConfiguration {
        const contractSourceRoot =
            typeof process.env.INPUT_PATH === 'undefined'
                ? path.join(__dirname, '../../src/contracts/')
                : path.join(__dirname, '../../coverageEnv/');
        const outputRoot =
            typeof process.env.OUTPUT_PATH === 'undefined'
                ? path.join(__dirname, '../../output/contracts/')
                : path.normalize(process.env.OUTPUT_PATH as string);
        const useFlattener =
            typeof process.env.TESTRPC === 'undefined'
                ? true
                : process.env.TESTRPC !== 'true';
        const enableSdb =
            typeof process.env.ENABLE_SOLIDITY_DEBUG === 'undefined'
                ? false
                : process.env.ENABLE_SOLIDITY_DEBUG === 'true';

        return new CompilerConfiguration(
            contractSourceRoot,
            outputRoot,
            enableSdb,
            useFlattener
        );
    }
}

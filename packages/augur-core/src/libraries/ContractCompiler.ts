import * as fs from 'async-file';
import * as path from 'path';
import { recursiveReadDir } from './HelperFunctions';
import { CompilerInput, CompilerOutput, CompilerOutputEvmBytecode } from 'solc';
import { Abi } from 'ethereum';
import { ChildProcess, exec, spawn } from 'child_process';
import { format } from 'util';
import { CompilerConfiguration } from './CompilerConfiguration';
import { INTERNAL_CONTRACTS, EXTERNAL_CONTRACTS, TEST_CONTRACTS } from './constants';

interface AbiOutput {
    [contract: string]: Abi;
}

export class ContractCompiler {
    private readonly configuration: CompilerConfiguration;
    private readonly flattenerBin = 'solidity_flattener';
    private readonly flattenerCommand: string;

    constructor(configuration: CompilerConfiguration) {
        this.configuration = configuration;
        this.flattenerCommand = `${this.flattenerBin} --solc-paths="ROOT=%s/" --allow-path . %s`;
    }

    private async getCommandOutputFromInput(childProcess: ChildProcess, stdin: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (childProcess.stdout === null || childProcess.stdin === null || childProcess.stderr == null) {
                throw Error('ChildProcess fields stdin, stdout, and stderr must not be null.');
            }

            const buffers: Buffer[] = [];
            childProcess.stdout.on('data', (data: Buffer) => {
                buffers.push(data);
            });
            const errorBuffers: Buffer[] = [];
            childProcess.stderr.on('data', (data: Buffer) => {
                errorBuffers.push(data);
            });
            childProcess.on('close', code => {
                const errorMessage = Buffer.concat(errorBuffers).toString();
                if (code > 0) return reject(new Error(`Process Exit Code ${code}\n${errorMessage}`));
                return resolve(Buffer.concat(buffers).toString());
            });
            childProcess.stdin.write(stdin);
            childProcess.stdin.end();
        })
    }

    private async compileCustomWrapper(compilerInputJson: CompilerInput): Promise<CompilerOutput> {
        const childProcess = spawn('solc', ['--standard-json']);
        const compilerOutputJson = await this.getCommandOutputFromInput(childProcess, JSON.stringify(compilerInputJson));
        return JSON.parse(compilerOutputJson);
    }

    private async getCompilerVersion() {
      const childProcess = spawn('solc', ['--version']);
      /*
        Example output:
          solc, the solidity compiler commandline interface
          Version: 0.5.15+commit.5a6ea5b1.Darwin.appleclang
     */
      const output = await this.getCommandOutputFromInput(childProcess, '');
      try {
        return output.split('\n')[1].replace('Version: ', '').split('.').slice(0,4).join('.');
      } catch {
        return 'Unable to retrieve solc version. Please ensure version format has not changed.';
      }
    }

    async compileContracts(): Promise<CompilerOutput> {
        // Check if all contracts are cached (and thus do not need to be compiled)
        try {
            if (!this.configuration.enableSdb) {
                const stats = await fs.stat(this.configuration.contractOutputPath);
                const lastCompiledTimestamp = stats.mtime;
                const ignoreCachedFile = (file: string, stats: fs.Stats): boolean => (stats.isFile() && path.extname(file) !== '.sol') || (stats.isFile() && path.extname(file) === '.sol' && stats.mtime < lastCompiledTimestamp);
                const uncachedFiles = await recursiveReadDir(this.configuration.contractSourceRoot, ignoreCachedFile);
                if (uncachedFiles.length === 0) {
                    return JSON.parse(await fs.readFile(this.configuration.contractOutputPath, 'utf8'));
                }
            }
        } catch {
            // Unable to read compiled contracts output file (likely because it has not been generated)
        }

        console.log('Compiling contracts, this may take a minute...');

        // Compile all contracts in the specified input directory
        const compilerInputJson = await this.generateCompilerInput();
        const compilerVersion = await this.getCompilerVersion();
        const compilerOutput = await this.compileCustomWrapper(compilerInputJson);

        if (compilerOutput.errors) {
            let errors = '';

            for (const error of compilerOutput.errors) {
                // FIXME: https://github.com/ethereum/solidity/issues/3273
                if (error.message.includes('instruction is only available after the Metropolis hard fork')) continue;
                if (error.message.includes('Experimental features are turned on. Do not use experimental features on live deployments')) continue;
                if (error.message.includes('This declaration shadows an existing declaration')) continue;
                if (error.message.includes('Unused local variable')) continue;
                if (error.message.includes('Unused function parameter')) continue;
                if (error.message.includes('The Yul optimiser is still experimental')) continue;
                errors += error.formattedMessage + '\n';
            }

            if (errors.length > 0) {
                throw new Error('The following errors/warnings were returned by solc:\n\n' + errors);
            }
        }

        // Create output directory (if it doesn't exist)
        await fs.mkdirp(path.dirname(this.configuration.contractOutputPath));

        // Output all contract data to single file (used for generating documentation markdown files)
        await fs.writeFile(this.configuration.fullContractOutputPath, JSON.stringify({
          compilerVersion,
          ...compilerOutput,
        }, null, '\t'));

        // Output filtered contract data to single file
        const filteredCompilerOutput = this.filterCompilerOutput(compilerOutput);
        await fs.writeFile(this.configuration.contractOutputPath, JSON.stringify({
          compilerVersion,
          ...filteredCompilerOutput,
        }, null, '\t'));

        // Output abi data to a single file
        const abiOutput = this.generateAbiOutput(filteredCompilerOutput);
        await fs.writeFile(this.configuration.abiOutputPath, JSON.stringify(abiOutput, null, '\t'));

        return filteredCompilerOutput;
    }

    async generateFlattenedSolidity(filePath: string): Promise<string> {
        const relativeFilePath = filePath.replace(this.configuration.contractSourceRoot, '').replace(/\\/g, '/');

        const formattedCommand = format(this.flattenerCommand, this.configuration.contractSourceRoot, relativeFilePath);
        const childProcess = exec(formattedCommand, {
            encoding: 'buffer',
            cwd: this.configuration.contractSourceRoot
        });
        // The flattener removes the pragma experimental line from output so we add it back here
        let result = await this.getCommandOutputFromInput(childProcess, '');
        const originalFileData = (await fs.readFile(filePath)).toString('utf8');
        if (result === '') {
            throw new Error(`Failed to flatten ${filePath}`);
        }
        if (originalFileData.includes('pragma experimental ABIEncoderV2')) {
            result = 'pragma experimental ABIEncoderV2;\n' + result;
        }
        return result;
    }

    async generateCompilerInput(): Promise<CompilerInput> {
        const ignoreFile = (file: string, stats: fs.Stats): boolean => {
            const allowedFilenames = INTERNAL_CONTRACTS.concat(EXTERNAL_CONTRACTS).concat(TEST_CONTRACTS);
            const name = path.parse(file).base.replace('.sol', '');
            if (!allowedFilenames.includes(name)) return true;
            return stats.isFile() && path.extname(file) !== '.sol';
        };
        const filePaths = await recursiveReadDir(this.configuration.contractSourceRoot, ignoreFile);
        let filesPromises: Array<Promise<string>>;
        if (this.configuration.useFlattener) {
            filesPromises = filePaths.map(async filePath => (this.generateFlattenedSolidity(filePath)));
        } else {
            filesPromises = filePaths.map(async filePath => (await fs.readFile(filePath)).toString('utf8'));
        }
        const files = await Promise.all(filesPromises);

        const inputJson: CompilerInput = {
            language: 'Solidity',
            settings: {
                remappings: [ `ROOT=${this.configuration.contractSourceRoot}/`],
                optimizer: {
                    enabled: true,
                    runs: 200,
                    details: {
                        yul: true,
                        deduplicate: true,
                        cse: true,
                        constantOptimizer: true
                    }
                },
                outputSelection: {
                    '*': {
                        '': [ 'ast' ],
                        '*': [ 'abi', 'devdoc', 'userdoc', 'evm.bytecode.object', 'evm.methodIdentifiers' ]
                    }
                }
            },
            sources: {}
        };
        for (const file in files) {
            const filePath = filePaths[file].replace(this.configuration.contractSourceRoot, '').replace(/\\/g, '/').replace(/^\//, '');
            inputJson.sources[filePath] = { content : files[file] };
        }

        return inputJson;
    }

    private filterCompilerOutput(compilerOutput: CompilerOutput): CompilerOutput {
        const result: CompilerOutput = { contracts: {} };
        for (const relativeFilePath in compilerOutput.contracts) {
            for (const contractName in compilerOutput.contracts[relativeFilePath]) {
                // don't include libraries
                if (relativeFilePath.startsWith('libraries/') && contractName !== 'Delegator' && contractName !== 'Map') continue;
                // don't include embedded libraries
                if (!(relativeFilePath === `${contractName}.sol` || relativeFilePath.endsWith(`/${contractName}.sol`))) continue;
                const contract = compilerOutput.contracts[relativeFilePath][contractName];
                const abi = contract.abi;
                if (abi === undefined) continue;
                const bytecode = contract.evm.bytecode;
                if (bytecode.object === undefined) continue;
                // don't include interfaces or Abstract contracts
                if (/^(?:I|Base|DS)[A-Z].*/.test(contractName)) continue;
                if (bytecode.object.length === 0) throw new Error('Contract: ' + contractName + " has no bytecode, but this is not expected. It probably doesn't implement all its abstract methods");

                result.contracts[relativeFilePath] = {
                    [contractName]: {
                        abi,
                        evm: { bytecode: { object: bytecode.object } }
                    }
                };

                if (this.configuration.enableSdb) {
                    const deployedBytecode = contract.evm.deployedBytecode;
                    if (deployedBytecode === undefined || deployedBytecode.object === undefined || deployedBytecode.sourceMap === undefined) continue;
                    if (bytecode.sourceMap === undefined) continue;
                    const methodIdentifiers = contract.evm.methodIdentifiers;
                    if (methodIdentifiers === undefined) continue;
                    result.contracts[relativeFilePath][contractName].evm.bytecode.sourceMap = bytecode.sourceMap;
                    result.contracts[relativeFilePath][contractName].evm.deployedBytecode = ({
                        object: deployedBytecode.object,
                        sourceMap: deployedBytecode.sourceMap
                    } as CompilerOutputEvmBytecode);
                    result.contracts[relativeFilePath][contractName].evm.methodIdentifiers = JSON.parse(JSON.stringify(methodIdentifiers));
                }
            }
        }

        if (this.configuration.enableSdb && compilerOutput.sources !== undefined) {
            result.sources = {};
            for (const relativeFilePath in compilerOutput.sources) {
                if (relativeFilePath in result.contracts) {
                    // only legacyAST is used, but including ast to be compliant with interface
                    result.sources[relativeFilePath] = {
                        id: compilerOutput.sources[relativeFilePath].id,
                        ast: JSON.parse(JSON.stringify(compilerOutput.sources[relativeFilePath].legacyAST)),
                        legacyAST: JSON.parse(JSON.stringify(compilerOutput.sources[relativeFilePath].legacyAST))
                    }
                }
            }
        }

        return result;
    }

    private generateAbiOutput(compilerOutput: CompilerOutput): AbiOutput {
        const result: AbiOutput = {};
        for (const relativeFilePath in compilerOutput.contracts) {
            for (const contractName in compilerOutput.contracts[relativeFilePath]) {
                result[contractName] = compilerOutput.contracts[relativeFilePath][contractName].abi;
            }
        }

        return result;
    }
}

import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { CompilerOutput } from 'solc';
import { DeployerConfiguration } from './DeployerConfiguration';
import { Augur, AugurTrading, } from './ContractInterfaces';
import { NetworkConfiguration } from './NetworkConfiguration';
import { Contracts, ContractData } from './Contracts';
import { Dependencies, Contract, AbiFunction } from '../libraries/GenericContractInterfaces';
import { TRADING_CONTRACTS } from './ContractDeployer';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const SUCCESS = "";

const INTERNAL_CONTRACTS = [
    "Market",
];

const EXTERNAL_CONTRACTS = [
    "ZeroXExchange",
];

const INITIALIZED_CONTRACTS = [
    "OICash",
];

export class DeploymentVerifier {
    private readonly configuration: DeployerConfiguration;
    private readonly contracts: Contracts;
    private readonly dependencies: Dependencies<BigNumber>
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly augur: Augur;
    private readonly augurTrading: AugurTrading;

    static verifyDeployment = async (augurAddress: string, augurTradingAddress: string, dependencies: Dependencies<BigNumber>, provider: ethers.providers.JsonRpcProvider, deployerConfiguration: DeployerConfiguration): Promise<string> => {
        const compilerOutput = JSON.parse(await readFile(deployerConfiguration.contractInputPath, 'utf8'));
        const verifier = new DeploymentVerifier(augurAddress, augurTradingAddress, deployerConfiguration, dependencies, provider, compilerOutput);
        return await verifier.doVerification();
    }

    constructor(augurAddress: string, augurTradingAddress: string, configuration: DeployerConfiguration, dependencies: Dependencies<BigNumber>, provider: ethers.providers.JsonRpcProvider, compilerOutput: CompilerOutput) {
        this.augur = new Augur(this.dependencies, augurAddress);
        this.augurTrading = new AugurTrading(this.dependencies, augurTradingAddress);
        this.configuration = configuration;
        this.dependencies = dependencies;
        this.provider = provider;
        this.contracts = new Contracts(compilerOutput);
    }

    async doVerification(): Promise<string> {
        let error = await this.verifyDeploymentIsOver();
        if (error) return error;

        error = await this.verifyByteCode();
        if (error) return error;

        error = await this.verifyExternalAddresses();
        if (error) return error;

        error = await this.verifyInitializations();
        
        return error;
    }

    // Verify deployment is ended for Augur and Augur Trading
    async verifyDeploymentIsOver(): Promise<string> {
        const augurUploader = await this.augur.uploader_();
        const augurTradingUploader = await this.augurTrading.uploader_();

        if (augurUploader !== NULL_ADDRESS) return "DEPLOYMENT NOT FINISHED FOR AUGUR";
        if (augurTradingUploader !== NULL_ADDRESS) return "DEPLOYMENT NOT FINISHED FOR AUGUR TRADING";
        return SUCCESS;
    }

    async getContractAddress(registryName: string): Promise<string> {
        if (registryName in TRADING_CONTRACTS) {
            return await this.augurTrading.lookup_(registryName);
        }
        return await this.augur.lookup_(registryName);
    }

    // Verify bytecode of all internal registered contracts
    async verifyByteCode(): Promise<string> {
        for (const registryName in INTERNAL_CONTRACTS) {
            const contractData = this.contracts.get(registryName);
            const expectedByteCode = contractData.bytecode.toString();
            const registeredAddress = await this.getContractAddress(registryName);
            const actualByteCode = await this.provider.getCode(registeredAddress);
            if (expectedByteCode !== actualByteCode) return `CONTRACT ${registryName} HAS INCORRECT BYTECODE`;
        }
        return SUCCESS;
    }

    // Verify addresses of all external registered contracts
    async verifyExternalAddresses(): Promise<string> {
        for (const name in EXTERNAL_CONTRACTS) {
            const expectedAddress = this.configuration.externalAddresses[name];
            // If an external address wasn't specified it means we're uploading a test version and this is verifying a test network, so don't bother verifying this
            if (!expectedAddress) continue;
            const registeredAddress = await this.getContractAddress(name);
            if (expectedAddress !== registeredAddress) return `CONTRACT ${name} HAS INCORRECT ADDRESS REGISTERED`;
        }
        return SUCCESS;
    }

    // Verify all initializable contracts are initialized
    async verifyInitializations(): Promise<string> {
        for (const name in INITIALIZED_CONTRACTS) {
            const contractData = this.contracts.get(name);
            const contract = new Initializable(this.dependencies, contractData.address);
            const initialized = await contract.getInitialized_();
            if (!initialized) return `CONTRACT ${name} was not initialized`;
        }
        return SUCCESS;
    }
}

export class Initializable extends Contract<BigNumber> {
    public constructor(dependencies: Dependencies<BigNumber>, address: string) {
		super(dependencies, address)
    }
    
    public getInitialized_ = async (options?: { sender?: string }): Promise<boolean> => {
		options = options || {}
		const abi: AbiFunction = {"constant":true,"inputs":[],"name":"getInitialized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}
		const result = await this.localCall(abi, [], options.sender)
		return <boolean>result[0]
	}
}

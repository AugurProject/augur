import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { CompilerOutput } from 'solc';
import {
    GovToken,
    Timelock,
    Governance,
    OINexus,
    FeePotStakingRewards,
} from "./ContractInterfaces";
import { Contracts, ContractData } from './Contracts';
import { Dependencies, ParaUniverse } from './GenericContractInterfaces';
import { GovernanceAddresses, SDKConfiguration, mergeConfig } from '@augurproject/utils';
import { updateConfig } from "@augurproject/artifacts";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export class GovernanceDeployer {
    private readonly configuration: SDKConfiguration;
    private readonly contracts: Contracts;
    private readonly dependencies: Dependencies<BigNumber>;
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly signer: ethers.Signer;
    private governanceAddress: string;
    private govTokenAddress: string;
    private timelockAddress: string;
    private initialStakingRewardsAddress: string;
    private feePotAddress: string;
    cashAddress: string = null;

    static deployToNetwork = async (env: string, config: SDKConfiguration, dependencies: Dependencies<BigNumber>, provider: ethers.providers.JsonRpcProvider,signer: ethers.Signer, cashAddress: string) => {
        const compilerOutput = JSON.parse(await readFile(config.deploy.contractInputPath, 'utf8'));
        const contractDeployer = new GovernanceDeployer(config, dependencies, provider, signer, compilerOutput);

        console.log(`\n\n-----------------
Deploying to: ${env}
    compiled contracts: ${config.deploy.contractInputPath}
`);
        await contractDeployer.deploy(env, cashAddress);
    };

    constructor(configuration: SDKConfiguration, dependencies: Dependencies<BigNumber>, provider: ethers.providers.JsonRpcProvider, signer: ethers.Signer, compilerOutput: CompilerOutput) {
        this.configuration = configuration;
        this.dependencies = dependencies;
        this.provider = provider;
        this.signer = signer;
        this.contracts = new Contracts(compilerOutput);

        if (!configuration.deploy) {
            throw Error('ContractDeployer configuration must include "deploy" config.');
        } else if (typeof configuration.deploy.externalAddresses === 'undefined') {
            configuration.deploy.externalAddresses = {};
        }
    }

    async getBlockNumber(): Promise<number> {
        return this.provider.getBlock('latest', false).then( (block) => block.number);
    }

    async deploy(env: string, cashAddress: string): Promise<void> {
        const blockNumber = await this.getBlockNumber();

        this.cashAddress = cashAddress;
        const coreAddresses = this.configuration.addresses;
        const paraAddresses = this.configuration.paraDeploys[cashAddress];
        const deployer = await this.signer.getAddress();

        // Deploy Gov Token
        this.govTokenAddress = await this.construct(this.contracts.get("GovToken"), [deployer]);

        // Deploy Timelock
        this.timelockAddress = await this.construct(this.contracts.get("Timelock"), [deployer]);

        // Deploy Initial Staking Rewards
        const paraUniverse = await new ParaUniverse(this.dependencies, paraAddresses.addresses.Universe);
        this.feePotAddress = await paraUniverse.getFeePot_();
        this.initialStakingRewardsAddress = await this.construct(this.contracts.get("FeePotStakingRewards"), [deployer, deployer, this.govTokenAddress, this.feePotAddress])

        // Deploy Governance
        this.governanceAddress = await this.construct(this.contracts.get("Governance"), [this.timelockAddress, this.govTokenAddress]);

        // Cede Timelock
        console.log("Transferring ownership of Timelock");
        const timelock = new Timelock(this.dependencies, this.timelockAddress);
        await timelock.setAdmin(this.governanceAddress);

        // Cede Gov Token
        console.log("Transferring ownership of Gov Token");
        const govToken = new GovToken(this.dependencies, this.govTokenAddress);
        await govToken.transferOwnership(this.timelockAddress);

        // Cede OINexus
        console.log("Transferring ownership of OINexus");
        const nexus = new OINexus(this.dependencies, coreAddresses.OINexus);
        await nexus.transferOwnership(this.timelockAddress);

        // Cede Initial Staking
        console.log("Transferring ownership of Initial Staking Rewards");
        const initialStakingRewards = new FeePotStakingRewards(this.dependencies, this.initialStakingRewardsAddress);
        await initialStakingRewards.transferOwnership(this.timelockAddress);

        console.log('Writing artifacts');
        if (this.configuration.deploy.writeArtifacts) {
          await this.generateLocalEnvFile(env, blockNumber, this.configuration);
        }
    }

    getContractAddress = (contractName: string): string => {
        if (!this.contracts.has(contractName)) throw new Error(`Contract named ${contractName} does not exist.`);
        const contract = this.contracts.get(contractName);
        if (contract.address === undefined) throw new Error(`Contract name ${contractName} has not yet been uploaded.`);
        return contract.address;
    };

    private async construct(contract: ContractData, constructorArgs: string[]): Promise<string> {
        console.log(`Upload contract: ${contract.contractName}`);
        const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, this.signer);
        const contractObj = await factory.deploy(...constructorArgs);
        await contractObj.deployed();
        console.log(`Uploaded contract: ${contract.contractName}: \"${contractObj.address}\"`);
        return contractObj.address;
    }

    private async generateLocalEnvFile(env: string, uploadBlockNumber: number, config: SDKConfiguration): Promise<void> {
        const addresses: GovernanceAddresses = {
            GovToken: this.govTokenAddress,
            Timelock: this.timelockAddress,
            Governance: this.governanceAddress,
            InitialStakingRewards: this.initialStakingRewardsAddress,
            FeePot: this.feePotAddress,
        };

        const governanceConfig = {
            governance: {
                uploadBlockNumber,
                addresses
            }
        }

        await updateConfig(env, mergeConfig(config, governanceConfig));
    }
}

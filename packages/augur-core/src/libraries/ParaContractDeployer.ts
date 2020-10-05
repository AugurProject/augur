import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { CompilerOutput } from 'solc';
import { OINexus } from './ContractInterfaces';
import { Contracts, ContractData } from './Contracts';
import { Dependencies, ParaDeployer } from './GenericContractInterfaces';
import { SDKConfiguration, mergeConfig } from '@augurproject/utils';
import { updateConfig } from '@augurproject/artifacts';
import { Block, BlockTag } from 'ethers/providers/abstract-provider';

const CONTRACTS = [
    "FeePotFactory",
    "ParaUniverseFactory",
    "ParaOICashFactory",
    "ParaOICash",
    "OINexus",
    "ParaAugurFactory",
    "ParaAugurTradingFactory",
    "ParaShareTokenFactory",
    "ParaRepOracleFactory",
    "CancelOrderFactory",
    "CreateOrderFactory",
    "FillOrderFactory",
    "OrdersFactory",
    "ProfitLossFactory",
    "SimulateTradeFactory",
    "TradeFactory",
    "ZeroXTradeFactory"
]

export interface BlockGetter {
    getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>, includeTransactions?: boolean): Promise<Block>;
}

export class ParaContractDeployer {
    private readonly contracts: Contracts;

    static deployToNetwork = async (env: string, config: SDKConfiguration, dependencies: Dependencies<BigNumber>, provider: BlockGetter, signer: ethers.Signer) => {
        const compilerOutput = JSON.parse(await readFile(config.deploy.contractInputPath, 'utf8'));
        const contractDeployer = new ParaContractDeployer(config, dependencies, provider, signer, compilerOutput);

        console.log(`\n\n-----------------
Deploying to: ${env}
    compiled contracts: ${config.deploy.contractInputPath}
`);
        await contractDeployer.deploy(env);
    };

    constructor(
        private readonly configuration: SDKConfiguration,
        private readonly dependencies: Dependencies<BigNumber>,
        private readonly provider: BlockGetter,
        private readonly signer: ethers.Signer,
        compilerOutput: CompilerOutput,
    ) {
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

    async deploy(env: string): Promise<void> {
        const blockNumber = await this.getBlockNumber();

        const addresses = {};

        for (const contractName of CONTRACTS) {
            console.log(`Deploying ${contractName}.`);
            const contract = this.contracts.get(contractName);
            const address = await this.construct(contract, []);
            addresses[contractName] = address;
            console.log(`${contractName} uploaded at address: ${address}`);
        }

        const paraDeployerAddress = await this.construct(this.contracts.get("ParaDeployer"), [
            this.configuration.addresses.Augur,
            addresses["FeePotFactory"],
            addresses["ParaUniverseFactory"],
            addresses["ParaOICashFactory"],
            addresses["ParaOICash"],
            addresses["OINexus"],
            this.configuration.addresses.Exchange,
            this.configuration.addresses.WETH9,
            [
                addresses["ParaAugurFactory"],
                addresses["ParaAugurTradingFactory"],
                addresses["ParaShareTokenFactory"],
                addresses["ParaRepOracleFactory"],
                addresses["CancelOrderFactory"],
                addresses["CreateOrderFactory"],
                addresses["FillOrderFactory"],
                addresses["OrdersFactory"],
                addresses["ProfitLossFactory"],
                addresses["SimulateTradeFactory"],
                addresses["TradeFactory"],
                addresses["ZeroXTradeFactory"]
            ]
        ])

        const oiNexus = new OINexus(this.dependencies, addresses["OINexus"]);
        oiNexus.transferOwnership(paraDeployerAddress)
        const paraDeployer = new ParaDeployer(this.dependencies, paraDeployerAddress);
        // TODO add more tokens?
        await paraDeployer.addToken(this.configuration.addresses.WETH9, new BigNumber(10**19));

        if (!this.configuration.deploy.writeArtifacts) return;

        await updateConfig(env, mergeConfig(this.configuration, {'addresses': {"ParaDeployer": paraDeployerAddress}}));
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
}

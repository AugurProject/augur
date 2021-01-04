import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { CompilerOutput } from 'solc';
import { OINexus } from './ContractInterfaces';
import { Contracts, ContractData } from './Contracts';
import { Dependencies, ParaDeployer } from './GenericContractInterfaces';
import { SDKConfiguration, mergeConfig, ParaAddresses } from '@augurproject/utils';
import { updateConfig } from '@augurproject/artifacts';
import { Block, BlockTag } from '@ethersproject/providers';
import {ContractAddresses, validConfigOrDie} from '@augurproject/utils/build';

const CONTRACTS = [
    "FeePotFactory",
    "ParaUniverseFactory",
    "ParaOICashFactory",
    "ParaOICash",
    "OINexus",
    "ParaAugurFactory",
    "ParaAugurTradingFactory",
    "ParaShareTokenFactory",
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
        return this.provider.getBlock('latest').then( (block) => block.number);
    }

    async deploy(env: string): Promise<SDKConfiguration> {
        const addresses = {};

        for (const contractName of CONTRACTS) {
            console.log(`Deploying ${contractName}.`);
            const contract = this.contracts.get(contractName);
            let constructorArgs = [];
            if (contractName == "OINexus") {
                constructorArgs = [this.configuration.addresses.WETH9, this.configuration.addresses.UniswapV2Factory]
            }
            const address = await this.construct(contract, constructorArgs);
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
        await oiNexus.transferOwnership(paraDeployerAddress)
        const paraDeployer = new ParaDeployer(this.dependencies, paraDeployerAddress);

        await paraDeployer.addToken(this.configuration.addresses.Cash, new BigNumber(10**18));
        await paraDeployer.addToken(this.configuration.addresses.WETH9, new BigNumber(10**20)); // .1 ETH min
        await paraDeployer.addToken(this.configuration.addresses.USDC, new BigNumber(10**30)); // 6 decimals
        await paraDeployer.addToken(this.configuration.addresses.USDT, new BigNumber(10**30)); // 6 decimals

        if (this.configuration.deploy.isProduction) {
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.SETH, new BigNumber(10**20)); // .1 ETH min
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.BUSD, new BigNumber(10**18));
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.TUSD, new BigNumber(10**18));
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.SUSD, new BigNumber(10**18));
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.MUSD, new BigNumber(10**18));
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.WBTC, new BigNumber(10**31)); // 8 decimals // .01 BTC
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.renBTC, new BigNumber(10**31)); // 8 decimals // .01 BTC
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.SBTC, new BigNumber(10**21)); // .01 BTC
            await paraDeployer.addToken(this.configuration.deploy.externalAddresses.TBTC, new BigNumber(10**21)); // .01 BTC
        }

        const config = validConfigOrDie(mergeConfig(this.configuration, {'addresses': {
            "ParaDeployer": paraDeployerAddress,
            "OINexus": addresses["OINexus"]
        }}));
        if (this.configuration.deploy.writeArtifacts) {
            await updateConfig(env, config);
        }

        return config;
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
        console.log(`"${contract.contractName}: \"${contractObj.address}\"`);
        return contractObj.address;
    }
}

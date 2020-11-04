import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { CompilerOutput } from 'solc';
import { SideChainAugur, SideChainShareToken, SideChainAugurTrading, SideChainFillOrder, SideChainProfitLoss, SideChainZeroXTrade, SideChainSimulateTrade } from './ContractInterfaces';
import { stringTo32ByteHex } from './HelperFunctions';
import { Contracts, ContractData } from './Contracts';
import { Dependencies } from './GenericContractInterfaces';
import { SDKConfiguration, mergeConfig, SideChainDeploy } from '@augurproject/utils';
import { updateConfig } from '@augurproject/artifacts';
import { Block, BlockTag } from '@ethersproject/providers';

const CONTRACTS = [
    "SideChainAugur",
    "SideChainShareToken",
    "SideChainAugurTrading",
    "SideChainFillOrder",
    "SideChainProfitLoss",
    "SideChainZeroXTrade",
    "SideChainSimulateTrade",
    "Affiliates",
]

export interface BlockGetter {
    getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>, includeTransactions?: boolean): Promise<Block>;
}

export class SideChainDeployer {
    private readonly contracts: Contracts;

    static deployToNetwork = async (env: string, config: SDKConfiguration, dependencies: Dependencies<BigNumber>, provider: BlockGetter, signer: ethers.Signer) => {
        const compilerOutput = JSON.parse(await readFile(config.deploy.contractInputPath, 'utf8'));
        const contractDeployer = new SideChainDeployer(config, dependencies, provider, signer, compilerOutput);

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

    async deploy(env: string): Promise<SideChainDeploy> {
        const blockNumber = await this.getBlockNumber();

        let sideChainExternalAddresses = this.configuration.deploy.sideChainExternalAddresses;
        const addresses = {};

        if (!this.configuration.deploy.isProduction) {
            const sideChainCashAddress = await this.construct(this.contracts.get("Cash"), []);
            const augurPushBridgeAddress = await this.construct(this.contracts.get("AugurPushBridge"), []);
            const testBridgeContractAddress = await this.construct(this.contracts.get("TestBridgeContract"), [sideChainCashAddress, this.configuration.addresses.OICash, this.configuration.addresses.Universe, augurPushBridgeAddress]);
            sideChainExternalAddresses = {
                Cash: sideChainCashAddress,
                MarketGetter: testBridgeContractAddress,
                RepFeeTarget: testBridgeContractAddress,
                ZeroXExchange: this.configuration.addresses.Exchange
            }
        } else if (!sideChainExternalAddresses) {
            throw new Error("Must provoide sidechain external addresses!");
        }

        for (const contractName of CONTRACTS) {
            console.log(`Deploying ${contractName}.`);
            const contract = this.contracts.get(contractName);
            let constructorArgs = [];
            if (contractName === "SideChainAugurTrading") {
                constructorArgs = [addresses["SideChainAugur"]];
            }
            const address = await this.construct(contract, constructorArgs);
            addresses[contractName] = address;
            console.log(`${contractName} uploaded at address: ${address}`);
        }

        const sideChainAugur = new SideChainAugur(this.dependencies, addresses["SideChainAugur"]);
        const sideChainAugurTrading = new SideChainAugurTrading(this.dependencies, addresses["SideChainAugurTrading"]);

        await sideChainAugur.registerContract(stringTo32ByteHex("Cash"), sideChainExternalAddresses.Cash);
        await sideChainAugur.registerContract(stringTo32ByteHex("ShareToken"), addresses["SideChainShareToken"]);
        await sideChainAugur.registerContract(stringTo32ByteHex("Affiliates"), addresses["Affiliates"]);
        await sideChainAugur.registerContract(stringTo32ByteHex("MarketGetter"), sideChainExternalAddresses.MarketGetter);
        await sideChainAugur.registerContract(stringTo32ByteHex("RepFeeTarget"), sideChainExternalAddresses.RepFeeTarget);

        await sideChainAugurTrading.registerContract(stringTo32ByteHex("FillOrder"), addresses["SideChainFillOrder"]);
        await sideChainAugurTrading.registerContract(stringTo32ByteHex("ZeroXTrade"), addresses["SideChainZeroXTrade"]);
        await sideChainAugurTrading.registerContract(stringTo32ByteHex("ProfitLoss"), addresses["SideChainProfitLoss"]);
        await sideChainAugurTrading.registerContract(stringTo32ByteHex("ZeroXExchange"), sideChainExternalAddresses.ZeroXExchange);

        const sideChainShareToken = new SideChainShareToken(this.dependencies, addresses["SideChainShareToken"]);
        const sideChainFillOrder = new SideChainFillOrder(this.dependencies, addresses["SideChainFillOrder"]);
        const sideChainZeroXTrade = new SideChainZeroXTrade(this.dependencies, addresses["SideChainZeroXTrade"]);
        const sideChainProfitLoss = new SideChainProfitLoss(this.dependencies, addresses["SideChainProfitLoss"]);
        const sideChainSimulateTrade = new SideChainSimulateTrade(this.dependencies, addresses["SideChainSimulateTrade"]);

        await sideChainShareToken.initialize(sideChainAugur.address);
        await sideChainFillOrder.initialize(sideChainAugur.address, sideChainAugurTrading.address);
        await sideChainZeroXTrade.initialize(sideChainAugur.address, sideChainAugurTrading.address);
        await sideChainProfitLoss.initialize(sideChainAugur.address, sideChainAugurTrading.address);
        await sideChainSimulateTrade.initialize(sideChainAugur.address, sideChainAugurTrading.address);

        const sideChain: SideChainDeploy = {
            uploadBlockNumber: blockNumber,
            addresses: {
                Augur: addresses["SideChainAugur"],
                Universe: this.configuration.addresses.Universe,
                ShareToken: addresses["SideChainShareToken"],
                Cash: sideChainExternalAddresses.Cash,
                Affiliates: addresses["Affiliates"],
                AugurTrading: addresses["SideChainAugurTrading"],
                FillOrder: addresses["SideChainFillOrder"],
                SimulateTrade: addresses["SideChainSimulateTrade"],
                ZeroXTrade: addresses["SideChainZeroXTrade"],
                ProfitLoss: addresses["SideChainProfitLoss"],
                MarketGetter: sideChainExternalAddresses.MarketGetter,
                RepFeeTarget: sideChainExternalAddresses.RepFeeTarget
            }
        }

        if (this.configuration.deploy.writeArtifacts) {
            await updateConfig(env, mergeConfig(this.configuration, {
                sideChain
            }));
        }

        return sideChain;
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

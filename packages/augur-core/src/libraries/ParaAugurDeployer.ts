import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { CompilerOutput } from 'solc';
import {
    // Para
    ParaDeployer,
    ParaAugur,
    ParaAugurTrading,
    ParaUniverse,
    Cash
} from './ContractInterfaces';
import { Contracts, ContractData } from './Contracts';
import { Dependencies } from './GenericContractInterfaces';
import { ParaAddresses, ParaDeploys, SDKConfiguration, mergeConfig } from '@augurproject/utils';
import { updateConfig } from '@augurproject/artifacts';
import { Block, BlockTag } from '@ethersproject/providers';
import { stringTo32ByteHex } from './HelperFunctions';


export interface BlockGetter {
    getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>, includeTransactions?: boolean): Promise<Block>;
}

export class ParaAugurDeployer {
    private readonly contracts: Contracts;
    cashAddress: string = null;
    paraDeployer: ParaDeployer = null;

    static deployToNetwork = async (env: string, config: SDKConfiguration, dependencies: Dependencies<BigNumber>, provider: BlockGetter, signer: ethers.Signer, cashAddress: string) => {
        const compilerOutput = JSON.parse(await readFile(config.deploy.contractInputPath, 'utf8'));
        const contractDeployer = new ParaAugurDeployer(config, dependencies, provider, signer, compilerOutput);

        console.log(`\n\n-----------------
Deploying to: ${env}
    compiled contracts: ${config.deploy.contractInputPath}
`);
        await contractDeployer.deploy(env, cashAddress);
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

    async deploy(env: string, cashAddress: string): Promise<ParaDeploys> {
        const blockNumber = await this.getBlockNumber();
        this.cashAddress = cashAddress;

        this.paraDeployer = new ParaDeployer(this.dependencies, this.configuration.addresses.ParaDeployer);
        let deployProgress = new BigNumber(await this.paraDeployer.paraDeployProgress_(cashAddress));
        while (deployProgress.lt(14)) {
            console.log(`Deploy Progress: ${deployProgress}`);
            await this.paraDeployer.progressDeployment(cashAddress);
            deployProgress = new BigNumber(await this.paraDeployer.paraDeployProgress_(cashAddress));
        }
        const configUpdate = await this.generateAddressBlock(env, blockNumber, this.configuration);

        console.log('Writing artifacts');
        if (this.configuration.deploy.writeArtifacts) {
            await updateConfig(env, mergeConfig(this.configuration, configUpdate))
        }

        return configUpdate;
    }

    private async generateAddressBlock(env: string, uploadBlockNumber: number, config: SDKConfiguration): Promise<ParaDeploys> {
        const cash = new Cash(this.dependencies, this.cashAddress);
        const paraAugur = new ParaAugur(this.dependencies, await this.paraDeployer.paraAugurs_(this.cashAddress));
        const paraAugurTrading = new ParaAugurTrading(this.dependencies, await this.paraDeployer.paraAugurTradings_(this.cashAddress));
        const universeAddress = await paraAugur.genesisUniverse_();
        const paraUniverse = new ParaUniverse(this.dependencies, universeAddress);
        const OICashAddress = await paraUniverse.openInterestCash_();

        const addresses: ParaAddresses = {
            Augur: paraAugur.address,
            AugurTrading: paraAugurTrading.address,
            Universe: universeAddress,
            Cash: cash.address,
            ShareToken: await paraAugur.lookup_(stringTo32ByteHex("ShareToken")),
            OICash: OICashAddress,
            CancelOrder: await paraAugurTrading.lookup_(stringTo32ByteHex("CancelOrder")),
            CreateOrder: await paraAugurTrading.lookup_(stringTo32ByteHex("CreateOrder")),
            FillOrder: await paraAugurTrading.lookup_(stringTo32ByteHex("FillOrder")),
            Orders: await paraAugurTrading.lookup_(stringTo32ByteHex("Orders")),
            Trade: await paraAugurTrading.lookup_(stringTo32ByteHex("Trade")),
            SimulateTrade: await paraAugurTrading.lookup_(stringTo32ByteHex("SimulateTrade")),
            ZeroXTrade: await paraAugurTrading.lookup_(stringTo32ByteHex("ZeroXTrade")),
            ProfitLoss: await paraAugurTrading.lookup_(stringTo32ByteHex("ProfitLoss"))
        };

        const name = await cash.symbol_();
        const decimals = await cash.decimals_();

        return {
            [cash.address]: {
                name,
                decimals,
                uploadBlockNumber,
                addresses,
            }
        };
    }
}

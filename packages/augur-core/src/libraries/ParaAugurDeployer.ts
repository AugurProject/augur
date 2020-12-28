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
import { Contracts } from './Contracts';
import { Dependencies } from './GenericContractInterfaces';
import { ParaAddresses, SDKConfiguration, mergeConfig, ParaDeploy, validConfigOrDie } from '@augurproject/utils';
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

    async deploy(env: string, cashAddress: string): Promise<ParaDeploy> {
        const blockNumber = await this.getBlockNumber();
        this.cashAddress = cashAddress;

        this.paraDeployer = new ParaDeployer(this.dependencies, this.configuration.addresses.ParaDeployer);

        let deployProgress = 0;
        while (deployProgress < 13) {
            const reportedProgress = new BigNumber(await this.paraDeployer.paraDeployProgress_(cashAddress)).toNumber();
            deployProgress = reportedProgress !== 1 ? reportedProgress : deployProgress + 1;
            console.log(`Deploy Progress: ${deployProgress}`);
            await this.paraDeployer.progressDeployment(cashAddress);
        }

        console.log('Writing artifacts');
        if (this.configuration.deploy.writeArtifacts) {
          return this.generateLocalEnvFile(env, blockNumber, this.configuration);
        } else {
            return this.buildParaDeploy(blockNumber);
        }
    }

    async buildParaDeploy(uploadBlockNumber: number): Promise<ParaDeploy> {
        const addresses = await this.buildParaAddresses();
        const cash = new Cash(this.dependencies, this.cashAddress);

        const name = await cash.symbol_();
        const decimals = await cash.decimals_();

        return {
            name,
            decimals,
            uploadBlockNumber,
            addresses,
        };
    }

    async buildParaAddresses(): Promise<ParaAddresses> {
        const cash = new Cash(this.dependencies, this.cashAddress);
        const paraAugur = new ParaAugur(this.dependencies, await this.paraDeployer.paraAugurs_(this.cashAddress));
        const paraAugurTrading = new ParaAugurTrading(this.dependencies, await this.paraDeployer.paraAugurTradings_(this.cashAddress));
        const universeAddress = await paraAugur.genesisUniverse_();
        const paraUniverse = new ParaUniverse(this.dependencies, universeAddress);
        const OICashAddress = await paraUniverse.openInterestCash_();

        return {
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
    }

    static mergeParaIntoConfig(cashAddress: string, para: ParaDeploy, config: SDKConfiguration): SDKConfiguration {
        return validConfigOrDie(mergeConfig(config, {
            paraDeploys: {
                [cashAddress]: para
            }
        }))
    }

    private async generateLocalEnvFile(env: string, uploadBlockNumber: number, config: SDKConfiguration): Promise<ParaDeploy> {
        const paraDeploy = await this.buildParaDeploy(uploadBlockNumber);
        const cash = new Cash(this.dependencies, this.cashAddress);
        await updateConfig(env, ParaAugurDeployer.mergeParaIntoConfig(cash.address, paraDeploy, config));
        return paraDeploy;
    }
}

import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { stringTo32ByteHex, resolveAll, sleep } from './HelperFunctions';
import { CompilerOutput } from 'solc';
import {
    // Para
    ParaAugur,
    ParaShareToken,
    ParaRepOracle,
    ParaUniverse,
    OINexus,
    ParaAugurTrading,
    ParaZeroXTrade,
    //Normal
    Trade,
    CreateOrder,
    CancelOrder,
    FillOrder,
    Orders,
    Cash,
    ProfitLoss,
    SimulateTrade,
} from './ContractInterfaces';
import { Contracts, ContractData } from './Contracts';
import { Dependencies } from './GenericContractInterfaces';
import { ParaAddresses, SDKConfiguration, mergeConfig } from '@augurproject/utils';
import { updateConfig } from '@augurproject/artifacts';
import { TRADING_CONTRACTS } from './constants';
import { Block, BlockTag } from 'ethers/providers/abstract-provider';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface BlockGetter {
    getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>, includeTransactions?: boolean): Promise<Block>;
}

export class ParaContractDeployer {
    private readonly contracts: Contracts;
    augur: ParaAugur|null = null;
    augurTrading: ParaAugurTrading|null = null;
    universe: ParaUniverse|null = null;
    cashAddress: string = null;

    static deployToNetwork = async (env: string, config: SDKConfiguration, dependencies: Dependencies<BigNumber>, provider: BlockGetter, signer: ethers.Signer, cashAddress: string) => {
        const compilerOutput = JSON.parse(await readFile(config.deploy.contractInputPath, 'utf8'));
        const contractDeployer = new ParaContractDeployer(config, dependencies, provider, signer, compilerOutput);

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
        return this.provider.getBlock('latest', false).then( (block) => block.number);
    }

    async deploy(env: string, cashAddress: string): Promise<void> {
        const blockNumber = await this.getBlockNumber();
        this.augur = await this.uploadParaAugur();
        this.augurTrading = await this.uploadAugurTrading();
        await this.uploadAllContracts();

        this.cashAddress = cashAddress;
        const coreAddresses = this.configuration.addresses;

        // Cash
        console.log(`Registering Cash Contract at ${cashAddress}`);
        await this.augur!.registerContract(stringTo32ByteHex('Cash'), cashAddress);
        await this.augurTrading!.registerContract(stringTo32ByteHex('Cash'), cashAddress);

        // OI Nexus
        if (!coreAddresses.OINexus) {
            console.log(`No OINexus in configuration. Deploying one.`);
            const OINexusContract = this.contracts.get("OINexus");
            await this.upload(OINexusContract);
            coreAddresses.OINexus = OINexusContract.address;
            console.log(`OINexus uploaded and registered at address: ${coreAddresses.OINexus}`);
        } else {
            await this.augur!.registerContract(stringTo32ByteHex('OINexus'), coreAddresses.OINexus);
        }

        // Augur Trading registrations
        await this.augurTrading!.registerContract(stringTo32ByteHex('WETH9'), coreAddresses.WETH9);
        await this.augurTrading!.registerContract(stringTo32ByteHex('ZeroXExchange'), coreAddresses.Exchange);

        await this.initializeAllContracts();

        await this.doTradingApprovals();

        console.log('Adding Para Augur to OINexus');
        // NOTE: This requires the deployer of OINexus be the deployer of this
        const nexus = new OINexus(this.dependencies, coreAddresses.OINexus);
        await nexus.addParaAugur(this.augur.address);

        console.log('Creating genesis para universe');
        this.universe = await this.createGenesisParaUniverse();

        // Handle some things that make testing less erorr prone that will need to occur naturally in production
        if (!this.configuration.deploy.isProduction) {
            const cash = new Cash(this.dependencies, this.cashAddress);

            console.log('Approving Augur');
            const authority = this.augur!.address;
            await cash.approve(authority, new BigNumber(2).pow(256).minus(new BigNumber(1)));
        }

        console.log('Writing artifacts');
        if (this.configuration.deploy.writeArtifacts) {
          await this.generateLocalEnvFile(env, blockNumber, this.configuration);
        }

        console.log('Finalizing deployment');
        await this.augur.finishDeployment();
        await this.augurTrading.finishDeployment();
    }

    getContractAddress = (contractName: string): string => {
        if (!this.contracts.has(contractName)) throw new Error(`Contract named ${contractName} does not exist.`);
        const contract = this.contracts.get(contractName);
        if (contract.address === undefined) throw new Error(`Contract name ${contractName} has not yet been uploaded.`);
        return contract.address;
    };

    private async uploadParaAugur(): Promise<ParaAugur> {
        console.log('Uploading para augur...');
        const contract = await this.contracts.get('ParaAugur');
        const address = await this.construct(contract, [this.configuration.addresses.Augur]);
        const augur = new ParaAugur(this.dependencies, address);
        const ownerAddress = await augur.uploader_();
        contract.address = address;
        if (ownerAddress.toLowerCase() !== (await this.signer.getAddress()).toLowerCase()) {
            throw new Error('Augur owner does not equal from address');
        }
        console.log(`Augur address: ${augur.address}`);
        return augur;
    }

    private async uploadAugurTrading(): Promise<ParaAugurTrading> {
        console.log('Uploading Augur Trading...');
        const contract = await this.contracts.get('ParaAugurTrading');
        const address = await this.construct(contract, [this.augur!.address]);
        const augurTrading = new ParaAugurTrading(this.dependencies, address);
        const ownerAddress = await augurTrading.uploader_();
        contract.address = address;
        if (ownerAddress.toLowerCase() !== (await this.signer.getAddress()).toLowerCase()) {
            throw new Error('Augur Trading owner does not equal from address');
        }
        console.log(`Augur Trading address: ${augurTrading.address}`);
        return augurTrading;
    }

    private async uploadAllContracts(): Promise<void> {
        console.log('Uploading contracts...');

        const contractsToDeploy = [
            'FeePotFactory',
            'ParaOICashFactory',
            'ParaUniverseFactory',
            'ParaOICash',
            'ParaRepOracle',
            'ParaShareToken',
            'CreateOrder',
            'FillOrder',
            'CancelOrder',
            'Trade',
            'Orders',
            'ParaZeroXTrade',
            'ProfitLoss',
            'SimulateTrade',
        ]

        if (this.configuration.deploy.serial) { // needed for deploy to ganache
          for (const contractName of contractsToDeploy) {
            const contract = this.contracts.get(contractName);
            await this.upload(contract);
          }
        } else {
          const promises: Array<Promise<void>> = [];
          for (const contractName of contractsToDeploy) {
            const contract = this.contracts.get(contractName);
            promises.push(this.upload(contract));
          }
          await resolveAll(promises);
        }
    }

    private async upload(contract: ContractData): Promise<void> {
        let contractName = contract.contractName;
        if (contractName === 'ParaShareToken') contractName = 'ShareToken';
        if (contractName === 'ParaZeroXTrade') contractName = 'ZeroXTrade';
        console.log(`Uploading new version of contract for ${contractName}`);
        contract.address = await this.uploadAndAddToAugur(contract, contractName, []);
    }

    private async uploadAndAddToAugur(contract: ContractData, registrationContractName: string = contract.contractName, constructorArgs: any[] = []): Promise<string> {
        if (TRADING_CONTRACTS.includes(registrationContractName)) {
            const alreadyRegisteredAddress = await this.augurTrading!.lookup_(stringTo32ByteHex(registrationContractName));
            if (alreadyRegisteredAddress !== NULL_ADDRESS) {
                return alreadyRegisteredAddress;
            }
        } else {
            const alreadyRegisteredAddress = await this.augur!.lookup_(stringTo32ByteHex(registrationContractName));
            if (alreadyRegisteredAddress !== NULL_ADDRESS) {
                return alreadyRegisteredAddress;
            }
        }
        const address = await this.construct(contract, constructorArgs);
        await this.registerContract(registrationContractName, address);
        return address;
    }

    private async registerContract(registrationContractName: string, address: string): Promise<void> {
        if (TRADING_CONTRACTS.includes(registrationContractName)) {
            await this.augurTrading!.registerContract(stringTo32ByteHex(registrationContractName), address);
        } else {
            await this.augur!.registerContract(stringTo32ByteHex(registrationContractName), address);
        }
    }

    private async construct(contract: ContractData, constructorArgs: string[]): Promise<string> {
        console.log(`Upload contract: ${contract.contractName}`);
        const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, this.signer);
        const contractObj = await factory.deploy(...constructorArgs);
        await contractObj.deployed();
        console.log(`Uploaded contract: ${contract.contractName}: \"${contractObj.address}\"`);
        return contractObj.address;
    }

    private async initializeAllContracts(): Promise<void> {
        console.log('Initializing contracts...');

        const readiedPromises = [
            async () => {
                const contract = new CreateOrder(this.dependencies, await this.getContractAddress('CreateOrder'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing CreateOrder contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized CreateOrder contract');
            },
            async () => {
                const contract = new FillOrder(this.dependencies, await this.getContractAddress('FillOrder'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing FillOrder contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized FillOrder contract');
            },
            async () => {
                const contract = new ProfitLoss(this.dependencies, await this.getContractAddress('ProfitLoss'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing ProfitLoss contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized ProfitLoss contract');
            },
            async () => {
                const contract = new CancelOrder(this.dependencies, await this.getContractAddress('CancelOrder'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing CancelOrder contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized CancelOrder contract');
            },
            async () => {
                const contract = new Trade(this.dependencies, await this.getContractAddress('Trade'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing Trade contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized Trade contract');
            },
            async () => {
                const contract = new ParaShareToken(this.dependencies, await this.getContractAddress('ParaShareToken'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing ShareToken contract');
                await contract.initialize(this.augur!.address, this.configuration.addresses.ShareToken);
                console.log('Initialized ShareToken contract');
            },
            async () => {
                const contract = new Orders(this.dependencies, await this.getContractAddress('Orders'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing Orders contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized Orders contract');
            },
            async () => {
                const contract = new ParaZeroXTrade(this.dependencies, await this.getContractAddress('ParaZeroXTrade'));
                console.log('Checking ZeroXTrade for initialized status');
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing ZeroXTrade contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized ZeroXTrade contract');
            },
            async () => {
                const contract = new ParaRepOracle(this.dependencies, await this.getContractAddress('ParaRepOracle'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing RepOracle contract');
                await contract.initialize(this.augur!.address);
                console.log('Initialized RepOracle contract');
            },
            async () => {
                const contract = new SimulateTrade(this.dependencies, await this.getContractAddress('SimulateTrade'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing SimulateTrade contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized SimulateTrade contract');
            },
        ];

        if (this.configuration.deploy.serial) {
            for (const p of readiedPromises) {
                await p();
            }
        } else {
            await resolveAll(readiedPromises.map((p) => p()));
        }
    }

    private async doTradingApprovals(): Promise<void> {
        console.log('Doing trade approvals...');
        const augurTradingContract = this.augurTrading?.address;
        const augurTrading = new ParaAugurTrading(this.dependencies, augurTradingContract);
        await augurTrading.doApprovals();
    }

    private async createGenesisParaUniverse(): Promise<ParaUniverse> {
        console.log('Creating genesis para universe...');
        const universeAddress = await this.augur.generateParaUniverse_(this.configuration.addresses.Universe);
        if (!universeAddress || universeAddress === '0x') {
            throw new Error('Unable to create genesis para universe. eth_call failed');
        }
        await this.augur.generateParaUniverse(this.configuration.addresses.Universe);
        const universe = new ParaUniverse(this.dependencies, universeAddress);
        console.log(`Genesis para universe address: ${universe.address}`);

        return universe;
    }

    private async generateLocalEnvFile(env: string, uploadBlockNumber: number, config: SDKConfiguration): Promise<void> {
        const cash = new Cash(this.dependencies, this.cashAddress);
        const paraUniverse = new ParaUniverse(this.dependencies, this.universe.address);
        const OICashAddress = await paraUniverse.openInterestCash_();

        const addresses: ParaAddresses = {
            Augur: this.augur!.address,
            AugurTrading: this.augurTrading!.address,
            Universe: this.universe.address,
            Cash: cash.address,
            ShareToken: this.contracts.get('ParaShareToken').address!,
            OICash: OICashAddress,
            CancelOrder: this.contracts.get('CancelOrder').address!,
            CreateOrder: this.contracts.get('CreateOrder').address!,
            FillOrder: this.contracts.get('FillOrder').address!,
            Orders: this.contracts.get('Orders').address!,
            Trade: this.contracts.get('Trade').address!,
            SimulateTrade: this.contracts.get('SimulateTrade').address!,
            ZeroXTrade: this.contracts.get('ParaZeroXTrade').address!,
            ProfitLoss: this.contracts.get('ProfitLoss').address!
        };

        const name = await cash.symbol_();

        const configUpdate = {
            paraDeploys: {
                [cash.address]: {
                    name,
                    uploadBlockNumber,
                    addresses,
                }
            }
        };

        if (!config.addresses.OINexus) {
            configUpdate['addresses'] = {
                OINexus: this.contracts.get('OINexus').address!
            }
        }

        await updateConfig(env, mergeConfig(config, configUpdate));
    }
}

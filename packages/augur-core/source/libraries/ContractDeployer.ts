import BN = require('bn.js');
import { exists, readFile, writeFile } from "async-file";
import { encodeParams } from 'ethjs-abi';
import { stringTo32ByteHex, resolveAll } from "./HelperFunctions";
import { CompilerOutput } from "solc";
import { Abi, AbiFunction } from 'ethereum';
import { DeployerConfiguration } from './DeployerConfiguration';
import { Connector } from './Connector';
import { Augur, ContractFactory, Universe, ReputationToken, LegacyReputationToken, TimeControlled, Contract, CompleteSets, Trade, CreateOrder, CancelOrder, FillOrder, Orders, ClaimTradingProceeds, Cash } from './ContractInterfaces';
import { NetworkConfiguration } from './NetworkConfiguration';
import { AccountManager } from './AccountManager';
import { Contracts, ContractData } from './Contracts';


export class ContractDeployer {
    private readonly accountManager: AccountManager;
    private readonly configuration: DeployerConfiguration;
    private readonly connector: Connector;
    private readonly contracts: Contracts;
    public augur: Augur|null = null;
    public universe: Universe|null = null;

    public static deployToNetwork = async (networkConfiguration: NetworkConfiguration, deployerConfiguration: DeployerConfiguration) => {
        const connector = new Connector(networkConfiguration);
        const accountManager = new AccountManager(connector, networkConfiguration.privateKey);

        const compilerOutput = JSON.parse(await readFile(deployerConfiguration.contractInputPath, "utf8"));
        const contractDeployer = new ContractDeployer(deployerConfiguration, connector, accountManager, compilerOutput);

        console.log(`\n\n-----------------
Deploying to: ${networkConfiguration.networkName}
    compiled contracts: ${deployerConfiguration.contractInputPath}
    contract address: ${deployerConfiguration.contractAddressesOutputPath}
    upload blocks #s: ${deployerConfiguration.uploadBlockNumbersOutputPath}
`);
        await contractDeployer.deploy();
    }

    public constructor(configuration: DeployerConfiguration, connector: Connector, accountManager: AccountManager, compilerOutput: CompilerOutput) {
        this.configuration = configuration;
        this.connector = connector;
        this.accountManager = accountManager;
        this.contracts = new Contracts(compilerOutput);
    }

    public async getBlockNumber(): Promise<number> {
        return this.connector.ethjsQuery.getBlockByNumber('latest', false).then( (block) => block.number.toNumber());
    }

    public async deploy(): Promise<{ [name: string]: string }> {
        const blockNumber = await this.getBlockNumber();
        this.augur = await this.uploadAugur();
        await this.uploadAllContracts();

        if (this.configuration.isProduction) {
            console.log(`Registering Legacy Rep Contract at ${this.configuration.legacyRepAddress}`);
            await this.augur!.registerContract(stringTo32ByteHex("LegacyReputationToken"), this.configuration.legacyRepAddress);
            const contract = await this.contracts.get("LegacyReputationToken");
            contract.address = this.configuration.legacyRepAddress;
        }

        await this.initializeAllContracts();

        if (!this.configuration.useNormalTime) {
            await this.resetTimeControlled();
        }

        if(this.configuration.createGenesisUniverse) {
            if (!this.configuration.isProduction) {
                console.log("Initializing legacy REP");
                await this.initializeLegacyRep();
            }

            this.universe = await this.createGenesisUniverse();

            if (!this.configuration.isProduction) {
                console.log("Migrating from legacy REP");
                await this.migrateFromLegacyRep();
            }
        }

        await this.generateUploadBlockNumberFile(blockNumber);
        await this.generateAddressMappingFile();

        return this.generateCompleteAddressMapping();
    }

    private generateCompleteAddressMapping(): { [name: string]: string } {
        const mapping: { [name: string]: string } = {};
        mapping['Augur'] = this.augur!.address;
        if (this.universe) mapping['Universe'] = this.universe.address;
        if (this.contracts.get('Augur').address === undefined) throw new Error(`Augur not uploaded.`);
        mapping['Augur'] = this.contracts.get('Augur').address!;
        mapping['LegacyReputationToken'] = this.contracts.get('LegacyReputationToken').address!;
        for (let contract of this.contracts) {
            if (/^I[A-Z].*/.test(contract.contractName)) continue;
            if (contract.contractName === 'TimeControlled') continue;
            if (contract.contractName === 'Universe') continue;
            if (contract.contractName === 'ReputationToken') continue;
            if (contract.contractName === 'TestNetReputationToken') continue;
            if (contract.contractName === 'Time') contract = this.configuration.useNormalTime ? contract: this.contracts.get('TimeControlled');
            if (contract.contractName === 'ReputationTokenFactory') contract = this.configuration.useNormalTime ? contract: this.contracts.get('TestNetReputationTokenFactory');
            if (contract.relativeFilePath.startsWith('legacy_reputation/')) continue;
            if (contract.relativeFilePath.startsWith('external/')) continue;
            if (contract.contractName !== 'Map' && contract.relativeFilePath.startsWith('libraries/')) continue;
            if (contract.address === undefined) throw new Error(`${contract.contractName} not uploaded.`);
            mapping[contract.contractName] = contract.address;
        }
        return mapping;
    }

    public getContract = (contractName: string): Contract => {
        if (!this.contracts.has(contractName)) throw new Error(`Contract named ${contractName} does not exist.`);
        const contract = this.contracts.get(contractName);
        if (contract.address === undefined) throw new Error(`Contract name ${contractName} has not yet been uploaded.`);
        const contractObj = ContractFactory(this.connector, this.accountManager, contract.address, this.connector.gasPrice);
        return contractObj;
    }

    private static getEncodedConstructData(abi: Abi, bytecode: Buffer, constructorArgs: Array<string>): Buffer {
        if (constructorArgs.length === 0) {
            return bytecode;
        }
        // TODO: submit a TypeScript bug that it can't deduce the type is AbiFunction|undefined here
        const constructorSignature = <AbiFunction|undefined>abi.find(signature => signature.type === 'constructor');
        if (typeof constructorSignature === 'undefined') throw new Error(`ABI did not contain a constructor.`);
        const constructorInputTypes = constructorSignature.inputs.map(x => x.type);
        const encodedConstructorParameters = Buffer.from(encodeParams(constructorInputTypes, constructorArgs).substring(2), 'hex');
        return Buffer.concat([bytecode, encodedConstructorParameters]);
    }

    private async uploadAugur(): Promise<Augur> {
        console.log('Uploading augur...');
        const contract = await this.contracts.get("Augur");
        const address = (this.configuration.augurAddress !== undefined)
            ? this.configuration.augurAddress
            : await this.construct(this.contracts.get('Augur'), [], `Uploading Augur.sol`);
        const augur = new Augur(this.connector, this.accountManager, address, this.connector.gasPrice);
        const ownerAddress = await augur.uploader_();
        contract.address = address;
        if (ownerAddress.toLowerCase() !== this.accountManager.defaultAddress.toLowerCase()) {
            throw new Error("Augur owner does not equal from address");
        }
        console.log(`Augur address: ${augur.address}`);
        return augur;
    }

    public async uploadLegacyRep(): Promise<string> {
        const contract = await this.contracts.get("LegacyReputationToken");
        contract.address = await this.construct(contract, [], `Uploading LegacyReputationToken`);
        return contract.address;
    }

    private async uploadAllContracts(): Promise<void> {
        console.log('Uploading contracts...');
        const promises: Array<Promise<any>> = [];
        for (let contract of this.contracts) {
            promises.push(this.upload(contract));
        }
        await resolveAll(promises);
    }

    private async upload(contract: ContractData): Promise<void> {
        const contractName = contract.contractName
        if (contractName === 'Augur') return;
        if (contractName === 'Delegator') return;
        if (contractName === 'TimeControlled') return;
        if (contractName === 'TestNetReputationTokenFactory') return;
        if (contractName === 'Augur') return;
        if (contractName === 'Universe') return;
        if (contractName === 'ReputationToken') return;
        if (contractName === 'TestNetReputationToken') return;
        if (contractName === 'Time') contract = this.configuration.useNormalTime ? contract : this.contracts.get('TimeControlled');
        if (contractName === 'ReputationTokenFactory') contract = this.configuration.isProduction ? contract : this.contracts.get('TestNetReputationTokenFactory');
        if (contract.relativeFilePath.startsWith('legacy_reputation/')) return;
        if (this.configuration.isProduction && contractName === 'LegacyReputationToken') return;
        if (contractName !== 'Map' && contract.relativeFilePath.startsWith('libraries/')) return;
        console.log(`Uploading new version of contract for ${contractName}`);
        contract.address = await this.uploadAndAddToAugur(contract, contractName);
    }

    private async uploadAndAddToAugur(contract: ContractData, registrationContractName: string = contract.contractName, constructorArgs: Array<any> = []): Promise<string> {
        const address = await this.construct(contract, constructorArgs, `Uploading ${contract.contractName}`);
        await this.augur!.registerContract(stringTo32ByteHex(registrationContractName), address);
        return address;
    }

    private async construct(contract: ContractData, constructorArgs: Array<string>, failureDetails: string): Promise<string> {
        const data = `0x${ContractDeployer.getEncodedConstructData(contract.abi, contract.bytecode, constructorArgs).toString('hex')}`;
        const gasEstimate = await this.connector.ethjsQuery.estimateGas({ from: this.accountManager.defaultAddress, data: data });
        const nonce = await this.accountManager.nonces.get(this.accountManager.defaultAddress);
        const signedTransaction = await this.accountManager.signTransaction({ gas: gasEstimate, gasPrice: this.connector.gasPrice, data: data});
        console.log(`Upload contract: ${contract.contractName} nonce: ${nonce}, gas: ${gasEstimate}, gasPrice: ${this.connector.gasPrice}`);
        const transactionHash = await this.connector.ethjsQuery.sendRawTransaction(signedTransaction);
        const receipt = await this.connector.waitForTransactionReceipt(transactionHash, failureDetails);
        console.log(`Uploaded contract: ${contract.contractName}: \"${receipt.contractAddress}\"`);
        return receipt.contractAddress;
    }

    private async initializeAllContracts(): Promise<void> {
        console.log('Initializing contracts...');
        const promises: Array<Promise<any>> = [];

        const completeSetsContract = await this.getContract("CompleteSets");
        const completeSets = new CompleteSets(this.connector, this.accountManager, completeSetsContract.address, this.connector.gasPrice);
        promises.push(completeSets.initialize(this.augur!.address));

        const createOrderContract = await this.getContract("CreateOrder");
        const createOrder = new CreateOrder(this.connector, this.accountManager, createOrderContract.address, this.connector.gasPrice);
        promises.push(createOrder.initialize(this.augur!.address));

        const fillOrderContract = await this.getContract("FillOrder");
        const fillOrder = new FillOrder(this.connector, this.accountManager, fillOrderContract.address, this.connector.gasPrice);
        promises.push(fillOrder.initialize(this.augur!.address));

        const cancelOrderContract = await this.getContract("CancelOrder");
        const cancelOrder = new CancelOrder(this.connector, this.accountManager, cancelOrderContract.address, this.connector.gasPrice);
        promises.push(cancelOrder.initialize(this.augur!.address));

        const tradeContract = await this.getContract("Trade");
        const trade = new Trade(this.connector, this.accountManager, tradeContract.address, this.connector.gasPrice);
        promises.push(trade.initialize(this.augur!.address));

        const claimTradingProceedsContract = await this.getContract("ClaimTradingProceeds");
        const claimTradingProceeds = new ClaimTradingProceeds(this.connector, this.accountManager, claimTradingProceedsContract.address, this.connector.gasPrice);
        promises.push(claimTradingProceeds.initialize(this.augur!.address));

        const ordersContract = await this.getContract("Orders");
        const orders = new Orders(this.connector, this.accountManager, ordersContract.address, this.connector.gasPrice);
        promises.push(orders.initialize(this.augur!.address));

        const cashContract = await this.getContract("Cash");
        const cash = new Cash(this.connector, this.accountManager, cashContract.address, this.connector.gasPrice);
        promises.push(cash.initialize(this.augur!.address));

        if (!this.configuration.useNormalTime) {
            const timeContract = await this.getContract("TimeControlled");
            const time = new TimeControlled(this.connector, this.accountManager, timeContract.address, this.connector.gasPrice);
            promises.push(time.initialize(this.augur!.address));
        }

        await resolveAll(promises);
    }

    public async initializeLegacyRep(): Promise<void> {
        const legacyReputationToken = new LegacyReputationToken(this.connector, this.accountManager, this.getContract('LegacyReputationToken').address, this.connector.gasPrice);
        await legacyReputationToken.initializeERC820(this.augur!.address);
        await legacyReputationToken.faucet(new BN(10).pow(new BN(18)).mul(new BN(11000000)));
        const legacyBalance = await legacyReputationToken.balanceOf_(this.accountManager.defaultAddress);
        if (!legacyBalance || legacyBalance == new BN(0)) {
            throw new Error("Faucet call to Legacy REP failed");
        }
    }

    private async resetTimeControlled(): Promise<void> {
      console.log('Resetting Timestamp for false time...');
      const time = new TimeControlled(this.connector, this.accountManager, this.getContract("TimeControlled").address, this.connector.gasPrice);
      const currentTimestamp = await time.getTimestamp_();
      return time.setTimestamp(currentTimestamp);
    }

    private async createGenesisUniverse(): Promise<Universe> {
        console.log('Creating genesis universe...');
        const augur = new Augur(this.connector, this.accountManager, this.getContract("Augur").address, this.connector.gasPrice);
        const universeAddress = await augur.createGenesisUniverse_();
        if (!universeAddress || universeAddress == "0x") {
            throw new Error("Unable to create genesis universe. eth_call failed");
        }
        await augur.createGenesisUniverse();
        const universe = new Universe(this.connector, this.accountManager, universeAddress, this.connector.gasPrice);
        console.log(`Genesis universe address: ${universe.address}`);
        if (await universe.getTypeName_() !== stringTo32ByteHex("Universe")) {
            throw new Error("Unable to create genesis universe. Get type name failed");
        }

        return universe;
    }

    private async migrateFromLegacyRep(): Promise<void> {
        const reputationTokenAddress = await this.universe!.getReputationToken_();
        const reputationToken = new ReputationToken(this.connector, this.accountManager, reputationTokenAddress, this.connector.gasPrice);
        const legacyReputationToken = new LegacyReputationToken(this.connector, this.accountManager, this.getContract('LegacyReputationToken').address, this.connector.gasPrice);
        const legacyBalance = await legacyReputationToken.balanceOf_(this.accountManager.defaultAddress);
        await legacyReputationToken.approve(reputationTokenAddress, legacyBalance);
        await reputationToken.migrateFromLegacyReputationToken();
        const balance = await reputationToken.balanceOf_(this.accountManager.defaultAddress);
        if (!balance || balance == new BN(0)) {
            throw new Error("Migration from Legacy REP failed");
        }
    }

    private async generateAddressMapping(): Promise<string> {
        type ContractAddressMapping = { [name: string]: string };
        type NetworkAddressMapping = { [networkId: string]: ContractAddressMapping };

        const mapping: ContractAddressMapping = {};
        mapping['Augur'] = this.augur!.address;
        if (this.universe) mapping['Universe'] = this.universe.address;
        if (this.contracts.get('Augur').address === undefined) throw new Error(`Augur not uploaded.`);
        mapping['Augur'] = this.contracts.get('Augur').address!;
        mapping['LegacyReputationToken'] = this.contracts.get('LegacyReputationToken').address!;
        for (let contract of this.contracts) {
            if (!contract.relativeFilePath.startsWith('trading/')) continue;
            if (/^I[A-Z].*/.test(contract.contractName)) continue;
            if (contract.address === undefined) throw new Error(`${contract.contractName} not uploaded.`);
            mapping[contract.contractName] = contract.address;
        }

        const networkId = await this.connector.ethjsQuery.net_version();
        let addressMapping: NetworkAddressMapping  = {};
        if (await exists(this.configuration.contractAddressesOutputPath)) {
            let existingAddressFileData: string = await readFile(this.configuration.contractAddressesOutputPath, 'utf8');
            addressMapping = JSON.parse(existingAddressFileData);
        }
        addressMapping[networkId] = mapping;
        return JSON.stringify(addressMapping, null, ' ');
    }

    private async generateAddressMappingFile(): Promise<void> {
        const addressMappingJson = await this.generateAddressMapping();
        await writeFile(this.configuration.contractAddressesOutputPath, addressMappingJson, 'utf8')
    }

    private async generateUploadBlockNumberMapping(blockNumber: number): Promise<string> {
        type UploadBlockNumberMapping = { [networkId: string]: number };

        const networkId = await this.connector.ethjsQuery.net_version();
        let blockNumberMapping: UploadBlockNumberMapping  = {};
        if (await exists(this.configuration.uploadBlockNumbersOutputPath)) {
            let existingBlockNumberData: string = await readFile(this.configuration.uploadBlockNumbersOutputPath, 'utf8');
            blockNumberMapping = JSON.parse(existingBlockNumberData);
        }
        blockNumberMapping[networkId] = blockNumber;
        return JSON.stringify(blockNumberMapping, null, '  ');
    }

    private async generateUploadBlockNumberFile(blockNumber: number): Promise<void> {
        const blockNumberMapping = await this.generateUploadBlockNumberMapping(blockNumber);
        await writeFile(this.configuration.uploadBlockNumbersOutputPath, blockNumberMapping, 'utf8')
    }

}

import { ethers } from "ethers";
import { exists, readFile, writeFile } from "async-file";
import { resolveAll, stringTo32ByteHex } from "./HelperFunctions";
import { CompilerOutput } from "solc";
import { DeployerConfiguration } from "./DeployerConfiguration";
import {
    Address,
    Augur,
    Bytes32,
    CancelOrder,
    Cash,
    ClaimTradingProceeds,
    CompleteSets,
    CreateOrder,
    Dependencies,
    FillOrder,
    LegacyReputationToken,
    Orders,
    ReputationToken,
    TimeControlled,
    Trade,
    UInt256,
    Universe
} from "./ContractInterfaces";
import { NetworkConfiguration } from "./NetworkConfiguration";
import { ContractData, Contracts } from "./Contracts";

type ContractAddressMapping = { [name: string]: Address };
type NetworkAddressMapping = { [networkId: string]: ContractAddressMapping };

export class ContractDeployer {
    private readonly configuration: DeployerConfiguration;
    private readonly contracts: Contracts;
    private readonly dependencies: Dependencies<ethers.utils.BigNumber>;
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly signer: ethers.Signer;
    public augur: Augur<ethers.utils.BigNumber>|null = null;
    public universe: Universe<ethers.utils.BigNumber>|null = null;

    public static deployToNetwork = async (networkConfiguration: NetworkConfiguration, dependencies: Dependencies<ethers.utils.BigNumber>, provider: ethers.providers.JsonRpcProvider,signer: ethers.Signer, deployerConfiguration: DeployerConfiguration) => {
        const compilerOutput = JSON.parse(await readFile(deployerConfiguration.contractInputPath, "utf8"));
        const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider, signer, compilerOutput);

        console.log(`\n\n-----------------
Deploying to: ${networkConfiguration.networkName}
    compiled contracts: ${deployerConfiguration.contractInputPath}
    contract address: ${deployerConfiguration.contractAddressesOutputPath}
    upload blocks #s: ${deployerConfiguration.uploadBlockNumbersOutputPath}
`);
        await contractDeployer.deploy();
    };

    public constructor(configuration: DeployerConfiguration, dependencies: Dependencies<ethers.utils.BigNumber>, provider: ethers.providers.JsonRpcProvider, signer: ethers.Signer, compilerOutput: CompilerOutput) {
        this.configuration = configuration;
        this.dependencies = dependencies;
        this.provider = provider;
        this.signer = signer;
        this.contracts = new Contracts(compilerOutput);
    }

    public async getBlockNumber(): Promise<number> {
        return this.provider.getBlock('latest', false).then( (block) => block.number);
    }

    public async deploy(): Promise<{ [name: string]: Address }> {
        const blockNumber = await this.getBlockNumber();
        this.augur = await this.uploadAugur();
        await this.uploadAllContracts();

        if (this.configuration.isProduction) {
            console.log(`Registering Legacy Rep Contract at ${this.configuration.legacyRepAddress}`);
            await this.augur!.registerContract((new Bytes32()).from("LegacyReputationToken"), this.configuration.legacyRepAddress);
            const contract = await this.contracts.get("LegacyReputationToken");
            contract.address = (new Address()).from(this.configuration.legacyRepAddress);
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

    private generateCompleteAddressMapping(): { [name: string]: Address } {
        const mapping: ContractAddressMapping = {};
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
            if (contract.contractName === 'TestNetReputationTokenFactory') continue;
            if (contract.contractName === 'Time') contract = this.configuration.useNormalTime ? contract: this.contracts.get('TimeControlled');
            if (contract.contractName === 'ReputationTokenFactory') contract = this.configuration.isProduction ? contract: this.contracts.get('TestNetReputationTokenFactory');
            if (contract.relativeFilePath.startsWith('legacy_reputation/')) continue;
            if (contract.relativeFilePath.startsWith('external/')) continue;
            if (contract.contractName !== 'Map' && contract.relativeFilePath.startsWith('libraries/')) continue;
            if (contract.address === undefined) throw new Error(`${contract.contractName} not uploaded.`);
            mapping[contract.contractName] = contract.address;
        }
        return mapping;
    }

    public getContractAddress = (contractName: string): Address => {
        if (!this.contracts.has(contractName)) throw new Error(`Contract named ${contractName} does not exist.`);
        const contract = this.contracts.get(contractName);
        if (contract.address === undefined) throw new Error(`Contract name ${contractName} has not yet been uploaded.`);
        return contract.address;
    };

    private async uploadAugur(): Promise<Augur<ethers.utils.BigNumber>> {
        console.log('Uploading augur...');
        const contract = await this.contracts.get("Augur");
        const address = await this.construct(this.contracts.get('Augur'), []);
        const augur = new Augur(this.dependencies, address);
        const ownerAddress = await augur.uploader_();
        contract.address = address;
        if (ownerAddress.to0xString() !== (await this.signer.getAddress()).toLowerCase()) {
            throw new Error("Augur owner does not equal from address");
        }
        console.log(`Augur address: ${augur.address}`);
        return augur;
    }

    public async uploadLegacyRep(): Promise<Address> {
        const contract = await this.contracts.get("LegacyReputationToken");
        contract.address = await this.construct(contract, []);
        return contract.address;
    }

    private async uploadAllContracts() {
        console.log('Uploading contracts...');
        const promises: Array<Promise<void>> = [];
        for (let contract of this.contracts) {
            await this.upload(contract);
        }
    }

    private async upload(contract: ContractData): Promise<void> {
        const contractName = contract.contractName;
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
        contract.address = await this.uploadAndAddToAugur(contract, contractName, []);
    }

    private async uploadAndAddToAugur(contract: ContractData, registrationContractName: string = contract.contractName, constructorArgs: Array<any> = []): Promise<Address> {
        const address = await this.construct(contract, constructorArgs);
        await this.augur!.registerContract(stringTo32ByteHex(registrationContractName), address);
        return address;
    }

    private async construct(contract: ContractData, constructorArgs: Array<string>): Promise<Address> {
        console.log(`Upload contract: ${contract.contractName}`);
        const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, this.signer);

        const tx = factory.getDeployTransaction(...constructorArgs);
        const estimate = await this.provider.estimateGas(tx);

        const block = await this.provider.getBlock('latest');

        const contractObj = await factory.deploy(...constructorArgs);
        await contractObj.deployed();
        console.log(`Uploaded contract: ${contract.contractName}: \"${contractObj.address}\"`);
        return (new Address()).from(contractObj.address);
    }

    private async initializeAllContracts(): Promise<void> {
        console.log('Initializing contracts...');
        const promises: Array<Promise<any>> = [];

        const completeSetsContract = await this.getContractAddress("CompleteSets");
        const completeSets = new CompleteSets(this.dependencies, completeSetsContract);
        await completeSets.initialize(this.augur!.address);

        const createOrderContract = await this.getContractAddress("CreateOrder");
        const createOrder = new CreateOrder(this.dependencies, createOrderContract);
        await createOrder.initialize(this.augur!.address);

        const fillOrderContract = await this.getContractAddress("FillOrder");
        const fillOrder = new FillOrder(this.dependencies, fillOrderContract);
        await fillOrder.initialize(this.augur!.address);

        const cancelOrderContract = await this.getContractAddress("CancelOrder");
        const cancelOrder = new CancelOrder(this.dependencies, cancelOrderContract);
        await cancelOrder.initialize(this.augur!.address);

        const tradeContract = await this.getContractAddress("Trade");
        const trade = new Trade(this.dependencies, tradeContract);
        await trade.initialize(this.augur!.address);

        const claimTradingProceedsContract = await this.getContractAddress("ClaimTradingProceeds");
        const claimTradingProceeds = new ClaimTradingProceeds(this.dependencies, claimTradingProceedsContract);
        await claimTradingProceeds.initialize(this.augur!.address);

        const ordersContract = await this.getContractAddress("Orders");
        const orders = new Orders(this.dependencies, ordersContract);
        await orders.initialize(this.augur!.address);

        const cashContract = await this.getContractAddress("Cash");
        const cash = new Cash(this.dependencies, cashContract);
        await cash.initialize(this.augur!.address);

        if (!this.configuration.useNormalTime) {
            const timeContract = await this.getContractAddress("TimeControlled");
            const time = new TimeControlled(this.dependencies, timeContract);
            await time.initialize(this.augur!.address);
        }
    }

    public async initializeLegacyRep(): Promise<void> {
        const legacyReputationToken = new LegacyReputationToken(this.dependencies, this.getContractAddress('LegacyReputationToken'));
        await legacyReputationToken.initializeERC820(this.augur!.address);
        const totalAmountToMint = new ethers.utils.BigNumber(10).pow(new ethers.utils.BigNumber(18)).mul(new ethers.utils.BigNumber(11000000)) as UInt256<ethers.utils.BigNumber>;
        await legacyReputationToken.faucet(totalAmountToMint);
        const defaultAddress = (new Address()).from(await this.signer.getAddress());
        const legacyBalance = await legacyReputationToken.balanceOf_(defaultAddress);
        if (!legacyBalance || legacyBalance == new ethers.utils.BigNumber(0)) {
            throw new Error("Faucet call to Legacy REP failed");
        }
    }

    private async resetTimeControlled(): Promise<void> {
      console.log('Resetting Timestamp for false time...');
      const time = new TimeControlled(this.dependencies, this.getContractAddress("TimeControlled"));
      const currentTimestamp = await time.getTimestamp_();
      time.setTimestamp(currentTimestamp);
    }

    private async createGenesisUniverse(): Promise<Universe<ethers.utils.BigNumber>> {
        console.log('Creating genesis universe...');
        const augur = new Augur(this.dependencies, this.getContractAddress("Augur"));
        const universeAddress = await augur.createGenesisUniverse_();
        if (!universeAddress || universeAddress.to0xString() == "0x") {
            throw new Error("Unable to create genesis universe. eth_call failed");
        }
        await augur.createGenesisUniverse();
        const universe = new Universe(this.dependencies, universeAddress);
        console.log(`Genesis universe address: ${universe.address}`);
        if (await universe.getTypeName_().toString() !== "Universe") {
            throw new Error("Unable to create genesis universe. Get type name failed");
        }

        return universe;
    }

    private async migrateFromLegacyRep(): Promise<void> {
        const reputationTokenAddress = await this.universe!.getReputationToken_();
        const reputationToken = new ReputationToken(this.dependencies, reputationTokenAddress);
        const legacyReputationToken = new LegacyReputationToken(this.dependencies, this.getContractAddress('LegacyReputationToken'));
        const defaultAddress = (new Address()).from(await this.signer.getAddress());
        const legacyBalance = await legacyReputationToken.balanceOf_(defaultAddress);
        await legacyReputationToken.approve(reputationTokenAddress, legacyBalance);
        await reputationToken.migrateFromLegacyReputationToken();
        const balance = await reputationToken.balanceOf_(defaultAddress);
        if (!balance || balance == new ethers.utils.BigNumber(0)) {
            throw new Error("Migration from Legacy REP failed");
        }
    }

    private async generateAddressMapping(): Promise<string> {
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

        const networkId = (await this.provider.getNetwork()).chainId;
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

        const networkId = (await this.provider.getNetwork()).chainId;
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

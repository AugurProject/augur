import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { exists, readFile, writeFile } from 'async-file';
import { stringTo32ByteHex, resolveAll } from './HelperFunctions';
import { CompilerOutput } from 'solc';
import { DeployerConfiguration } from './DeployerConfiguration';
import {
  Augur,
  AugurTrading,
  Universe,
  ReputationToken,
  LegacyReputationToken,
  TimeControlled,
  ShareToken,
  Trade,
  CreateOrder,
  CancelOrder,
  FillOrder,
  Orders,
  Cash,
  ProfitLoss,
  SimulateTrade,
  ZeroXTrade,
  GnosisSafeRegistry,
  WarpSync,
  RepPriceOracle,
  // 0x
  DevUtils,
  Exchange,
  ERC1155Proxy,
  ERC20Proxy,
} from './ContractInterfaces';
import { NetworkConfiguration } from './NetworkConfiguration';
import { Contracts, ContractData } from './Contracts';
import { Dependencies } from '../libraries/GenericContractInterfaces';
import { ContractAddresses, NetworkId, setAddresses, setUploadBlockNumber } from '@augurproject/artifacts';

const TRADING_CONTRACTS = ['CreateOrder','FillOrder','CancelOrder','Trade','Orders','ZeroXTrade','ProfitLoss','SimulateTrade','ZeroXExchange']

export class ContractDeployer {
    private readonly configuration: DeployerConfiguration;
    private readonly contracts: Contracts;
    private readonly dependencies: Dependencies<BigNumber>
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly signer: ethers.Signer;
    public augur: Augur|null = null;
    public augurTrading: AugurTrading|null = null;
    public universe: Universe|null = null;
    public externalContractAddresses = {};

    static deployToNetwork = async (networkConfiguration: NetworkConfiguration, dependencies: Dependencies<BigNumber>, provider: ethers.providers.JsonRpcProvider,signer: ethers.Signer, deployerConfiguration: DeployerConfiguration) => {
        const compilerOutput = JSON.parse(await readFile(deployerConfiguration.contractInputPath, 'utf8'));
        const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider, signer, compilerOutput);

        console.log(`\n\n-----------------
Deploying to: ${networkConfiguration.networkName}
    compiled contracts: ${deployerConfiguration.contractInputPath}
    contract address: ${deployerConfiguration.contractAddressesOutputPath}
    upload blocks #s: ${deployerConfiguration.uploadBlockNumbersOutputPath}
`);
        await contractDeployer.deploy();
    }

    constructor(configuration: DeployerConfiguration, dependencies: Dependencies<BigNumber>, provider: ethers.providers.JsonRpcProvider, signer: ethers.Signer, compilerOutput: CompilerOutput) {
        this.configuration = configuration;
        this.dependencies = dependencies;
        this.provider = provider;
        this.signer = signer;
        this.contracts = new Contracts(compilerOutput);
    }

    async getBlockNumber(): Promise<number> {
        return this.provider.getBlock('latest', false).then( (block) => block.number);
    }

    async deploy(): Promise<ContractAddresses> {
        const blockNumber = await this.getBlockNumber();
        this.augur = await this.uploadAugur();
        this.augurTrading = await this.uploadAugurTrading();
        await this.uploadAllContracts();

        const externalAddresses = this.configuration.externalAddresses;

        // Legacy REP
        if (this.configuration.isProduction || externalAddresses.LegacyReputationToken) {
            if (!externalAddresses.LegacyReputationToken) throw new Error('Must provide LegacyReputationToken');
            console.log(`Registering Legacy Rep Contract at ${externalAddresses.LegacyReputationToken}`);
            await this.augur!.registerContract(stringTo32ByteHex('LegacyReputationToken'), externalAddresses.LegacyReputationToken);
        } else {
            await this.uploadLegacyRep();
        }

        // REP price oracle
        if (this.configuration.isProduction || externalAddresses.RepPriceOracle) {
            if (!externalAddresses.RepPriceOracle) throw new Error('Must provide RepPriceOracle');
            console.log(`Registering Rep Price Oracle Contract at ${externalAddresses.RepPriceOracle}`);
            await this.augur!.registerContract(stringTo32ByteHex('RepPriceOracle'), externalAddresses.RepPriceOracle);
        } else {
            await this.uploadRepPriceOracle();
        }

        // Cash
        if (this.configuration.isProduction
            || externalAddresses.Cash
            || externalAddresses.DaiVat
            || externalAddresses.DaiPot
            || externalAddresses.DaiJoin) {
            if (!(externalAddresses.Cash && externalAddresses.DaiVat && externalAddresses.DaiPot && externalAddresses.DaiJoin)) {
                throw new Error('Must provide ALL Maker contracts if any are provided');
            }

            console.log(`Registering Cash Contract at ${externalAddresses.Cash}`);
            await this.augur!.registerContract(stringTo32ByteHex('Cash'), externalAddresses.Cash);

            // Dai Vat
            console.log(`Registering Vat Contract at ${externalAddresses.DaiVat}`);
            await this.augur!.registerContract(stringTo32ByteHex('DaiVat'), externalAddresses.DaiVat);

            // Dai Pot
            console.log(`Registering Pot Contract at ${externalAddresses.DaiPot}`);
            await this.augur!.registerContract(stringTo32ByteHex('DaiPot'), externalAddresses.DaiPot);

            // Dai Join
            console.log(`Registering Join Contract at ${externalAddresses.DaiJoin}`);
            await this.augur!.registerContract(stringTo32ByteHex('DaiJoin'), externalAddresses.DaiJoin);

            if (!this.configuration.isProduction) {
                if (!(externalAddresses.MCDCol && externalAddresses.MCDColJoin && externalAddresses.MCDFaucet)) {
                    throw new Error('Must provide ALL Testnet Maker contracts');
                }

                // Col
                console.log(`Registering MCDCol Contract at ${externalAddresses.MCDCol}`);
                await this.augur!.registerContract(stringTo32ByteHex('MCDCol'), externalAddresses.MCDCol);

                // Col Join
                console.log(`Registering MCDColJoin Contract at ${externalAddresses.MCDColJoin}`);
                await this.augur!.registerContract(stringTo32ByteHex('MCDColJoin'), externalAddresses.MCDColJoin);

                // Dai Faucet
                console.log(`Registering MCDFaucet Contract at ${externalAddresses.MCDFaucet}`);
                await this.augur!.registerContract(stringTo32ByteHex('MCDFaucet'), externalAddresses.MCDFaucet);

                const cashFaucet = await this.contracts.get('CashFaucet');
                cashFaucet.address = await this.uploadAndAddToAugur(cashFaucet, 'CashFaucet', [this.augur!.address]);
            }
        } else {
            await this.uploadTestDaiContracts();
        }

        // Proxy Factory & Gnosis Safe
        if (this.configuration.isProduction || externalAddresses.GnosisSafe || externalAddresses.ProxyFactory) {
            if (!(externalAddresses.ProxyFactory && externalAddresses.GnosisSafe)) {
                throw new Error('Must provide ALL Gnosis contracts if any are provided');
            }

            await this.augur!.registerContract(stringTo32ByteHex('ProxyFactory'), externalAddresses.ProxyFactory);

            await this.augur!.registerContract(stringTo32ByteHex('GnosisSafe'), externalAddresses.GnosisSafe);
        } else {
            await this.uploadGnosisContracts();
        }

        // 0x Exchange
        if (this.configuration.isProduction || externalAddresses.ZeroXExchange) {
            if (!externalAddresses.ZeroXExchange) throw new Error('Must provide ZeroXExchange');
            console.log(`Registering 0x Exchange Contract at ${externalAddresses.ZeroXExchange}`);
            await this.augurTrading!.registerContract(stringTo32ByteHex('ZeroXExchange'), externalAddresses.ZeroXExchange);
        } else {
            await this.upload0xContracts();
        }

        // Uniswap
        if (this.configuration.isProduction || externalAddresses.UniswapV2Factory) {
            if (!externalAddresses.UniswapV2Factory) throw new Error('Must provide UniswapV2Factory');
            console.log(`Registering UniswapV2Factory Contract at ${externalAddresses.UniswapV2Factory}`);
            await this.augur!.registerContract(stringTo32ByteHex('UniswapV2Factory'), externalAddresses.UniswapV2Factory);
        } else {
            await this.uploadUniswapContracts();
        }

        await this.initializeAllContracts();
        await this.doTradingApprovals();

        if (!this.configuration.useNormalTime) {
            await this.resetTimeControlled();
        }

        if (!externalAddresses.LegacyReputationToken) {
            console.log('Initializing fake legacy REP');
            await this.initializeLegacyRep();
        }

        this.universe = await this.createGenesisUniverse();

        if (!externalAddresses.LegacyReputationToken) {
            console.log('Migrating from fake legacy REP');
            await this.migrateFromLegacyRep();
        }

        if (this.configuration.writeArtifacts) {
          await this.generateUploadBlockNumberMapping(blockNumber);
          await this.generateAddressMappingFile();
        }

        return this.generateCompleteAddressMapping();
    }

    private generateCompleteAddressMapping(): ContractAddresses {
        // This type assertion means that `mapping` can possibly NOT adhere to the ContractAddresses interface.
        const mapping = {} as ContractAddresses;

        mapping['Augur'] = this.augur!.address;
        if (this.universe) mapping['Universe'] = this.universe.address;
        if (this.contracts.get('Augur').address === undefined) throw new Error('Augur not uploaded.');
        mapping['Augur'] = this.contracts.get('Augur').address!;
        mapping['LegacyReputationToken'] = this.contracts.get('LegacyReputationToken').address!;
        mapping['Cash'] = this.getContractAddress('Cash');
        mapping['BuyParticipationTokens'] = this.contracts.get('BuyParticipationTokens').address!;
        mapping['RedeemStake'] = this.contracts.get('RedeemStake').address!;
        mapping['AugurTrading'] = this.contracts.get('AugurTrading').address!;
        mapping['ZeroXExchange'] = this.contracts.get('Exchange').address!;
        for (let contract of this.contracts) {
            if (/^I[A-Z].*/.test(contract.contractName)) continue;
            if (contract.contractName === 'TimeControlled') continue;
            if (contract.contractName === 'Universe') continue;
            if (contract.contractName === 'ReputationToken') continue;
            if (contract.contractName === 'TestNetReputationToken') continue;
            if (contract.contractName === 'TestNetReputationTokenFactory') continue;
            if (contract.contractName === 'CashFaucetProxy') continue;
            if (contract.contractName === 'UniswapV2') continue;
            if (contract.contractName === 'UniswapV2Factory') continue;
            if (contract.contractName === 'Time') contract = this.configuration.useNormalTime ? contract : this.contracts.get('TimeControlled');
            if (contract.contractName === 'ReputationTokenFactory') contract = this.configuration.isProduction ? contract: this.contracts.get('TestNetReputationTokenFactory');
            if (contract.contractName === 'CashFaucet') {
                if (this.configuration.isProduction) continue;
                mapping['CashFaucet'] = this.getCashFaucetAddress();
                continue;
            }
            if (contract.relativeFilePath.startsWith('legacy_reputation/')) continue;
            if (contract.relativeFilePath.startsWith('external/')) continue;

            // 0x
            if (this.configuration.externalAddresses.ZeroXExchange && [
              'ERC20Proxy',
              'ERC721Proxy',
              'ERC1155Proxy',
              'Exchange',
              'Coordinator',
              'CoordinatorRegistry',
              'DevUtils',
              'WETH9',
              'ZRXToken',
            ].includes(contract.contractName)) continue;
            if (contract.contractName === 'Exchange') continue;

            if (contract.contractName !== 'Map' && contract.relativeFilePath.startsWith('libraries/')) continue;
            if (['Cash', 'TestNetDaiVat', 'TestNetDaiPot', 'TestNetDaiJoin'].includes(contract.contractName)) continue;
            if (['IAugur', 'IDisputeCrowdsourcer', 'IDisputeWindow', 'IUniverse', 'IMarket', 'IReportingParticipant', 'IReputationToken', 'IOrders', 'IShareToken', 'Order', 'IV2ReputationToken', 'IInitialReporter'].includes(contract.contractName)) continue;
            if (contract.address === undefined) throw new Error(`${contract.contractName} not uploaded.`);
            // @ts-ignore
            mapping[contract.contractName] = contract.address;
        }
        return mapping;
    }

    getContractAddress = (contractName: string): string => {
        if (this.configuration.externalAddresses[contractName]) return this.configuration.externalAddresses[contractName];
        if (contractName === 'CashFaucet') return this.getCashFaucetAddress();
        if (!this.contracts.has(contractName)) throw new Error(`Contract named ${contractName} does not exist.`);
        const contract = this.contracts.get(contractName);
        if (contract.address === undefined) throw new Error(`Contract name ${contractName} has not yet been uploaded.`);
        return contract.address;
    }

    private async uploadAugur(): Promise<Augur> {
        console.log('Uploading augur...');
        const contract = await this.contracts.get("Augur");
        const address = await this.construct(contract, []);
        const augur = new Augur(this.dependencies, address);
        const ownerAddress = await augur.uploader_();
        contract.address = address;
        if (ownerAddress.toLowerCase() !== (await this.signer.getAddress()).toLowerCase()) {
            throw new Error('Augur owner does not equal from address');
        }
        console.log(`Augur address: ${augur.address}`);
        return augur;
    }

    private async uploadAugurTrading(): Promise<AugurTrading> {
        console.log('Uploading Augur Trading...');
        const contract = await this.contracts.get("AugurTrading");
        const address = await this.construct(contract, [this.augur!.address]);
        const augurTrading = new AugurTrading(this.dependencies, address);
        const ownerAddress = await augurTrading.uploader_();
        contract.address = address;
        if (ownerAddress.toLowerCase() !== (await this.signer.getAddress()).toLowerCase()) {
            throw new Error("Augur Trading owner does not equal from address");
        }
        console.log(`Augur Trading address: ${augurTrading.address}`);
        return augurTrading;
    }

    private async uploadTestDaiContracts(): Promise<void> {
        const cashContract = await this.contracts.get('Cash');
        cashContract.address = await this.uploadAndAddToAugur(cashContract, 'Cash', []);

        const vatContract = await this.contracts.get('TestNetDaiVat');
        vatContract.address = await this.uploadAndAddToAugur(vatContract, 'DaiVat', []);

        const potContract = await this.contracts.get('TestNetDaiPot');
        potContract.address = await this.uploadAndAddToAugur(potContract, 'DaiPot', [vatContract.address, await this.augur!.lookup_(stringTo32ByteHex('Time'))]);

        const joinContract = await this.contracts.get('TestNetDaiJoin');
        joinContract.address = await this.uploadAndAddToAugur(joinContract, 'DaiJoin', [vatContract.address, cashContract.address]);

        await this.augur!.registerContract(stringTo32ByteHex('CashFaucet'), cashContract.address);

        const cash = new Cash(this.dependencies, cashContract.address);
        await cash.initialize(this.augur!.address);
    }

    private async uploadGnosisContracts(): Promise<void> {
        const proxyFactoryContract = await this.contracts.get('ProxyFactory');
        proxyFactoryContract.address = await this.uploadAndAddToAugur(proxyFactoryContract, 'ProxyFactory', []);

        const gnosisSafeContract = await this.contracts.get('GnosisSafe');
        gnosisSafeContract.address = await this.uploadAndAddToAugur(gnosisSafeContract, 'GnosisSafe', []);
    }

    private async uploadUniswapContracts(): Promise<string> {
        const uniswapV2FactoryContract = await this.contracts.get('UniswapV2Factory');
        uniswapV2FactoryContract.address = await this.uploadAndAddToAugur(uniswapV2FactoryContract, 'UniswapV2Factory', ["0x0", 0]);
        return uniswapV2FactoryContract.address;
    }

    async uploadLegacyRep(): Promise<string> {
        const contract = await this.contracts.get('LegacyReputationToken');
        contract.address = await this.uploadAndAddToAugur(contract, 'LegacyReputationToken');
        return contract.address;
    }

    async uploadRepPriceOracle(): Promise<string> {
        const contract = await this.contracts.get('RepPriceOracle');
        contract.address = await this.uploadAndAddToAugur(contract, 'RepPriceOracle');
        return contract.address;
    }

    private async upload0xContracts(): Promise<string> {
      const networkId = (await this.provider.getNetwork()).chainId;

      const erc20ProxyContract = this.contracts.get('ERC20Proxy');
      erc20ProxyContract.address = await this.uploadAndAddToAugur(erc20ProxyContract, 'ERC20Proxy');

      const erc721ProxyContract = this.contracts.get('ERC721Proxy');
      erc721ProxyContract.address = await this.uploadAndAddToAugur(erc721ProxyContract, 'ERC721Proxy');

      const erc1155ProxyContract = this.contracts.get('ERC1155Proxy');
      erc1155ProxyContract.address = await this.uploadAndAddToAugur(erc1155ProxyContract, 'ERC1155Proxy');

      const zeroXExchangeContract = await this.contracts.get('Exchange');
      zeroXExchangeContract.address = await this.uploadAndAddToAugur(zeroXExchangeContract, 'ZeroXExchange', [networkId]);

      const zeroXCoordinatorContract = await this.contracts.get('Coordinator');
      zeroXCoordinatorContract.address = await this.uploadAndAddToAugur(zeroXCoordinatorContract, 'ZeroXCoordinator', [zeroXExchangeContract.address, networkId]);

      const coordinatorRegistryContract = await this.contracts.get('CoordinatorRegistry');
      coordinatorRegistryContract.address = await this.uploadAndAddToAugur(coordinatorRegistryContract, 'CoordinatorRegistry');

      const devUtilsContract = this.contracts.get('DevUtils');
      devUtilsContract.address = await this.uploadAndAddToAugur(devUtilsContract, 'DevUtils', [zeroXExchangeContract.address]);

      const weth9Contract = this.contracts.get('WETH9');
      weth9Contract.address = await this.uploadAndAddToAugur(weth9Contract, 'WETH9');

      const zrxTokenContract = this.contracts.get('ZRXToken');
      zrxTokenContract.address = await this.uploadAndAddToAugur(zrxTokenContract, 'ZRXToken');

      const actualZeroXExchangeContract = new Exchange(this.dependencies, zeroXExchangeContract.address);
      await actualZeroXExchangeContract.registerAssetProxy(erc1155ProxyContract.address);
      await actualZeroXExchangeContract.registerAssetProxy(erc20ProxyContract.address);

      const actualERC1155ProxyContract = new ERC1155Proxy(this.dependencies, erc1155ProxyContract.address);
      await actualERC1155ProxyContract.addAuthorizedAddress(zeroXExchangeContract.address);

      const actualERC20ProxyContract = new ERC20Proxy(this.dependencies, erc20ProxyContract.address);
      await actualERC20ProxyContract.addAuthorizedAddress(zeroXExchangeContract.address);

      return zeroXExchangeContract.address;
    }

    private async uploadAllContracts(serial=true): Promise<void> {
        console.log('Uploading contracts...');

        if (serial) { // needed for deploy to ganache
          for (const contract of this.contracts) {
            await this.upload(contract);
          }
        } else {
          const promises: Array<Promise<void>> = [];
          for (const contract of this.contracts) {
            promises.push(this.upload(contract));
          }
          await resolveAll(promises);
        }
    }

    private async upload(contract: ContractData): Promise<void> {
        const contractName = contract.contractName
        if (contractName === 'Augur') return;
        if (contractName === 'Delegator') return;
        if (contractName === 'TimeControlled') return;
        if (contractName === 'TestNetReputationTokenFactory') return;
        if (contractName === 'AugurTrading') return;
        if (contractName === 'Universe') return;
        if (contractName === 'ReputationToken') return;
        if (contractName === 'UniswapV2') return;
        if (contractName === 'UniswapV2Factory') return;
        if (contractName === 'TestNetReputationToken') return;
        if (contractName === 'ProxyFactory') return;
        if (contractName === 'Time') contract = this.configuration.useNormalTime ? contract : this.contracts.get('TimeControlled');
        if (contractName === 'ReputationTokenFactory') contract = this.configuration.isProduction ? contract : this.contracts.get('TestNetReputationTokenFactory');
        if (contract.relativeFilePath.startsWith('legacy_reputation/')) return;
        if (contractName === 'LegacyReputationToken') return;
        if (contractName === 'Cash') return;
        if (contractName === 'RepPriceOracle') return;
        if (contractName === 'CashFaucet') return;
        if (contractName === 'CashFaucetProxy') return;
        if (contractName === 'GnosisSafe') return;
        // 0x
        if ([
          'ERC20Proxy',
          'ERC721Proxy',
          'ERC1155Proxy',
          'Exchange',
          'Coordinator',
          'CoordinatorRegistry',
          'DevUtils',
          'WETH9',
          'ZRXToken',
        ].includes(contractName)) return;
        if (contractName !== 'Map' && contract.relativeFilePath.startsWith('libraries/')) return;
        if (['Cash', 'TestNetDaiVat', 'TestNetDaiPot', 'TestNetDaiJoin'].includes(contract.contractName)) return;
        if (['IAugur', 'IDisputeCrowdsourcer', 'IDisputeWindow', 'IUniverse', 'IMarket', 'IReportingParticipant', 'IReputationToken', 'IOrders', 'IShareToken', 'Order', 'IV2ReputationToken', 'IInitialReporter', 'ICashFaucet'].includes(contract.contractName)) return;
        console.log(`Uploading new version of contract for ${contractName}`);
        contract.address = await this.uploadAndAddToAugur(contract, contractName, []);
    }

    private async uploadAndAddToAugur(contract: ContractData, registrationContractName: string = contract.contractName, constructorArgs: any[] = []): Promise<string> {
        const address = await this.construct(contract, constructorArgs);
        if (TRADING_CONTRACTS.includes(registrationContractName)) {
            await this.augurTrading!.registerContract(stringTo32ByteHex(registrationContractName), address);
        } else {
            await this.augur!.registerContract(stringTo32ByteHex(registrationContractName), address);
        }
        return address;
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
        const promises: Array<Promise<any>> = [];

        const shareTokenContract = await this.getContractAddress("ShareToken");
        const shareToken = new ShareToken(this.dependencies, shareTokenContract);
        promises.push(shareToken.initialize(this.augur!.address));

        const createOrderContract = await this.getContractAddress('CreateOrder');
        const createOrder = new CreateOrder(this.dependencies, createOrderContract);
        promises.push(createOrder.initialize(this.augur!.address, this.augurTrading!.address));

        const fillOrderContract = await this.getContractAddress('FillOrder');
        const fillOrder = new FillOrder(this.dependencies, fillOrderContract);
        promises.push(fillOrder.initialize(this.augur!.address, this.augurTrading!.address));

        const cancelOrderContract = await this.getContractAddress('CancelOrder');
        const cancelOrder = new CancelOrder(this.dependencies, cancelOrderContract);
        promises.push(cancelOrder.initialize(this.augur!.address, this.augurTrading!.address));

        const tradeContract = await this.getContractAddress('Trade');
        const trade = new Trade(this.dependencies, tradeContract);
        promises.push(trade.initialize(this.augur!.address, this.augurTrading!.address));

        const ordersContract = await this.getContractAddress('Orders');
        const orders = new Orders(this.dependencies, ordersContract);
        promises.push(orders.initialize(this.augur!.address, this.augurTrading!.address));

        const profitLossContract = await this.getContractAddress('ProfitLoss');
        const profitLoss = new ProfitLoss(this.dependencies, profitLossContract);
        promises.push(profitLoss.initialize(this.augur!.address, this.augurTrading!.address));

        const simulateTradeContract = await this.getContractAddress('SimulateTrade');
        const simulateTrade = new SimulateTrade(this.dependencies, simulateTradeContract);
        promises.push(simulateTrade.initialize(this.augur!.address, this.augurTrading!.address));

        const ZeroXTradeContract = await this.getContractAddress('ZeroXTrade');
        const zeroXTrade = new ZeroXTrade(this.dependencies, ZeroXTradeContract);
        promises.push(zeroXTrade.initialize(this.augur!.address, this.augurTrading!.address));

        const GnosisSafeRegistryContract = await this.getContractAddress('GnosisSafeRegistry');
        const gnosisSafeRegistry = new GnosisSafeRegistry(this.dependencies, GnosisSafeRegistryContract);
        promises.push(gnosisSafeRegistry.initialize(this.augur!.address));

        const WarpSyncContract = await this.getContractAddress('WarpSync');
        const warpSync = new WarpSync(this.dependencies, WarpSyncContract);
        promises.push(warpSync.initialize(this.augur!.address));

        const RepPriceOracleContract = await this.getContractAddress('RepPriceOracle');
        const repPriceOracle = new RepPriceOracle(this.dependencies, RepPriceOracleContract);
        promises.push(repPriceOracle.initialize(this.augur!.address));

        if (!this.configuration.useNormalTime) {
            const timeContract = await this.getContractAddress('TimeControlled');
            const time = new TimeControlled(this.dependencies, timeContract);
            promises.push(time.initialize(this.augur!.address));
        }

        await resolveAll(promises);
    }

    private async doTradingApprovals(): Promise<void> {
        const augurTradingContract = await this.getContractAddress("AugurTrading");
        const augurTrading = new AugurTrading(this.dependencies, augurTradingContract);
        await augurTrading.doApprovals();
    }

    public async initializeLegacyRep(): Promise<void> {
        const legacyReputationToken = new LegacyReputationToken(this.dependencies, this.getContractAddress('LegacyReputationToken'));
        await legacyReputationToken.faucet(new BigNumber(11000000).multipliedBy(10**18));
        const defaultAddress = await this.signer.getAddress();
        const legacyBalance = await legacyReputationToken.balanceOf_(defaultAddress);
        if (!legacyBalance || legacyBalance.isEqualTo(0)) {
            throw new Error('Faucet call to Legacy REP failed');
        }
    }

    private async resetTimeControlled(): Promise<void> {
      console.log('Resetting Timestamp for false time...');
      const time = new TimeControlled(this.dependencies, this.getContractAddress('TimeControlled'));
      const currentTimestamp = await time.getTimestamp_();
      await time.setTimestamp(currentTimestamp);
    }

    private async createGenesisUniverse(): Promise<Universe> {
        console.log('Creating genesis universe...');
        const augur = new Augur(this.dependencies, this.getContractAddress('Augur'));
        const universeAddress = await augur.createGenesisUniverse_();
        if (!universeAddress || universeAddress === '0x') {
            throw new Error('Unable to create genesis universe. eth_call failed');
        }
        await augur.createGenesisUniverse();
        const universe = new Universe(this.dependencies, universeAddress);
        console.log(`Genesis universe address: ${universe.address}`);

        return universe;
    }

    private async migrateFromLegacyRep(): Promise<void> {
        const reputationTokenAddress = await this.universe!.getReputationToken_();
        const reputationToken = new ReputationToken(this.dependencies, reputationTokenAddress);
        const legacyReputationToken = new LegacyReputationToken(this.dependencies, this.getContractAddress('LegacyReputationToken'));
        const defaultAddress = await this.signer.getAddress();
        const legacyBalance = await legacyReputationToken.balanceOf_(defaultAddress);
        await legacyReputationToken.approve(reputationTokenAddress, legacyBalance);
        await reputationToken.migrateFromLegacyReputationToken();
        const balance = await reputationToken.balanceOf_(defaultAddress);
        if (!balance || balance === new BigNumber(0)) {
            throw new Error('Migration from Legacy REP failed');
        }
    }

    private getCashFaucetAddress(): string {
        if (this.contracts.get('CashFaucet').address) {
            return this.contracts.get('CashFaucet').address!;
        } else {
            return this.contracts.get('Cash').address!;
        }
    }

    private async generateAddressMappingFile(): Promise<void> {
        const mapping: Partial<ContractAddresses> = {};
        mapping['Augur'] = this.augur!.address;
        if (this.universe) mapping['Universe'] = this.universe.address;
        if (this.contracts.get('Augur').address === undefined) throw new Error('Augur not uploaded.');
        mapping['Augur'] = this.contracts.get('Augur').address!;
        mapping['LegacyReputationToken'] = this.contracts.get('LegacyReputationToken').address!;
        mapping['Cash'] = this.getContractAddress('Cash');
        mapping['ProxyFactory'] = this.contracts.get('ProxyFactory').address!;
        mapping['GnosisSafe'] = this.contracts.get('GnosisSafe').address!;
        if (!this.configuration.isProduction) mapping['CashFaucet'] = this.getCashFaucetAddress();
        mapping['BuyParticipationTokens'] = this.contracts.get('BuyParticipationTokens').address!;
        mapping['RedeemStake'] = this.contracts.get('RedeemStake').address!;
        mapping['GnosisSafeRegistry'] = this.contracts.get('GnosisSafeRegistry').address!;
        mapping['WarpSync'] = this.contracts.get('WarpSync').address!;
        mapping['ShareToken'] = this.contracts.get('ShareToken').address!;
        mapping['HotLoading'] = this.contracts.get('HotLoading').address!;
        mapping['Affiliates'] = this.contracts.get('Affiliates').address!;
        mapping['AffiliateValidator'] = this.contracts.get('AffiliateValidator').address!;

        // 0x
        mapping['ERC20Proxy'] = this.contracts.get('ERC20Proxy').address!;
        mapping['ERC721Proxy'] = this.contracts.get('ERC20Proxy').address!;
        mapping['ERC1155Proxy'] = this.contracts.get('ERC20Proxy').address!;
        mapping['Exchange'] = this.contracts.get('Exchange').address!;
        mapping['Coordinator'] = this.contracts.get('Coordinator').address!;
        mapping['CoordinatorRegistry'] = this.contracts.get('CoordinatorRegistry').address!;
        mapping['DevUtils'] = this.contracts.get('DevUtils').address!;
        mapping['WETH9'] = this.contracts.get('WETH9').address!;
        mapping['ZRXToken'] = this.contracts.get('ZRXToken').address!;

        if (this.contracts.get('TimeControlled')) mapping['TimeControlled'] = this.contracts.get('TimeControlled').address;
        if (this.contracts.get('Time')) mapping['Time'] = this.contracts.get('Time').address;

        for (const contract of this.contracts) {
            if (!contract.relativeFilePath.startsWith('trading/')) continue;
            if (contract.contractName === 'CashFaucet') continue;
            if (contract.contractName === 'CashFaucetProxy') continue;
            if (/^I[A-Z].*/.test(contract.contractName)) continue;
            if (contract.contractName === 'ZeroXTradeToken') continue;
            if (contract.address === undefined) throw new Error(`${contract.contractName} not uploaded.`);
            mapping[contract.contractName] = contract.address;
        }

        const networkId = (await this.provider.getNetwork()).chainId;

        await setAddresses(String(networkId) as NetworkId, mapping as ContractAddresses);
    }

    private async generateUploadBlockNumberMapping(blockNumber: number): Promise<void> {
        const networkId = (await this.provider.getNetwork()).chainId as unknown as NetworkId;
        await setUploadBlockNumber(networkId, blockNumber);
    }
}

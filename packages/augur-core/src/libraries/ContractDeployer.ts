import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { readFile } from 'async-file';
import { stringTo32ByteHex, resolveAll } from './HelperFunctions';
import { CompilerOutput } from 'solc';
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
    USDC,
    USDT,
    ProfitLoss,
    SimulateTrade,
    ZeroXTrade,
    WarpSync,
    AugurWalletRegistry,
    AugurWalletRegistryV2,
    AugurWalletFactory,
    RepOracle,
    AuditFunds,
    AccountLoader,
    // 0x
    Exchange,
    ERC1155Proxy,
    ERC20Proxy,
    MultiAssetProxy,
    // Uniswap
    UniswapV2Factory,
    UniswapV2Pair,
    WETH9,
    TestNetReputationToken,
    UniswapV2Router02,
} from './ContractInterfaces';
import { Contracts, ContractData } from './Contracts';
import { Dependencies } from './GenericContractInterfaces';
import { NetworkId } from '@augurproject/utils';
import { ContractAddresses, SDKConfiguration, mergeConfig } from '@augurproject/utils';
import { updateConfig } from '@augurproject/artifacts';
import { TRADING_CONTRACTS, RELAY_HUB_SIGNED_DEPLOY_TX, RELAY_HUB_DEPLOYER_ADDRESS, RELAY_HUB_ADDRESS } from './constants';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export class ContractDeployer {
    private readonly configuration: SDKConfiguration;
    private readonly contracts: Contracts;
    private readonly dependencies: Dependencies<BigNumber>;
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly signer: ethers.Signer;
    augur: Augur|null = null;
    augurTrading: AugurTrading|null = null;
    universe: Universe|null = null;

    static deployToNetwork = async (env: string, config: SDKConfiguration, dependencies: Dependencies<BigNumber>, provider: ethers.providers.JsonRpcProvider,signer: ethers.Signer) => {
        const compilerOutput = JSON.parse(await readFile(config.deploy.contractInputPath, 'utf8'));
        const contractDeployer = new ContractDeployer(config, dependencies, provider, signer, compilerOutput);

        console.log(`\n\n-----------------
Deploying to: ${env}
    compiled contracts: ${config.deploy.contractInputPath}
`);
        await contractDeployer.deploy(env);
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

    async deploy(env: string): Promise<ContractAddresses> {
        const blockNumber = await this.getBlockNumber();
        const walletFactoryAddress = await this.uploadAugurWalletFactory();
        this.augur = await this.uploadAugur();
        this.augurTrading = await this.uploadAugurTrading();
        await this.registerContract('AugurWalletFactory', walletFactoryAddress);
        await this.uploadAllContracts();

        const externalAddresses = this.configuration.deploy.externalAddresses;

        // Legacy REP

        if (this.configuration.deploy.isProduction || externalAddresses.LegacyReputationToken) {
            if (!externalAddresses.LegacyReputationToken) throw new Error('Must provide LegacyReputationToken');
            console.log(`Registering Legacy Rep Contract at ${externalAddresses.LegacyReputationToken}`);
            await this.augur!.registerContract(stringTo32ByteHex('LegacyReputationToken'), externalAddresses.LegacyReputationToken);
        } else {
            await this.uploadLegacyRep();
        }

        // Cash
        if (this.configuration.deploy.isProduction
            || externalAddresses.Cash
            || externalAddresses.WETH9) {
            if (!(externalAddresses.Cash && externalAddresses.WETH9)) {
                throw new Error('Must provide ALL Maker contracts if any are provided');
            }

            console.log(`Registering Cash Contract at ${externalAddresses.Cash}`);
            await this.augur!.registerContract(stringTo32ByteHex('Cash'), externalAddresses.Cash);

            // WETH 9
            console.log(`Registering WETH9 Contract at ${externalAddresses.WETH9}`);
            await this.augurTrading!.registerContract(stringTo32ByteHex('WETH9'), externalAddresses.WETH9);
        } else {
            await this.uploadTestDaiContracts();
            await this.uploadTestUSDxContracts();
        }

        // 0x Exchange
        if (this.configuration.deploy.isProduction || externalAddresses.Exchange) {
            if (!externalAddresses.Exchange) throw new Error('Must provide Exchange (ZeroXExchange)');
            console.log(`Registering 0x Exchange Contract at ${externalAddresses.Exchange}`);
            await this.augurTrading!.registerContract(stringTo32ByteHex('ZeroXExchange'), externalAddresses.Exchange);
        } else {
            await this.upload0xContracts();
        }

        // Uniswap
        if (this.configuration.deploy.isProduction || externalAddresses.UniswapV2Factory) {
            if (!externalAddresses.UniswapV2Factory) throw new Error('Must provide UniswapV2Factory');
            console.log(`Registering UniswapV2Factory Contract at ${externalAddresses.UniswapV2Factory}`);
            await this.augur!.registerContract(stringTo32ByteHex('UniswapV2Factory'), externalAddresses.UniswapV2Factory);
            console.log(`Registering UniswapV2Router02 Contract at ${externalAddresses.UniswapV2Router02}`);
            await this.augur!.registerContract(stringTo32ByteHex('UniswapV2Router02'), externalAddresses.UniswapV2Router02);
        } else {
            await this.uploadUniswapContracts();
        }

        // GSN. The GSN RelayHub is deployed with a static address via create2 so we only need to do anything if we're in a dev environment where it hasnt been deployed
        if (!this.configuration.deploy.isProduction) {
            const relayHubDeployedCode = await this.provider.getCode(RELAY_HUB_ADDRESS);
            if (relayHubDeployedCode !== '0x') {
                console.log('Relay Hub is already deployed to this environment. Skipping Deploy.')
            } else {
                console.log('Deploying Relay Hub.')
                let response = await this.signer.sendTransaction({
                    to: RELAY_HUB_DEPLOYER_ADDRESS,
                    data: '0x00',
                    value: '0x3A4965BF58A40000',
                })
                let receipt = await response.wait();
                response = await this.provider.sendTransaction(RELAY_HUB_SIGNED_DEPLOY_TX);
                receipt = await response.wait();
                if (receipt.contractAddress !== RELAY_HUB_ADDRESS) {
                    throw new Error(`Relay Hub deployment failed. Deployed address: ${receipt.contractAddress}`);
                }
                console.log('Relay Hub deployed.')
            }
        }

        // GSN V2 requires a more standard deployment
        if (this.configuration.deploy.isProduction || externalAddresses.RelayHubV2) {
            if (!externalAddresses.RelayHubV2) throw new Error('Must provide RelayHubV2');
            console.log(`Registering RelayHubV2 Contract at ${externalAddresses.RelayHubV2}`);
            await this.augurTrading!.registerContract(stringTo32ByteHex('RelayHubV2'), externalAddresses.RelayHubV2);
        } else {
            await this.uploadGSNV2Contracts();
        }

        await this.uploadERC20Proxy1155Contracts();

        await this.initializeAllContracts();
        await this.doTradingApprovals();

        if (!this.configuration.deploy.normalTime) {
            console.log('Resetting time controlled');
            await this.resetTimeControlled();
        }

        if (!externalAddresses.LegacyReputationToken) {
            console.log('Initializing fake legacy REP');
            await this.initializeLegacyRep();
        }

        console.log('Creating genesis universe');
        this.universe = await this.createGenesisUniverse();

        if (!externalAddresses.LegacyReputationToken) {
            console.log('Migrating from fake legacy REP');
            await this.migrateFromLegacyRep();
        }


        // Handle some things that make testing less erorr prone that will need to occur naturally in production
        if (!this.configuration.deploy.isProduction) {
            console.log('Initializing warp sync market');
            const warpSync = new WarpSync(this.dependencies, this.getContractAddress('WarpSync'));
            await warpSync.initializeUniverse(this.universe.address);

            const cash = new Cash(this.dependencies, this.getContractAddress('Cash'));

            console.log('Approving Augur');
            const authority = this.getContractAddress('Augur');
            await cash.approve(authority, new BigNumber(2).pow(256).minus(new BigNumber(1)));

            console.log('Add ETH-Cash exchange liquidity');
            await this.setupEthExchange(cash);

            console.log('Add REP-Cash exchange liquidity');
            const repAddress = await this.universe!.getReputationToken_();
            await this.setupTokenExchange(cash, new TestNetReputationToken(this.dependencies, repAddress));

            console.log('Add USDC-Cash exchange liquidity');
            await this.setupTokenExchange(new USDC(this.dependencies, this.getContractAddress('USDC')), cash);

            console.log('Add USDT-Cash exchange liquidity');
            await this.setupTokenExchange(new USDT(this.dependencies, this.getContractAddress('USDT')), cash);
        }

        console.log('Writing artifacts');
        if (this.configuration.deploy.writeArtifacts) {
          await this.generateLocalEnvFile(env, blockNumber, this.configuration);
        }

        console.log('Finalizing deployment');
        await this.augur.finishDeployment();
        await this.augurTrading.finishDeployment();

        return await this.generateCompleteAddressMapping();
    }

    private async setupEthExchange<C extends Cash|TestNetReputationToken>(token: C) {
        const address = await this.dependencies.getDefaultAddress();
        const weth = new WETH9(this.dependencies, this.getContractAddress('WETH9'));
        const uniswapV2Factory = new UniswapV2Factory(this.dependencies, this.getContractAddress('UniswapV2Factory'));
        const ethExchangeAddress = await uniswapV2Factory.getPair_(weth.address, token.address);
        const ethExchange = new UniswapV2Pair(this.dependencies, ethExchangeAddress);
        const cashAmount = new BigNumber(4000 * 1e18); // 4000 Dai
        const ethAmount = new BigNumber(20 * 1e18); // 20 ETH
        await weth.deposit({attachedEth: ethAmount});
        await token.faucet(cashAmount);
        await token.transfer(ethExchange.address, cashAmount);
        await weth.transfer(ethExchange.address, ethAmount);
        await ethExchange.mint(address);
    }

    private async setupTokenExchange<C1 extends Cash|TestNetReputationToken, C2 extends Cash|TestNetReputationToken>(token1: C1, token2: C2) {
        const address = await this.dependencies.getDefaultAddress();
        const uniswapAddress = this.getContractAddress('UniswapV2Router02');
        const uniswap = new UniswapV2Router02(this.dependencies, uniswapAddress);
        const token1Amount = new BigNumber(100e18);
        const token2Amount = new BigNumber(10e18);

        await token1.faucet(token1Amount);
        await token2.faucet(token2Amount);
        await token1.approve(uniswapAddress, new BigNumber(2 ** 255));
        await token2.approve(uniswapAddress, new BigNumber(2 ** 255));

        console.log('Adding liquidity');
        await uniswap.addLiquidity(
            token1.address,
            token2.address,
            token1Amount,
            token2Amount,
            new BigNumber(0),
            new BigNumber(0),
            address,
            new BigNumber((new Date()).valueOf() + 3600000),
        );
    }

    private async generateCompleteAddressMapping(): Promise<ContractAddresses> {
        // This type assertion means that `mapping` can possibly NOT adhere to the ContractAddresses interface.
        const mapping = {} as ContractAddresses;

        mapping['Augur'] = this.augur!.address;
        if (this.universe) mapping['Universe'] = this.universe.address;
        if (this.contracts.get('Augur').address === undefined) throw new Error('Augur not uploaded.');
        mapping['Augur'] = this.contracts.get('Augur').address!;
        mapping['LegacyReputationToken'] = this.contracts.get('LegacyReputationToken').address!;
        mapping['Cash'] = this.getContractAddress('Cash');
        const USDCAddress = this.configuration.deploy.externalAddresses.USDC || this.getContractAddress('USDC');
        const USDTAddress = this.configuration.deploy.externalAddresses.USDT || this.getContractAddress('USDT');
        mapping['USDC'] = USDCAddress;
        mapping['USDT'] = USDTAddress;
        mapping['BuyParticipationTokens'] = this.contracts.get('BuyParticipationTokens').address!;
        mapping['RedeemStake'] = this.contracts.get('RedeemStake').address!;
        mapping['AugurTrading'] = this.contracts.get('AugurTrading').address!;
        mapping['Exchange'] = this.contracts.get('Exchange').address!;

        mapping['UniswapV2Factory'] = this.contracts.get('UniswapV2Factory').address!;
        mapping['UniswapV2Router02'] = this.contracts.get('UniswapV2Router02').address!;
        const uniswapV2Factory = new UniswapV2Factory(this.dependencies, this.getContractAddress('UniswapV2Factory'));
        mapping['EthExchange'] = await uniswapV2Factory.getPair_(this.getContractAddress('WETH9'), this.getContractAddress('Cash'));
        mapping['USDCExchange'] = await uniswapV2Factory.getPair_(USDCAddress, this.getContractAddress('Cash'));
        mapping['USDTExchange'] = await uniswapV2Factory.getPair_(USDTAddress, this.getContractAddress('Cash'));
        mapping['AuditFunds'] = this.contracts.get('AuditFunds').address!;
        mapping['AccountLoader'] = this.contracts.get('AccountLoader').address!;

        mapping['OICash'] = this.contracts.get('OICash').address!;
        mapping['AugurWalletRegistry'] = this.contracts.get('AugurWalletRegistry').address!;
        for (let contract of this.contracts) {
            if (/^I[A-Z].*/.test(contract.contractName)) continue;
            if (contract.contractName === 'ERC20Proxy1155') continue;
            if (contract.contractName === 'TimeControlled') continue;
            if (contract.contractName === 'Universe') continue;
            if (contract.contractName === 'ReputationToken') continue;
            if (contract.contractName === 'TestNetReputationToken') continue;
            if (contract.contractName === 'TestNetReputationTokenFactory') continue;
            if (contract.contractName === 'RelayHub') continue;
            if (contract.contractName === 'Time') contract = this.configuration.deploy.normalTime ? contract : this.contracts.get('TimeControlled');
            if (contract.contractName === 'ReputationTokenFactory') contract = this.configuration.deploy.isProduction ? contract: this.contracts.get('TestNetReputationTokenFactory');
            if (contract.relativeFilePath.startsWith('legacy_reputation/')) continue;
            if (contract.relativeFilePath.startsWith('external/')) continue;
            if (contract.relativeFilePath.startsWith('uniswap/')) continue;

            // 0x
            if (this.configuration.deploy.externalAddresses.Exchange && [
              'ERC20Proxy',
              'ERC721Proxy',
              'ERC1155Proxy',
              'Exchange',
              'Coordinator',
              'CoordinatorRegistry',
              'MultiAssetProxy',
              'ChaiBridge',
              'DevUtils',
              'WETH9',
              'ZRXToken',
            ].includes(contract.contractName)) continue;
            if (contract.contractName === 'Exchange') continue;

            if (contract.contractName !== 'Map' && contract.relativeFilePath.startsWith('libraries/')) continue;
            if (['Cash', 'USDC', 'USDT'].includes(contract.contractName)) continue;
            if (['IAugur', 'IDisputeCrowdsourcer', 'IDisputeWindow', 'IUniverse', 'IMarket', 'IReportingParticipant', 'IReputationToken', 'IOrders', 'IShareToken', 'Order', 'IV2ReputationToken', 'IInitialReporter'].includes(contract.contractName)) continue;
            if (contract.address === undefined) throw new Error(`${contract.contractName} not uploaded.`);

            mapping[contract.contractName] = contract.address;
        }

        return mapping;
    }

    getContractAddress = (contractName: string): string => {
        if (this.configuration.deploy.externalAddresses[contractName]) return this.configuration.deploy.externalAddresses[contractName];
        if (!this.contracts.has(contractName)) throw new Error(`Contract named ${contractName} does not exist.`);
        const contract = this.contracts.get(contractName);
        if (contract.address === undefined) throw new Error(`Contract name ${contractName} has not yet been uploaded.`);
        return contract.address;
    };

    private async uploadAugurWalletFactory(): Promise<string> {
        console.log('Uploading Augur Wallet Factory...');
        const contract = await this.contracts.get('AugurWalletFactory');
        contract.address = await this.construct(contract, []);
        return contract.address;
    }

    private async uploadAugur(): Promise<Augur> {
        console.log('Uploading augur...');
        const contract = await this.contracts.get('Augur');
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
        const contract = await this.contracts.get('AugurTrading');
        const address = await this.construct(contract, [this.augur!.address]);
        const augurTrading = new AugurTrading(this.dependencies, address);
        const ownerAddress = await augurTrading.uploader_();
        contract.address = address;
        if (ownerAddress.toLowerCase() !== (await this.signer.getAddress()).toLowerCase()) {
            throw new Error('Augur Trading owner does not equal from address');
        }
        console.log(`Augur Trading address: ${augurTrading.address}`);
        return augurTrading;
    }

    private async uploadTestDaiContracts(): Promise<void> {
        const cashContract = await this.contracts.get('Cash');
        cashContract.address = await this.uploadAndAddToAugur(cashContract, 'Cash', []);

        const weth9Contract = this.contracts.get('WETH9');
        weth9Contract.address = await this.uploadAndAddToAugur(weth9Contract, 'WETH9');

        const cash = new Cash(this.dependencies, cashContract.address);
    }

    private async uploadTestUSDxContracts(): Promise<void> {
        const usdcContract = await this.contracts.get('USDC');
        usdcContract.address = await this.uploadAndAddToAugur(usdcContract, 'USDC', []);
        const usdc = new USDC(this.dependencies, usdcContract.address);

        const usdtContract = await this.contracts.get('USDT');
        usdtContract.address = await this.uploadAndAddToAugur(usdtContract, 'USDT', []);
        const usdt = new USDT(this.dependencies, usdtContract.address);
    }

    async uploadLegacyRep(): Promise<string> {
        const contract = await this.contracts.get('LegacyReputationToken');
        contract.address = await this.uploadAndAddToAugur(contract, 'LegacyReputationToken');
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

      const multiAssetProxyContract = this.contracts.get('MultiAssetProxy');
      multiAssetProxyContract.address = await this.uploadAndAddToAugur(multiAssetProxyContract, 'MultiAssetProxy');

      const zeroXExchangeContract = await this.contracts.get('Exchange');
      zeroXExchangeContract.address = await this.uploadAndAddToAugur(zeroXExchangeContract, 'ZeroXExchange', [networkId]);

      const zeroXCoordinatorContract = await this.contracts.get('Coordinator');
      zeroXCoordinatorContract.address = await this.uploadAndAddToAugur(zeroXCoordinatorContract, 'ZeroXCoordinator', [zeroXExchangeContract.address, networkId]);

      const coordinatorRegistryContract = await this.contracts.get('CoordinatorRegistry');
      coordinatorRegistryContract.address = await this.uploadAndAddToAugur(coordinatorRegistryContract, 'CoordinatorRegistry');

      const chaiBridgeContract = this.contracts.get('ChaiBridge');
      chaiBridgeContract.address = await this.uploadAndAddToAugur(chaiBridgeContract, 'ChaiBridge', []);

      const devUtilsContract = this.contracts.get('DevUtils');
      devUtilsContract.address = await this.uploadAndAddToAugur(devUtilsContract, 'DevUtils', [zeroXExchangeContract.address, chaiBridgeContract.address]);

      const zrxTokenContract = this.contracts.get('ZRXToken');
      zrxTokenContract.address = await this.uploadAndAddToAugur(zrxTokenContract, 'ZRXToken');

      const actualZeroXExchangeContract = new Exchange(this.dependencies, zeroXExchangeContract.address);
      await actualZeroXExchangeContract.registerAssetProxy(erc1155ProxyContract.address);
      await actualZeroXExchangeContract.registerAssetProxy(erc20ProxyContract.address);
      await actualZeroXExchangeContract.registerAssetProxy(multiAssetProxyContract.address);

      const actualMultiAssetProxyContract = new MultiAssetProxy(this.dependencies, multiAssetProxyContract.address);
      await actualMultiAssetProxyContract.registerAssetProxy(erc1155ProxyContract.address);
      await actualMultiAssetProxyContract.registerAssetProxy(erc20ProxyContract.address);
      await actualMultiAssetProxyContract.addAuthorizedAddress(zeroXExchangeContract.address);

      const actualERC1155ProxyContract = new ERC1155Proxy(this.dependencies, erc1155ProxyContract.address);
      await actualERC1155ProxyContract.addAuthorizedAddress(zeroXExchangeContract.address);
      await actualERC1155ProxyContract.addAuthorizedAddress(multiAssetProxyContract.address);

      const actualERC20ProxyContract = new ERC20Proxy(this.dependencies, erc20ProxyContract.address);
      await actualERC20ProxyContract.addAuthorizedAddress(zeroXExchangeContract.address);
      await actualERC20ProxyContract.addAuthorizedAddress(multiAssetProxyContract.address);

      return zeroXExchangeContract.address;
    }

    private async uploadUniswapContracts() : Promise<string> {
      const uniswapV2FactoryContract = await this.contracts.get('UniswapV2Factory');
      uniswapV2FactoryContract.address = await this.uploadAndAddToAugur(uniswapV2FactoryContract, 'UniswapV2Factory', ['0x0000000000000000000000000000000000000000']);
      const uniswapRouterContract = await this.contracts.get('UniswapV2Router02');
      uniswapRouterContract.address = await this.uploadAndAddToAugur(uniswapRouterContract, 'UniswapV2Router02', [uniswapV2FactoryContract.address, this.getContractAddress('WETH9')]);
      return uniswapV2FactoryContract.address;
    }

    private async uploadGSNV2Contracts(): Promise<string> {
        console.log('Uploading GSN V2 contracts');
        const penalizerContract = await this.contracts.get('Penalizer');
        penalizerContract.address = await this.uploadAndAddToAugur(penalizerContract, 'Penalizer');
        const stakeManagerContract = await this.contracts.get('StakeManager');
        stakeManagerContract.address = await this.uploadAndAddToAugur(stakeManagerContract, 'StakeManager');
        const relayHubContract = await this.contracts.get('RelayHubV2');
        relayHubContract.address = await this.uploadAndAddToAugur(relayHubContract, 'RelayHubV2', [stakeManagerContract.address, penalizerContract.address]);
        return relayHubContract.address;
    }

    private async uploadERC20Proxy1155Contracts(): Promise<string> {
        console.log('Uploading ERC20 proxy contracts');
        const shareToken = this.contracts.get('ShareToken');
        const masterProxy = this.contracts.get('ERC20Proxy1155');
        const nexus = this.contracts.get('ERC20Proxy1155Nexus');

        masterProxy.address = await this.construct(masterProxy, []);
        nexus.address = await this.construct(nexus, [masterProxy.address, shareToken.address]);

        return nexus.address;
    }

    private async uploadAllContracts(): Promise<void> {
        console.log('Uploading contracts...');

        if (this.configuration.deploy.serial) { // needed for deploy to ganache
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
        const contractName = contract.contractName;
        if (contractName === 'Augur') return;
        if (contractName === 'Delegator') return;
        if (contractName === 'TimeControlled') return;
        if (contractName === 'TestNetReputationTokenFactory') return;
        if (contractName === 'AugurTrading') return;
        if (contractName === 'Universe') return;
        if (contractName === 'ReputationToken') return;
        if (contractName === 'TestNetReputationToken') return;
        if (contractName === 'Time') contract = this.configuration.deploy.normalTime ? contract : this.contracts.get('TimeControlled');
        if (contractName === 'ReputationTokenFactory') contract = this.configuration.deploy.isProduction ? contract : this.contracts.get('TestNetReputationTokenFactory');
        if (contract.relativeFilePath.startsWith('legacy_reputation/')) return;
        if (contract.relativeFilePath.startsWith('uniswap/')) return;
        if (contract.relativeFilePath.startsWith('gsn/')) return;
        if (contractName === 'LegacyReputationToken') return;
        if (contractName === 'Cash') return;
        if (contractName === 'USDC') return;
        if (contractName === 'USDT') return;
        if (contractName === 'ERC20Proxy1155') return;
        if (contractName === 'ERC20Proxy1155Nexus') return;
        // 0x
        if ([
          'ERC20Proxy',
          'ERC721Proxy',
          'ERC1155Proxy',
          'MultiAssetProxy',
          'Exchange',
          'Coordinator',
          'CoordinatorRegistry',
          'ChaiBridge',
          'DevUtils',
          'WETH9',
          'ZRXToken',
        ].includes(contractName)) return;
        if (contractName !== 'Map' && contract.relativeFilePath.startsWith('libraries/')) return;
        if (['Cash', 'USDC', 'USDT'].includes(contract.contractName)) return;
        if (['IAugur', 'IDisputeCrowdsourcer', 'IDisputeWindow', 'IUniverse', 'IMarket', 'IReportingParticipant', 'IReputationToken', 'IOrders', 'IShareToken', 'Order', 'IV2ReputationToken', 'IInitialReporter'].includes(contract.contractName)) return;
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
                const contract = new ShareToken(this.dependencies, await this.getContractAddress('ShareToken'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing ShareToken contract');
                await contract.initialize(this.augur!.address);
                console.log('Initialized ShareToken contract');
            },
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
                const contract = new Orders(this.dependencies, await this.getContractAddress('Orders'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing Orders contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized Orders contract');
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
                const contract = new SimulateTrade(this.dependencies, await this.getContractAddress('SimulateTrade'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing SimulateTrade contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized SimulateTrade contract');
            },
            async () => {
                const contract = new ZeroXTrade(this.dependencies, await this.getContractAddress('ZeroXTrade'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing ZeroXTrade contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized ZeroXTrade contract');
            },
            async () => {
                const contract = new WarpSync(this.dependencies, await this.getContractAddress('WarpSync'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing WarpSync contract');
                await contract.initialize(this.augur!.address);
                console.log('Initialized WarpSync contract');
            },
            async () => {
                const contract = new RepOracle(this.dependencies, await this.getContractAddress('RepOracle'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing RepOracle contract');
                await contract.initialize(this.augur!.address);
                console.log('Initialized RepOracle contract');
            },
            async () => {
                const contract = new AuditFunds(this.dependencies, await this.getContractAddress('AuditFunds'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing AuditFunds contract');
                await contract.initialize(this.augur!.address);
                console.log('Initialized AuditFunds contract');
            },
            async () => {
                const contract = new AccountLoader(this.dependencies, await this.getContractAddress('AccountLoader'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing AccountLoader contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized AccountLoader contract');
            },
            async () => {
                const contract = new AugurWalletRegistry(this.dependencies, await this.getContractAddress('AugurWalletRegistry'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing AugurWalletRegistry contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address, { attachedEth:  new BigNumber(2.5e17) });
                console.log('Initialized AugurWalletRegistry contract');
            },
            async () => {
                const contract = new AugurWalletRegistryV2(this.dependencies, await this.getContractAddress('AugurWalletRegistryV2'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing AugurWalletRegistryV2 contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address, { attachedEth:  new BigNumber(2.5e17) });
                console.log('Initialized AugurWalletRegistryV2 contract');
            },
            async () => {
                const contract = new AugurWalletFactory(this.dependencies, await this.getContractAddress('AugurWalletFactory'));
                if (await contract.getInitialized_()) {
                    return;
                }
                console.log('Initializing AugurWalletFactory contract');
                await contract.initialize(this.augur!.address, this.augurTrading!.address);
                console.log('Initialized AugurWalletFactory contract');
            },
        ];

        if (!this.configuration.deploy.normalTime) {
            readiedPromises.push(async () => {
                const timeContract = await this.getContractAddress('TimeControlled');
                const time = new TimeControlled(this.dependencies, timeContract);
                console.log('Initializing TimeControlled contract');
                await time.initialize(this.augur!.address);
                console.log('Initialized TimeControlled contract');
            })
        }

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
        const augurTradingContract = await this.getContractAddress('AugurTrading');
        const augurTrading = new AugurTrading(this.dependencies, augurTradingContract);
        await augurTrading.doApprovals();
    }

    async initializeLegacyRep(): Promise<void> {
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

    private async generateLocalEnvFile(env: string, uploadBlockNumber: number, config: SDKConfiguration): Promise<void> {
        const mapping: Partial<ContractAddresses> = {};
        mapping['Augur'] = this.augur!.address;
        if (this.universe) mapping['Universe'] = this.universe.address;
        if (this.contracts.get('Augur').address === undefined) throw new Error('Augur not uploaded.');
        mapping['Augur'] = this.contracts.get('Augur').address!;
        mapping['LegacyReputationToken'] = this.contracts.get('LegacyReputationToken').address!;
        mapping['Cash'] = this.getContractAddress('Cash');
        const USDCAddress = this.configuration.deploy.externalAddresses.USDC || this.getContractAddress('USDC');
        const USDTAddress = this.configuration.deploy.externalAddresses.USDT || this.getContractAddress('USDT');
        mapping['USDC'] = USDCAddress;
        mapping['USDT'] = USDTAddress;
        mapping['BuyParticipationTokens'] = this.contracts.get('BuyParticipationTokens').address!;
        mapping['RedeemStake'] = this.contracts.get('RedeemStake').address!;
        mapping['WarpSync'] = this.contracts.get('WarpSync').address!;
        mapping['ShareToken'] = this.contracts.get('ShareToken').address!;
        mapping['HotLoading'] = this.contracts.get('HotLoading').address!;
        mapping['Affiliates'] = this.contracts.get('Affiliates').address!;
        mapping['AffiliateValidator'] = this.contracts.get('AffiliateValidator').address!;
        mapping['OICash'] = this.contracts.get('OICash').address!;
        mapping['AugurWalletRegistry'] = this.contracts.get('AugurWalletRegistry').address!;
        mapping['AugurWalletRegistryV2'] = this.contracts.get('AugurWalletRegistryV2').address!;
        mapping['UniswapV2Factory'] = this.contracts.get('UniswapV2Factory').address!;
        mapping['UniswapV2Router02'] = this.contracts.get('UniswapV2Router02').address!;
        mapping['RelayHubV2'] = this.contracts.get('RelayHubV2').address!;
        const uniswapV2Factory = new UniswapV2Factory(this.dependencies, this.getContractAddress('UniswapV2Factory'));
        mapping['EthExchange'] = await uniswapV2Factory.getPair_(this.getContractAddress('WETH9'), this.getContractAddress('Cash'));
        mapping['AuditFunds'] = this.contracts.get('AuditFunds').address!;
        mapping['AccountLoader'] = this.contracts.get('AccountLoader').address!;

        // 0x
        mapping['ERC20Proxy'] = this.contracts.get('ERC20Proxy').address!;
        mapping['ERC721Proxy'] = this.contracts.get('ERC721Proxy').address!;
        mapping['ERC1155Proxy'] = this.contracts.get('ERC1155Proxy').address!;
        mapping['MultiAssetProxy'] = this.contracts.get('MultiAssetProxy').address!;
        mapping['Exchange'] = this.contracts.get('Exchange').address!;
        mapping['Coordinator'] = this.contracts.get('Coordinator').address!;
        mapping['CoordinatorRegistry'] = this.contracts.get('CoordinatorRegistry').address!;
        mapping['ChaiBridge'] = this.contracts.get('ChaiBridge').address!;
        mapping['DevUtils'] = this.contracts.get('DevUtils').address!;
        mapping['WETH9'] = this.contracts.get('WETH9').address!;
        mapping['ZRXToken'] = this.contracts.get('ZRXToken').address!;

        if (this.contracts.get('TimeControlled')) mapping['TimeControlled'] = this.contracts.get('TimeControlled').address;
        if (this.contracts.get('Time')) mapping['Time'] = this.contracts.get('Time').address;

        for (const contract of this.contracts) {
            if (!contract.relativeFilePath.startsWith('trading/')) continue;
            if (/^I[A-Z].*/.test(contract.contractName)) continue;
            if (contract.contractName === 'ZeroXTradeToken') continue;
            if (contract.contractName === 'ERC20Proxy1155') continue;
            if (contract.address === undefined) throw new Error(`${contract.contractName} not uploaded.`);
            mapping[contract.contractName] = contract.address;
        }

        if (this.configuration.deploy.externalAddresses) {
            Object.keys(this.configuration.deploy.externalAddresses).forEach((name) => {
                const address = this.configuration.deploy.externalAddresses[name];
                mapping[name] = address;
            })
        }

        const networkId = String((await this.provider.getNetwork()).chainId) as NetworkId;

        await updateConfig(env, mergeConfig(config, {
            networkId,
            uploadBlockNumber,
            addresses: mapping as ContractAddresses,
        }));
    }
}

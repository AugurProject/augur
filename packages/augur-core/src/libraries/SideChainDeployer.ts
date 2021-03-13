import { ethers, providers } from 'ethers';
import { BigNumber } from 'bignumber.js';

import { SDKConfiguration, mergeConfig, ArbitrumDeploy, TestDeploy, SideChainAddresses, validConfigOrDie, deepCopy, SpecificArbitrum } from '@augurproject/utils';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { updateConfig, abi as ABI } from '@augurproject/artifacts';
import { Block, BlockTag } from '@ethersproject/providers';
import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';

import { sleep, stringTo32ByteHex } from './HelperFunctions';
import { Contracts, ContractData } from './Contracts';
import { Dependencies } from './GenericContractInterfaces';
import { EthersFastSubmitWallet } from './EthersFastSubmitWallet';

import {
    SideChainAugur__factory,
    SideChainAugurTrading__factory,
    SideChainShareToken__factory,
    SideChainFillOrder__factory,
    SideChainZeroXTrade__factory,
    SideChainProfitLoss__factory,
    SideChainSimulateTrade__factory,
    USDC__factory,
    ArbitrumBridge__factory,
    ArbitrumMarketGetter__factory,
} from '../contractsTS';


interface BlockGetter {
    getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>, includeTransactions?: boolean): Promise<Block>;
}

const ARBITRUM_OVERRIDES = {
    gasPrice: 1,
    gasLimit: 21000000
}

export async function deploySideChain(
    env: string,
    config: SDKConfiguration,
    account: Account,
    contracts: Contracts,
): Promise<SDKConfiguration> {
    config = deepCopy(config);
    switch (config.deploy?.sideChain?.name) {
        case 'test': return deployTestSideChain(env, config, account, contracts);
        case 'arbitrum': return deployArbitrumSideChain(env, config, account, contracts);
        case 'matic': throw Error('Matic sidechain not yet implemented.')
        default: throw Error('Must specify deploy.sideChain.name in config.')
    }
}

async function deployArbitrumSideChain(
    env: string,
    config: SDKConfiguration,
    account: Account,
    contracts: Contracts,
): Promise<SDKConfiguration> {
    console.log('Deploying contracts to Ethereum, if not yet deployed.');
    let { MarketGetter: marketGetter, Cash: cash, ZeroXExchange: zeroXExchange } = config?.deploy?.sideChain?.sideChainExternalAddresses || {};
    const specific: ArbitrumDeploy = (config.deploy.sideChain.specific || {}) as ArbitrumDeploy;
    let { pushBridge, bridge } = specific;
    const { arbChain, globalInbox } = specific;

    if (!arbChain) throw Error('Must specify deploy.sideChain.specific.arbChain in config.');
    if (!cash) throw Error('Must specify deploy.sideChain.sideChainExternalAddresses.Cash in config.');
    if (!zeroXExchange) throw Error('Must specify deploy.sideChain.sideChainExternalAddresses.ZeroXExchange in config.');

    const { signer: ethereumSigner } = await setupEthereumDeployer(config, account, {});
    if (!pushBridge) pushBridge = await construct(config, ethereumSigner, contracts.get('AugurPushBridge'));
    if (!bridge) bridge = await construct(config, ethereumSigner, contracts.get('ArbitrumBridge'), [pushBridge, config.addresses.Augur, config.addresses.ParaDeployer]);

    console.log('Deploying contracts to Arbitrum, if not yet deployed.');
    const { signer: arbitrumSigner, dependencies: arbitrumDependencies, provider: arbitrumProvider } = await setupSideChainDeployer(config, account, ARBITRUM_OVERRIDES);
    if (!marketGetter) marketGetter = await construct(config, arbitrumSigner, contracts.get('ArbitrumMarketGetter'), [bridge], ARBITRUM_OVERRIDES);

    config =  validConfigOrDie(mergeConfig(config, {
        sideChain: {
            addresses: { // the same as under deploy, plus bridge
                MarketGetter: marketGetter,
                Cash: cash,
                RepFeeTarget: marketGetter, // same contract for rep fee target and market getter
                ZeroXExchange: zeroXExchange,
                Bridge: bridge,
            },
            specific: {
                arbChain,
            }
        }
    }));

    if (globalInbox) {
        console.log('Registering global inbox and arbitrum chain address with bridge.')
        const bridgeContract = ArbitrumBridge__factory.connect(bridge, ethereumSigner);
        await bridgeContract.registerArbchain(arbChain, globalInbox, marketGetter);
    } else {
        console.log('No global inbox provided so NOT registering with bridge.')
    }

    return await deploySideChainCore(env, config, arbitrumDependencies, arbitrumProvider, arbitrumSigner, contracts, ARBITRUM_OVERRIDES);
}

async function deployTestSideChain(
    env: string,
    config: SDKConfiguration,
    account: Account,
    contracts: Contracts,
): Promise<SDKConfiguration> {
    console.log('Deploying contracts to Ethereum, if not yet deployed.');
    let { pushBridge } = (config.deploy.sideChain.specific || {}) as TestDeploy;
    let { MarketGetter: marketGetter } = config?.sideChain?.addresses || {};
    let { Cash: cash } = config.deploy?.sideChain?.sideChainExternalAddresses || {};

    const { signer: ethereumSigner, dependencies: ethereumDependencies, provider: ethereumProvider } = await setupEthereumDeployer(config, account, {});

    if (!pushBridge) pushBridge = await construct(config, ethereumSigner, contracts.get('AugurPushBridge'));
    if (!cash) cash = await construct(config, ethereumSigner, contracts.get('Cash'));
    if (!marketGetter) {
        marketGetter = await construct(config, ethereumSigner, contracts.get('TestBridgeContract'), [
            cash,
            config.addresses.OICash,
            config.addresses.Universe,
            pushBridge
        ]);
    }

    config =  validConfigOrDie(mergeConfig(config, {
        deploy: {
            sideChain: {
                sideChainExternalAddresses: {
                    Cash: cash,
                    MarketGetter: marketGetter,
                    RepFeeTarget: marketGetter,
                    ZeroXExchange: config.addresses.Exchange
                }
            }
        },
        sideChain: {
            addresses: {
                Cash: cash,
                MarketGetter: marketGetter,
                RepFeeTarget: marketGetter,
                ZeroXExchange: config.addresses.Exchange
            }
        }
    }));

    return await deploySideChainCore(env, config, ethereumDependencies, ethereumProvider, ethereumSigner, contracts);
}

async function deploySideChainCore(
    env: string,
    config: SDKConfiguration,
    dependencies: Dependencies<BigNumber>,
    provider: BlockGetter,
    signer: ethers.Signer,
    contracts: Contracts,
    overrides?: ethers.Overrides,
): Promise<SDKConfiguration> {
    const delay = delayFactory(config);

    const { MarketGetter: marketGetter, RepFeeTarget: repFeeTarget, Cash: cash, ZeroXExchange: zeroXExchange } = config.sideChain.addresses;
    const { name } = config.deploy.sideChain;
    const uploadBlockNumber = await getBlockNumber(provider);

    const addresses = await deployContracts(config, signer, contracts);

    config = validConfigOrDie(mergeConfig(config, { sideChain: {
        name,
        uploadBlockNumber,
        addresses: {
            Augur: addresses['SideChainAugur'],
            Universe: config.addresses.Universe,
            ShareToken: addresses['SideChainShareToken'],
            Cash: cash,
            Affiliates: addresses['Affiliates'],
            AugurTrading: addresses['SideChainAugurTrading'],
            FillOrder: addresses['SideChainFillOrder'],
            SimulateTrade: addresses['SideChainSimulateTrade'],
            ZeroXTrade: addresses['SideChainZeroXTrade'],
            ProfitLoss: addresses['SideChainProfitLoss'],
            MarketGetter: marketGetter,
            RepFeeTarget: repFeeTarget,
            ZeroXExchange: zeroXExchange
        }
    }}));

    await registerSideChainContracts(signer, config.sideChain.addresses, delay, overrides);

    if (config.deploy.writeArtifacts) {
        await updateConfig(env, config);
    }

    return config;
}

export interface Account {
    privateKey: string;
    address: string;
    initialBalance?: number;
}

export function accountFromPrivateKey(key: string): Account {
    key = cleanKey(key);
    return {
        privateKey: key,
        address: ethers.utils.computeAddress(key),
    }
}

function cleanKey(key: string): string {
    if (key.slice(0, 2) !== '0x') {
        key = `0x${key}`;
    }
    if (key[key.length - 1] === '\n') {
        key = key.slice(0, key.length - 1)
    }
    return key;
}

export async function makeSigner(account: Account, provider: EthersProvider) {
    return EthersFastSubmitWallet.create(account.privateKey, provider);
}

export function makeDependencies(
    account: Account,
    provider: EthersProvider,
    signer: EthersFastSubmitWallet
) {
    return new ContractDependenciesEthers(provider, signer, account.address);
}

async function setupEthereumDeployer(config: SDKConfiguration, account: Account, overrides: ethers.PayableOverrides) {
    const { http } = config.ethereum || {};
    if (!http) throw Error('Must specify ethereum.http');
    return setupDeployer(http, config, account, overrides);
}

async function setupSideChainDeployer(config: SDKConfiguration, account: Account, overrides: ethers.PayableOverrides) {
    const { http } = config.sideChain || {};
    if (!http) throw Error('Must specify sideChain.http');
    return setupDeployer(http, config, account, overrides);
}

async function setupDeployer(http: string, config: SDKConfiguration, account: Account, overrides: ethers.PayableOverrides) {
    const { rpcRetryCount, rpcRetryInterval, rpcConcurrency } = config.ethereum;
    const jsonProvider = new providers.JsonRpcProvider(http);
    const provider = new EthersProvider(
        jsonProvider,
        rpcRetryCount,
        rpcRetryInterval,
        rpcConcurrency,
    );
    if (config.gas?.override) {
        if (config.gas?.price) provider.overrideGasPrice = ethers.BigNumber.from(config.gas.price);
        if (config.gas?.limit) provider.gasLimit = ethers.BigNumber.from(config.gas.limit);
    }
    if (overrides?.gasPrice) provider.overrideGasPrice = ethers.BigNumber.from(overrides.gasPrice);
    if (overrides?.gasLimit) provider.gasLimit = ethers.BigNumber.from(overrides.gasLimit);

    const signer = await makeSigner(account, provider);
    const dependencies = await makeDependencies(account, provider, signer);

    return { signer, dependencies, provider };
}

async function deployContracts(config: SDKConfiguration, signer: ethers.Signer, contracts: Contracts): Promise<Addresses> {
    console.log('Deploying contracts.')
    const contractsToDeploy = [
        'SideChainAugur',
        'SideChainShareToken',
        'SideChainAugurTrading',
        'SideChainFillOrder',
        'SideChainProfitLoss',
        'SideChainZeroXTrade',
        'SideChainSimulateTrade',
        'Affiliates',
    ];

    const addresses: Addresses = {};
    for (const contractName of contractsToDeploy) {
        const contract = contracts.get(contractName);
        const constructorArgsMap = {
            'SideChainAugurTrading': [ addresses['SideChainAugur'] ],
        };
        const constructorArgs = constructorArgsMap[contractName] || [];
        addresses[contractName] = await construct(config, signer, contract, constructorArgs);
    }
    return addresses;
}

interface Addresses { [contractName: string]: string }

async function registerSideChainContracts(
    signerOrProvider: SignerOrProvider,
    addresses: SideChainAddresses,
    delay: Delay,
    overrides?: ethers.Overrides,
) {
    const sideChainAugur = SideChainAugur__factory.connect(addresses['Augur'], signerOrProvider);
    const sideChainAugurTrading = SideChainAugurTrading__factory.connect(addresses['AugurTrading'], signerOrProvider);
    const sideChainShareToken = SideChainShareToken__factory.connect(addresses['ShareToken'], signerOrProvider);
    const sideChainFillOrder = SideChainFillOrder__factory.connect(addresses['FillOrder'], signerOrProvider);
    const sideChainZeroXTrade = SideChainZeroXTrade__factory.connect(addresses['ZeroXTrade'], signerOrProvider);
    const sideChainProfitLoss = SideChainProfitLoss__factory.connect(addresses['ProfitLoss'], signerOrProvider);
    const sideChainSimulateTrade = SideChainSimulateTrade__factory.connect(addresses['SimulateTrade'], signerOrProvider);

    await delay();
    await sideChainAugur.registerContract(stringTo32ByteHex('Cash'), addresses['Cash'], overrides);
    await delay();
    await sideChainAugur.registerContract(stringTo32ByteHex('ShareToken'), addresses['ShareToken'], overrides);
    await delay();
    await sideChainAugur.registerContract(stringTo32ByteHex('Affiliates'), addresses['Affiliates'], overrides);
    await delay();
    await sideChainAugur.registerContract(stringTo32ByteHex('MarketGetter'), addresses['MarketGetter'], overrides);
    await delay();
    await sideChainAugur.registerContract(stringTo32ByteHex('RepFeeTarget'), addresses['RepFeeTarget'], overrides);

    await delay();
    await sideChainAugurTrading.registerContract(stringTo32ByteHex('FillOrder'), addresses['FillOrder'], overrides);
    await delay();
    await sideChainAugurTrading.registerContract(stringTo32ByteHex('ZeroXTrade'), addresses['ZeroXTrade'], overrides);
    await delay();
    await sideChainAugurTrading.registerContract(stringTo32ByteHex('ProfitLoss'), addresses['ProfitLoss'], overrides);
    await delay();
    await sideChainAugurTrading.registerContract(stringTo32ByteHex('ZeroXExchange'), addresses['ZeroXExchange'], overrides);

    await delay();
    await sideChainShareToken.initialize(sideChainAugur.address, overrides);
    await delay();
    await sideChainFillOrder.initialize(sideChainAugur.address, sideChainAugurTrading.address, overrides);
    await delay();
    await sideChainZeroXTrade.initialize(sideChainAugur.address, sideChainAugurTrading.address, overrides);
    await delay();
    await sideChainProfitLoss.initialize(sideChainAugur.address, sideChainAugurTrading.address, overrides);
    await delay();
    await sideChainSimulateTrade.initialize(sideChainAugur.address, sideChainAugurTrading.address, overrides);
}

async function construct(
    config: SDKConfiguration,
    signer: ethers.Signer,
    contract: ContractData,
    constructorArgs: string[] = null,
    overrides: ethers.PayableOverrides = null
): Promise<string> {
    constructorArgs = constructorArgs || [];
    overrides = overrides || {};
    console.log(`Upload contract: ${contract.contractName}`);

    if (config.gas?.override) {
        const {limit, price} = config.gas;
        if (limit) overrides.gasLimit = limit;
        if (price) overrides.gasPrice = price;
    }
    const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, signer);
    await delayFactory(config)();
    const contractObj = await factory.deploy(...constructorArgs, overrides);
    await contractObj.deployed();
    console.log(`Uploaded contract: ${contract.contractName}: "${contractObj.address}"`);
    return contractObj.address;
}

export async function registerArbitrumChain(config: SDKConfiguration, account: Account) {
    const { signer } = await setupEthereumDeployer(config, account, {});
    const marketGetterAddress = config.sideChain.addresses.MarketGetter;
    const { arbChain, globalInbox } = config.sideChain.specific as SpecificArbitrum;
    const bridge = ArbitrumBridge__factory.connect(config.sideChain.addresses.Bridge, signer);;
    await bridge.registerArbchain(arbChain, globalInbox, marketGetterAddress);
}

export async function bridgeMarketToArbitrum(config: SDKConfiguration, account: Account, marketAddress: string) {
    const { signer } = await setupEthereumDeployer(config, account, {});
    const arbChainAddress = (config.sideChain.specific as SpecificArbitrum).arbChain;
    const bridge = ArbitrumBridge__factory.connect(config.sideChain.addresses.Bridge, signer);
    const { gasPrice, gasLimit } = ARBITRUM_OVERRIDES;
    const r = await bridge.pushBridgeData(marketAddress, arbChainAddress, ethers.BigNumber.from(gasPrice), ethers.BigNumber.from(gasLimit));
    console.log(r)
}

export async function bridgeOICashToArbitrum(config: SDKConfiguration, account: Account, to: string, value: BigNumber) {
    const { signer } = await setupEthereumDeployer(config, account, {});
    const arbChainAddress = (config.sideChain.specific as SpecificArbitrum).arbChain;
    const bridge = ArbitrumBridge__factory.connect(config.sideChain.addresses.Bridge, signer);

    const universeAddress = config.paraDeploys[config.paraDeploy]?.addresses?.Universe;

    if (!universeAddress) throw Error('Must specify config.paraDeploy and config.paraDeploys.$cashAddr.addresses.Universe');
    const r = await bridge.depositOICash(arbChainAddress, universeAddress, to, ethers.BigNumber.from(value.toFixed()));
    console.log(r)
}

export async function bridgeCashToArbitrum(config: SDKConfiguration, account: Account, to: string, value: BigNumber) {
    const { signer } = await setupEthereumDeployer(config, account, {});
    const arbChainAddress = (config.sideChain.specific as SpecificArbitrum).arbChain;
    const bridge = ArbitrumBridge__factory.connect(config.sideChain.addresses.Bridge, signer);
    const cashAddress = config.sideChain?.addresses?.Cash;
    if (!cashAddress) throw Error('Must specify config.sideChain.addresses.Cash and config.paraDeploys.$cashAddr.addresses.OICash');
    const r = await bridge.bridgeCash(arbChainAddress, cashAddress, to, ethers.BigNumber.from(value.toFixed()));
    console.log(r)
}

export async function isMarketBridged(config: SDKConfiguration, account: Account, marketAddress: string) {
    const { signer } = await setupSideChainDeployer(config, account, ARBITRUM_OVERRIDES);
    const getterAddress = config.sideChain.addresses.MarketGetter;
    const getter = ArbitrumMarketGetter__factory.connect(getterAddress, signer);
    return getter.isValid(marketAddress, ARBITRUM_OVERRIDES);
}

export async function getMarketInfo(config: SDKConfiguration, account: Account, marketAddress: string) {
    const { signer } = await setupSideChainDeployer(config, account, ARBITRUM_OVERRIDES);
    const getterAddress = config.sideChain.addresses.MarketGetter;
    const getter = ArbitrumMarketGetter__factory.connect(getterAddress, signer);

    const isValid = await getter.isValid(marketAddress, ARBITRUM_OVERRIDES);
    const isFinalized = await getter.isFinalized(marketAddress, ARBITRUM_OVERRIDES);
    const getAffiliateFeeDivisor = await getter.getAffiliateFeeDivisor(marketAddress, ARBITRUM_OVERRIDES).then(b => b.toString());
    const getCreatorFee = await getter.getCreatorFee(marketAddress, ARBITRUM_OVERRIDES).then(b => b.toString());
    const getNumberOfOutcomes = await getter.getNumberOfOutcomes(marketAddress, ARBITRUM_OVERRIDES).then(b => b.toString());
    const getOwner = await getter.getOwner(marketAddress, ARBITRUM_OVERRIDES);
    const getUniverse = await getter.getUniverse(marketAddress, ARBITRUM_OVERRIDES);
    const getWinningPayoutNumerator0 = await getter.getWinningPayoutNumerator(marketAddress, 0, ARBITRUM_OVERRIDES).then(b => b.toString());
    const getWinningPayoutNumerator1 = await getter.getWinningPayoutNumerator(marketAddress, 1, ARBITRUM_OVERRIDES).then(b => b.toString());
    // const getWinningPayoutNumerator2 = await getter.getWinningPayoutNumerator(marketAddress, 2, ARBITRUM_OVERRIDES);
    const getNumTicks = await getter.getNumTicks(marketAddress, ARBITRUM_OVERRIDES).then(b => b.toString());
    const isFinalizedAsInvalid = await getter.isFinalizedAsInvalid(marketAddress, ARBITRUM_OVERRIDES);

    return {
        isValid, isFinalized, getAffiliateFeeDivisor, getCreatorFee, getNumberOfOutcomes, getOwner, getUniverse,
        getWinningPayoutNumerator0, getWinningPayoutNumerator1, getNumTicks, isFinalizedAsInvalid,
        // getWinningPayoutNumerator2,
    }
}

export async function mintSets(config: SDKConfiguration, account: Account, marketAddress: string, amount: BigNumber): Promise<ethers.ContractTransaction> {
    const { signer } = await setupSideChainDeployer(config, account, ARBITRUM_OVERRIDES);
    const shareTokenAddress = config.sideChain.addresses.ShareToken;
    const shareToken = SideChainShareToken__factory.connect(shareTokenAddress, signer);
    return shareToken.buyCompleteSets(marketAddress, account.address, ethers.BigNumber.from(amount.toFixed()), ARBITRUM_OVERRIDES);
}

export async function claimWinnings(config: SDKConfiguration, account: Account, marketAddress: string): Promise<ethers.ContractTransaction> {
    const { signer } = await setupSideChainDeployer(config, account, ARBITRUM_OVERRIDES);
    const shareTokenAddress = config.sideChain.addresses.ShareToken;
    const shareToken = SideChainShareToken__factory.connect(shareTokenAddress, signer);
    return shareToken.claimTradingProceeds(marketAddress, account.address, ARBITRUM_OVERRIDES);
}

export async function erc20Balance(config: SDKConfiguration, account: Account, erc20Address: string, owner: string, arbitrum: boolean): Promise<BigNumber> {
    const overrides = {}; // callStatic on arbitrum fails (revert code 3) if gas overrides are specified
    const { signer } = await (arbitrum ? setupSideChainDeployer(config, account, overrides) : setupEthereumDeployer(config, account, overrides));
    const erc20 = USDC__factory.connect(erc20Address, signer);
    const balance = await erc20.balanceOf(owner, overrides);
    return new BigNumber(balance.toString());
}

export async function erc20Approve(config: SDKConfiguration, account: Account, erc20Address: string, spender: string, amount: BigNumber): Promise<ethers.ContractTransaction> {
    const { signer } = await setupSideChainDeployer(config, account, ARBITRUM_OVERRIDES);
    const erc20 = USDC__factory.connect(erc20Address, signer);
    return erc20.approve(spender, ethers.BigNumber.from(amount.toFixed()), ARBITRUM_OVERRIDES);
}

async function getBlockNumber(provider: BlockGetter): Promise<number> {
    return provider.getBlock('latest').then(block => block.number);
}

type Delay = () => Promise<void>;
function delayFactory(config: SDKConfiguration):  Delay {
    const delayMS = config.deploy?.sideChain?.delayMS || 0;
    return async () => {
        console.log('Time before delay: ', new Date().toTimeString());
        await sleep(delayMS);
        console.log('Time after delay: ', new Date().toTimeString());
    }
}

export type SignerOrProvider = ethers.Signer | ethers.providers.Provider;

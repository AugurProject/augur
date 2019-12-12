import pytest
import eth
import eth_tester
from typing import Any
from datetime import timedelta
from eth_tester import PyEVMBackend, EthereumTester
from solc import compile_standard
from io import open as io_open
from json import dump as json_dump, load as json_load, dumps as json_dumps
from os import path, walk, makedirs, remove as remove_file
from re import findall
from contract import Contract
from utils import stringToBytes, BuyWithCash, PrintGasUsed, nullAddress

from web3 import (
    EthereumTesterProvider,
    Web3,
)

from web3.middleware import (
    abi_middleware,
    attrdict_middleware,
    gas_price_strategy_middleware,
    name_to_address_middleware,
    normalize_errors_middleware,
    pythonic_middleware,
    request_parameter_normalizer,
    validation_middleware,
)

from eth_typing import (
    Address,
    Hash32
)

from trie import (
    HexaryTrie,
)

from eth.db.hash_trie import HashTrie

from eth._utils.padding import (
    pad32,
)

from eth_utils import (
    encode_hex,
    is_checksum_address,
    int_to_big_endian,
)

from eth.rlp.headers import (
    BlockHeader,
    HeaderParams,
)

from eth_hash.auto import keccak
from eth_utils import (
    encode_hex,
)

from eth import constants
from eth.exceptions import (
    OutOfGas,
)
from eth.vm.computation import BaseComputation
from eth.vm.forks.homestead.computation import (
    HomesteadComputation,
)

from eth.vm.forks.spurious_dragon.opcodes import SPURIOUS_DRAGON_OPCODES

from hexbytes.main import HexBytes

import rlp

import web3

genesis_overrides = {
    'gas_limit': 800000000
}
custom_genesis_params = PyEVMBackend._generate_genesis_params(overrides=genesis_overrides)
custom_genesis_state = PyEVMBackend._generate_genesis_state(num_accounts=9)

# Hacks to reduce test time
def new_is_valid_opcode(self, position: int) -> bool:
    return True

def new_default_middlewares(self, web3):
    return [
        (request_parameter_normalizer, 'request_param_normalizer'),
        (gas_price_strategy_middleware, 'gas_price_strategy'),
        (name_to_address_middleware(web3), 'name_to_address'),
        (attrdict_middleware, 'attrdict'),
        (pythonic_middleware, 'pythonic'),
        (normalize_errors_middleware, 'normalize_errors'),
        (validation_middleware, 'validation'),
        (abi_middleware, 'abi'),
    ]

def new_debug2(self, message: str, *args: Any, **kwargs: Any) -> None:
    pass

def new_get_storage(self, address: Address, slot: int, from_journal: bool=True) -> int:
        account = self._get_account(address, from_journal)
        storage = HashTrie(HexaryTrie(self._journaldb, account.storage_root))

        slot_as_key = pad32(int_to_big_endian(slot))

        encoded_value = storage[slot_as_key]
        if not encoded_value:
            return 0
        return rlp.decode(encoded_value, sedes=rlp.sedes.big_endian_int)

def dumb_gas_search(*args) -> int:
    return 790000000

def dumb_get_buffered_gas_estimate(web3, transaction, gas_buffer=100000):
    return 790000000

def dumb_estimateGas(self, transaction, block_identifier=None):
    return 790000000

def new_create_header_from_parent(self,
                                parent_header: BlockHeader,
                                **header_params: HeaderParams) -> BlockHeader:
    header = self.get_vm_class_for_block_number(
        block_number=parent_header.block_number + 1,
    ).create_header_from_parent(parent_header, **header_params)
    header._gas_limit = 800000000
    return header

def new_apply_create_message(self) -> BaseComputation:
        snapshot = self.state.snapshot()

        # EIP161 nonce incrementation
        self.state.account_db.increment_nonce(self.msg.storage_address)

        computation = self.apply_message()

        if computation.is_error:
            self.state.revert(snapshot)
            return computation
        else:
            contract_code = computation.output

            if contract_code:
                contract_code_gas_cost = len(contract_code) * constants.GAS_CODEDEPOSIT
                try:
                    computation.consume_gas(
                        contract_code_gas_cost,
                        reason="Write contract code for CREATE",
                    )
                except OutOfGas as err:
                    # Different from Frontier: reverts state on gas failure while
                    # writing contract code.
                    computation._error = err
                    self.state.revert(snapshot)
                else:
                    if self.logger:
                        self.logger.debug2(
                            "SETTING CODE: %s -> length: %s | hash: %s",
                            encode_hex(self.msg.storage_address),
                            len(contract_code),
                            encode_hex(keccak(contract_code))
                        )

                    self.state.account_db.set_code(self.msg.storage_address, contract_code)
                    self.state.commit(snapshot)
            else:
                self.state.commit(snapshot)
            return computation

eth.vm.code_stream.CodeStream.is_valid_opcode = new_is_valid_opcode
eth.vm.forks.spurious_dragon.computation.SpuriousDragonComputation.apply_create_message = new_apply_create_message
eth.tools.logging.ExtendedDebugLogger.debug2 = new_debug2
eth.db.account.AccountDB.get_storage = new_get_storage
web3.manager.RequestManager.default_middlewares = new_default_middlewares
web3._utils.transactions.get_buffered_gas_estimate = dumb_get_buffered_gas_estimate
eth.chains.base.Chain.create_header_from_parent = new_create_header_from_parent
old_estimateGas = web3.eth.Eth.estimateGas
web3.eth.Eth.estimateGas = dumb_estimateGas

# used to resolve relative paths
BASE_PATH = path.dirname(path.abspath(__file__))
def resolveRelativePath(relativeFilePath):
    return path.abspath(path.join(BASE_PATH, relativeFilePath))
COMPILATION_CACHE = resolveRelativePath('./compilation_cache')

class bcolors:
    WARN = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'

CONTRACT_SIZE_LIMIT = 24576.0
CONTRACT_SIZE_WARN_LEVEL = CONTRACT_SIZE_LIMIT * 0.75

def pytest_addoption(parser):
    parser.addoption("--cover", action="store_true", help="Use the coverage enabled contracts. Meant to be used with the tools/generateCoverageReport.js script")
    parser.addoption("--subFork", action="store_true", help="Use the coverage enabled contracts. Meant to be used with the tools/generateCoverageReport.js script")

def pytest_configure(config):
    # register an additional marker
    config.addinivalue_line("markers", "cover: use coverage contracts")

TRADING_CONTRACTS = ['CreateOrder','FillOrder','CancelOrder','Trade','Orders','ZeroXTrade','ProfitLoss','SimulateTrade']

class ContractsFixture:
    signatures = {}
    compiledCode = {}

    ####
    #### Static Methods
    ####

    @staticmethod
    def ensureCacheDirectoryExists():
        if not path.exists(COMPILATION_CACHE):
            makedirs(COMPILATION_CACHE)

    def __init__(self, request):
        self.eth_tester = EthereumTester(backend=PyEVMBackend(genesis_parameters=custom_genesis_params, genesis_state=custom_genesis_state))
        self.testerProvider = EthereumTesterProvider(ethereum_tester=self.eth_tester)
        self.w3 = Web3(self.testerProvider)
        self.eth_tester.backend.chain.gas_estimator = dumb_gas_search
        self.privateKeys = self.eth_tester.backend.account_keys
        self.accounts = self.eth_tester.get_accounts()
        self.contracts = {}
        self.relativeContractsPath = '../source/contracts'
        self.relativeTestContractsPath = 'solidity_test_helpers'
        # self.relativeTestContractsPath = 'mock_templates/contracts'
        self.coverageMode = request.config.option.cover
        self.subFork = request.config.option.subFork
        self.logListener = None
        if self.coverageMode:
            self.logListener = self.writeLogToFile
            self.relativeContractsPath = '../coverageEnv/contracts'
            self.relativeTestContractsPath = '../coverageEnv/solidity_test_helpers'

    def writeLogToFile(self, message):
        with open('./allFiredEvents', 'a') as logsFile:
            logData = message.__dict__
            for key, value in logData.items():
                if type(value) == HexBytes:
                    logData[key] = value.hex()[2:]
            logData['topics'] = [val.hex()[2:] for val in logData['topics']]
            logData['data'] = logData['data'][2:]
            logsFile.write(json_dumps(logData) + '\n')

    def generateSignature(self, relativeFilePath):
        ContractsFixture.ensureCacheDirectoryExists()
        filename = path.basename(relativeFilePath)
        name = path.splitext(filename)[0]
        outputPath = path.join(COMPILATION_CACHE,  name + 'Signature')
        lastCompilationTime = path.getmtime(outputPath) if path.isfile(outputPath) else 0
        if path.getmtime(relativeFilePath) > lastCompilationTime:
            print('generating signature for ' + name)
            extension = path.splitext(filename)[1]
            signature = None
            if extension == '.sol':
                signature = self.compileSolidity(relativeFilePath)['abi']
            else:
                raise
            with open(outputPath, mode='w') as file:
                json_dump(signature, file)
        else:
            pass#print('using cached signature for ' + name)
        with open(outputPath, 'r') as file:
            signature = json_load(file)
        return(signature)

    def getCompiledCode(self, relativeFilePath):
        filename = path.basename(relativeFilePath)
        name = path.splitext(filename)[0]
        if name in ContractsFixture.compiledCode:
            return ContractsFixture.compiledCode[name]
        dependencySet = set()
        self.getAllDependencies(relativeFilePath, dependencySet)
        ContractsFixture.ensureCacheDirectoryExists()
        compiledOutputPath = path.join(COMPILATION_CACHE, name)
        lastCompilationTime = path.getmtime(compiledOutputPath) if path.isfile(compiledOutputPath) else 0
        needsRecompile = False
        for dependencyPath in dependencySet:
            if (path.getmtime(dependencyPath) > lastCompilationTime):
                needsRecompile = True
                break
        if (needsRecompile):
            print('compiling ' + name + '...')
            extension = path.splitext(filename)[1]
            compiledCode = None
            if extension == '.sol':
                compiledCode = bytearray.fromhex(self.compileSolidity(relativeFilePath)['evm']['bytecode']['object'])
            else:
                raise
            with io_open(compiledOutputPath, mode='wb') as file:
                file.write(compiledCode)
        else:
            pass#print('using cached compilation for ' + name)
        with io_open(compiledOutputPath, mode='rb') as file:
            compiledCode = file.read()
            contractSize = len(compiledCode)
            if (contractSize >= CONTRACT_SIZE_LIMIT):
                print('%sContract %s is OVER the size limit by %d bytes%s' % (bcolors.FAIL, name, contractSize - CONTRACT_SIZE_LIMIT, bcolors.ENDC))
            elif (contractSize >= CONTRACT_SIZE_WARN_LEVEL):
                print('%sContract %s is under size limit by only %d bytes%s' % (bcolors.WARN, name, CONTRACT_SIZE_LIMIT - contractSize, bcolors.ENDC))
            elif (contractSize > 0):
                pass#print('Size: %i' % contractSize)
            ContractsFixture.compiledCode[name] = compiledCode
            return(compiledCode)

    def compileSolidity(self, relativeFilePath):
        absoluteFilePath = resolveRelativePath(relativeFilePath)
        filename = path.basename(relativeFilePath)
        contractName = path.splitext(filename)[0]
        compilerParameter = {
            'language': 'Solidity',
            'sources': {
                absoluteFilePath: {
                    'urls': [ absoluteFilePath ]
                }
            },
            'settings': {
                # TODO: Remove 'remappings' line below and update 'sources' line above
                'remappings': [ 'ROOT=%s/' % resolveRelativePath(self.relativeContractsPath), 'TEST=%s/' % resolveRelativePath(self.relativeTestContractsPath) ],
                'optimizer': {
                    'enabled': True,
                    'runs': 200
                },
                'outputSelection': {
                    "*": {
                        '*': [ 'metadata', 'evm.bytecode', 'evm.sourceMap', 'abi' ]
                    }
                }
            }
        }
        return compile_standard(compilerParameter, allow_paths=resolveRelativePath("../"))['contracts'][absoluteFilePath][contractName]

    def getAllDependencies(self, filePath, knownDependencies):
        knownDependencies.add(filePath)
        fileDirectory = path.dirname(filePath)
        with open(filePath, 'r') as file:
            fileContents = file.read()
        matches = findall("inset\('(.*?)'\)", fileContents)
        for match in matches:
            dependencyPath = path.abspath(path.join(fileDirectory, match))
            if not dependencyPath in knownDependencies:
                self.getAllDependencies(dependencyPath, knownDependencies)
        matches = findall("create\('(.*?)'\)", fileContents)
        for match in matches:
            dependencyPath = path.abspath(path.join(fileDirectory, match))
            if not dependencyPath in knownDependencies:
                self.getAllDependencies(dependencyPath, knownDependencies)
        matches = findall("import ['\"](.*?)['\"]", fileContents)
        for match in matches:
            dependencyPath = path.join(BASE_PATH, self.relativeContractsPath, match).replace("ROOT/", "")
            if "TEST" in dependencyPath:
                dependencyPath = path.join(BASE_PATH, self.relativeTestContractsPath, match).replace("TEST/", "")
            if not path.isfile(dependencyPath):
                print("BAD DEPS for", filePath)
                print("BAD DEPS is", dependencyPath)
                raise Exception("Could not resolve dependency file path: %s" % dependencyPath)
            if not dependencyPath in knownDependencies:
                self.getAllDependencies(dependencyPath, knownDependencies)
        return(knownDependencies)

    def uploadAndAddToAugur(self, relativeFilePath, lookupKey = None, signatureKey = None, constructorArgs=[]):
        lookupKey = lookupKey if lookupKey else path.splitext(path.basename(relativeFilePath))[0]
        #with PrintGasUsed(self, "UPLOAD CONTRACT %s" % lookupKey, 0):
        contract = self.upload(relativeFilePath, lookupKey, signatureKey, constructorArgs)
        if not contract: return None
        if lookupKey in TRADING_CONTRACTS:
            self.contracts['AugurTrading'].registerContract(lookupKey.ljust(32, '\x00').encode('utf-8'), contract.address)
        else:
            self.contracts['Augur'].registerContract(lookupKey.ljust(32, '\x00').encode('utf-8'), contract.address)
        return(contract)

    def generateAndStoreSignature(self, relativePath):
        key = path.splitext(path.basename(relativePath))[0]
        resolvedPath = resolveRelativePath(relativePath)
        if self.coverageMode:
            resolvedPath = resolvedPath.replace("tests", "coverageEnv").replace("source/", "coverageEnv/")
        if key not in ContractsFixture.signatures:
            ContractsFixture.signatures[key] = self.generateSignature(resolvedPath)

    def upload(self, relativeFilePath, lookupKey = None, signatureKey = None, constructorArgs=[]):
        resolvedPath = resolveRelativePath(relativeFilePath)
        if self.coverageMode:
            resolvedPath = resolvedPath.replace("tests", "coverageEnv").replace("source/", "coverageEnv/")
        lookupKey = lookupKey if lookupKey else path.splitext(path.basename(resolvedPath))[0]
        signatureKey = signatureKey if signatureKey else lookupKey
        if lookupKey in self.contracts:
            return(self.contracts[lookupKey])
        compiledCode = self.getCompiledCode(resolvedPath)
        # abstract contracts have a 0-length array for bytecode
        if len(compiledCode) == 0:
            if ("libraries" in relativeFilePath or lookupKey.startswith("I") or lookupKey.startswith("Base") or lookupKey.startswith("DS")):
                pass#print "Skipping upload of " + lookupKey + " because it had no bytecode (likely a abstract class/interface)."
            else:
                raise Exception("Contract: " + lookupKey + " has no bytecode, but this is not expected. It probably doesn't implement all its abstract methods")
            return None
        if signatureKey not in ContractsFixture.signatures:
            ContractsFixture.signatures[signatureKey] = self.generateSignature(resolvedPath)
        signature = ContractsFixture.signatures[signatureKey]
        W3Contract = self.w3.eth.contract(abi=signature, bytecode=compiledCode)
        deploy_address = self.accounts[0]
        tx_hash = W3Contract.constructor(*constructorArgs).transact({'from': deploy_address, 'gasPrice': 1, 'gas': 750000000})
        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash, 180)
        if tx_receipt.status == 0:
            raise Exception("Contract upload %s failed" % lookupKey)
        w3Contract = W3Contract(tx_receipt.contractAddress)
        contract = Contract(self.w3, w3Contract, self.logListener, self.coverageMode)
        self.contracts[lookupKey] = contract
        return contract

    def applySignature(self, signatureName, address, signature=None):
        assert address
        if signature is None:
            signature = ContractsFixture.signatures[signatureName]
        W3Contract = self.w3.eth.contract(abi=signature)
        w3Contract = W3Contract(address)
        contract = Contract(self.w3, w3Contract, self.logListener, self.coverageMode)
        return contract

    def createSnapshot(self):
        return self.eth_tester.take_snapshot()

    def resetToSnapshot(self, snapshot):
        self.eth_tester.revert_to_snapshot(snapshot)

    def createSnapshot(self):
        contractsCopy = {}
        for contractName in self.contracts:
            contractsCopy[contractName] = dict(signature = self.contracts[contractName].abi, address = self.contracts[contractName].address)
        return  { 'snapshot_id': self.eth_tester.take_snapshot(), 'contracts': contractsCopy }

    def resetToSnapshot(self, snapshot):
        if not 'snapshot_id' in snapshot: raise "snapshot is missing 'snapshot_id'"
        if not 'contracts' in snapshot: raise "snapshot is missing 'contracts'"
        self.eth_tester.revert_to_snapshot(snapshot['snapshot_id'])
        self.contracts = {}
        for contractName in snapshot['contracts']:
            contract = snapshot['contracts'][contractName]
            self.contracts[contractName] = self.applySignature(None, contract['address'], contract['signature'])

    def getBlockNumber(self):
        return self.eth_tester.backend.chain.header.block_number

    def mineBlocks(self, numBlocks):
        for i in range(int(numBlocks)):
            self.eth_tester.backend.chain.mine_block()

    def uploadAllContracts(self):
        for directory, _, filenames in walk(resolveRelativePath(self.relativeContractsPath)):
            # skip the legacy reputation directory since it is unnecessary and we don't support uploads of contracts with constructors yet
            if 'legacy_reputation' in directory: continue
            if 'external' in directory: continue
            if '0x' in directory: continue # uploaded separately
            if 'uniswap' in directory: continue
            for filename in filenames:
                name = path.splitext(filename)[0]
                extension = path.splitext(filename)[1]
                if extension != '.sol': continue
                if name == 'augur': continue
                if name == 'Augur': continue
                if name == 'Orders': continue # In testing we use the TestOrders version which lets us call protected methods
                if name == 'Time': continue # In testing and development we swap the Time library for a ControlledTime version which lets us manage block timestamp
                if name == 'ReputationTokenFactory': continue # In testing and development we use the TestNetReputationTokenFactory which lets us faucet
                if name in ['Cash', 'TestNetDaiVat', 'TestNetDaiPot', 'TestNetDaiJoin', 'CashFaucet', 'CashFaucetProxy']: continue # We upload the Test Dai contracts manually after this process
                if name in ['IAugur', 'IDisputeCrowdsourcer', 'IDisputeWindow', 'IUniverse', 'IMarket', 'IReportingParticipant', 'IReputationToken', 'IOrders', 'IShareToken', 'Order', 'IInitialReporter']: continue # Don't compile interfaces or libraries
                # TODO these four are necessary for test_universe but break everything else
                # if name == 'MarketFactory': continue # tests use mock
                # if name == 'ReputationTokenFactory': continue # tests use mock
                # if name == 'DisputeWindowFactory': continue # tests use mock
                # if name == 'UniverseFactory': continue # tests use mock
                onlySignatures = ["ReputationToken", "TestNetReputationToken", "Universe"]
                if name in onlySignatures:
                    self.generateAndStoreSignature(path.join(directory, filename))
                elif name == "TimeControlled":
                    self.uploadAndAddToAugur(path.join(directory, filename), lookupKey = "Time", signatureKey = "TimeControlled")
                # TODO this breaks test_universe tests but is necessary for other tests
                elif name == "TestNetReputationTokenFactory":
                    self.uploadAndAddToAugur(path.join(directory, filename), lookupKey = "ReputationTokenFactory", signatureKey = "TestNetReputationTokenFactory")
                elif name == "TestOrders":
                    self.uploadAndAddToAugur(path.join(directory, filename), lookupKey = "Orders", signatureKey = "TestOrders")
                else:
                    self.uploadAndAddToAugur(path.join(directory, filename))

    def uploadTestDaiContracts(self):
        self.uploadAndAddToAugur("../source/contracts/Cash.sol")
        self.uploadAndAddToAugur("../source/contracts/TestNetDaiVat.sol", lookupKey = "DaiVat", signatureKey = "DaiVat")
        self.uploadAndAddToAugur("../source/contracts/TestNetDaiPot.sol", lookupKey = "DaiPot", signatureKey = "DaiPot", constructorArgs=[self.contracts['DaiVat'].address, self.contracts['Time'].address])
        self.uploadAndAddToAugur("../source/contracts/TestNetDaiJoin.sol", lookupKey = "DaiJoin", signatureKey = "DaiJoin", constructorArgs=[self.contracts['DaiVat'].address, self.contracts['Cash'].address])
        self.contracts["Cash"].initialize(self.contracts['Augur'].address)

    def upload0xContracts(self):
        chainId = 123456
        contractSetups = [
            ("ERC20Proxy", "asset-proxy/contracts/src/ERC20Proxy", []),
            ("ERC721Proxy", "asset-proxy/contracts/src/ERC721Proxy", []),
            ("ERC1155Proxy", "asset-proxy/contracts/src/ERC1155Proxy", []),
            ("ZeroXExchange", "exchange/contracts/src/Exchange", [chainId]),
            ("ZeroXCoordinator", "coordinator/contracts/src/Coordinator", ["EXCHANGE", chainId]),
            ("CoordinatorRegistry", "coordinator/contracts/src/registry/CoordinatorRegistry", []),
            ("DevUtils", "dev-utils/contracts/src/DevUtils", ["EXCHANGE"]),
            ("WETH9", "erc20/contracts/src/WETH9", []),
            ("ZRXToken", "erc20/contracts/src/ZRXToken", []),
        ]
        zeroXContracts = dict()
        for alias, filename, constructorArgs in contractSetups:
            if constructorArgs and constructorArgs[0] == "EXCHANGE":
                constructorArgs[0] = zeroXContracts["ZeroXExchange"]
            contract = self.upload("../source/contracts/0x/{}.sol".format(filename), constructorArgs=constructorArgs)
            zeroXContracts[alias] = contract.address
            self.contracts[alias] = contract
        self.contracts["ZeroXExchange"].registerAssetProxy(zeroXContracts["ERC1155Proxy"])
        self.contracts["ZeroXExchange"].registerAssetProxy(zeroXContracts["ERC20Proxy"])
        self.contracts["ERC1155Proxy"].addAuthorizedAddress(zeroXContracts["ZeroXExchange"])
        self.contracts["ERC20Proxy"].addAuthorizedAddress(zeroXContracts["ZeroXExchange"])
        self.contracts['AugurTrading'].registerContract("ZeroXExchange".ljust(32, '\x00').encode('utf-8'), zeroXContracts["ZeroXExchange"])
        return zeroXContracts

    def uploadUniswapContracts(self):
        resolvedUniswapPath = resolveRelativePath("../source/contracts/uniswap/UniswapV2.sol")
        self.signatures["UniswapV2"] = self.generateSignature(resolvedUniswapPath)
        self.uploadAndAddToAugur("../source/contracts/uniswap/UniswapV2Factory.sol", constructorArgs=["", 1])

    def initializeAllContracts(self):
        coreContractsToInitialize = ['Time','GnosisSafeRegistry','ShareToken','WarpSync','RepPriceOracle']
        for contractName in coreContractsToInitialize:
            if getattr(self.contracts[contractName], "initialize", None):
                self.contracts[contractName].initialize(self.contracts['Augur'].address)
            else:
                raise "contract has no 'initialize' method on it."
        for contractName in TRADING_CONTRACTS:
            self.contracts[contractName].initialize(self.contracts['Augur'].address, self.contracts['AugurTrading'].address)

    ####
    #### Helpers
    ####

    def approveCentralAuthority(self):
        contractsNeedingApproval = ['Augur','FillOrder','CreateOrder']
        contractsToApprove = ['Cash']
        testersGivingApproval = [self.accounts[x] for x in range(0,8)]
        for testerKey in testersGivingApproval:
            for contractName in contractsToApprove:
                for authorityName in contractsNeedingApproval:
                    self.contracts[contractName].approve(self.contracts[authorityName].address, 2**254, sender=testerKey)
        contractsToSetApproval = ['ShareToken']
        for testerKey in testersGivingApproval:
            for contractName in contractsToSetApproval:
                for authorityName in contractsNeedingApproval:
                    self.contracts[contractName].setApprovalForAll(self.contracts[authorityName].address, True, sender=testerKey)


    def uploadAugur(self):
        # We have to upload Augur first
        with PrintGasUsed(self, "AUGUR CREATION", 0):
            return self.upload("../source/contracts/Augur.sol")

    def uploadAugurTrading(self):
        # We have to upload Augur Trading before trading contracts
        return self.upload("../source/contracts/trading/AugurTrading.sol", constructorArgs=[self.contracts["Augur"].address])

    def doAugurTradingApprovals(self):
        self.contracts["AugurTrading"].doApprovals()

    def createUniverse(self):
        augur = self.contracts['Augur']
        with PrintGasUsed(self, "GENESIS CREATION", 0):
            assert augur.createGenesisUniverse(getReturnData=False)
        universeCreatedLogs = augur.getLogs("UniverseCreated")
        universeAddress = universeCreatedLogs[0].args.childUniverse
        universe = self.applySignature('Universe', universeAddress)
        return universe

    def distributeRep(self, universe):
        # Get the reputation token for this universe and migrate legacy REP to it
        reputationToken = self.applySignature('ReputationToken', universe.getReputationToken())
        legacyRepToken = self.applySignature('LegacyReputationToken', reputationToken.getLegacyRepToken())
        totalSupply = legacyRepToken.balanceOf(self.accounts[0])
        legacyRepToken.approve(reputationToken.address, totalSupply)
        reputationToken.migrateFromLegacyReputationToken()

    def getLogValue(self, eventName, argName):
        tradeEvents = ['OrderEvent','ProfitLossChanged','MarketVolumeChanged']
        augur = self.contracts['AugurTrading'] if eventName in tradeEvents else self.contracts['Augur']
        logs = augur.getLogs(eventName)
        log = logs[0]
        return log.args.__dict__[argName]

    def createYesNoMarket(self, universe, endTime, feePerCashInAttoCash, affiliateFeeDivisor, designatedReporterAddress, sender=None, extraInfo="{description: \"description\", categories: [\"\"]}", validityBond=0, affiliateValidator=nullAddress):
        sender = sender or self.accounts[0]
        marketCreationFee = validityBond or universe.getOrCacheValidityBond(commitTx=False)
        with BuyWithCash(self.contracts['Cash'], marketCreationFee, sender, "validity bond"):
            assert universe.createYesNoMarket(int(endTime), feePerCashInAttoCash, affiliateValidator, affiliateFeeDivisor, designatedReporterAddress, extraInfo, sender=sender, getReturnData=False)
        marketAddress = self.getLogValue("MarketCreated", "market")
        market = self.applySignature('Market', marketAddress)
        return market

    def createCategoricalMarket(self, universe, numOutcomes, endTime, feePerCashInAttoCash, affiliateFeeDivisor, designatedReporterAddress, outcomes = None, sender=None, extraInfo="{description: \"description\", categories: [\"\", \"\"]}", affiliateValidator=nullAddress):
        sender = sender or self.accounts[0]
        marketCreationFee = universe.getOrCacheValidityBond(commitTx=False)
        if outcomes is None:
            outcomes = [" "] * numOutcomes
        with BuyWithCash(self.contracts['Cash'], marketCreationFee, sender, "validity bond"):
            assert universe.createCategoricalMarket(endTime, feePerCashInAttoCash, affiliateValidator, affiliateFeeDivisor, designatedReporterAddress, outcomes, extraInfo, sender=sender, getReturnData=False)
        marketAddress = self.getLogValue("MarketCreated", "market")
        market = self.applySignature('Market', marketAddress)
        return market

    def createScalarMarket(self, universe, endTime, feePerCashInAttoCash, affiliateFeeDivisor, maxPrice, minPrice, numTicks, designatedReporterAddress, sender=None, extraInfo="{description: \"description\", categories: [\"\", \"\", \"\"]}", affiliateValidator=nullAddress):
        sender = sender or self.accounts[0]
        marketCreationFee = universe.getOrCacheValidityBond(commitTx=False)
        with BuyWithCash(self.contracts['Cash'], marketCreationFee, sender, "validity bond"):
            assert universe.createScalarMarket(endTime, feePerCashInAttoCash, affiliateValidator, affiliateFeeDivisor, designatedReporterAddress, [minPrice, maxPrice], numTicks, extraInfo, sender=sender, getReturnData=False)
        marketAddress = self.getLogValue("MarketCreated", "market")
        market = self.applySignature('Market', marketAddress)
        return market

    def createReasonableYesNoMarket(self, universe, sender=None, extraInfo="{description: \"description\", categories: [\"\", \"\", \"\"]}", validityBond=0, designatedReporterAddress=None, affiliateValidator=nullAddress):
        sender = sender or self.accounts[0]
        designatedReporter = designatedReporterAddress or sender
        return self.createYesNoMarket(
            universe = universe,
            endTime = self.contracts["Time"].getTimestamp() + timedelta(days=1).total_seconds(),
            feePerCashInAttoCash = 10**16,
            affiliateValidator = affiliateValidator,
            affiliateFeeDivisor = 4,
            designatedReporterAddress = designatedReporter,
            sender = sender,
            extraInfo= extraInfo,
            validityBond= validityBond)

    def createReasonableCategoricalMarket(self, universe, numOutcomes, sender=None, affiliateValidator=nullAddress):
        sender = sender or self.accounts[0]
        return self.createCategoricalMarket(
            universe = universe,
            numOutcomes = numOutcomes,
            affiliateValidator = affiliateValidator,
            endTime = self.contracts["Time"].getTimestamp() + timedelta(days=1).total_seconds(),
            feePerCashInAttoCash = 10**16,
            affiliateFeeDivisor = 0,
            designatedReporterAddress = sender,
            sender = sender)

    def createReasonableScalarMarket(self, universe, maxPrice, minPrice, numTicks, sender=None, affiliateValidator=nullAddress):
        sender = sender or self.accounts[0]
        return self.createScalarMarket(
            universe = universe,
            endTime = self.contracts["Time"].getTimestamp() + timedelta(days=1).total_seconds(),
            feePerCashInAttoCash = 10**16,
            affiliateValidator = affiliateValidator,
            affiliateFeeDivisor = 0,
            maxPrice= maxPrice,
            minPrice= minPrice,
            numTicks= numTicks,
            designatedReporterAddress = sender,
            sender = sender)

    def getShareToken(self, market, outcome):
        address = market.getShareToken(outcome)
        return self.applySignature("ShareToken", address)

    def MKRShutdown(self):
        daiVat = self.contracts['DaiVat']
        daiJoin = self.contracts['DaiJoin']
        daiVat.cage()
        daiJoin.cage()

@pytest.fixture(scope="session")
def fixture(request):
    return ContractsFixture(request)

@pytest.fixture(scope="session")
def baseSnapshot(fixture):
    return fixture.createSnapshot()

@pytest.fixture(scope="session")
def augurInitializedSnapshot(fixture, baseSnapshot):
    fixture.resetToSnapshot(baseSnapshot)
    fixture.uploadAugur()
    fixture.uploadAugurTrading()
    fixture.uploadAllContracts()
    fixture.uploadTestDaiContracts()
    fixture.upload0xContracts()
    fixture.uploadUniswapContracts()
    fixture.initializeAllContracts()
    fixture.doAugurTradingApprovals()
    fixture.approveCentralAuthority()
    return fixture.createSnapshot()

@pytest.fixture(scope="session")
def kitchenSinkSnapshot(fixture, augurInitializedSnapshot):
    fixture.resetToSnapshot(augurInitializedSnapshot)
    legacyReputationToken = fixture.contracts['LegacyReputationToken']
    legacyReputationToken.faucet(11 * 10**6 * 10**18)
    universe = fixture.createUniverse()
    cash = fixture.contracts['Cash']
    augur = fixture.contracts['Augur']
    fixture.distributeRep(universe)

    if fixture.subFork:
        forkingMarket = fixture.createReasonableYesNoMarket(universe)
        proceedToFork(fixture, forkingMarket, universe)
        fixture.contracts["Time"].setTimestamp(universe.getForkEndTime() + 1)
        reputationToken = fixture.applySignature('ReputationToken', universe.getReputationToken())
        yesPayoutNumerators = [0, 0, forkingMarket.getNumTicks()]
        reputationToken.migrateOutByPayout(yesPayoutNumerators, reputationToken.balanceOf(fixture.accounts[0]))
        universe = fixture.applySignature('Universe', universe.createChildUniverse(yesPayoutNumerators))

    yesNoMarket = fixture.createReasonableYesNoMarket(universe)
    categoricalMarket = fixture.createReasonableCategoricalMarket(universe, 3)
    categorical8Market = fixture.createReasonableCategoricalMarket(universe, 7)
    scalarMarket = fixture.createReasonableScalarMarket(universe, 30, -10, 400000)
    fixture.uploadAndAddToAugur("solidity_test_helpers/Constants.sol")
    fixture.contracts['DaiPot'].setDSR(1000000564701133626865910626) # 5% a day

    snapshot = fixture.createSnapshot()
    snapshot['universe'] = universe
    snapshot['cash'] = cash
    snapshot['augur'] = augur
    snapshot['yesNoMarket'] = yesNoMarket
    snapshot['categoricalMarket'] = categoricalMarket
    snapshot['categorical8Market'] = categorical8Market
    snapshot['scalarMarket'] = scalarMarket
    snapshot['reputationToken'] = fixture.applySignature('ReputationToken', universe.getReputationToken())
    return snapshot

@pytest.fixture
def kitchenSinkFixture(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    return fixture

@pytest.fixture
def universe(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['universe'].address, kitchenSinkSnapshot['universe'].abi)

@pytest.fixture
def cash(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['cash'].address, kitchenSinkSnapshot['cash'].abi)

@pytest.fixture
def augur(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['augur'].address, kitchenSinkSnapshot['augur'].abi)

@pytest.fixture
def market(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['yesNoMarket'].address, kitchenSinkSnapshot['yesNoMarket'].abi)

@pytest.fixture
def yesNoMarket(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['yesNoMarket'].address, kitchenSinkSnapshot['yesNoMarket'].abi)

@pytest.fixture
def categoricalMarket(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['categoricalMarket'].address, kitchenSinkSnapshot['categoricalMarket'].abi)

@pytest.fixture
def scalarMarket(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['scalarMarket'].address, kitchenSinkSnapshot['scalarMarket'].abi)

@pytest.fixture
def reputationToken(kitchenSinkFixture, kitchenSinkSnapshot):
    return kitchenSinkFixture.applySignature(None, kitchenSinkSnapshot['reputationToken'].address, kitchenSinkSnapshot['reputationToken'].abi)


# TODO: globally replace this with `fixture` and `kitchenSinkSnapshot` as appropriate then delete this
@pytest.fixture(scope="session")
def sessionFixture(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    return fixture

@pytest.fixture
def contractsFixture(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    return fixture

@pytest.fixture
def augurInitializedFixture(fixture, augurInitializedSnapshot):
    fixture.resetToSnapshot(augurInitializedSnapshot)
    return fixture

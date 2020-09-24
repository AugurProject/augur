from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises, mark
from utils import longToHexString, EtherDelta, TokenDelta, PrintGasUsed, fix, AssertLog, longTo32Bytes, stringToBytes, BuyWithCash, nullAddress
from reporting_utils import proceedToDesignatedReporting, proceedToInitialReporting, proceedToNextRound, proceedToFork, finalize
from constants import BID, ASK, YES, NO, SHORT

def test_market_hot_loading_basic(kitchenSinkFixture, augur, cash, reputationToken):
    augurWalletRegistry = kitchenSinkFixture.contracts["AugurWalletRegistry"]
    accountLoader = kitchenSinkFixture.contracts["AccountLoader"]
    legacyReputationToken = kitchenSinkFixture.contracts['LegacyReputationToken']
    account = kitchenSinkFixture.accounts[5]
    walletAddress = augurWalletRegistry.getCreate2WalletAddress(account)

    # Lets load the account right away without doing anything to check defaults
    accountData = getAccountData(accountLoader, account, reputationToken.address, legacyReputationToken.address, legacyReputationToken.address)

    assert accountData.signerETH == 999999999999999999645100
    assert accountData.signerDAI == 0
    assert accountData.signerREP == 0
    assert accountData.signerLegacyREP == 0
    assert accountData.attoDAIperREP == 0
    assert accountData.attoDAIperETH == 0

    # Now lets make some data happen

    cash.faucet(10 * 10**18, sender=account)
    reputationToken.faucet(9 * 10**18, sender=account)
    legacyReputationToken.faucet(8 * 10**18, sender=account)

    accountData = getAccountData(accountLoader, account, reputationToken.address, legacyReputationToken.address, legacyReputationToken.address)

    assert accountData.signerETH < 999999999999999999645000
    assert accountData.signerDAI == 10 * 10**18
    assert accountData.signerREP == 9 * 10**18
    assert accountData.signerLegacyREP == 8 * 10**18

    # Now lets create some Uniswap exchanges, provide initial liquidity and confirm we get current prices 
    repOracle = kitchenSinkFixture.contracts["RepOracle"]
    repExchange = kitchenSinkFixture.applySignature("UniswapV2Pair", repOracle.getExchange(reputationToken.address))

    cashAmount = 20 * 10**18
    repAmount = 1 * 10**18
    cash.faucet(cashAmount)
    reputationToken.faucet(repAmount)

    cash.transfer(repExchange.address, cashAmount)
    reputationToken.transfer(repExchange.address, repAmount)

    repExchange.mint(account)

    accountData = getAccountData(accountLoader, account, reputationToken.address, legacyReputationToken.address, legacyReputationToken.address)
    assert accountData.attoDAIperREP == 20 * 10**18

    ZeroXTrade = kitchenSinkFixture.contracts['ZeroXTrade']
    weth = kitchenSinkFixture.contracts["WETH9"]
    ethExchange = kitchenSinkFixture.applySignature("UniswapV2Pair", ZeroXTrade.ethExchange())

    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    accountData = getAccountData(accountLoader, account, reputationToken.address, legacyReputationToken.address, cash.address)
    assert accountData.attoDAIperETH == 100 * 10**18

    # It provides the balances of the last two tokens provided
    assert accountData.signerUSDC == 8 * 10**18
    assert accountData.signerUSDT == 10 * 10**18


class AccountData:

    def __init__(self, accountData):
        self.signerETH = accountData[0]
        self.signerDAI = accountData[1]
        self.signerREP = accountData[2]
        self.signerLegacyREP = accountData[3]
        self.attoDAIperREP = accountData[4]
        self.attoDAIperETH = accountData[5]
        self.signerUSDC = accountData[14]
        self.signerUSDT = accountData[15]

def getAccountData(accountLoader, account, reputationToken, USDC, USDT):
    return AccountData(accountLoader.loadAccountData(account, reputationToken, USDC, USDT))

from eth_tester.exceptions import TransactionFailed
from utils import longToHexString, nullAddress, stringToBytes
from pytest import raises
import codecs
import functools

def test_oracle(contractsFixture, augur, cash, market, universe):
    if not contractsFixture.paraAugur:
        return

    nexus = contractsFixture.contracts["OINexus"]
    oracleAddress = nexus.oracle()
    oracle = contractsFixture.applySignature("ParaOracle", oracleAddress)
    weth = contractsFixture.applySignature("WETH9", oracle.weth())
    
    reputationTokenAddress = universe.getReputationToken()
    reputationToken = contractsFixture.applySignature('TestNetReputationToken', reputationTokenAddress)
    repExchange = contractsFixture.applySignature("UniswapV2Pair", oracle.getExchange(reputationTokenAddress))
    cashExchange =  contractsFixture.applySignature("UniswapV2Pair", oracle.getExchange(cash.address))

    account = contractsFixture.accounts[0]

    # Initially the price of both oracles will be a sentinel value of 0
    initialPrice = 0
    assert roughlyEqual(oracle.poke(reputationTokenAddress), initialPrice)
    assert roughlyEqual(oracle.poke(cash.address), initialPrice)

    token0IsWethInRepExchange = weth.address < reputationTokenAddress

    # Add liquidity to suggest the price is 25 REP = 1 ETH
    wethAmount = 1 * 10**18
    repAmount = 25 * 10**18
    addLiquidity(repExchange, weth, reputationToken, wethAmount, repAmount, account)

    # The reserves have been modified, however little time has passed so the price will not have diverged much
    oracle.poke(reputationTokenAddress)
    assert roughlyEqual(oracle.poke(reputationTokenAddress), initialPrice)

    # If we "mine" a block and advance the time 1/2 the period value of the oracle we should see the new value significantly closer to the price dictated by reserves. Specifically about half of the difference
    period = oracle.PERIOD()
    mineBlock(contractsFixture, period / 2)

    expectedNewRepPrice = 2 * 10**16 # expected eventual price is .04 ETH. Halfway is .02
    assert roughlyEqual(oracle.poke(reputationTokenAddress), expectedNewRepPrice)

    # Just calling poke again will be a no op
    assert roughlyEqual(oracle.poke(reputationTokenAddress), expectedNewRepPrice)

    # If we "mine" a block after period time then the new value will simply be the price
    mineBlock(contractsFixture, period)

    assert roughlyEqual(oracle.poke(reputationTokenAddress), 4 * 10**16)

    # Buy REP and manipulate blockNumber to affect cummulative amounts
    wethAmount = 42 * 10**15 # Trade .042 WETH for ~1 REP
    repAmount = 10**18
    buyRep(repExchange, weth, wethAmount, repAmount, token0IsWethInRepExchange, account)
    mineBlock(contractsFixture, period)

    expectedNewRepPrice = 43 * 10**15 # ETH reserve of 1.04 and rep reserve of 24 means 1 rep ~= .043 ETH
    assert roughlyEqual(oracle.poke(reputationTokenAddress), expectedNewRepPrice, 2 * 10**17)

    # Now Sell REP
    repAmount = 1 * 10**18 # Trade 1 REP for .04 ETH
    wethAmount = 4 * 10**16
    sellRep(repExchange, reputationToken, repAmount, wethAmount, token0IsWethInRepExchange, account)
    mineBlock(contractsFixture, period)

    expectedNewRepPrice = 4 * 10**16 # ETH reserve of 1.00 and rep reserve of 25 means 1 rep ~= .04 ETH
    assert roughlyEqual(oracle.poke(reputationTokenAddress), expectedNewRepPrice, 2 * 10**17)

    # Now lets get a price set up on the ETH / CASH oracle
    wethAmount = 1 * 10**18
    cashAmount = 350 * 10**18
    addLiquidity(cashExchange, weth, cash, wethAmount, cashAmount, account)
    addLiquidity(cashExchange, weth, cash, wethAmount, cashAmount, account)

    # The reserves have been modified, however little time has passed so the price will not have diverged much
    oracle.poke(cash.address)
    assert roughlyEqual(oracle.poke(cash.address), initialPrice)

    # If we "mine" a block after period time then the new value will simply be the price
    expectedPrice = 285 * 10**13
    mineBlock(contractsFixture, period)
    assert roughlyEqual(oracle.poke(cash.address), expectedPrice, 10**13)

    # Now get the Cash / REP price from the OINexus
    attoCashPerRep = nexus.getAttoCashPerRep(cash.address, reputationTokenAddress)
    assert roughlyEqual(attoCashPerRep, 14 * 10**18)


def addLiquidity(exchange, weth, reputationToken, wethAmount, repAmount, address):
    weth.deposit(value=wethAmount)
    reputationToken.faucet(repAmount)

    weth.transfer(exchange.address, wethAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.mint(address)

def buyRep(exchange, weth, wethAmount, repAmount, token0IsWethInRepExchange, address):
    weth.deposit(value=wethAmount)
    weth.transfer(exchange.address, wethAmount)

    exchange.swap(0 if token0IsWethInRepExchange else repAmount, repAmount if token0IsWethInRepExchange else 0, address, "")

def sellRep(exchange, reputationToken, repAmount, wethAmount, token0IsWethInRepExchange, address):
    reputationToken.faucet(repAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.swap(wethAmount if token0IsWethInRepExchange else 0, 0 if token0IsWethInRepExchange else wethAmount, address, "")

def mineBlock(contractsFixture, timePassed):
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + timePassed))

def roughlyEqual(amount1, amount2, tolerance=5 * 10**16):
    return abs(amount1 - amount2) < tolerance



from eth_tester.exceptions import TransactionFailed
from utils import longToHexString, nullAddress
from pytest import raises

def test_rep_oracle(contractsFixture, augur, market, universe):
    repOracle = contractsFixture.contracts["RepPriceOracle"]
    cash = contractsFixture.contracts["Cash"]
    reputationToken = contractsFixture.applySignature('TestNetReputationToken', universe.getReputationToken())

    with raises(TransactionFailed):
        repOracle.initialize(augur.address)

    account = contractsFixture.accounts[0]

    uniswapExchangeAddress = repOracle.getOrCreateUniswapExchange(reputationToken.address)
    assert uniswapExchangeAddress != nullAddress
    uniswap = contractsFixture.applySignature('UniswapV2', uniswapExchangeAddress)

    # Initially the price will just be the initialization value
    initialPrice = repOracle.genesisInitialRepPriceinAttoCash()
    assert repOracle.pokeRepPriceInAttoCash(reputationToken.address) == initialPrice

    # Add liquidity to suggest the price is 1 REP = 20 Cash
    cashAmount = 20 * 10**18
    repAmount = 1 * 10**18
    addLiquidity(uniswap, cash, reputationToken, cashAmount, repAmount, account)

    # The reserves have been modified so we will have new cumulative values which will affect the perceived price weighted by a single block
    (reserves0, reserves1) = uniswap.getReservesCumulative()
    if cash.address > reputationToken.address:
        repReserves, cashReserves = reserves0, reserves1
    else:
        cashReserves, repReserves = reserves0, reserves1

    assert cashReserves == cashAmount
    assert repReserves == repAmount

    tau = repOracle.tau()

    (exchangeAddress, cashAmount, repAmount, lastBlockNumber, price) = repOracle.exchangeData(reputationToken.address)
    blockNumber = contractsFixture.getBlockNumber()
    weight = repOracle.getWeight(blockNumber - lastBlockNumber)
    deltaPrice = cashReserves * 10**18 / repReserves
    expectedNewRepPrice = ((initialPrice * (10**18 - weight)) + (deltaPrice * weight)) / 10**18
    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), expectedNewRepPrice)

    # If we "mine" tau / 2 blocks we should see the new value significantly closer to the price dictated by reserves. Specifically about half of the difference
    # TODO: refactor below when Uniswap contracts are public
    token0, token1 = (cash.address, reputationToken.address) if cash.address < reputationToken.address else (reputationToken.address, cash.address)
    if (token0 == cash.address):
        mineBlocks(contractsFixture, uniswap, tau / 2, cashReserves, repReserves)
    else:
        mineBlocks(contractsFixture, uniswap, tau / 2, repReserves, cashReserves)

    (exchangeAddress, cashAmount, repAmount, lastBlockNumber, price) = repOracle.exchangeData(reputationToken.address)
    blockNumber = contractsFixture.getBlockNumber()
    weight = repOracle.getWeight(blockNumber - lastBlockNumber)
    deltaPrice = cashReserves * 10**18 / repReserves
    expectedNewRepPrice = ((initialPrice * (10**18 - weight)) + (deltaPrice * weight)) / 10**18
    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), expectedNewRepPrice)
    assert roughlyEqual(expectedNewRepPrice - initialPrice, (cashAmount - initialPrice) / 2)

    # If we "mine" tau blocks then the new value will simply be the price
    # TODO: refactor below when Uniswap contracts are public
    if (token0 == cash.address):
        mineBlocks(contractsFixture, uniswap, tau, cashReserves, repReserves)
    else:
        mineBlocks(contractsFixture, uniswap, tau, repReserves, cashReserves)

    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), cashAmount)

    # Buy REP and manipulate blockNumber to affect cummulative amounts
    cashAmount = 10**18 # Trade 1 Dai for ~.05 REP
    buyRep(uniswap, cash, cashAmount, account)
    # TODO: remove below when Uniswap contracts are public
    cashReserves = 21 * 10**18
    repReserves = 95 * 10**16
    if (token0 == cash.address):
        mineBlocks(contractsFixture, uniswap, tau, cashReserves, repReserves)
    else:
        mineBlocks(contractsFixture, uniswap, tau, repReserves, cashReserves)

    expectedNewRepPrice = 22 * 10**18 # Cash reserves of ~ 21 Dai and REP reserves of ~.95 REP means a price of 22 Dai / REP
    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), expectedNewRepPrice, 2 * 10**17)

    # Now Sell REP
    repAmount = 1 * 10**17 # Trade .1 REP for 2.2 DAI
    sellRep(uniswap, reputationToken, repAmount, account)
    # TODO: remove below when Uniswap contracts are public
    cashReserves = 188 * 10**17
    repReserves = 105 * 10**16
    if (token0 == cash.address):
        mineBlocks(contractsFixture, uniswap, tau, cashReserves, repReserves)
    else:
        mineBlocks(contractsFixture, uniswap, tau, repReserves, cashReserves)

    expectedNewRepPrice = 179 * 10**17 # Cash reserves of ~ 18.8 Dai and REP reserves of ~1.05 REP means a price of 17.9 Dai / REP
    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), expectedNewRepPrice, 2 * 10**17)

def addLiquidity(exchange, cash, reputationToken, cashAmount, repAmount, address):
    cash.faucet(cashAmount)
    reputationToken.faucet(repAmount)

    cash.transfer(exchange.address, cashAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.mintLiquidity(address)
    # TODO: remove below when Uniswap contracts are public
    token0, token1 = (cash.address, reputationToken.address) if cash.address < reputationToken.address else (reputationToken.address, cash.address)
    if (token0 == cash.address):
        exchange.setReservesCumulative(cashAmount, repAmount)
    else:
        exchange.setReservesCumulative(repAmount, cashAmount)

def buyRep(exchange, cash, cashAmount, address):
    cash.faucet(cashAmount)
    cash.transfer(exchange.address, cashAmount)

    exchange.swap(cash.address, address)

def sellRep(exchange, reputationToken, repAmount, address):
    reputationToken.faucet(repAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.swap(reputationToken.address, address)

def mineBlocks(contractsFixture, exchange, numBlocks, token0Amount, token1Amount):
    contractsFixture.mineBlocks(numBlocks)

    # TODO: remove below when Uniswap contracts are public
    oldToken0Amount, oldToken1Amount = exchange.getReservesCumulative()
    exchange.setReservesCumulative(oldToken0Amount + token0Amount * numBlocks, oldToken1Amount + token1Amount * numBlocks)

def roughlyEqual(amount1, amount2, tolerance=5 * 10**16):
    return abs(amount1 - amount2) < tolerance

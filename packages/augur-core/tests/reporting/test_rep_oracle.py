from eth_tester.exceptions import TransactionFailed
from utils import longToHexString, nullAddress, stringToBytes
from pytest import raises
import codecs
import functools
from old_eth_utils import sha3

def test_rep_oracle(contractsFixture, augur, market, universe):
    repOracle = contractsFixture.contracts["RepPriceOracle"]
    cash = contractsFixture.contracts["Cash"]
    reputationToken = contractsFixture.applySignature('TestNetReputationToken', universe.getReputationToken())

    with raises(TransactionFailed):
        repOracle.initialize(augur.address)

    account = contractsFixture.accounts[0]

    SimpleDexAddress = universe.repExchange()
    assert SimpleDexAddress != nullAddress
    repExchange = contractsFixture.applySignature('RepExchange', SimpleDexAddress)

    # Initially the price will just be the initialization value
    initialPrice = repOracle.genesisInitialRepPriceinAttoCash()
    assert repOracle.pokeRepPriceInAttoCash(reputationToken.address) == initialPrice

    # Add liquidity to suggest the price is 1 REP = 20 Cash
    cashAmount = 20 * 10**18
    repAmount = 1 * 10**18
    addLiquidity(repExchange, cash, reputationToken, cashAmount, repAmount, account)

    # The reserves have been modified, however since this is our first use of actual exchange data we do not have an accurate way to get the correct _delta_ in price. So We use the initial value again.
    assert repOracle.pokeRepPriceInAttoCash(reputationToken.address) == initialPrice

    # If we "mine" a block and advance the time 1/2 the period value of the oracle we should see the new value significantly closer to the price dictated by reserves. Specifically about half of the difference
    period = repOracle.period()
    mineBlock(contractsFixture, period / 2)

    expectedNewRepPrice = initialPrice + ((cashAmount - initialPrice) / 2)
    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), expectedNewRepPrice)

    # If we "mine" a block after period time then the new value will simply be the price
    mineBlock(contractsFixture, period)

    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), cashAmount)

    # Buy REP and manipulate blockNumber to affect cummulative amounts
    cashAmount = 10**18 # Trade 1 Dai for ~.05 REP
    buyRep(repExchange, cash, cashAmount, account)
    mineBlock(contractsFixture, period)

    expectedNewRepPrice = 22 * 10**18 # Cash reserves of ~ 21 Dai and REP reserves of ~.95 REP means a price of 22 Dai / REP
    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), expectedNewRepPrice, 2 * 10**17)

    # Now Sell REP
    repAmount = 1 * 10**17 # Trade .1 REP for 1.8 DAI
    sellRep(repExchange, reputationToken, repAmount, account)
    mineBlock(contractsFixture, period)

    expectedNewRepPrice = 18.3 * 10**18 # Cash reserves of ~ 19.2 Dai and REP reserves of ~1.05 REP means a price of ~18.3 Dai / REP
    assert roughlyEqual(repOracle.pokeRepPriceInAttoCash(reputationToken.address), expectedNewRepPrice, 2 * 10**17)


def addLiquidity(exchange, cash, reputationToken, cashAmount, repAmount, address):
    cash.faucet(cashAmount)
    reputationToken.faucet(repAmount)

    cash.transfer(exchange.address, cashAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.publicMint(address)

def buyRep(exchange, cash, cashAmount, address):
    cash.faucet(cashAmount)
    cash.transfer(exchange.address, cashAmount)

    exchange.buyToken(address)

def sellRep(exchange, reputationToken, repAmount, address):
    reputationToken.faucet(repAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.sellToken(address)

def mineBlock(contractsFixture, timePassed):
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + timePassed))
    contractsFixture.mineBlocks(100)

def roughlyEqual(amount1, amount2, tolerance=5 * 10**16):
    return abs(amount1 - amount2) < tolerance

def is_bytes(value):
    return isinstance(value, (bytes, bytearray))

def combine(f, g):
    return lambda x: f(g(x))

def compose(*functions):
    return functools.reduce(combine, functions, lambda x: x)

# ensure we have the *correct* sha3 installed (keccak)
assert codecs.encode(sha3(b''), 'hex') == b'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'  # noqa

def _sub_hash(value, label):
    return sha3(value + sha3(label))

def namehash(name):
    node = b'\x00' * 32
    if name:
        if is_bytes(name):
            encoded_name = name
        else:
            encoded_name = codecs.encode(name, 'utf8')

        labels = encoded_name.split(b'.')

        return compose(*(
            functools.partial(_sub_hash, label=label)
            for label
            in labels
        ))(node)
    return node
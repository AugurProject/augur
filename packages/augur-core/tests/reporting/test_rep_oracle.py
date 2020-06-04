from eth_tester.exceptions import TransactionFailed
from utils import longToHexString, nullAddress, stringToBytes
from pytest import raises
import codecs
import functools
from old_eth_utils import sha3

def test_rep_oracle(contractsFixture, augur, market, universe):
    cash = contractsFixture.contracts["Cash"]
    reputationTokenAddress = universe.getReputationToken()
    reputationToken = contractsFixture.applySignature('TestNetReputationToken', reputationTokenAddress)
    repOracle = contractsFixture.contracts["RepOracle"]
    repExchange = contractsFixture.applySignature("UniswapV2Pair", repOracle.getExchange(reputationTokenAddress))

    account = contractsFixture.accounts[0]

    # Initially the price will just be the initialization value
    initialPrice = repOracle.genesisInitialRepPriceinAttoCash()
    assert roughlyEqual(repOracle.poke(reputationTokenAddress), initialPrice)

    token0IsCash = cash.address < reputationTokenAddress

    # Add liquidity to suggest the price is 1 REP = 20 Cash
    cashAmount = 20 * 10**18
    repAmount = 1 * 10**18
    addLiquidity(repExchange, cash, reputationToken, cashAmount, repAmount, account)

    # The reserves have been modified, however little time has passed so the price will not have diverged much
    repOracle.poke(reputationTokenAddress)
    assert roughlyEqual(repOracle.poke(reputationTokenAddress), initialPrice)

    # If we "mine" a block and advance the time 1/2 the period value of the oracle we should see the new value significantly closer to the price dictated by reserves. Specifically about half of the difference
    period = repOracle.PERIOD()
    mineBlock(contractsFixture, period / 2)

    expectedNewRepPrice = initialPrice + ((cashAmount - initialPrice) / 2)
    assert roughlyEqual(repOracle.poke(reputationTokenAddress), expectedNewRepPrice)

    # Just calling poke again will be a no op
    assert roughlyEqual(repOracle.poke(reputationTokenAddress), expectedNewRepPrice)

    # If we "mine" a block after period time then the new value will simply be the price
    mineBlock(contractsFixture, period)

    assert roughlyEqual(repOracle.poke(reputationTokenAddress), cashAmount)

    # Buy REP and manipulate blockNumber to affect cummulative amounts
    cashAmount = 10**18 # Trade 1 Dai for ~.05 REP
    repAmount = 4.7 * 10**16
    buyRep(repExchange, cash, cashAmount, repAmount, token0IsCash, account)
    mineBlock(contractsFixture, period)

    expectedNewRepPrice = 22 * 10**18 # Cash reserves of ~ 21 Dai and REP reserves of ~.95 REP means a price of 22 Dai / REP
    assert roughlyEqual(repOracle.poke(reputationTokenAddress), expectedNewRepPrice, 2 * 10**17)

    # Now Sell REP
    repAmount = 1 * 10**17 # Trade .1 REP for 1.8 DAI
    cashAmount = 1.8 * 10**18
    sellRep(repExchange, reputationToken, repAmount, cashAmount, token0IsCash, account)
    mineBlock(contractsFixture, period)

    expectedNewRepPrice = 18.2 * 10**18 # Cash reserves of ~ 19.2 Dai and REP reserves of ~1.05 REP means a price of ~18.2 Dai / REP
    assert roughlyEqual(repOracle.poke(reputationTokenAddress), expectedNewRepPrice, 2 * 10**17)


def addLiquidity(exchange, cash, reputationToken, cashAmount, repAmount, address):
    cash.faucet(cashAmount)
    reputationToken.faucet(repAmount)

    cash.transfer(exchange.address, cashAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.mint(address)

def buyRep(exchange, cash, cashAmount, repAmount, token0IsCash, address):
    cash.faucet(cashAmount)
    cash.transfer(exchange.address, cashAmount)

    exchange.swap(0 if token0IsCash else repAmount, repAmount if token0IsCash else 0, address, "")

def sellRep(exchange, reputationToken, repAmount, cashAmount, token0IsCash, address):
    reputationToken.faucet(repAmount)
    reputationToken.transfer(exchange.address, repAmount)

    exchange.swap(cashAmount if token0IsCash else 0, 0 if token0IsCash else cashAmount, address, "")

def mineBlock(contractsFixture, timePassed):
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + timePassed))

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
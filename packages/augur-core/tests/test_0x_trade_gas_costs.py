
from eth_tester.exceptions import TransactionFailed
from pytest import fixture, mark, raises
from utils import longTo32Bytes, PrintGasUsed, fix, BuyWithCash, nullAddress
from constants import BID, ASK, YES, NO
from datetime import timedelta
from trading.test_claimTradingProceeds import acquireLongShares, finalizeMarket
from reporting_utils import proceedToNextRound, proceedToFork, finalize, proceedToDesignatedReporting
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad

#pytestmark = mark.skip(reason="Just for testing gas cost")


FILL_ORDER_TAKE_SHARES   =   [
    668022,
    674250,
    680470,
    686708,
    692927,
    699176,
]

FILL_ORDER_BOTH_ETH    =   [
    935219,
    996763,
    1058302,
    1119834,
    1181369,
    1242902,
]

FILL_ORDER_DOUBLE_REVERSE_POSITION    =   [
    830219,
    861763,
    893302,
    924822,
    956369,
    987902,
]

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_take_shares(numOutcomes, localFixture, markets):
    ZeroXTrade = localFixture.contracts['ZeroXTrade']
    cash = localFixture.contracts['Cash']
    shareToken = localFixture.contracts["ShareToken"]
    expirationTime = localFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    amount = fix(10)
    cost = amount * market.getNumTicks()
    with BuyWithCash(cash, cost, localFixture.accounts[0], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, amount)
    outcome = 0
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, amount, 50, market.address, outcome, expirationTime, salt)
    signature = signOrder(orderHash, localFixture.privateKeys[0])
    fingerprint = longTo32Bytes(11)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    cost = amount * 50
    localFixture.contracts["Cash"].faucet(cost, sender=localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER TAKE SHARES: %i" % numOutcomes, FILL_ORDER_TAKE_SHARES[numOutcomes-2]):
        ZeroXTrade.trade(amount, fingerprint, tradeGroupID, 0, 10, orders, signatures, sender=localFixture.accounts[1])

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_both_eth(numOutcomes, localFixture, markets):
    ZeroXTrade = localFixture.contracts['ZeroXTrade']
    cash = localFixture.contracts['Cash']
    shareToken = localFixture.contracts["ShareToken"]
    expirationTime = localFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    amount = fix(10)
    cost = amount * 50

    outcome = 0
    localFixture.contracts["Cash"].faucet(cost)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, amount, 50, market.address, outcome, expirationTime, salt)
    signature = signOrder(orderHash, localFixture.privateKeys[0])
    fingerprint = longTo32Bytes(11)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    localFixture.contracts["Cash"].faucet(cost, sender = localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER BOTH ETH: %i" % numOutcomes, FILL_ORDER_BOTH_ETH[numOutcomes-2]):
        ZeroXTrade.trade(amount, fingerprint, tradeGroupID, 0, 10, orders, signatures, sender=localFixture.accounts[1])

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_double_reverse(numOutcomes, localFixture, markets):
    ZeroXTrade = localFixture.contracts['ZeroXTrade']
    cash = localFixture.contracts['Cash']
    shareToken = localFixture.contracts["ShareToken"]
    expirationTime = localFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    amount = fix(10)
    cost = amount * 50

    localFixture.contracts["Cash"].faucet(amount * market.getNumTicks())
    assert shareToken.publicBuyCompleteSets(market.address, amount)
    outcome = 0
    shareTokenId = shareToken.getTokenId(market.address, outcome)
    shareToken.unsafeTransferFrom(localFixture.accounts[0], localFixture.accounts[1], shareTokenId, amount)
    localFixture.contracts["Cash"].faucet(cost)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, amount, 50, market.address, outcome, expirationTime, salt)
    signature = signOrder(orderHash, localFixture.privateKeys[0])
    fingerprint = longTo32Bytes(11)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    localFixture.contracts["Cash"].faucet(cost, sender = localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER BOTH REVERSE: %i" % numOutcomes, FILL_ORDER_DOUBLE_REVERSE_POSITION[numOutcomes-2]):
        ZeroXTrade.trade(amount, fingerprint, tradeGroupID, 0, 10, orders, signatures, sender=localFixture.accounts[1])


@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    universe = fixture.applySignature(None, kitchenSinkSnapshot['universe'].address, kitchenSinkSnapshot['universe'].abi)
    fixture.markets = [
        fixture.createReasonableCategoricalMarket(universe, 2),
        fixture.createReasonableCategoricalMarket(universe, 3),
        fixture.createReasonableCategoricalMarket(universe, 4),
        fixture.createReasonableCategoricalMarket(universe, 5),
        fixture.createReasonableCategoricalMarket(universe, 6),
        fixture.createReasonableCategoricalMarket(universe, 7),
    ]

    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def universe(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['universe'].address, kitchenSinkSnapshot['universe'].abi)

@fixture
def markets(localFixture, kitchenSinkSnapshot):
    return localFixture.markets

def signOrder(orderHash, private_key, signaturePostFix="03"):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + orderHash), key)
    return "0x" + v.to_bytes(1, "big").hex() + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + signaturePostFix

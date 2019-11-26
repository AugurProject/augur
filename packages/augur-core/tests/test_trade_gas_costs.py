
from eth_tester.exceptions import TransactionFailed
from pytest import fixture, mark, raises
from utils import longTo32Bytes, PrintGasUsed, fix, BuyWithCash, nullAddress
from constants import BID, ASK, YES, NO
from datetime import timedelta
from trading.test_claimTradingProceeds import acquireLongShares, finalizeMarket
from reporting_utils import proceedToNextRound, proceedToFork, finalize, proceedToDesignatedReporting

pytestmark = mark.skip(reason="Just for testing gas cost")

# Trading Max Costs

CREATE_ORDER_BEST_CASE    =   [
    430071,
    436547,
    443151,
    449691,
    456231,
    462771,
]

CREATE_ORDER_MAXES    =   [
    581805,
    631614,
    681551,
    731424,
    781297,
    831170,
]

CANCEL_ORDER_MAXES    =   [
    224469,
    257363,
    290322,
    323248,
    369149,
    415202,
]

FILL_ORDER_TAKE_SHARES   =   [
    492104,
    518174,
    544307,
    570505,
    596644,
    622784,
]

FILL_ORDER_BOTH_ETH    =   [
    705752,
    802294,
    898837,
    995379,
    1091926,
    1188474,
]

FILL_ORDER_MAKER_REVERSE_POSITION    =   [
    756240,
    858547,
    960981,
    1063352,
    1165728,
    1268105,
]

FILL_ORDER_TAKER_REVERSE_POSITION    =   [
    1359009,
    1461898,
    1564915,
    1667869,
    1770823,
    1873778,
]

FILL_ORDER_DOUBLE_REVERSE_POSITION    =   [
    1359009,
    1461898,
    1564915,
    1667869,
    1770823,
    1873778,
]

@mark.parametrize('numOutcomes', range(2,8))
def test_order_creation_best_case(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    maxGas = 0
    cost = fix('1', '50')

    outcome = 0

    localFixture.contracts["Cash"].faucet(fix(1, 50))

    with PrintGasUsed(localFixture, "ORDER CREATION BEST: %i" % numOutcomes, CREATE_ORDER_BEST_CASE[numOutcomes-2]):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", nullAddress)

@mark.parametrize('numOutcomes', range(2,8))
def test_orderCreationMax(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    maxGas = 0
    cost = fix('1', '50')

    localFixture.contracts["Cash"].faucet(1000000)
    assert shareToken.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(localFixture.accounts[7], 100)

    localFixture.contracts["Cash"].faucet(fix(1, 50))
    with PrintGasUsed(localFixture, "ORDER CREATION MAX: %i" % numOutcomes, CREATE_ORDER_MAXES[numOutcomes-2]):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", nullAddress)

@mark.parametrize('numOutcomes', range(2,8))
def test_orderCancelationMax(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    cancelOrder = localFixture.contracts['CancelOrder']
    completeSets = localFixture.contracts['CompleteSets']
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    localFixture.contracts["Cash"].faucet(1000000)
    assert shareToken.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(localFixture.accounts[7], 100)

    localFixture.contracts["Cash"].faucet(fix(1, 50))
    orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", nullAddress)

    with PrintGasUsed(localFixture, "CANCEL ORDER: %i" % numOutcomes, CANCEL_ORDER_MAXES[numOutcomes-2]):
        cancelOrder.cancelOrder(orderID)

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_take_shares(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    cash = localFixture.contracts['Cash']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = 100 * market.getNumTicks()
    with BuyWithCash(cash, cost, localFixture.accounts[0], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    orderID = createOrder.publicCreateOrder(ASK, 100, 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), nullAddress)

    cost = 50000
    localFixture.contracts["Cash"].faucet(cost, sender=localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER TAKE SHARES: %i" % numOutcomes, FILL_ORDER_TAKE_SHARES[numOutcomes-2]):
        fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, "0x0000000000000000000000000000000000000000", sender = localFixture.accounts[1])

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_both_eth(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '50')

    outcome = 0
    localFixture.contracts["Cash"].faucet(fix(1, 50))
    orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", nullAddress)

    localFixture.contracts["Cash"].faucet(cost, sender = localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER BOTH ETH: %i" % numOutcomes, FILL_ORDER_BOTH_ETH[numOutcomes-2]):
        fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, "0x0000000000000000000000000000000000000000", sender = localFixture.accounts[1])

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_maker_reverse(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '50')

    localFixture.contracts["Cash"].faucet(1000000)
    assert shareToken.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(localFixture.accounts[2], 100)
    localFixture.contracts["Cash"].faucet(cost)
    orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", nullAddress)

    localFixture.contracts["Cash"].faucet(cost, sender = localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER MAKER REVERSE: %i" % numOutcomes, FILL_ORDER_MAKER_REVERSE_POSITION[numOutcomes-2]):
        fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, "0x0000000000000000000000000000000000000000", sender = localFixture.accounts[1])

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_taker_reverse(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '50')

    localFixture.contracts["Cash"].faucet(1000000)
    assert shareToken.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(localFixture.accounts[1], 100)
    localFixture.contracts["Cash"].faucet(cost)
    orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", nullAddress)

    localFixture.contracts["Cash"].faucet(cost, sender = localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER TAKER REVERSE: %i" % numOutcomes, FILL_ORDER_TAKER_REVERSE_POSITION[numOutcomes-2]):
        fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, "0x0000000000000000000000000000000000000000", sender = localFixture.accounts[1])

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_double_reverse(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '50')

    localFixture.contracts["Cash"].faucet(1000000)
    assert shareToken.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(localFixture.accounts[1], 100)
    localFixture.contracts["Cash"].faucet(cost)
    orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", nullAddress)

    localFixture.contracts["Cash"].faucet(cost, sender = localFixture.accounts[1])
    with PrintGasUsed(localFixture, "FILL ORDER BOTH REVERSE: %i" % numOutcomes, FILL_ORDER_DOUBLE_REVERSE_POSITION[numOutcomes-2]):
        fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, "0x0000000000000000000000000000000000000000", sender = localFixture.accounts[1])


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

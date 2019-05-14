from ethereum.tools import tester
from ethereum.tools.tester import ABIContract, TransactionFailed
from pytest import fixture, mark, raises
from utils import longTo32Bytes, PrintGasUsed, fix, BuyWithCash, nullAddress
from constants import BID, ASK, YES, NO
from datetime import timedelta
from trading.test_claimTradingProceeds import acquireLongShares, finalizeMarket
from reporting_utils import proceedToNextRound, proceedToFork, finalize, proceedToDesignatedReporting

pytestmark = mark.skip(reason="Just for testing gas cost")

# Trading Max Costs

CREATE_ORDER_BEST_CASE    =   [
    443354,
    450370,
    457386,
    464402,
    471418,
    478434,
]

CREATE_ORDER_MAXES    =   [
    563657,
    615694,
    667731,
    719768,
    771805,
    823842,
]

CANCEL_ORDER_MAXES    =   [
    256625,
    316438,
    376251,
    436064,
    495877,
    555690,
    615503,
]

FILL_ORDER_TAKE_SHARES   =   [
    442662,
    463804,
    484946,
    506088,
    527230,
    548371,
]

FILL_ORDER_BOTH_ETH    =   [
    901939,
    1035601,
    1169263,
    1302925,
    1436587,
    1570248,
]

FILL_ORDER_MAKER_REVERSE_POSITION    =   [
    757960,
    906997,
    1056033,
    1205070,
    1354107,
    1503144,
    1652180,
]

FILL_ORDER_TAKER_REVERSE_POSITION    =   [
    763953,
    881728,
    999502,
    1117277,
    1235052,
    1352827,
    1470601,
]

FILL_ORDER_DOUBLE_REVERSE_POSITION    =   [
    1838224,
    2039618,
    2241011,
    2442405,
    2643799,
    2845193,
    3046586,
]

tester.STARTGAS = long(6.7 * 10**6)

@mark.parametrize('numOutcomes', range(2,8))
def test_order_creation_best_case(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    maxGas = 0
    cost = fix('1', '5000')

    outcome = 0

    startGas = localFixture.chain.head_state.gas_used
    localFixture.contracts["Cash"].faucet(fix(1, 5000))
    orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)
    maxGas = localFixture.chain.head_state.gas_used - startGas
    assert maxGas == CREATE_ORDER_BEST_CASE[marketIndex]

@mark.parametrize('numOutcomes', range(2,8))
def test_orderCreationMax(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    maxGas = 0
    cost = fix('1', '5000')

    localFixture.contracts["Cash"].faucet(1000000)
    assert completeSets.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(tester.a7, 100)

    startGas = localFixture.chain.head_state.gas_used
    localFixture.contracts["Cash"].faucet(fix(1, 5000))
    orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)
    maxGas = localFixture.chain.head_state.gas_used - startGas
    assert maxGas == CREATE_ORDER_MAXES[marketIndex]

@mark.parametrize('numOutcomes', range(2,9))
def test_orderCancelationMax(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    cancelOrder = localFixture.contracts['CancelOrder']
    completeSets = localFixture.contracts['CompleteSets']
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    assert completeSets.publicBuyCompleteSets(market.address, 100, value=1000000)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(tester.a7, 100)

    orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", value = fix(1, 5000))

    startGas = localFixture.chain.head_state.gas_used
    cancelOrder.cancelOrder(orderID)
    maxGas = localFixture.chain.head_state.gas_used - startGas

    assert maxGas == CANCEL_ORDER_MAXES[marketIndex]

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
    with BuyWithCash(cash, cost, tester.k0, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, 100)
    outcome = 0
    orderID = createOrder.publicCreateOrder(ASK, 100, 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)

    cost = 500000
    with BuyWithCash(cash, cost, tester.k1, "fill order"):
        startGas = localFixture.chain.head_state.gas_used
        fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k1)
        maxGas = localFixture.chain.head_state.gas_used - startGas
        assert maxGas == FILL_ORDER_TAKE_SHARES[marketIndex]

@mark.parametrize('numOutcomes', range(2,8))
def test_order_filling_both_eth(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '5000')

    outcome = 0
    localFixture.contracts["Cash"].faucet(fix(1, 5000))
    orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)

    startGas = localFixture.chain.head_state.gas_used
    localFixture.contracts["Cash"].faucet(cost, sender = tester.k1)
    fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k1)
    maxGas = localFixture.chain.head_state.gas_used - startGas
    print "MAX GAS: %i FOR %i OUTCOMES" % (maxGas, numOutcomes)
    # assert maxGas == FILL_ORDER_BOTH_ETH[marketIndex]

@mark.parametrize('numOutcomes', range(2,9))
def test_order_filling_maker_reverse(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '5000')

    assert completeSets.publicBuyCompleteSets(market.address, 100, value=1000000)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(tester.a2, 100)
    orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", value = fix(1, 5000))

    startGas = localFixture.chain.head_state.gas_used
    fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k1, value=cost)
    maxGas = localFixture.chain.head_state.gas_used - startGas

    assert maxGas == FILL_ORDER_MAKER_REVERSE_POSITION[marketIndex]

@mark.parametrize('numOutcomes', range(2,9))
def test_order_filling_taker_reverse(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '5000')

    assert completeSets.publicBuyCompleteSets(market.address, 100, value=1000000, sender = tester.k2)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(tester.a1, 100, sender = tester.k2)
    orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", value = fix(1, 5000))

    startGas = localFixture.chain.head_state.gas_used
    fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k1, value=cost)
    maxGas = localFixture.chain.head_state.gas_used - startGas

    assert maxGas == FILL_ORDER_TAKER_REVERSE_POSITION[marketIndex]

@mark.parametrize('numOutcomes', range(2,9))
def test_order_filling_double_reverse(numOutcomes, localFixture, markets):
    createOrder = localFixture.contracts['CreateOrder']
    completeSets = localFixture.contracts['CompleteSets']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)
    marketIndex = numOutcomes - 2
    market = markets[marketIndex]

    cost = fix('1', '5000')

    assert completeSets.publicBuyCompleteSets(market.address, 100, value=1000000)
    outcome = 0
    shareToken = localFixture.applySignature('ShareToken', market.getShareToken(outcome))
    shareToken.transfer(tester.a1, 100)
    orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), "7", value = fix(1, 5000))

    startGas = localFixture.chain.head_state.gas_used
    fillOrder.publicFillOrder(orderID, fix(1), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k1, value=cost)
    maxGas = localFixture.chain.head_state.gas_used - startGas

    assert maxGas == FILL_ORDER_DOUBLE_REVERSE_POSITION[marketIndex]


@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    universe = ABIContract(fixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)
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
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)

@fixture
def markets(localFixture, kitchenSinkSnapshot):
    return localFixture.markets

#!/usr/bin/env python

from decimal import Decimal, ROUND_UP, ROUND_DOWN
from pytest import fixture, mark
from random import randint, random as randfloat
from utils import bytesToLong, longTo32Bytes, fix, nullAddress
from constants import BID, ASK, YES, NO

def execute(fixture, snapshot, universe, market, orderType, orderSize, orderPrice, orderOutcome, creatorLongShares, creatorShortShares, creatorTokens, fillerLongShares, fillerShortShares, fillerTokens, expectedMakerLongShares, expectedMakerShortShares, expectedMakerTokens, expectedFillerLongShares, expectedFillerShortShares, expectedFillerTokens, numTicks):
    def acquireLongShares(outcome, amount, approvalAddress, sender):
        if amount == 0: return

        shareToken = fixture.applySignature('ShareToken', market.getShareToken(outcome))
        completeSets = fixture.contracts['CompleteSets']
        createOrder = fixture.contracts['CreateOrder']
        fillOrder = fixture.contracts['FillOrder']

        ethRequired = amount * numTicks
        fixture.contracts['Cash'].faucet(ethRequired, sender=sender)
        assert completeSets.publicBuyCompleteSets(market.address, amount, sender = sender)
        for otherOutcome in range(0, market.getNumberOfOutcomes()):
            if otherOutcome == outcome: continue
            otherShareToken = fixture.applySignature('ShareToken', market.getShareToken(otherOutcome))
            assert otherShareToken.transfer(fixture.accounts[8], amount, sender = sender)

    def acquireShortShareSet(outcome, amount, approvalAddress, sender):
        if amount == 0: return

        shareToken = fixture.applySignature('ShareToken', market.getShareToken(outcome))
        completeSets = fixture.contracts['CompleteSets']
        createOrder = fixture.contracts['CreateOrder']
        fillOrder = fixture.contracts['FillOrder']

        ethRequired = amount * numTicks
        fixture.contracts['Cash'].faucet(ethRequired, sender=sender)
        assert completeSets.publicBuyCompleteSets(market.address, amount, sender = sender)
        assert shareToken.transfer(fixture.accounts[8], amount, sender = sender)
        for otherOutcome in range(0, market.getNumberOfOutcomes()):
            if otherOutcome == outcome: continue
            otherShareToken = fixture.applySignature('ShareToken', market.getShareToken(otherOutcome))

    fixture.resetToSnapshot(snapshot)

    legacyReputationToken = fixture.contracts['LegacyReputationToken']
    legacyReputationToken.faucet(11 * 10**6 * 10**18)
    fixture.contracts['Time'].incrementTimestamp(15000)

    orders = fixture.contracts['Orders']
    createOrder = fixture.contracts['CreateOrder']
    fillOrder = fixture.contracts['FillOrder']
    completeSets = fixture.contracts['CompleteSets']

    account1 = fixture.accounts[1]
    account2 = fixture.accounts[2]

    creatorAddress = account1
    fillerAddress = account2
    creatorKey = account1
    fillerKey = account2

    # Acquire shares for creator
    creatorEthRequiredLong = 0 if creatorLongShares == 0 else creatorLongShares * numTicks
    creatorEthRequiredShort = 0 if creatorShortShares == 0 else creatorShortShares * numTicks
    acquireLongShares(orderOutcome, creatorLongShares, createOrder.address, sender = creatorKey)
    acquireShortShareSet(orderOutcome, creatorShortShares, createOrder.address, sender = creatorKey)

    # Create order
    fixture.contracts['Cash'].faucet(creatorTokens, sender=creatorKey)
    try:
        orderId = createOrder.publicCreateOrder(orderType, orderSize, orderPrice, market.address, orderOutcome, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender = creatorKey)
    except Exception:
        import pdb;pdb.set_trace()
        raise

    # Validate order
    assert orders.getAmount(orderId) == orderSize
    assert orders.getPrice(orderId) == orderPrice
    assert orders.getOrderCreator(orderId) == creatorAddress
    assert orders.getOrderMoneyEscrowed(orderId) == creatorTokens
    assert orders.getOrderSharesEscrowed(orderId) == creatorLongShares or creatorShortShares

    # Acquire shares for filler
    fillerEthRequiredLong = 0 if fillerLongShares == 0 else fillerLongShares * numTicks
    fillerEthRequiredShort = 0 if fillerShortShares == 0 else fillerShortShares * numTicks
    acquireLongShares(orderOutcome, fillerLongShares, fillOrder.address, sender = fillerKey)
    acquireShortShareSet(orderOutcome, fillerShortShares, fillOrder.address, sender = fillerKey)

    # Fill order
    fixture.contracts['Cash'].faucet(fillerTokens, sender=fillerKey)
    remaining = fillOrder.publicFillOrder(orderId, orderSize, longTo32Bytes(42), False, "0x0000000000000000000000000000000000000000", sender = fillerKey)
    assert not remaining

    # Assert final state
    assert fixture.contracts['Cash'].balanceOf(creatorAddress) == int(expectedMakerTokens)
    assert fixture.contracts['Cash'].balanceOf(fillerAddress) == int(expectedFillerTokens)
    for outcome in range(0, market.getNumberOfOutcomes()):
        shareToken = fixture.applySignature('ShareToken', market.getShareToken(outcome))
        if outcome == orderOutcome:
            assert shareToken.balanceOf(creatorAddress) == expectedMakerLongShares
            assert shareToken.balanceOf(fillerAddress) == expectedFillerLongShares
        else:
            assert shareToken.balanceOf(creatorAddress) == expectedMakerShortShares
            assert shareToken.balanceOf(fillerAddress) == expectedFillerShortShares

def execute_bidOrder_tests(fixture, kitchenSinkSnapshot, universe, market, amount, fxpPrice, numTicks):
    longCost = amount * fxpPrice
    shortCost = amount * (numTicks - fxpPrice)
    totalProceeds = amount * numTicks
    completeSetFees = totalProceeds / 100 + totalProceeds / 100
    shortFee = (completeSetFees * shortCost) / (longCost + shortCost)
    longFee = completeSetFees - shortFee

    print("creator escrows ETH, filler pays with ETH")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = BID,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = 0,
        creatorShortShares = 0,
        creatorTokens = longCost,
        fillerLongShares = 0,
        fillerShortShares = 0,
        fillerTokens = shortCost,
        expectedMakerLongShares = amount,
        expectedMakerShortShares = 0,
        expectedMakerTokens = 0,
        expectedFillerLongShares = 0,
        expectedFillerShortShares = amount,
        expectedFillerTokens = 0,
        numTicks = numTicks)

    print("creator escrows shares, filler pays with shares")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = BID,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = 0,
        creatorShortShares = amount,
        creatorTokens = 0,
        fillerLongShares = amount,
        fillerShortShares = 0,
        fillerTokens = 0,
        expectedMakerLongShares = 0,
        expectedMakerShortShares = 0,
        expectedMakerTokens = shortCost - shortFee,
        expectedFillerLongShares = 0,
        expectedFillerShortShares = 0,
        expectedFillerTokens = longCost - longFee,
        numTicks = numTicks)

    print("creator escrows ETH, filler pays with shares")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = BID,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = 0,
        creatorShortShares = 0,
        creatorTokens = longCost,
        fillerLongShares = amount,
        fillerShortShares = 0,
        fillerTokens = 0,
        expectedMakerLongShares = amount,
        expectedMakerShortShares = 0,
        expectedMakerTokens = 0,
        expectedFillerLongShares = 0,
        expectedFillerShortShares = 0,
        expectedFillerTokens = longCost,
        numTicks = numTicks)

    print("creator escrows shares, filler pays with ETH")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = BID,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = 0,
        creatorShortShares = amount,
        creatorTokens = 0,
        fillerLongShares = 0,
        fillerShortShares = 0,
        fillerTokens = shortCost,
        expectedMakerLongShares = 0,
        expectedMakerShortShares = 0,
        expectedMakerTokens = shortCost,
        expectedFillerLongShares = 0,
        expectedFillerShortShares = amount,
        expectedFillerTokens = 0,
        numTicks = numTicks)

def execute_askOrder_tests(fixture, kitchenSinkSnapshot, universe, market, amount, fxpPrice, numTicks):
    longCost = amount * fxpPrice
    shortCost = amount * (numTicks - fxpPrice)
    totalProceeds = amount * numTicks
    completeSetFees = totalProceeds / 100 + totalProceeds / 100
    longFee = (completeSetFees * longCost) / (longCost + shortCost)
    shortFee = completeSetFees - longFee

    print("creator escrows ETH, filler pays with ETH")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = ASK,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = 0,
        creatorShortShares = 0,
        creatorTokens = shortCost,
        fillerLongShares = 0,
        fillerShortShares = 0,
        fillerTokens = longCost,
        expectedMakerLongShares = 0,
        expectedMakerShortShares = amount,
        expectedMakerTokens = 0,
        expectedFillerLongShares = amount,
        expectedFillerShortShares = 0,
        expectedFillerTokens = 0,
        numTicks = numTicks)

    print("creator escrows shares, filler pays with shares")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = ASK,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = amount,
        creatorShortShares = 0,
        creatorTokens = 0,
        fillerLongShares = 0,
        fillerShortShares = amount,
        fillerTokens = 0,
        expectedMakerLongShares = 0,
        expectedMakerShortShares = 0,
        expectedMakerTokens = longCost - longFee,
        expectedFillerLongShares = 0,
        expectedFillerShortShares = 0,
        expectedFillerTokens = shortCost - shortFee,
        numTicks = numTicks)

    print("creator escrows ETH, filler pays with shares")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = ASK,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = 0,
        creatorShortShares = 0,
        creatorTokens = shortCost,
        fillerLongShares = 0,
        fillerShortShares = amount,
        fillerTokens = 0,
        expectedMakerLongShares = 0,
        expectedMakerShortShares = amount,
        expectedMakerTokens = 0,
        expectedFillerLongShares = 0,
        expectedFillerShortShares = 0,
        expectedFillerTokens = shortCost,
        numTicks = numTicks)

    print("creator escrows shares, filler pays with ETH")
    execute(
        fixture = fixture,
        snapshot = kitchenSinkSnapshot,
        universe = universe,
        market = market,
        orderType = ASK,
        orderSize = amount,
        orderPrice = fxpPrice,
        orderOutcome = YES,
        creatorLongShares = amount,
        creatorShortShares = 0,
        creatorTokens = 0,
        fillerLongShares = 0,
        fillerShortShares = 0,
        fillerTokens = longCost,
        expectedMakerLongShares = 0,
        expectedMakerShortShares = 0,
        expectedMakerTokens = longCost,
        expectedFillerLongShares = amount,
        expectedFillerShortShares = 0,
        expectedFillerTokens = 0,
        numTicks = numTicks)

def test_yesNo(fixture, kitchenSinkSnapshot, universe, yesNoMarket, randomAmount, randomNormalizedPrice):
    print("")
    print('Random amount: ' + str(randomAmount))
    print('Random price: ' + str(randomNormalizedPrice))
    print("")
    amount = randomAmount
    numTicks = yesNoMarket.getNumTicks()
    print("Start Fuzzy WCL tests - YesNo Market - bidOrders.")
    execute_bidOrder_tests(fixture, kitchenSinkSnapshot, universe, yesNoMarket, amount, randomNormalizedPrice, numTicks)
    print("Finished Fuzzy WCL tests - YesNo Market - bidOrders.")
    print("")
    print("Start Fuzzy WCL tests - YesNo Market - askOrders.")
    execute_askOrder_tests(fixture, kitchenSinkSnapshot, universe, yesNoMarket, amount, randomNormalizedPrice, numTicks)
    print("Finished Fuzzy WCL tests - YesNo Market - askOrders.")
    print("")

def test_categorical(fixture, kitchenSinkSnapshot, universe, categoricalMarket, randomAmount, randomNormalizedPrice):
    print("")
    print('Random amount: ' + str(randomAmount))
    print('Random price: ' + str(randomNormalizedPrice))
    print("")
    amount = randomAmount
    numTicks = categoricalMarket.getNumTicks()
    print("Start Fuzzy WCL tests - Categorical Market - bidOrders.")
    execute_bidOrder_tests(fixture, kitchenSinkSnapshot, universe, categoricalMarket, amount, randomNormalizedPrice, numTicks)
    print("Finished Fuzzy WCL tests - Categorical Market - bidOrders.")
    print("")
    print("Start Fuzzy WCL tests - Categorical Market - askOrders.")
    execute_askOrder_tests(fixture, kitchenSinkSnapshot, universe, categoricalMarket, amount, randomNormalizedPrice, numTicks)
    print("Finished Fuzzy WCL tests - Categorical Market - askOrders.")
    print("")

def test_scalar(fixture, kitchenSinkSnapshot, universe, scalarMarket, randomAmount, randomNormalizedPrice):
    print("")
    print('Random amount: ' + str(randomAmount))
    print('Random price: ' + str(randomNormalizedPrice))
    print("")
    amount = randomAmount / 40
    numTicks = scalarMarket.getNumTicks()
    print("Start Fuzzy WCL tests - Scalar Market - bidOrders.")
    execute_bidOrder_tests(fixture, kitchenSinkSnapshot, universe, scalarMarket, amount, randomNormalizedPrice, numTicks)
    print("Finished Fuzzy WCL tests - Scalar Market - bidOrders.")
    print("")
    print("Start Fuzzy WCL tests - Scalar Market - askOrders.")
    execute_askOrder_tests(fixture, kitchenSinkSnapshot, universe, scalarMarket, amount, randomNormalizedPrice, numTicks)
    print("Finished Fuzzy WCL tests - Scalar Market - askOrders.")
    print("")

# Check randomly generated numbers to make sure they aren't unreasonable
def check_randoms(market, price, numTicks):
    fxpPrice = fix(price)
    fxpMaxDisplayPrice = numTicks
    fxpTradingFee = fix('0.0101')
    if fxpPrice <= 0:
        return 0
    if fxpPrice >= fxpMaxDisplayPrice:
        return 0
    if fxpTradingFee >= fxpPrice:
        return 0
    if fxpTradingFee >= fxpMaxDisplayPrice - fxpPrice:
        return 0
    return 1

@fixture
def numberOfIterations():
    return 1

@fixture
def randomAmount():
    return fix(randint(1, 11))

@fixture
def randomNormalizedPrice():
    return randint(1,99)

#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises
from utils import fix, AssertLog, longTo32Bytes, longToHexString, stringToBytes, BuyWithCash, nullAddress
from constants import BID, ASK, YES, NO


def test_publicFillOrder_bid(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    fingerprint = longTo32Bytes(11)

    creatorCost = fix('2', '60')
    fillerCost = fix('2', '40')

    # create order
    with BuyWithCash(cash, creatorCost, contractsFixture.accounts[1], "complete set buy"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    orderEventLog = {
        "universe": universe.address,
        "market": market.address,
        "eventType": 2,
        "addressData": [nullAddress, contractsFixture.accounts[1], contractsFixture.accounts[2]],
        "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }

    marketVolumeChangedLog = {
        "universe": universe.address,
        "market": market.address,
        "volume": creatorCost + fillerCost,
        "outcomeVolumes": [0, 0, creatorCost + fillerCost]
    }

    profitLossChangedLog = {
        "market": market.address,
        "account": contractsFixture.accounts[2],
        "outcome": YES,
        "netPosition": -fix(2),
        "avgPrice": 60,
        "realizedProfit": 0,
        "frozenFunds": fillerCost,
    }

    with BuyWithCash(cash, fillerCost, contractsFixture.accounts[2], "filling order"):
        with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog):
            with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
                with AssertLog(contractsFixture, "MarketVolumeChanged", marketVolumeChangedLog):
                    fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, fingerprint, sender = contractsFixture.accounts[2])
                    assert fillOrderID == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_publicFillOrder_ask(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    fingerprint = longTo32Bytes(11)

    creatorCost = fix('2', '40')
    fillerCost = fix('2', '60')

    # create order
    with BuyWithCash(cash, creatorCost, contractsFixture.accounts[1], "creating order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    with BuyWithCash(cash, fillerCost, contractsFixture.accounts[2], "filling order"):
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, fingerprint, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == 0

def test_publicFillOrder_bid_scalar(contractsFixture, cash, scalarMarket, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    # We're testing the scalar market because it has a different numTicks than 10**18 as the other do. In particular it's numTicks is 40*18**18
    market = scalarMarket
    tradeGroupID = longTo32Bytes(42)
    fingerprint = longTo32Bytes(11)

    creatorCost = fix('2', '60')
    fillerCost = fix('2', market.getNumTicks()-60)

    # create order
    with BuyWithCash(cash, creatorCost, contractsFixture.accounts[1], "creating order"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender=contractsFixture.accounts[1])

    # fill best order
    with BuyWithCash(cash, fillerCost, contractsFixture.accounts[2], "filling order"):
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, fingerprint, sender=contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == 0

def test_fill_order_with_shares_escrowed_sell_with_shares(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts['ShareToken']
    fingerprint = longTo32Bytes(11)

    # buy complete sets for both users
    with BuyWithCash(cash, fix('1', '100'), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.buyCompleteSets(market.address, contractsFixture.accounts[1], fix(1), sender=contractsFixture.accounts[1])
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(1)
    with BuyWithCash(cash, fix('1', '100'), contractsFixture.accounts[0], "buy complete set"):
        assert shareToken.buyCompleteSets(market.address, contractsFixture.accounts[0], fix(1))
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[0]) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert orderID

    # fill order with shares
    assert fillOrder.publicFillOrder(orderID, fix(1), "43", fingerprint) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[0]) == 0
    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_fill_order_with_shares_escrowed_sell_with_shares_categorical(contractsFixture, cash, categoricalMarket, universe):
    market = categoricalMarket
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts['ShareToken']
    fingerprint = longTo32Bytes(11)

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.buyCompleteSets(market.address, contractsFixture.accounts[1], fix(1), sender=contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.buyCompleteSets(market.address, contractsFixture.accounts[2], fix(1), sender=contractsFixture.accounts[2])
    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[2]) == fix(1)

    # create order with shares
    price = 60
    orderID = createOrder.publicCreateOrder(ASK, fix(1), price, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert orderID

    # fill order with shares
    assert fillOrder.publicFillOrder(orderID, fix(1), "43", fingerprint, sender=contractsFixture.accounts[2]) == 0

    # The second users corresponding shares were used to fulfil this order
    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[2]) == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_fill_buy_order_with_buy_categorical(contractsFixture, cash, categoricalMarket, universe):
    market = categoricalMarket
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts['ShareToken']
    fingerprint = longTo32Bytes(11)

    # create order with cash
    price = 60
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix(1, price), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), price, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert orderID

    # fill order with cash
    with BuyWithCash(cash, fix(1, numTicks - price), contractsFixture.accounts[2], "fill order"):
        assert fillOrder.publicFillOrder(orderID, fix(1), "43", fingerprint, sender=contractsFixture.accounts[2]) == 0

    # A complete set was purchased with the provided cash and the shares were provided to each user
    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[1]) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[2]) == fix(1)

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_malicious_order_creator(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    augur = contractsFixture.contracts['Augur']
    shareToken = contractsFixture.contracts['ShareToken']
    augurTrading = contractsFixture.contracts['AugurTrading']

    maliciousTrader = contractsFixture.upload('solidity_test_helpers/MaliciousTrader.sol', 'maliciousTrader')
    maliciousTrader.doApprovals(cash.address, augur.address, augurTrading.address)

    account = contractsFixture.accounts[0]
    fingerprint = longTo32Bytes(11)

    # create order with the malicious contract by escrowing shares
    price = 60
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[0], "buy complete set"):
        assert shareToken.buyCompleteSets(market.address, contractsFixture.accounts[0], fix(1))
    shareToken.unsafeTransferFrom(account, maliciousTrader.address, shareToken.getTokenId(market.address, 0), fix(1))
    shareToken.unsafeTransferFrom(account, maliciousTrader.address, shareToken.getTokenId(market.address, 1), fix(1))
    shareToken.unsafeTransferFrom(account, maliciousTrader.address, shareToken.getTokenId(market.address, 2), fix(1))
    orderID = maliciousTrader.makeOrder(createOrder.address, BID, fix(1), price, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), sender=contractsFixture.accounts[1])
    assert orderID

    # Make the fallback function fail
    maliciousTrader.setEvil(True)

    # fill order with cash
    with BuyWithCash(cash, fix(1, numTicks - price), contractsFixture.accounts[2], "fill order"):
        assert fillOrder.publicFillOrder(orderID, fix(1), "43", fingerprint, sender=contractsFixture.accounts[2]) == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    # The malicious contract may have just been a smart contract that has expensive and dumb fallback behavior. We do the right thing and still award them Cash in this case.
    assert cash.balanceOf(maliciousTrader.address) == fix(1, 40)

def test_complete_set_auto_sale(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    shareToken = contractsFixture.contracts['ShareToken']
    fingerprint = longTo32Bytes(11)

    # create non matching orders
    with BuyWithCash(cash, fix('2', '60'), contractsFixture.accounts[1], "create order 1"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('2', '30'), contractsFixture.accounts[1], "create order 2"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(2), 70, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # Have other users fill them
    with BuyWithCash(cash, fix('2', '40'), contractsFixture.accounts[2], "fill order 1"):
        assert fillOrder.publicFillOrder(orderID1, fix(2), tradeGroupID, fingerprint, sender = contractsFixture.accounts[2]) == 0
    with BuyWithCash(cash, fix('2', '70'), contractsFixture.accounts[3], "fill order 1"):
        assert fillOrder.publicFillOrder(orderID2, fix(2), tradeGroupID, fingerprint, sender = contractsFixture.accounts[3]) == 0

    # The first user would have ended up with 2 complete sets at the end of the second fill and we expect those to be automatically sold
    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[1]) == 0

    totalPaid = fix('2', '60') + fix('2', '30')
    totalPayout = fix(2) * market.getNumTicks()
    fees = totalPayout / universe.getOrCacheReportingFeeDivisor()
    fees += market.deriveMarketCreatorFeeAmount(totalPayout)
    totalPayout -= fees

    assert cash.balanceOf(contractsFixture.accounts[1]) == totalPayout

def test_publicFillOrder_kyc(contractsFixture, cash, market, universe, reputationToken):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    fingerprint = longTo32Bytes(11)

    creatorCost = fix('2', '40')
    fillerCost = fix('2', '60')

    # Using the reputation token as "KYC"
    reputationToken.transfer(contractsFixture.accounts[1], 1)

    # create order
    with BuyWithCash(cash, creatorCost, contractsFixture.accounts[1], "creating order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, reputationToken.address, sender = contractsFixture.accounts[1])

    with raises(TransactionFailed):
        fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, fingerprint, sender = contractsFixture.accounts[2])

    reputationToken.transfer(contractsFixture.accounts[2], 1)

    # fill best order
    with BuyWithCash(cash, fillerCost, contractsFixture.accounts[2], "filling order"):
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, fingerprint, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == 0

def test_publicFillOrder_withSelf(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    fingerprint = longTo32Bytes(11)

    creatorCost = fix('2', '60')
    fillerCost = fix('2', '40')

    # create order
    with BuyWithCash(cash, creatorCost, contractsFixture.accounts[1], "complete set buy"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    with BuyWithCash(cash, fillerCost, contractsFixture.accounts[1], "filling order"):
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, fingerprint, sender = contractsFixture.accounts[1])
        assert fillOrderID == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

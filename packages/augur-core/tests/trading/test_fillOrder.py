#!/usr/bin/env python

from ethereum.tools import tester
from utils import fix, bytesToHexString, AssertLog, longTo32Bytes, longToHexString, stringToBytes, BuyWithCash, nullAddress
from constants import BID, ASK, YES, NO


def test_publicFillOrder_bid(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    initialMakerETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    initialFillerETH = contractsFixture.chain.head_state.get_balance(tester.a2)
    creatorCost = fix('2', '6000')
    fillerCost = fix('2', '4000')

    # create order
    with BuyWithCash(cash, creatorCost, tester.k1, "complete set buy"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    orderFilledLog = {
        "filler": bytesToHexString(tester.a2),
        "numCreatorShares": 0,
        "numCreatorTokens": creatorCost,
        "numFillerShares": 0,
        "numFillerTokens": fillerCost,
        "marketCreatorFees": 0,
        "reporterFees": 0,
        "shareToken": market.getShareToken(YES),
        "tradeGroupId": stringToBytes(longTo32Bytes(42)),
        "amountFilled": fix(2),
    }

    marketVolumeChangedLog = {
        "market": market.address,
        "volume": creatorCost + fillerCost
    }

    profitLossChangedLog = {
        "market": market.address,
        "account": bytesToHexString(tester.a2),
        "outcome": YES,
        "netPosition": -fix(2),
        "avgPrice": 6000,
        "realizedProfit": 0,
        "frozenFunds": fillerCost,
    }

    with BuyWithCash(cash, fillerCost, tester.k2, "filling order"):
        with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog):
            with AssertLog(contractsFixture, "OrderFilled", orderFilledLog):
                with AssertLog(contractsFixture, "MarketVolumeChanged", marketVolumeChangedLog):
                    fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k2)
                    assert fillOrderID == 0

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == initialMakerETH - creatorCost
    assert contractsFixture.chain.head_state.get_balance(tester.a2) == initialFillerETH - fillerCost
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

    initialMakerETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    initialFillerETH = contractsFixture.chain.head_state.get_balance(tester.a2)
    creatorCost = fix('2', '4000')
    fillerCost = fix('2', '6000')

    # create order
    with BuyWithCash(cash, creatorCost, tester.k1, "creating order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    with BuyWithCash(cash, fillerCost, tester.k2, "filling order"):
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k2)

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == initialMakerETH - creatorCost
    assert contractsFixture.chain.head_state.get_balance(tester.a2) == initialFillerETH - fillerCost
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

    initialMakerETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    initialFillerETH = contractsFixture.chain.head_state.get_balance(tester.a2)
    creatorCost = fix('2', '6000')
    fillerCost = fix('2', '394000')

    # create order
    with BuyWithCash(cash, creatorCost, tester.k1, "creating order"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender=tester.k1)

    # fill best order
    with BuyWithCash(cash, fillerCost, tester.k2, "filling order"):
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender=tester.k2)

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == initialMakerETH - creatorCost
    assert contractsFixture.chain.head_state.get_balance(tester.a2) == initialFillerETH - fillerCost
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
    completeSets = contractsFixture.contracts['CompleteSets']
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))

    # buy complete sets for both users
    with BuyWithCash(cash, fix('1', '10000'), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k1)
    assert yesShareToken.balanceOf(tester.a1) == fix(1)
    with BuyWithCash(cash, fix('1', '10000'), tester.k2, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k2)
    assert noShareToken.balanceOf(tester.a2) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert orderID

    # fill order with shares
    assert fillOrder.publicFillOrder(orderID, fix(1), "43", False, "0x0000000000000000000000000000000000000000", sender=tester.k2) == 0

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
    completeSets = contractsFixture.contracts['CompleteSets']
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))
    thirdShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(2))

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k1)
    with BuyWithCash(cash, fix('1', numTicks), tester.k2, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k2)
    assert firstShareToken.balanceOf(tester.a1) == firstShareToken.balanceOf(tester.a2) == fix(1)
    assert secondShareToken.balanceOf(tester.a1) == secondShareToken.balanceOf(tester.a2) == fix(1)
    assert thirdShareToken.balanceOf(tester.a1) == thirdShareToken.balanceOf(tester.a2) == fix(1)

    # create order with shares
    price = 6000
    orderID = createOrder.publicCreateOrder(ASK, fix(1), price, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert orderID

    # fill order with shares
    assert fillOrder.publicFillOrder(orderID, fix(1), "43", False, "0x0000000000000000000000000000000000000000", sender=tester.k2) == 0

    # The second users corresponding shares were used to fulfil this order
    assert firstShareToken.balanceOf(tester.a2) == fix(1)
    assert secondShareToken.balanceOf(tester.a2) == 0
    assert thirdShareToken.balanceOf(tester.a2) == 0

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
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))
    thirdShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(2))

    # create order with cash
    price = 6000
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix(1, price), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), price, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert orderID

    # fill order with cash
    with BuyWithCash(cash, fix(1, numTicks - price), tester.k2, "fill order"):
        assert fillOrder.publicFillOrder(orderID, fix(1), "43", False, "0x0000000000000000000000000000000000000000", sender=tester.k2) == 0

    # A complete set was purchased with the provided cash and the shares were provided to each user
    assert firstShareToken.balanceOf(tester.a1) == fix(1)
    assert secondShareToken.balanceOf(tester.a1) == 0
    assert thirdShareToken.balanceOf(tester.a1) == 0

    assert firstShareToken.balanceOf(tester.a2) == 0
    assert secondShareToken.balanceOf(tester.a2) == fix(1)
    assert thirdShareToken.balanceOf(tester.a2) == fix(1)

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
    completeSets = contractsFixture.contracts['CompleteSets']
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))
    thirdShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(2))

    maliciousTrader = contractsFixture.upload('solidity_test_helpers/MaliciousTrader.sol', 'maliciousTrader')
    maliciousTrader.approveAugur(cash.address, augur.address)

    # create order with the malicious contract by escrowing shares
    price = 6000
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), tester.k0, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1))
    assert firstShareToken.transfer(maliciousTrader.address, fix(1))
    assert secondShareToken.transfer(maliciousTrader.address, fix(1))
    assert thirdShareToken.transfer(maliciousTrader.address, fix(1))
    orderID = maliciousTrader.makeOrder(createOrder.address, BID, fix(1), price, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), value=fix(1, price), sender=tester.k1)
    assert orderID

    # Make the fallback function fail
    maliciousTrader.setEvil(True)

    # fill order with cash
    with BuyWithCash(cash, fix(1, numTicks - price), tester.k2, "fill order"):
        assert fillOrder.publicFillOrder(orderID, fix(1), "43", False, "0x0000000000000000000000000000000000000000", sender=tester.k2) == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    # The malicious contract may have just been a smart contract that has expensive and dumb fallback behavior. We do the right thing and still award them Cash in this case.
    assert cash.balanceOf(maliciousTrader.address) == fix(1, 4000)

def test_complete_set_auto_sale(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))
    thirdShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(2))

    initialMakerETH = contractsFixture.chain.head_state.get_balance(tester.a1)

    # create non matching orders
    with BuyWithCash(cash, fix('2', '6000'), tester.k1, "create order 1"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    with BuyWithCash(cash, fix('2', '3000'), tester.k1, "create order 2"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(2), 7000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # Have other users fill them
    with BuyWithCash(cash, fix('2', '4000'), tester.k2, "fill order 1"):
        assert fillOrder.publicFillOrder(orderID1, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k2) == 0
    with BuyWithCash(cash, fix('2', '7000'), tester.k3, "fill order 1"):
        assert fillOrder.publicFillOrder(orderID2, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k3) == 0

    # The first user would have ended up with 2 complete sets at the end of the second fill and we expect those to be automatically sold
    assert firstShareToken.balanceOf(tester.a1) == 0
    assert secondShareToken.balanceOf(tester.a1) == 0
    assert thirdShareToken.balanceOf(tester.a1) == 0

    totalPaid = fix('2', '6000') + fix('2', '3000')
    totalPayout = fix(2) * market.getNumTicks()
    fees = totalPayout / universe.getOrCacheReportingFeeDivisor()
    fees += market.deriveMarketCreatorFeeAmount(totalPayout)
    totalPayout -= fees

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == initialMakerETH - totalPaid
    assert cash.balanceOf(tester.a1) == totalPayout

def test_publicFillOrder_ask_price_zero(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    initialMakerETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    initialFillerETH = contractsFixture.chain.head_state.get_balance(tester.a2)
    creatorCost = fix(2, 10000)
    fillerCost = 0

    # create order
    with BuyWithCash(cash, creatorCost, tester.k1, "creating order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(2), 0, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, sender = tester.k1)

    # fill best order
    fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k2)

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == initialMakerETH - creatorCost
    assert contractsFixture.chain.head_state.get_balance(tester.a2) == initialFillerETH - fillerCost
    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == 0

def test_publicFillOrder_bid_price_zero(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    initialMakerETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    initialFillerETH = contractsFixture.chain.head_state.get_balance(tester.a2)
    creatorCost = 0
    fillerCost = fix(2, 10000)

    # create order
    orderID = createOrder.publicCreateOrder(BID, fix(2), 0, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, sender = tester.k1)

    # fill best order
    with BuyWithCash(cash, fillerCost, tester.k2, "filling order"):
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k2)

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == initialMakerETH - creatorCost
    assert contractsFixture.chain.head_state.get_balance(tester.a2) == initialFillerETH - fillerCost
    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == 0

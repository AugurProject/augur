#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from utils import longTo32Bytes, longToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, nullAddress
from constants import ASK, BID, YES, NO, LONG, SHORT
from pytest import raises, mark, fixture as pytest_fixture
from reporting_utils import proceedToNextRound
from decimal import Decimal
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad
from math import floor

def signOrder(orderHash, private_key, signaturePostFix="03"):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + orderHash), key)
    return "0x" + v.to_bytes(1, "big").hex() + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + signaturePostFix

def signMessage(messageHash, private_key):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + messageHash), key)
    return "0x" + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + v.to_bytes(1, "big").hex()

def test_trade_1155_behavior(contractsFixture, augur, cash, market, categoricalMarket, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    shareToken = contractsFixture.contracts['ShareToken']
    fillOrder = contractsFixture.contracts['FillOrder']

    account = contractsFixture.accounts[0]
    account2 = contractsFixture.accounts[1]

    price = 60
    outcome = YES
    orderType = BID

    marketTokenId = ZeroXTrade.getTokenId(market.address, price, outcome, orderType)
    catMarketTokenId = ZeroXTrade.getTokenId(categoricalMarket.address, price, outcome, orderType)

    assert ZeroXTrade.unpackTokenId(marketTokenId) == [market.address, price, outcome, orderType]

    # By default the trade tokens will give a 0 balance
    assert ZeroXTrade.balanceOf(account, marketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == 0
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == 0

    # If we provide some Cash it will affect the balances since Cash can always be used to perform trades
    accountCash = 10000
    account2Cash = 20000
    cash.faucet(accountCash, sender=account)
    cash.faucet(account2Cash, sender=account2)

    assert ZeroXTrade.balanceOf(account, marketTokenId) == floor(accountCash / price)
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == floor(account2Cash / price)
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == floor(accountCash / price)
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == floor(account2Cash / price)

    # If we reverse the trade type it will change our available balance since we dont need to put up as much Cash for the trade

    orderType = ASK
    askPrice = 1000 - price

    marketTokenId = ZeroXTrade.getTokenId(market.address, price, outcome, orderType)
    catMarketTokenId = ZeroXTrade.getTokenId(categoricalMarket.address, price, outcome, orderType)

    assert ZeroXTrade.balanceOf(account, marketTokenId) == floor(accountCash / askPrice)
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == floor(account2Cash / askPrice)
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == floor(accountCash / askPrice)
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == floor(account2Cash / askPrice)

    # Lets try with just shares. Get rid of account 1 Cash
    cash.transfer(contractsFixture.accounts[3], accountCash, sender=account)

    # Make some complete sets for both markets and transfer our outcome shares to account 1
    shareToken.publicBuyCompleteSets(market.address, 10, sender=account2)
    shareToken.publicBuyCompleteSets(categoricalMarket.address, 10, sender=account2)

    shareToken.unsafeTransferFrom(account2, account, shareToken.getTokenId(market.address, outcome), 10, sender=account2)
    shareToken.unsafeTransferFrom(account2, account, shareToken.getTokenId(categoricalMarket.address, outcome), 10, sender=account2)

    assert cash.balanceOf(account) == 0
    assert cash.balanceOf(account2) == 0

    # The shares should determine an available balance when appropriate. In this case the order type is ASK so account 1 should have a balance
    assert ZeroXTrade.balanceOf(account, marketTokenId) == 10
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == 0
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == 10
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == 0

    # If we modify the order type back to BID account 2 will have a balance since they own shares in every other outcome
    orderType = BID

    marketTokenId = ZeroXTrade.getTokenId(market.address, price, outcome, orderType)
    catMarketTokenId = ZeroXTrade.getTokenId(categoricalMarket.address, price, outcome, orderType)

    assert ZeroXTrade.balanceOf(account, marketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == 10
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == 10

    # If we change the outcome we'll see that neither account has a BID compatible balance
    outcome = NO

    marketTokenId = ZeroXTrade.getTokenId(market.address, price, outcome, orderType)
    catMarketTokenId = ZeroXTrade.getTokenId(categoricalMarket.address, price, outcome, orderType)

    assert ZeroXTrade.balanceOf(account, marketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == 0
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == 0

    # However if the type is an ASK then account 2 will have a balance since they own those shares
    orderType = ASK

    marketTokenId = ZeroXTrade.getTokenId(market.address, price, outcome, orderType)
    catMarketTokenId = ZeroXTrade.getTokenId(categoricalMarket.address, price, outcome, orderType)

    assert ZeroXTrade.balanceOf(account, marketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == 10
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == 0
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == 10

    # Now lets give the account some Cash again and confirm the Cash is simply summed onto the share balances
    cash.faucet(accountCash, sender=account)
    cash.faucet(account2Cash, sender=account2)

    assert ZeroXTrade.balanceOf(account, marketTokenId) == floor(accountCash / askPrice)
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == 10 + floor(account2Cash / askPrice)
    assert ZeroXTrade.balanceOf(account, catMarketTokenId) == floor(accountCash / askPrice)
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == 10 + floor(account2Cash / askPrice)

    # We also have a method of checking multiple balances

    (marketAccount1Balance, marketAccount2Balance) = ZeroXTrade.balanceOfBatch([account, account2], [marketTokenId, catMarketTokenId])
    assert marketAccount1Balance == floor(accountCash / askPrice)
    assert marketAccount2Balance == 10 + floor(account2Cash / askPrice)

    # The balances take into account the approval of cash
    cash.approve(fillOrder.address, 5000, sender=account2)
    assert ZeroXTrade.balanceOf(account2, marketTokenId) == 10 + floor(5000 / askPrice)
    assert ZeroXTrade.balanceOf(account2, catMarketTokenId) == 10 + floor(5000 / askPrice)

def test_basic_trading(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    salt = 5

    zeroXExchange.setProtocolFeeMultiplier(150000)

    # First we'll create a signed order
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(BID, fix(20), 60, market.address, YES, expirationTime, salt)
    signature = signOrder(orderHash, contractsFixture.privateKeys[0])

    assert zeroXExchange.isValidSignature(rawZeroXOrderData, orderHash, signature)

    # Validate the signed order state
    marketAddress, price, outcome, orderType = ZeroXTrade.parseOrderData(rawZeroXOrderData)
    assert marketAddress == market.address
    assert price == 60
    assert outcome == YES
    assert orderType == BID

    fillAmount = fix(10)
    fingerprint = longTo32Bytes(11)
    tradeGroupId = longTo32Bytes(42)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    # Lets take the order as another user and confirm assets are traded
    assert cash.faucet(fix(10, 60))
    assert cash.faucet(fix(10, 940), sender=contractsFixture.accounts[1])
    with TokenDelta(cash, -fix(10, 60), contractsFixture.accounts[0], "Tester 0 cash not taken"):
        with TokenDelta(cash, -fix(10, 940), contractsFixture.accounts[1], "Tester 1 cash not taken"):
            with PrintGasUsed(contractsFixture, "ZeroXTrade.trade", 0):
                amountRemaining = ZeroXTrade.trade(fillAmount, fingerprint, tradeGroupId, 0, 1, orders, signatures, sender=contractsFixture.accounts[1], value=150000)
                assert amountRemaining == 0

    yesShareTokenBalance = shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[0])
    noShareTokenBalance = shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1])
    assert yesShareTokenBalance == fix(10)
    assert noShareTokenBalance == fix(10)

    # Another user can fill the rest. We'll also ask to fill more than is available and see that we get back the remaining amount desired
    assert cash.faucet(fix(10, 60))
    assert cash.faucet(fix(10, 940), sender=contractsFixture.accounts[2])
    # We get refunded excess ETH sent
    initialETHBalance = contractsFixture.ethBalance(contractsFixture.accounts[2])
    protocolFee = 150000
    sent = 10 * 10**7
    amountRemaining = ZeroXTrade.trade(fillAmount + 10**17, fingerprint, tradeGroupId, 0, 1, orders, signatures, sender=contractsFixture.accounts[2], value=sent)
    assert amountRemaining == 10**17
    newEthBalance = contractsFixture.ethBalance(contractsFixture.accounts[2])
    assert initialETHBalance - newEthBalance < 10**7

    # The order is completely filled so further attempts to take it will result in a no-op
    assert cash.faucet(fix(10, 60))
    assert cash.faucet(fix(10, 940), sender=contractsFixture.accounts[1])
    assert ZeroXTrade.trade(fillAmount, fingerprint, tradeGroupId, 0, 1, orders, signatures, sender=contractsFixture.accounts[1], value=150000) == fillAmount

    assert yesShareTokenBalance == fix(10)
    assert noShareTokenBalance == fix(10)

def test_cancelation(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    salt = 5

    # First we'll create a signed order
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(BID, fix(2), 60, market.address, YES, expirationTime, salt)
    signature = signOrder(orderHash, contractsFixture.privateKeys[0])

    orders = [rawZeroXOrderData]
    signatures = [signature]

    # Now lets cancel it
    maxProtocolFeeDai = 10**18

    CancelZeroXOrderLog = {
        "universe": universe.address,
        "market": market.address,
        "account": contractsFixture.accounts[0],
        "outcome": YES,
        "price": 60,
        "amount": fix(2),
        "orderType": BID,
    }
    with PrintGasUsed(contractsFixture, "Cancel 0x Order"):
        with AssertLog(contractsFixture, "CancelZeroXOrder", CancelZeroXOrderLog):
            ZeroXTrade.cancelOrders(orders, signatures, maxProtocolFeeDai)

    assert zeroXExchange.filled(orderHash)

    fillAmount = fix(1)
    fingerprint = longTo32Bytes(11)
    tradeGroupId = longTo32Bytes(42)

    # Lets take the order as another user and confirm we cannot take a canceled order
    assert cash.faucet(fix(1, 60))
    assert cash.faucet(fix(1, 940), sender=contractsFixture.accounts[1])
    assert ZeroXTrade.trade(fillAmount, fingerprint, tradeGroupId, 0, 10, orders, signatures, sender=contractsFixture.accounts[1], value=150000) == fillAmount

    # Now lets make and cancel several
    # First we'll create a signed order
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(BID, fix(2), 60, market.address, YES, expirationTime, salt+1)
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(BID, fix(2), 60, market.address, YES, expirationTime, salt+2)

    # Now lets cancel it
    zeroXExchange.batchCancelOrders([rawZeroXOrderData1,rawZeroXOrderData2])
    assert zeroXExchange.cancelled(orderHash1)
    assert zeroXExchange.cancelled(orderHash2)

@mark.parametrize('withSelf', [
    True,
    False
])
def test_one_bid_on_books_buy_full_order(withSelf, contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order
    sender = contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1]
    senderPrivateKey = contractsFixture.privateKeys[2] if withSelf else contractsFixture.privateKeys[1]
    cash.faucet(fix('2', '60'), sender=sender)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(BID, fix(2), 60, market.address, YES, expirationTime, salt, sender=sender)
    signature = signOrder(orderHash, senderPrivateKey)

    # fill signed order
    orderEventLog = {
	    "eventType": 2,
        "orderId": orderHash,
	    "addressData": [contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1] , contractsFixture.accounts[2]],
	    "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    assert cash.faucet(fix(2, 940), sender=contractsFixture.accounts[2])
    if not withSelf:
        with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
            with TokenDelta(cash, -fix(2, 60), sender, "Creator cash not taken"):
                with TokenDelta(cash, -fix(2, 940), contractsFixture.accounts[2], "Taker cash not taken"):
                    assert ZeroXTrade.trade(fix(2), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

        assert shareToken.balanceOfMarketOutcome(market.address, YES, sender) == fix(2)
        assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(2)
    else:
        assert ZeroXTrade.trade(fix(2), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

def test_one_bid_on_books_buy_partial_order(contractsFixture, cash, market):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order
    cash.faucet(fix('2', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(BID, fix(2), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])

    # fill signed order
    orderEventLog = {
	    "eventType": 2,
        "orderId": orderHash,
	    "addressData": [contractsFixture.accounts[1], contractsFixture.accounts[2]],
	    "uint256Data": [60, 0, YES, 0, 0, 0, fix(1),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    cash.faucet(fix('1', '940'), sender=contractsFixture.accounts[2])
    expectedAmountRemaining = fix(1)
    with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
        with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[1], "Creator cash not taken"):
            with TokenDelta(cash, -fix(1, 940), contractsFixture.accounts[2], "Taker cash not taken"):
                assert ZeroXTrade.trade(fix(1), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(1)

def test_two_bids_on_books_buy_both(contractsFixture, cash, market):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order 1
    cash.faucet(fix('4', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(BID, fix(4), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(BID, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('5', '940'), sender=contractsFixture.accounts[2])
    with TokenDelta(cash, -fix(4, 60), contractsFixture.accounts[1], "Creator cash not taken"):
        with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[3], "Creator cash not taken"):
            with TokenDelta(cash, -fix(5, 940), contractsFixture.accounts[2], "Taker cash not taken"):
                assert ZeroXTrade.trade(fix(5), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=300000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(4)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[3]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(5)

def test_three_bids_on_books_buy_first_2_cover_protocol_fee(contractsFixture, cash, market):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", ZeroXTrade.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    zeroXExchange.setProtocolFeeMultiplier(150000)
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order 1
    cash.faucet(fix('4', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(BID, fix(4), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(BID, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    # create signed order 3
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[4])
    rawZeroXOrderData3, orderHash3 = ZeroXTrade.createZeroXOrder(BID, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[4])
    signature3 = signOrder(orderHash3, contractsFixture.privateKeys[4])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2, rawZeroXOrderData3]
    signatures = [signature1, signature2, signature3]

    # We'll provide some liquidity to the uniswap eth/cash exchange
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(contractsFixture.accounts[2])

    # Calculate the expected protocol fee cost and add that as a limit
    cost = ZeroXTrade.estimateProtocolFeeCostInCash(2, 1)
    cash.faucet(cost, sender=contractsFixture.accounts[2])

    # fill signed orders
    cash.faucet(fix('6', '940'), sender=contractsFixture.accounts[2])
    with TokenDelta(cash, -fix(4, 60), contractsFixture.accounts[1], "Creator cash not taken"):
        with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[3], "Creator cash not taken"):
            assert ZeroXTrade.trade(fix(5), longTo32Bytes(11), tradeGroupID, cost, 2, orders, signatures, sender=contractsFixture.accounts[2]) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(4)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[3]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[4]) == fix(0)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(5)

def test_two_bids_on_books_buy_full_and_partial(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order 1
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(BID, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('4', '60'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(BID, fix(4), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('3', '940'), sender=contractsFixture.accounts[2])
    with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[1], "Creator cash not taken"):
        with TokenDelta(cash, -fix(2, 60), contractsFixture.accounts[3], "Creator cash not taken"):
            with TokenDelta(cash, -fix(3, 940), contractsFixture.accounts[2], "Taker cash not taken"):
                assert ZeroXTrade.trade(fix(3), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=300000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[3]) == fix(2)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(3)

def test_one_ask_on_books_buy_full_order(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order
    sender = contractsFixture.accounts[1]
    senderPrivateKey = contractsFixture.privateKeys[1]
    cash.faucet(fix('2', '940'), sender=sender)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, fix(2), 60, market.address, YES, expirationTime, salt, sender=sender)
    signature = signOrder(orderHash, senderPrivateKey)

    # fill signed order
    orderEventLog = {
        "eventType": 2,
        "addressData": [contractsFixture.accounts[1] , contractsFixture.accounts[2]],
        "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    assert cash.faucet(fix(2, 60), sender=contractsFixture.accounts[2])
    with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
        with TokenDelta(cash, -fix(2, 940), sender, "Creator cash not taken"):
            with TokenDelta(cash, -fix(2, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                assert ZeroXTrade.trade(fix(2), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, NO, sender) == fix(2)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(2)

def test_one_ask_on_books_buy_partial_order(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order
    sender = contractsFixture.accounts[1]
    senderPrivateKey = contractsFixture.privateKeys[1]
    cash.faucet(fix('4', '940'), sender=sender)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, fix(4), 60, market.address, YES, expirationTime, salt, sender=sender)
    signature = signOrder(orderHash, senderPrivateKey)

    # fill signed order
    orderEventLog = {
        "eventType": 2,
        "addressData": [contractsFixture.accounts[1] , contractsFixture.accounts[2]],
        "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    assert cash.faucet(fix(2, 60), sender=contractsFixture.accounts[2])
    with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
        with TokenDelta(cash, -fix(2, 940), sender, "Creator cash not taken"):
            with TokenDelta(cash, -fix(2, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                assert ZeroXTrade.trade(fix(2), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, NO, sender) == fix(2)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(2)

def test_two_asks_on_books_buy_both(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order 1
    cash.faucet(fix('4', '940'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(ASK, fix(4), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('1', '940'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(ASK, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('5', '60'), sender=contractsFixture.accounts[2])
    with TokenDelta(cash, -fix(4, 940), contractsFixture.accounts[1], "Creator cash not taken"):
        with TokenDelta(cash, -fix(1, 940), contractsFixture.accounts[3], "Creator cash not taken"):
            with TokenDelta(cash, -fix(5, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                assert ZeroXTrade.trade(fix(5), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=300000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(4)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[3]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(5)

def test_two_asks_on_books_buy_full_and_partial(contractsFixture, cash, market):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order 1
    cash.faucet(fix('1', '940'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(ASK, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('4', '940'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(ASK, fix(4), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('3', '60'), sender=contractsFixture.accounts[2])
    with TokenDelta(cash, -fix(1, 940), contractsFixture.accounts[1], "Creator cash not taken"):
        with TokenDelta(cash, -fix(2, 940), contractsFixture.accounts[3], "Creator cash not taken"):
            with TokenDelta(cash, -fix(3, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                assert ZeroXTrade.trade(fix(3), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=300000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[3]) == fix(2)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(3)

def test_take_order_with_shares_buy_with_cash(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts['ShareToken']
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # buy complete sets
    account = contractsFixture.accounts[1]
    with BuyWithCash(cash, fix('1', '1000'), account, "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=account)

    assert shareToken.balanceOfMarketOutcome(market.address, YES, account) == fix(1)

    # create signed order
    cash.faucet(fix('1', '940'), sender=account)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, fix(1), 60, market.address, YES, expirationTime, salt, sender=account)
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])

    # fill order with cash and see that the creator has shares taken
    orders = [rawZeroXOrderData]
    signatures = [signature]
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[2])
    with TokenDelta(cash, fix(1, 60), account, "Creator cash not received"):
        with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[2], "Taker cash not taken"):
            assert ZeroXTrade.trade(fix(1), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, YES, account) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(1)

def test_take_best_order_with_shares_escrowed_buy_with_shares_categorical(contractsFixture, cash, categoricalMarket, universe):
    market = categoricalMarket
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts['ShareToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[2])

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[2]) == fix(1)

    # create signed order
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, fix(1), 60, market.address, 0, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])

    # fill order with shares and see payouts occur
    orders = [rawZeroXOrderData]
    signatures = [signature]
    totalProceeds = fix(1, numTicks)
    totalProceeds -= fix(1, numTicks) / market.getMarketCreatorSettlementFeeDivisor()
    totalProceeds -= fix(1, numTicks) / universe.getOrCacheReportingFeeDivisor()
    expectedTester1Payout = totalProceeds * 60 / numTicks
    expectedTester2Payout = totalProceeds * (numTicks - 60) / numTicks
    with TokenDelta(cash, expectedTester1Payout, contractsFixture.accounts[1], "Tester 1 Cash delta wrong"):
        with TokenDelta(cash, expectedTester2Payout, contractsFixture.accounts[2], "Tester 2 Cash delta wrong"):
            assert ZeroXTrade.trade(fix(1), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[1]) == fix(1)

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[2]) == 0

@mark.parametrize(('finalized', 'invalid'), [
    (True, True),
    (False, True),
    (True, False),
    (False, False),
])
def test_fees_from_trades(finalized, invalid, contractsFixture, cash, market, universe):
    affiliates = contractsFixture.contracts['Affiliates']
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts['ShareToken']
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    shareToken = contractsFixture.contracts['ShareToken']
    fingerprint = longTo32Bytes(11)

    affiliateAddress = contractsFixture.accounts[3]
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=contractsFixture.accounts[1])
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=contractsFixture.accounts[2])

    if finalized:
        if invalid:
            contractsFixture.contracts["Time"].setTimestamp(market.getDesignatedReportingEndTime() + 1)
            market.doInitialReport([market.getNumTicks(), 0, 0], "", 0)
        else:
            proceedToNextRound(contractsFixture, market)

        disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
        assert market.finalize()

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[2])

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == fix(1)

    # create order with shares
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, fix(1), 60, market.address, 0, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])
    orders = [rawZeroXOrderData]
    signatures = [signature]

    expectedAffiliateFees = fix(1000) / 400
    sourceKickback = expectedAffiliateFees / 5
    expectedAffiliateFees -= sourceKickback
    cash.faucet(fix(60), sender=contractsFixture.accounts[2])
    # Trade and specify an affiliate address.
    if finalized:
        if invalid:
            nextDisputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)
            totalFees = fix(1) - sourceKickback # market fees
            totalFees += fix(.01) # reporting fee
            with TokenDelta(cash, totalFees, nextDisputeWindowAddress, "Dispute Window did not recieve the correct fees"):
                assert ZeroXTrade.trade(fix(1), fingerprint, tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0
        else:
            with TokenDelta(cash, expectedAffiliateFees, contractsFixture.accounts[3], "Affiliate did not recieve the correct fees"):
                assert ZeroXTrade.trade(fix(1), fingerprint, tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0
    else:
        with TokenDelta(cash, 0 if invalid else expectedAffiliateFees, contractsFixture.accounts[3]):
            assert ZeroXTrade.trade(fix(1), fingerprint, tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == fix(1)

    # The second user sold the complete set they ended up holding from this transaction, which extracts fees
    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == 0

    if not finalized:
        if invalid:
            contractsFixture.contracts["Time"].setTimestamp(market.getDesignatedReportingEndTime() + 1)
            market.doInitialReport([market.getNumTicks(), 0, 0], "", 0)
        else:
            proceedToNextRound(contractsFixture, market)

        disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
        totalCollectedFees = market.marketCreatorFeesAttoCash() + expectedAffiliateFees + market.validityBondAttoCash()
        nextDisputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)
        nextDisputeWindowBalanceBeforeFinalization = cash.balanceOf(universe.getOrCreateNextDisputeWindow(False))
        assert market.finalize()

        if invalid:
            if finalized:
                assert cash.balanceOf(universe.getOrCreateNextDisputeWindow(False)) == nextDisputeWindowBalanceBeforeFinalization + totalCollectedFees
            else:
                assert cash.balanceOf(universe.getOrCreateNextDisputeWindow(False)) == nextDisputeWindowBalanceBeforeFinalization + totalCollectedFees - expectedAffiliateFees

def test_order_creator_lacks_funds(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    shareToken = contractsFixture.contracts['ShareToken']
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(ASK, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])
    orders = [rawZeroXOrderData]
    signatures = [signature]

    # The TX will succeed when the order creator lacks funds but no trade occurs
    with TokenDelta(cash, 0, contractsFixture.accounts[1], "Creator cash not received"):
        with TokenDelta(cash, 0, contractsFixture.accounts[2], "Taker cash not taken"):
            assert ZeroXTrade.trade(fix(1), longTo32Bytes(11), tradeGroupID, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000) == fix(1)

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0

def test_dev_utils(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    devUtils = contractsFixture.contracts['DevUtils']

    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5

    cash.faucet(fix(940), sender=contractsFixture.accounts[1])
    cash.faucet(fix(60), sender=contractsFixture.accounts[2])

    signedOrder, orderHash = ZeroXTrade.createZeroXOrder(
        ASK,
        fix(1),
        60,
        market.address,
        YES,
        expirationTime,
        salt,
        sender=contractsFixture.accounts[1])

    signature = signOrder(orderHash, contractsFixture.privateKeys[1])
    orders = [signedOrder]
    signatures = [signature]

    ordersInfo, fillableTakerAssetAmounts, isValidSignature = devUtils.getOrderRelevantStates(orders, signatures)
    orderStatus, orderHash, orderTakerAssetFilledAmount = ordersInfo[0]

    assert fillableTakerAssetAmounts[0] == signedOrder[5] # takerAssetAmount
    assert orderStatus == 3, 'order status must be 3 (FILLABLE) not {}'.format(orderStatus)
    assert isValidSignature[0], 'signature must be valid'

def test_order_non_valid_market(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    shareToken = contractsFixture.contracts['ShareToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order
    badMarket = cash.address
    with raises(TransactionFailed):
        ZeroXTrade.createZeroXOrder(ASK, fix(1), 60, badMarket, YES, expirationTime, salt, sender=contractsFixture.accounts[1])

def test_fill_nothing_failure(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    tradeGroupID = longTo32Bytes(42)

    # The TX will not succeed when one tries to fill no orders
    with raises(TransactionFailed):
        ZeroXTrade.trade(fix(1), longTo32Bytes(11), tradeGroupID, 0, 10, [], [], sender=contractsFixture.accounts[2], value=150000) == fix(1)

def test_augur_wallet_trade(contractsFixture, augur, cash, market, universe, reputationToken):
    RELAY_HUB_ADDRESS = "0xD216153c06E857cD7f72665E0aF1d7D82172F494"
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
    affiliates = contractsFixture.contracts["Affiliates"]
    weth = contractsFixture.contracts["WETH9"]

    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistry"]
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", ZeroXTrade.ethExchange())
    relayHub = contractsFixture.applySignature("RelayHub", RELAY_HUB_ADDRESS)
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    relayHub.stake(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    relayHub.registerRelay(10, "url", sender=relayer)

    # Fund the wallet so we can generate it and have it reimburse the relay hub
    cashAmount = 100*10**18
    walletAddress = augurWalletRegistry.getCreate2WalletAddress(account)
    cash.faucet(cashAmount)
    cash.transfer(walletAddress, cashAmount, sender=account)

    # We'll provide some liquidity to the eth exchange
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    # We do this again in order to trigger a storage update that will make using the exchange cheaper
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    assert augurWalletRegistry.getWallet(account) == nullAddress

    cashPayment = 10**18
    desiredSignerBalance = 0
    maxExchangeRate = 200 * 10**36
    fingerprint = longTo32Bytes(42)
    additionalFee = 10 # 10%
    gasPrice = 1
    gasLimit = 3000000
    nonce = 0
    approvalData = ""
    repAmount = 10**18
    repFaucetData = reputationToken.faucet_encode(repAmount)
    augurWalletRepFaucetData = augurWalletRegistry.executeWalletTransaction_encode(reputationToken.address, repFaucetData, 0, cashPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)

    messageHash = augurWalletRegistry.getRelayMessageHash(relayer,
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)
    signature = signMessage(messageHash, accountKey)

    relayHub.relayCall(
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData,
        sender=relayer
    )

    assert augurWalletRegistry.getWallet(account) == walletAddress
    wallet = contractsFixture.applySignature("AugurWallet", walletAddress)

    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    account = contractsFixture.accounts[0]

    # First we'll create a signed order
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrderFor(walletAddress, BID, fix(2), 60, market.address, YES, expirationTime, salt)
    
    EIP1271OrderWithHash = ZeroXTrade.encodeEIP1271OrderWithHash(rawZeroXOrderData, orderHash)
    messageHash = wallet.getMessageHash(EIP1271OrderWithHash)
    signatureType = "07"
    key = normalize_key(accountKey.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + messageHash), key)
    bytesv = v.to_bytes(1, "big").hex()
    bytesr = zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32).hex()
    bytess = zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32).hex()

    signature = "0x" + bytesr + bytess + bytesv + signatureType
    assert wallet.isValidSignature(EIP1271OrderWithHash, signature)
    assert zeroXExchange.isValidSignature(rawZeroXOrderData, orderHash, signature)

    # Validate the signed order state
    marketAddress, price, outcome, orderType = ZeroXTrade.parseOrderData(rawZeroXOrderData)
    fillAmount = fix(1)
    fingerprint = longTo32Bytes(11)
    tradeGroupId = longTo32Bytes(42)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    # Lets take the order as another user also using a wallet and confirm assets are traded
    senderAccount = contractsFixture.accounts[1]
    senderAccountKey = contractsFixture.privateKeys[1]

    # Fund the wallet so we can generate it and have it reimburse the relay hub
    cashAmount = 100*10**18
    walletAddress2 = augurWalletRegistry.getCreate2WalletAddress(senderAccount)
    cash.faucet(cashAmount)
    cash.transfer(walletAddress2, cashAmount, sender=account)

    messageHash = augurWalletRegistry.getRelayMessageHash(relayer,
        senderAccount,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)
    signature = signMessage(messageHash, senderAccountKey)

    relayHub.relayCall(
        senderAccount,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData,
        sender=relayer
    )

    assert augurWalletRegistry.getWallet(senderAccount) == walletAddress2
    wallet2 = contractsFixture.applySignature("AugurWallet", walletAddress2)

    assert cash.faucet(fix(1, 60))
    assert cash.transfer(walletAddress, fix(1, 60))
    assert cash.faucet(fix(1, 940))
    assert cash.transfer(walletAddress2, fix(1, 940))
    ethPayment = 10**16

    walletAddress2InitialBalance = cash.balanceOf(walletAddress2)
    with TokenDelta(cash, -fix(1, 60), walletAddress, "Tester 0 cash taken incorrect"):
        with PrintGasUsed(contractsFixture, "ZeroXTrade.trade", 0):
            nonce+=1
            tradeData = ZeroXTrade.trade_encode(fillAmount, fingerprint, tradeGroupId, 0, 10, orders, signatures)
            augurWalletTradeData = augurWalletRegistry.executeWalletTransaction_encode(ZeroXTrade.address, tradeData, 0, ethPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)
            messageHash = augurWalletRegistry.getRelayMessageHash(relayer,
                senderAccount,
                augurWalletRegistry.address,
                augurWalletTradeData,
                additionalFee,
                gasPrice,
                gasLimit,
                nonce)

            signature = signMessage(messageHash, senderAccountKey)
            relayHub.relayCall(
                senderAccount,
                augurWalletRegistry.address,
                augurWalletTradeData,
                additionalFee,
                gasPrice,
                gasLimit,
                nonce,
                signature,
                approvalData,
                sender=relayer
            )
    
    assert cash.balanceOf(walletAddress2) <= (walletAddress2InitialBalance - fix(1, 940))

    yesShareTokenBalance = shareToken.balanceOfMarketOutcome(market.address, YES, walletAddress)
    noShareTokenBalance = shareToken.balanceOfMarketOutcome(market.address, NO, walletAddress2)
    assert yesShareTokenBalance == fix(1)
    assert noShareTokenBalance == fix(1)

    # Another user can fill the rest. We'll also ask to fill more than is available and see that we get back the remaining amount desired
    assert cash.faucet(fix(1, 60))
    assert cash.transfer(walletAddress, fix(1, 60))
    assert cash.faucet(fix(1, 940), sender=contractsFixture.accounts[2])
    amountRemaining = ZeroXTrade.trade(fillAmount + 10**17, fingerprint, tradeGroupId, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000)
    assert amountRemaining == 10**17

    # The order is completely filled so further attempts to take it will result in a no-op
    assert cash.faucet(fix(1, 60))
    assert cash.transfer(walletAddress, fix(1, 60))
    assert cash.faucet(fix(1, 940), sender=contractsFixture.accounts[1])
    assert ZeroXTrade.trade(fillAmount, fingerprint, tradeGroupId, 0, 10, orders, signatures, sender=contractsFixture.accounts[1], value=150000) == fillAmount

    assert yesShareTokenBalance == fix(1)
    assert noShareTokenBalance == fix(1)

def test_protocol_fee_coverage(contractsFixture, cash, market):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    weth = contractsFixture.contracts["WETH9"]
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", ZeroXTrade.ethExchange())
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    zeroXExchange.setProtocolFeeMultiplier(1)

    # create signed order 1
    cash.faucet(fix('4', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(BID, fix(4), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(BID, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    account = contractsFixture.accounts[2]
    cash.faucet(fix('5', '940'), sender=account)

    # Initially we will fail the tx bc we have neither provided liquidity to the ETH exchange nor authorized a non zero purchase in the function args
    with raises(TransactionFailed):
        assert ZeroXTrade.trade(fix(5), longTo32Bytes(11), tradeGroupID, 0, 2, orders, signatures, sender=account) == 0

    # We'll provide some liquidity to the exchange
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    # We still fail since we have not approved any purchase of ETH using our DAI
    with raises(TransactionFailed):
        assert ZeroXTrade.trade(fix(5), longTo32Bytes(11), tradeGroupID, 0, 2, orders, signatures, sender=account) == 0

    # Calculate the expected cost and add that as a limit
    cost = ZeroXTrade.estimateProtocolFeeCostInCash(len(orders), 1)
    cash.faucet(cost, sender=account)

    assert ZeroXTrade.trade(fix(5), longTo32Bytes(11), tradeGroupID, cost, 2, orders, signatures, sender=account) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(4)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[3]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(5)

def test_max_trades(contractsFixture, cash, market):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    # create signed order 1
    cash.faucet(fix('4', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(BID, fix(4), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = ZeroXTrade.createZeroXOrder(BID, fix(1), 60, market.address, YES, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    account = contractsFixture.accounts[2]
    cash.faucet(fix('5', '940'), sender=account)

    assert ZeroXTrade.trade(fix(5), longTo32Bytes(11), tradeGroupID, 0, 1, orders, signatures, sender=account) == fix(1)

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(4)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[3]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(4)

def test_scalar_order_creation(contractsFixture, augur, universe, cash):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    scalarMarket = contractsFixture.createReasonableScalarMarket(universe, 120  * 10**18, -10  * 10**18, 1300)

    tradeInterval = augur.getMarketRecommendedTradeInterval(scalarMarket.address)
    assert tradeInterval == 10**16

    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    amount = tradeInterval
    price = 200
    cash.faucet(amount*price, sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = ZeroXTrade.createZeroXOrder(BID, amount, price, scalarMarket.address, YES, expirationTime, salt, sender=contractsFixture.accounts[1])

    assert orderHash1 is not None


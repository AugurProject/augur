from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed, ABIContract
from pytest import fixture, raises
from utils import TokenDelta, EtherDelta, AssertLog, BuyWithCash
from reporting_utils import generateFees

def test_bootstrap(localFixture, universe, reputationToken, auction, time, cash):
    # Lets confirm the auction is in the dormant state initially and also in bootstrap mode
    assert auction.getRoundType() == 0
    assert auction.bootstrapMode()
    assert not auction.isActive()

    # If we move time forward to the next auction start time we can see that the auction is now active.
    startTime = auction.getAuctionStartTime()
    assert time.setTimestamp(startTime)
    assert auction.getRoundType() == 2
    assert auction.bootstrapMode()
    assert auction.isActive()

    # We can get the price of CASH in REP
    assert auction.getRepSalePriceInAttoCash() == auction.initialRepSalePrice()

    # However since we're in bootstrap mode we cannot yet sell REP for CASH.
    with raises(TransactionFailed):
        auction.getCashSalePriceInAttoRep()

    # If we move time forward but stay in the auction the sale price of the REP will drop accordingly. We'll move forward an hour and confirm the price is 1/24th less
    repSalePrice = auction.initialRepSalePrice() * 23 / 24
    assert time.incrementTimestamp(60 * 60)
    assert auction.getRepSalePriceInAttoCash() == repSalePrice

    # Before we do any trading lets confirm the contract balances are as expected
    repAuctionToken = localFixture.applySignature("AuctionToken", auction.repAuctionToken())
    assert auction.initialAttoRepBalance() == reputationToken.balanceOf(repAuctionToken.address)
    expectedBalance = (11 * 10 ** 6  + 1) * 10 ** 18 / 11000
    assert auction.initialAttoRepBalance() == expectedBalance
    assert localFixture.chain.head_state.get_balance(auction.address) == 0

    # We can purchase some of the REP now. We'll send some extra CASH to confirm it just gets returned too
    repAmount = 10 ** 18
    cost = repAmount * repSalePrice / 10 ** 18
    with BuyWithCash(cash, cost, tester.k0, "trade cash for rep"):
        with TokenDelta(cash, cost, auction.address, "CASH was not transfered to auction correctly"):
            with TokenDelta(repAuctionToken, cost, tester.a0, "REP auction token was not transferred to the user correctly"):
                auction.tradeCashForRep(repAmount)

    # We cannot yet redeem our auction tokens since the auction time hasnt expired and not enough tokens have been sold to qualify the auction as over
    with raises(TransactionFailed):
        repAuctionToken.redeem()

    # Lets purchase the remaining REP in the auction
    repAmount = auction.getCurrentAttoRepBalance()
    cost = repAmount * repSalePrice / 10 ** 18
    with BuyWithCash(cash, cost, tester.k0, "trade cash for rep"):
        with TokenDelta(cash, cost, auction.address, "CASH was not transfered to auction correctly"):
            with TokenDelta(repAuctionToken, cost, tester.a0, "REP auction token was not transferred to the user correctly"):
                assert auction.tradeCashForRep(repAmount)

    # If we try to purchase any more the transaction will fail
    cash.faucet(cost)
    with raises(TransactionFailed):
        auction.tradeCashForRep(repAmount)

    # We can redeem our auction tokens immediately now that the auction is effectively over
    expectedREP = reputationToken.balanceOf(repAuctionToken.address)
    with TokenDelta(reputationToken, expectedREP, tester.a0, "REP was not distributed correctly from auction token redemption"):
        repAuctionToken.redeem()

    # Lets end this auction then move time to the next auction
    endTime = auction.getAuctionEndTime()
    assert time.setTimestamp(endTime + 1)

    assert auction.getRoundType() == 3
    assert auction.bootstrapMode()
    assert not auction.isActive()

    startTime = auction.getAuctionStartTime()
    assert time.setTimestamp(startTime)

    # We can see that the CASH and REP auctions are active
    assert auction.getRoundType() == 6
    assert auction.isActive()

    assert auction.getRepSalePriceInAttoCash() == auction.initialRepSalePrice()
    assert auction.getCashSalePriceInAttoRep() == auction.initialCashSalePrice()

    assert not auction.bootstrapMode()

    cashAuctionToken = localFixture.applySignature("AuctionToken", auction.cashAuctionToken())
    cashSalePrice = auction.initialCashSalePrice()
    cashAmount = 10 ** 18
    cost = cashAmount * cashSalePrice / 10 ** 18
    with TokenDelta(cashAuctionToken, cost, tester.a0, "CASH auction token was not transferred to the user correctly"):
        with TokenDelta(reputationToken, cost, auction.address, "REP was not transferred to the auction correctly"):
            assert auction.tradeRepForCash(cashAmount)

    endTime = auction.getAuctionEndTime()
    assert time.setTimestamp(endTime + 1)

    # We can redeem the cash auction tokens for CASH. Since the auction ended with no other bids we get all the CASH
    with TokenDelta(cash, cash.balanceOf(cashAuctionToken.address), tester.a0, "Cash redemption from cash auction token did not work correctly"):
        assert cashAuctionToken.redeem()

def test_reporting_fee_from_auction(localFixture, universe, auction, reputationToken, time, cash):
    # We'll quickly do the bootstrap auction and seed it with some CASH
    startTime = auction.getAuctionStartTime()
    assert time.setTimestamp(startTime)

    # Buy 1000 REP
    repSalePrice = auction.getRepSalePriceInAttoCash()
    repAuctionToken = localFixture.applySignature("AuctionToken", auction.repAuctionToken())
    repAmount = 1000 * 10 ** 18
    cost = repAmount * repSalePrice / 10 ** 18
    with BuyWithCash(cash, cost, tester.k0, "trade cash for rep"):
        with TokenDelta(cash, cost, auction.address, "CASH was not transferred to auction correctly"):
            with TokenDelta(repAuctionToken, cost, tester.a0, "REP was not transferred to the user correctly"):
                assert auction.tradeCashForRep(repAmount)

    # Now we'll go to the first real auction, which will be a reported auction, meaning the result affects the reported REP price
    endTime = auction.getAuctionEndTime()
    assert time.setTimestamp(endTime + 1)

    # Now we can redeem the tokens we received for the amount of REP we purchased
    expectedREP = reputationToken.balanceOf(repAuctionToken.address)
    with TokenDelta(reputationToken, expectedREP, tester.a0, "REP was not distributed correctly from auction token redemption"):
        repAuctionToken.redeem()

    startTime = auction.getAuctionStartTime()
    assert time.setTimestamp(startTime)

    # Initially the REP price of the auction will simply be what was provided as the constant initialized value
    assert auction.getRepPriceInAttoCash() == auction.initialRepPriceInAttoCash()
    repSalePrice = auction.getRepSalePriceInAttoCash()
    repAuctionToken = localFixture.applySignature("AuctionToken", auction.repAuctionToken())
    cashAuctionToken = localFixture.applySignature("AuctionToken", auction.cashAuctionToken())

    # Purchasing REP or CASH will update the current auctions derived price, though until the auction ends it will be very innacurate so we dont bother checking here. We'll purchase 1/4 of the available supply of each at the initial price
    repAmount = auction.getCurrentAttoRepBalance() / 4
    cost = repAmount * repSalePrice / 10 ** 18
    with BuyWithCash(cash, cost, tester.k0, "trade cash for rep"):
        assert auction.tradeCashForRep(repAmount)

    cashSalePrice = auction.getCashSalePriceInAttoRep()
    cashAmount = auction.getCurrentAttoCashBalance() / 4
    cost = cashAmount * cashSalePrice / 10 ** 18
    assert auction.tradeRepForCash(cashAmount)

    # We'll let some time pass and buy the rest of the REP and CASH and the halfpoint prices
    assert time.incrementTimestamp(12 * 60 * 60)

    newRepSalePrice = auction.getRepSalePriceInAttoCash()
    repAmount = auction.getCurrentAttoRepBalance()
    cost = repAmount * newRepSalePrice / 10 ** 18
    with BuyWithCash(cash, cost, tester.k0, "trade cash for rep"):
        assert auction.tradeCashForRep(repAmount)

    # Now we'll purchase 2 CASH
    newCashSalePrice = auction.getCashSalePriceInAttoRep()
    cashAmount = auction.getCurrentAttoCashBalance()
    cost = cashAmount * newCashSalePrice / 10 ** 18
    assert auction.tradeRepForCash(cashAmount)

    # We can observe that the recorded lower bound weighs this purchase more since more CASH was purchased
    lowerBoundRepPrice = auction.initialAttoCashBalance() * 10**18 / cashAuctionToken.maxSupply()
    upperBoundRepPrice = repAuctionToken.maxSupply() * 10**18 / auction.initialAttoRepBalance()
    derivedRepPrice = (lowerBoundRepPrice + upperBoundRepPrice) / 2
    assert auction.getDerivedRepPriceInAttoCash() == derivedRepPrice

    # Lets turn on auction price reporting and move time so that this auction is considered over
    assert time.setTimestamp(auction.getAuctionEndTime() + 1)

    # We can see now that the auction will use the derived rep price when we request the price of rep for reporting fee purposes
    assert auction.getRepPriceInAttoCash() == derivedRepPrice

    # If we move time forward to the next auction we can confirm the price is still the derived price
    assert time.setTimestamp(auction.getAuctionStartTime())
    assert auction.getRepPriceInAttoCash() == derivedRepPrice

    # Lets purchase REP and CASH in this auction and confirm that it does not change the reported rep price, but is recorded for use internally to set auction pricing
    repSalePrice = auction.getRepSalePriceInAttoCash()

    # Note that the repSalePrice now starts at 4 x the previous auctions derived price
    assert auction.initialRepSalePrice() == 4 * derivedRepPrice

    repAmount = auction.getCurrentAttoRepBalance()
    cost = repAmount * repSalePrice / 10 ** 18
    with BuyWithCash(cash, cost, tester.k0, "trade cash for rep"):
        assert auction.tradeCashForRep(repAmount)

    # Now we'll purchase 1 CASH
    cashSalePrice = auction.getCashSalePriceInAttoRep()

    # Note that the cashSalePrice is now 4 x the previous auctions derived price in terms of CASH
    assert auction.initialCashSalePrice() == 4 * 10**36 / derivedRepPrice

    cashAmount = auction.getCurrentAttoCashBalance()
    cost = cashAmount * cashSalePrice / 10 ** 18
    assert auction.tradeRepForCash(cashAmount)

    # And as before the recorded REP price is the mean of the two bounds
    repAuctionToken = localFixture.applySignature("AuctionToken", auction.repAuctionToken())
    cashAuctionToken = localFixture.applySignature("AuctionToken", auction.cashAuctionToken())
    lowerBoundRepPrice = auction.initialAttoCashBalance() * 10**18 / cashAuctionToken.maxSupply()
    upperBoundRepPrice = repAuctionToken.maxSupply() * 10**18 / auction.initialAttoRepBalance()
    newDerivedRepPrice = (lowerBoundRepPrice + upperBoundRepPrice) / 2
    assert auction.getDerivedRepPriceInAttoCash() == newDerivedRepPrice

    # Now lets go to the dormant state and confirm that the reported rep price is still the previous recorded auctions derived REP price
    assert time.setTimestamp(auction.getAuctionEndTime() + 1)
    assert auction.getRepPriceInAttoCash() == derivedRepPrice

    # In the next auction we will see the newly derived REP price used as the basis for auction pricing but NOT used as the reported rep price for fees
    assert time.setTimestamp(auction.getAuctionStartTime())
    assert auction.initializeNewAuction()
    assert auction.getRepPriceInAttoCash() == derivedRepPrice
    assert auction.lastRepPrice() == newDerivedRepPrice
    assert auction.initialRepSalePrice() == 4 * newDerivedRepPrice
    assert auction.initialCashSalePrice() == 4 * 10**36 / newDerivedRepPrice

@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    universe = ABIContract(fixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)

    # Distribute REP
    reputationToken = fixture.applySignature('ReputationToken', universe.getReputationToken())
    for testAccount in [tester.a1, tester.a2, tester.a3]:
        reputationToken.transfer(testAccount, 1 * 10**6 * 10**18)

    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def universe(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)

@fixture
def time(localFixture, kitchenSinkSnapshot):
    return localFixture.contracts["Time"]

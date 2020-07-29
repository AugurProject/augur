from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises, mark
from utils import longToHexString, EtherDelta, TokenDelta, PrintGasUsed, fix, AssertLog, longTo32Bytes, stringToBytes, BuyWithCash, nullAddress
from reporting_utils import proceedToDesignatedReporting, proceedToInitialReporting, proceedToNextRound, proceedToFork, finalize
from constants import BID, ASK, YES, NO, SHORT

def test_market_hot_loading_basic(kitchenSinkFixture, augur, cash, market, categoricalMarket, scalarMarket):
    hotLoading = kitchenSinkFixture.contracts["HotLoading"]
    fillOrder = kitchenSinkFixture.contracts["FillOrder"]
    orders = kitchenSinkFixture.contracts["Orders"]
    account = kitchenSinkFixture.accounts[0]

    # Get the market hot load data
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)

    assert marketData.extraInfo == '{description: "description", categories: ["", "", ""]}'
    assert marketData.marketCreator == account
    assert marketData.owner == account
    assert marketData.outcomes == []
    assert marketData.marketType == 0 # YES_NO
    assert marketData.displayPrices == []
    assert marketData.designatedReporter == account
    assert marketData.reportingState == 0 # PRE_REPORTING
    assert marketData.disputeRound == 0
    assert marketData.winningPayout == []
    assert marketData.volume == 0
    assert marketData.openInterest == 0
    assert marketData.lastTradedPrices == [0, 0, 0]
    assert marketData.universe == market.getUniverse()
    assert marketData.numTicks == market.getNumTicks()
    assert marketData.feeDivisor == market.getMarketCreatorSettlementFeeDivisor()
    assert marketData.affiliateFeeDivisor == market.affiliateFeeDivisor()
    assert marketData.endTime == market.getEndTime()
    assert marketData.numOutcomes == 3
    universeContract = kitchenSinkFixture.applySignature("Universe", marketData.universe)
    assert marketData.validityBond == universeContract.getOrCacheValidityBond()
    assert marketData.reportingFeeDivisor == universeContract.getReportingFeeDivisor()

    # Try the other markets
    marketData = getMarketData(hotLoading, augur, categoricalMarket, fillOrder, orders)
    assert marketData.marketType == 1 # CATEGORICAL
    assert marketData.numOutcomes == 4
    outcomeLabel = stringToBytes(" ")
    assert marketData.outcomes == [outcomeLabel, outcomeLabel, outcomeLabel]

    marketData = getMarketData(hotLoading, augur, scalarMarket, fillOrder, orders)
    assert marketData.marketType == 2 # SCALAR
    assert marketData.numTicks == 400000
    assert marketData.displayPrices == [-10 * 10 **18, 30 * 10 ** 18]

def test_hot_loading_bulk(kitchenSinkFixture, augur, cash, categoricalMarket, scalarMarket):
    hotLoading = kitchenSinkFixture.contracts["HotLoading"]
    fillOrder = kitchenSinkFixture.contracts["FillOrder"]
    orders = kitchenSinkFixture.contracts["Orders"]
    account = kitchenSinkFixture.accounts[0]

    markets = [categoricalMarket.address, scalarMarket.address]

    # Get the market hot load data
    marketsData = getMarketsData(hotLoading, augur, markets, fillOrder, orders)

    marketData = marketsData[0]
    assert marketData.marketType == 1 # CATEGORICAL
    assert marketData.numOutcomes == 4
    outcomeLabel = stringToBytes(" ")
    assert marketData.outcomes == [outcomeLabel, outcomeLabel, outcomeLabel]

    marketData = marketsData[1]
    assert marketData.marketType == 2 # SCALAR
    assert marketData.numTicks == 400000
    assert marketData.displayPrices == [-10 * 10 **18, 30 * 10 ** 18]

def test_trading(kitchenSinkFixture, augur, cash, market):
    hotLoading = kitchenSinkFixture.contracts["HotLoading"]
    fillOrder = kitchenSinkFixture.contracts["FillOrder"]
    trade = kitchenSinkFixture.contracts["Trade"]
    orders = kitchenSinkFixture.contracts["Orders"]
    account = kitchenSinkFixture.accounts[0]

    # We'll do some trades and confirm volume, OI, and last trade prices change
    createOrder = kitchenSinkFixture.contracts['CreateOrder']

    tradeGroupID = longTo32Bytes(42)

    creatorCost = fix('2', '600')
    fillerCost = fix('2', '400')

    # create order
    with BuyWithCash(cash, creatorCost, kitchenSinkFixture.accounts[1], "complete set buy"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = kitchenSinkFixture.accounts[1])
    # take order
    with BuyWithCash(cash, fillerCost, kitchenSinkFixture.accounts[2], "fill order"):
        assert trade.publicTrade(SHORT, market.address, YES, fix(2), 600, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender=kitchenSinkFixture.accounts[2])

    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)

    assert marketData.volume == fix(2, 1000)
    assert marketData.openInterest == fix(2, 1000)
    assert marketData.lastTradedPrices == [0, 0, 600]
    assert marketData.outcomeVolumes == [0, 0, fix(2, 1000)]
    

def test_reporting(kitchenSinkFixture, augur, cash, market):
    hotLoading = kitchenSinkFixture.contracts["HotLoading"]
    fillOrder = kitchenSinkFixture.contracts["FillOrder"]
    orders = kitchenSinkFixture.contracts["Orders"]
    account = kitchenSinkFixture.accounts[0]

    # Get to Designated Reporting
    proceedToDesignatedReporting(kitchenSinkFixture, market)
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)
    assert marketData.reportingState == 1
    assert marketData.disputeRound == 0

    # Get to Open Reporting
    proceedToInitialReporting(kitchenSinkFixture, market)
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)
    assert marketData.reportingState == 2
    assert marketData.disputeRound == 0

    # Get to Disputing
    proceedToNextRound(kitchenSinkFixture, market)
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)
    assert marketData.reportingState == 3
    assert marketData.disputeRound == 0

    # Proceed to next round
    proceedToNextRound(kitchenSinkFixture, market)
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)
    assert marketData.reportingState == 3
    assert marketData.disputeRound == 1

    # Get to Awaiting Next Window
    while not market.getDisputePacingOn():
        proceedToNextRound(kitchenSinkFixture, market, moveTimeForward=False)
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)
    assert marketData.reportingState == 4
    assert marketData.disputeRound == 11

    # Get to AwaitingFinalization
    kitchenSinkFixture.contracts["Time"].incrementTimestamp(30 * 24 * 60 * 60)
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)
    assert marketData.reportingState == 5

    # get to Finalized
    market.finalize()
    marketData = getMarketData(hotLoading, augur, market, fillOrder, orders)
    assert marketData.reportingState == 6

def test_dispute_window_hot_loading(kitchenSinkFixture, augur, cash, universe, reputationToken):
    hotLoading = kitchenSinkFixture.contracts["HotLoading"]
    account = kitchenSinkFixture.accounts[0]

    disputeWindowData = getDisputeWindowData(hotLoading, augur, universe)

    expectedStartTime, duration = universe.getDisputeWindowStartTimeAndDuration(kitchenSinkFixture.contracts["Time"].getTimestamp(), False)
    expectedEndTime = expectedStartTime + duration

    assert disputeWindowData.address != nullAddress
    assert disputeWindowData.startTime == expectedStartTime
    assert disputeWindowData.endTime == expectedEndTime
    assert disputeWindowData.purchased == 0
    assert disputeWindowData.fees == 0

    # Add fees and purchase some PTs to see those shown
    cash.faucet(5000)
    cash.transfer(disputeWindowData.address, 5000)

    disputeWindow = kitchenSinkFixture.applySignature("DisputeWindow", disputeWindowData.address)
    disputeWindow.buy(2000)

    disputeWindowData = getDisputeWindowData(hotLoading, augur, universe)
    assert disputeWindowData.purchased == 2000
    assert disputeWindowData.fees == 5000

    # it will predict the data if no window exists yet

    kitchenSinkFixture.contracts["Time"].incrementTimestamp(duration)
    expectedStartTime = expectedEndTime
    expectedEndTime = expectedStartTime + duration

    disputeWindowData = getDisputeWindowData(hotLoading, augur, universe)

    assert disputeWindowData.address == nullAddress
    assert disputeWindowData.startTime == expectedStartTime
    assert disputeWindowData.endTime == expectedEndTime
    assert disputeWindowData.purchased == 0
    assert disputeWindowData.fees == 0

def test_validity_bonds(kitchenSinkFixture, augur, cash, market, categoricalMarket, scalarMarket):
    hotLoading = kitchenSinkFixture.contracts["HotLoading"]
    account = kitchenSinkFixture.accounts[0]

    totalValidityBonds = hotLoading.getTotalValidityBonds([market.address, categoricalMarket.address, scalarMarket.address])

    expectedTotal = sum(m.getValidityBondAttoCash() for m in [market, categoricalMarket, scalarMarket])

    assert totalValidityBonds == expectedTotal


class MarketData:

    def __init__(self, marketData):
        self.extraInfo = marketData[0]
        self.marketCreator = marketData[1]
        self.owner = marketData[2]
        self.outcomes = marketData[3]
        self.marketType = marketData[4]
        self.displayPrices = marketData[5]
        self.designatedReporter = marketData[6]
        self.reportingState = marketData[7]
        self.disputeRound = marketData[8]
        self.winningPayout = marketData[9]
        self.volume = marketData[10]
        self.openInterest = marketData[11]
        self.lastTradedPrices = marketData[12]
        self.universe = marketData[13]
        self.numTicks = marketData[14]
        self.feeDivisor = marketData[15]
        self.affiliateFeeDivisor = marketData[16]
        self.endTime = marketData[17]
        self.numOutcomes = marketData[18]
        self.validityBond = marketData[19]
        self.reportingFeeDivisor = marketData[20]
        self.outcomeVolumes = marketData[21]

def getMarketData(hotLoading, augur, market, fillOrder, orders):
    return MarketData(hotLoading.getMarketData(augur.address, market.address, fillOrder.address, orders.address))

def getMarketsData(hotLoading, augur, markets, fillOrder, orders):
    rawMarketsData = hotLoading.getMarketsData(augur.address, markets, fillOrder.address, orders.address)
    return [MarketData(rawMarketData) for rawMarketData in rawMarketsData]

class DisputeWindowData:

    def __init__(self, disputeWindowData):
        self.address = disputeWindowData[0]
        self.startTime = disputeWindowData[1]
        self.endTime = disputeWindowData[2]
        self.purchased = disputeWindowData[3]
        self.fees = disputeWindowData[4]

def getDisputeWindowData(hotLoading, augur, universe):
    return DisputeWindowData(hotLoading.getCurrentDisputeWindowData(augur.address, universe.address))
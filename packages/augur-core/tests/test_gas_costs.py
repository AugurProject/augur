
from eth_tester.exceptions import TransactionFailed
from pytest import fixture, mark, raises
from utils import longTo32Bytes, PrintGasUsed, fix, nullAddress
from constants import BID, ASK, YES, NO
from datetime import timedelta
from trading.test_claimTradingProceeds import acquireLongShares, finalizeMarket
from reporting_utils import proceedToNextRound, proceedToFork, finalize, proceedToDesignatedReporting

# Market Methods
MARKET_CREATION =               2409638
MARKET_FINALIZATION =           948446
INITIAL_REPORT =                554349
FIRST_CONTRIBUTE =              830811
FIRST_COMPLETED_CONTRIBUTE =    582390
LAST_COMPLETED_CONTRIBUTE =     1445403
FORKING_CONTRIBUTE =            984817

# Redemption
REPORTING_WINDOW_CREATE =           305421
INITIAL_REPORT_REDEMPTION =         98937
CROWDSOURCER_REDEMPTION =           93908
PARTICIPATION_TOKEN_REDEMPTION =    93162

# Trading
CREATE_ORDER =      481755
FILL_ORDER =        808067
CLAIM_PROCEEDS =    667419

# Other
UNIVERSE_CREATE =   7752505

pytestmark = mark.skip(reason="Just for testing gas cost")

def test_universe_creation(localFixture, augur, market, universe):
    proceedToFork(localFixture, market, universe)
    finalize(localFixture, market, universe)

    with PrintGasUsed(localFixture, "UNIVERSE_CREATE", UNIVERSE_CREATE):
        universe.createChildUniverse([0, 1, market.getNumTicks()-1])

def test_disputeWindowCreation(localFixture, augur, universe, cash):
    endTime = augur.getTimestamp() + timedelta(days=365).total_seconds()

    with PrintGasUsed(localFixture, "REPORTING_WINDOW_CREATE", REPORTING_WINDOW_CREATE):
        universe.getOrCreateDisputeWindowByTimestamp(endTime, False)

def test_marketCreation(localFixture, augur, universe):
    marketCreationFee = universe.getOrCacheMarketCreationCost()

    endTime = augur.getTimestamp() + timedelta(days=1).total_seconds()
    feePerEthInWei = 10**16
    affiliateFeeDivisor = 100
    designatedReporterAddress = localFixture.accounts[0]
    numTicks = 10 ** 18
    numOutcomes = 2

    with PrintGasUsed(localFixture, "DisputeWindow:createMarket", MARKET_CREATION):
        localFixture.contracts["Cash"].faucet(marketCreationFee)
        marketAddress = universe.createYesNoMarket(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporterAddress, "")

def test_marketFinalization(localFixture, universe, market):
    proceedToNextRound(localFixture, market)

    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    with PrintGasUsed(localFixture, "Market:finalize", MARKET_FINALIZATION):
        assert market.finalize()

@mark.parametrize('hints', [
    True,
    False
])
def test_orderCreation(hints, localFixture, categoricalMarket):
    createOrder = localFixture.contracts['CreateOrder']

    for i in range(39, 43):
        localFixture.contracts["Cash"].faucet(fix(1, i))
        createOrder.publicCreateOrder(BID, fix(1), i, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)

    localFixture.contracts["Cash"].faucet(fix(1, 44))
    worseOrderId = createOrder.publicCreateOrder(BID, fix(1), 44, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)
    localFixture.contracts["Cash"].faucet(fix(1, 46))
    betterOrderId = createOrder.publicCreateOrder(BID, fix(1), 46, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)

    for i in range(47, 80):
        localFixture.contracts["Cash"].faucet(fix(1, i))
        createOrder.publicCreateOrder(BID, fix(1), i, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)

    if not hints:
        with PrintGasUsed(localFixture, "CreateOrder:publicCreateOrder NO Hints", CREATE_ORDER):
            localFixture.contracts["Cash"].faucet(fix(1, 45))
            orderID = createOrder.publicCreateOrder(BID, fix(1), 45, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)
    else:
        with PrintGasUsed(localFixture, "CreateOrder:publicCreateOrder HINTS", CREATE_ORDER):
            localFixture.contracts["Cash"].faucet(fix(1, 45))
            orderID = createOrder.publicCreateOrder(BID, fix(1), 45, categoricalMarket.address, 1, betterOrderId, worseOrderId, "7", False, nullAddress)

def test_orderFilling(localFixture, market):
    createOrder = localFixture.contracts['CreateOrder']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)

    creatorCost = fix('2', '40')
    fillerCost = fix('2', '60')

    # create order
    localFixture.contracts["Cash"].faucet(creatorCost, sender = localFixture.accounts[1])
    orderID = createOrder.publicCreateOrder(ASK, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = localFixture.accounts[1])

    with PrintGasUsed(localFixture, "FillOrder:publicFillOrder", FILL_ORDER):
        localFixture.contracts["Cash"].faucet(fillerCost, sender = localFixture.accounts[2])
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = localFixture.accounts[2])

def test_winningShareRedmption(localFixture, cash, market):
    claimTradingProceeds = localFixture.contracts['ClaimTradingProceeds']

    acquireLongShares(localFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = localFixture.accounts[1])
    finalizeMarket(localFixture, market, [0, 0, market.getNumTicks()])

    with PrintGasUsed(localFixture, "ClaimTradingProceeds:claimTradingProceeds", CLAIM_PROCEEDS):
        claimTradingProceeds.claimTradingProceeds(market.address, localFixture.accounts[1])

def test_initial_report(localFixture, universe, cash, market):
    proceedToDesignatedReporting(localFixture, market)

    with PrintGasUsed(localFixture, "Market:doInitialReport", INITIAL_REPORT):
        market.doInitialReport([0, 0, market.getNumTicks()], "")

def test_contribute(localFixture, universe, cash, market):
    proceedToNextRound(localFixture, market)

    with PrintGasUsed(localFixture, "Market.contribute", FIRST_CONTRIBUTE):
        market.contribute([0, 0, market.getNumTicks()], 1, "")

    with PrintGasUsed(localFixture, "Market.contribute", FIRST_COMPLETED_CONTRIBUTE):
        market.contribute([0, 0, market.getNumTicks()], market.getParticipantStake()*2, "")

    for i in range(9):
        proceedToNextRound(localFixture, market, randomPayoutNumerators = True)

    with PrintGasUsed(localFixture, "Market.contribute", LAST_COMPLETED_CONTRIBUTE):
        proceedToNextRound(localFixture, market, randomPayoutNumerators = True)

    with PrintGasUsed(localFixture, "Market.contribute", FORKING_CONTRIBUTE):
        market.contribute([0, market.getNumTicks() / 2, market.getNumTicks() / 2], market.getParticipantStake(), "")

def test_redeem(localFixture, universe, cash, market):
    # Initial report
    proceedToNextRound(localFixture, market)
    # Initial losing
    proceedToNextRound(localFixture, market)
    # Initial Winning
    proceedToNextRound(localFixture, market, doGenerateFees = True)

    initialReporter = localFixture.applySignature('InitialReporter', market.getReportingParticipant(0))
    winningDisputeCrowdsourcer1 = localFixture.applySignature('DisputeCrowdsourcer', market.getReportingParticipant(2))
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    assert disputeWindow.buy(100)

    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    with PrintGasUsed(localFixture, "InitialReporter:redeem", INITIAL_REPORT_REDEMPTION):
        initialReporter.redeem(localFixture.accounts[0])

    with PrintGasUsed(localFixture, "DisputeCrowdsourcer:redeem", CROWDSOURCER_REDEMPTION):
        winningDisputeCrowdsourcer1.redeem(localFixture.accounts[0])

    with PrintGasUsed(localFixture, "DisputeWindow:redeem", PARTICIPATION_TOKEN_REDEMPTION):
        disputeWindow.redeem(localFixture.accounts[0])


@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    universe = fixture.applySignature(None, kitchenSinkSnapshot['universe'].address, kitchenSinkSnapshot['universe'].abi)
    market = fixture.applySignature(None, kitchenSinkSnapshot['yesNoMarket'].address, kitchenSinkSnapshot['yesNoMarket'].abi)
    # Give some REP to testers to make things interesting
    reputationToken = fixture.applySignature('ReputationToken', universe.getReputationToken())
    for testAccount in [fixture.accounts[1], fixture.accounts[2], fixture.accounts[3]]:
        reputationToken.transfer(testAccount, 1 * 10**6 * 10**18)

    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def universe(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['universe'].address, kitchenSinkSnapshot['universe'].abi)

@fixture
def market(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['yesNoMarket'].address, kitchenSinkSnapshot['yesNoMarket'].abi)

@fixture
def categoricalMarket(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['categoricalMarket'].address, kitchenSinkSnapshot['categoricalMarket'].abi)

@fixture
def scalarMarket(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['scalarMarket'].address, kitchenSinkSnapshot['scalarMarket'].abi)

@fixture
def cash(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['cash'].address, kitchenSinkSnapshot['cash'].abi)

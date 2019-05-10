from ethereum.tools import tester
from ethereum.tools.tester import ABIContract, TransactionFailed
from pytest import fixture, mark, raises
from utils import longTo32Bytes, PrintGasUsed, fix, nullAddress
from constants import BID, ASK, YES, NO
from datetime import timedelta
from trading.test_claimTradingProceeds import acquireLongShares, finalizeMarket
from reporting_utils import proceedToNextRound, proceedToFork, finalize, proceedToDesignatedReporting

# Market Methods
MARKET_CREATION =               2196667
MARKET_FINALIZATION =           492720
INITIAL_REPORT =                551454
FIRST_CONTRIBUTE =              819400
FIRST_COMPLETED_CONTRIBUTE =    557334
LAST_COMPLETED_CONTRIBUTE =     1430116
FORKING_CONTRIBUTE =            962274

# Redemption
REPORTING_WINDOW_CREATE =           300444
INITIAL_REPORT_REDEMPTION =         90599
CROWDSOURCER_REDEMPTION =           81698
PARTICIPATION_TOKEN_REDEMPTION =    80634

# Trading
CREATE_ORDER =      460030
FILL_ORDER =        875638
CLAIM_PROCEEDS =    962083

# Other
UNIVERSE_CREATE =   870579

pytestmark = mark.skip(reason="Just for testing gas cost")

tester.STARTGAS = int(6.7 * 10**6)

def test_universe_creation(localFixture, augur):
    with PrintGasUsed(localFixture, "UNIVERSE_CREATE", UNIVERSE_CREATE):
        augur.createGenesisUniverse()

def test_disputeWindowCreation(localFixture, universe, cash):
    endTime = int(localFixture.chain.head_state.timestamp + timedelta(days=365).total_seconds())

    with PrintGasUsed(localFixture, "REPORTING_WINDOW_CREATE", REPORTING_WINDOW_CREATE):
        universe.getOrCreateDisputeWindowByTimestamp(endTime, False)

def test_marketCreation(localFixture, universe):
    marketCreationFee = universe.getOrCacheMarketCreationCost()

    endTime = int(localFixture.chain.head_state.timestamp + timedelta(days=1).total_seconds())
    feePerEthInWei = 10**16
    affiliateFeeDivisor = 100
    designatedReporterAddress = tester.a0
    numTicks = 10 ** 18
    numOutcomes = 2

    with PrintGasUsed(localFixture, "DisputeWindow:createMarket", MARKET_CREATION):
        localFixture.contracts["Cash"].faucet(marketCreationFee)
        marketAddress = universe.createYesNoMarket(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporterAddress, "", "description", "")

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

    for i in range(3900, 4003):
        localFixture.contracts["Cash"].faucet(fix(1, i))
        createOrder.publicCreateOrder(BID, fix(1), i, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)

    localFixture.contracts["Cash"].faucet(fix(1, 4004))
    worseOrderId = createOrder.publicCreateOrder(BID, fix(1), 4004, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)
    localFixture.contracts["Cash"].faucet(fix(1, 4006))
    betterOrderId = createOrder.publicCreateOrder(BID, fix(1), 4006, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)

    for i in range(4007, 4107):
        localFixture.contracts["Cash"].faucet(fix(1, i))
        createOrder.publicCreateOrder(BID, fix(1), i, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)

    if not hints:
        with PrintGasUsed(localFixture, "CreateOrder:publicCreateOrder NO Hints", CREATE_ORDER):
            localFixture.contracts["Cash"].faucet(fix(1, 4005))
            orderID = createOrder.publicCreateOrder(BID, fix(1), 4005, categoricalMarket.address, 1, longTo32Bytes(0), longTo32Bytes(0), "7", False, nullAddress)
    else:
        with PrintGasUsed(localFixture, "CreateOrder:publicCreateOrder HINTS", CREATE_ORDER):
            localFixture.contracts["Cash"].faucet(fix(1, 4005))
            orderID = createOrder.publicCreateOrder(BID, fix(1), 4005, categoricalMarket.address, 1, betterOrderId, worseOrderId, "7", False, nullAddress)

def test_orderFilling(localFixture, market):
    createOrder = localFixture.contracts['CreateOrder']
    fillOrder = localFixture.contracts['FillOrder']
    tradeGroupID = longTo32Bytes(42)

    creatorCost = fix('2', '4000')
    fillerCost = fix('2', '6000')

    # create order
    localFixture.contracts["Cash"].faucet(creatorCost, sender = tester.k1)
    orderID = createOrder.publicCreateOrder(ASK, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    with PrintGasUsed(localFixture, "FillOrder:publicFillOrder", FILL_ORDER):
        localFixture.contracts["Cash"].faucet(fillerCost, sender = tester.k2)
        fillOrderID = fillOrder.publicFillOrder(orderID, fix(2), tradeGroupID, False, "0x0000000000000000000000000000000000000000", sender = tester.k2)

def test_winningShareRedmption(localFixture, cash, market):
    claimTradingProceeds = localFixture.contracts['ClaimTradingProceeds']

    acquireLongShares(localFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = tester.k1)
    finalizeMarket(localFixture, market, [0, 0, market.getNumTicks()])

    with PrintGasUsed(localFixture, "ClaimTradingProceeds:claimTradingProceeds", CLAIM_PROCEEDS):
        claimTradingProceeds.claimTradingProceeds(market.address, tester.a1)

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
        initialReporter.redeem(tester.a0)

    with PrintGasUsed(localFixture, "DisputeCrowdsourcer:redeem", CROWDSOURCER_REDEMPTION):
        winningDisputeCrowdsourcer1.redeem(tester.a0)

    with PrintGasUsed(localFixture, "DisputeWindow:redeem", PARTICIPATION_TOKEN_REDEMPTION):
        disputeWindow.redeem()


@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    universe = ABIContract(fixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)
    market = ABIContract(fixture.chain, kitchenSinkSnapshot['yesNoMarket'].translator, kitchenSinkSnapshot['yesNoMarket'].address)
    # Give some REP to testers to make things interesting
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
def market(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['yesNoMarket'].translator, kitchenSinkSnapshot['yesNoMarket'].address)

@fixture
def categoricalMarket(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['categoricalMarket'].translator, kitchenSinkSnapshot['categoricalMarket'].address)

@fixture
def scalarMarket(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['scalarMarket'].translator, kitchenSinkSnapshot['scalarMarket'].address)

@fixture
def cash(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['cash'].translator, kitchenSinkSnapshot['cash'].address)

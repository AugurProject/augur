from datetime import timedelta
from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark
from reporting_utils import proceedToNextRound
from utils import AssertLog, TokenDelta, EtherDelta

RAY = 10**27

# variant where DSR on or off before sweep
def test_dsr_interest(contractsFixture, market, universe, cash):
    daiPot = contractsFixture.contracts["DaiPot"]
    daiVat = contractsFixture.contracts["DaiVat"]
    shareToken = contractsFixture.contracts['ShareToken']

    assert daiPot.setDSR(RAY)

    # Buy complete sets to put funds in
    numCompleteSets = 10**18
    cost = numCompleteSets * market.getNumTicks()
    assert cash.faucet(cost)
    assert shareToken.publicBuyCompleteSets(market.address, numCompleteSets)

    initialUniverseCashBalance = universe.totalBalance()

    # Change DSR to be above threshold and toggle on
    assert daiPot.setDSR(1000000564701133626865910626) # 5% a day

    # Move time forward
    day = 24 * 60 * 60
    assert contractsFixture.contracts["Time"].incrementTimestamp(day)

    # Sweep interest
    nextDisputeWindow = contractsFixture.applySignature("DisputeWindow", universe.getOrCreateNextDisputeWindow(False))
    assert universe.sweepInterest()
    assert cash.balanceOf(nextDisputeWindow.address) == initialUniverseCashBalance * 0.05

    # close out complete sets
    assert shareToken.publicSellCompleteSets(market.address, numCompleteSets)
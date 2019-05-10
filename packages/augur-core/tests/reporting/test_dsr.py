from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed
from utils import captureFilteredLogs, bytesToHexString, AssertLog, TokenDelta, longToHexString
from pytest import raises
from reporting_utils import proceedToNextRound

DAI_ONE = 10**27

# TODO when Max movement is available from MKR contracts update
MAX_DSR_MOVEMENT = 10**20

def test_dsr_toggle(contractsFixture, market, universe, cash, reputationToken):
    daiPot = contractsFixture.contracts["DaiPot"]
    completeSets = contractsFixture.contracts['CompleteSets']

    # Turn off DSR to make accounting easy
    assert daiPot.setDSR(DAI_ONE)
    assert universe.toggleDSR()

    # We'll put some cash in escrow using complete sets so that fund movement gets tested
    cost = 10 * market.getNumTicks()
    print cash.faucet(cost, sender=tester.k1)
    assert completeSets.publicBuyCompleteSets(market.address, 10, sender=tester.k1)

    initialUniverseCashBalance = cash.balanceOf(universe.address)

    # We can't initially toggle using DSR while the actual rate is below the safe threshold
    assert not universe.canToggleDSR()

    with raises(TransactionFailed):
        universe.toggleDSR()

    # If we move the rate above our safe threshold we can toggle however
    assert daiPot.setDSR(DAI_ONE + MAX_DSR_MOVEMENT)

    assert universe.canToggleDSR()

    repAward = contractsFixture.contracts["Constants"].DSR_TOGGLE_REWARD_IN_ATTO_REP()

    with TokenDelta(reputationToken, repAward, tester.a0, "REP award was not given for toggling the DSR"):
        universe.toggleDSR()

    # The cash balance of the universe should now be 0 as the funds are in the DSR contract
    assert cash.balanceOf(universe.address) == 0

    # We can no longer toggle
    assert not universe.canToggleDSR()

    with raises(TransactionFailed):
        universe.toggleDSR()

    # If we set the rate below the threshold we can toggle it back off
    assert daiPot.setDSR(DAI_ONE + MAX_DSR_MOVEMENT - 1)

    assert universe.canToggleDSR()

    with TokenDelta(reputationToken, repAward, tester.a0, "REP award was not given for toggling the DSR"):
        universe.toggleDSR()

    # The cash balance of the universe should be restored to its initial value
    assert cash.balanceOf(universe.address) == initialUniverseCashBalance

    # We can no longer toggle
    assert not universe.canToggleDSR()

    with raises(TransactionFailed):
        universe.toggleDSR()

# variant where DSR on or off before sweep
def test_dsr_interest(contractsFixture, market, universe, cash):
    daiPot = contractsFixture.contracts["DaiPot"]
    daiVat = contractsFixture.contracts["DaiVat"]
    completeSets = contractsFixture.contracts['CompleteSets']

    # Turn off DSR to make accounting easy
    assert daiPot.setDSR(DAI_ONE)
    assert universe.toggleDSR()

    # Buy complete sets to put funds in
    numCompleteSets = 10**18
    cost = numCompleteSets * market.getNumTicks()
    assert cash.faucet(cost)
    assert completeSets.publicBuyCompleteSets(market.address, numCompleteSets)

    initialUniverseCashBalance = cash.balanceOf(universe.address)

    # Change DSR to be above threshold and toggle on
    assert daiPot.setDSR(1000000564701133626865910626) # 5% a day
    assert universe.toggleDSR()

    # Move time forward
    day = 24 * 60 * 60
    assert contractsFixture.contracts["Time"].incrementTimestamp(day)

    # Sweep interest
    nextDisputeWindow = contractsFixture.applySignature("DisputeWindow", universe.getOrCreateNextDisputeWindow(False))
    assert universe.sweepInterest()
    assert cash.balanceOf(nextDisputeWindow.address) == long(initialUniverseCashBalance * 0.05)

    # close out complete sets
    assert completeSets.publicSellCompleteSets(market.address, numCompleteSets)

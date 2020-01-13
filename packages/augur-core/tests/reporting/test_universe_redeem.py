from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises, mark
from utils import longToHexString, EtherDelta, TokenDelta, PrintGasUsed
from reporting_utils import proceedToNextRound, proceedToFork, finalize

def test_redeem_reporting_participants(kitchenSinkFixture, market, categoricalMarket, scalarMarket, universe, cash):
    redeemStake = kitchenSinkFixture.contracts["RedeemStake"]
    reputationToken = kitchenSinkFixture.applySignature("ReputationToken", universe.getReputationToken())
    constants = kitchenSinkFixture.contracts["Constants"]

    # Initial Report
    proceedToNextRound(kitchenSinkFixture, market, doGenerateFees = True)
    # Initial Report Losing
    proceedToNextRound(kitchenSinkFixture, market, doGenerateFees = True)
    # Initial Report Winning
    proceedToNextRound(kitchenSinkFixture, market, doGenerateFees = True)
    # Initial Report Losing
    proceedToNextRound(kitchenSinkFixture, market, doGenerateFees = True)
    # Initial Report Winning
    proceedToNextRound(kitchenSinkFixture, market, doGenerateFees = True)

    # Get the winning reporting participants
    initialReporter = kitchenSinkFixture.applySignature('InitialReporter', market.participants(0))
    winningDisputeCrowdsourcer1 = kitchenSinkFixture.applySignature('DisputeCrowdsourcer', market.participants(2))
    winningDisputeCrowdsourcer2 = kitchenSinkFixture.applySignature('DisputeCrowdsourcer', market.participants(4))

    # Fast forward time until the new dispute window is over and we can redeem
    disputeWindow = kitchenSinkFixture.applySignature("DisputeWindow", market.getDisputeWindow())

    # Purchase PTs and inject fees into the window
    ptAmount = 10**18
    additionalfees = 10**18
    assert cash.faucet(additionalfees)
    assert cash.transfer(disputeWindow.address, additionalfees)
    assert disputeWindow.buy(ptAmount)

    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    expectedRep = winningDisputeCrowdsourcer2.getStake() + winningDisputeCrowdsourcer1.getStake() + initialReporter.getStake()
    expectedRep = expectedRep + expectedRep * 2 / 5
    expectedRep += ptAmount
    expectedRep -= 1 # Rounding error
    fees = cash.balanceOf(disputeWindow.address)
    with TokenDelta(reputationToken, expectedRep, kitchenSinkFixture.accounts[0], "Redeeming didn't refund REP"):
        with TokenDelta(cash, fees, kitchenSinkFixture.accounts[0], "Redeeming didn't pay out fees"):
            with PrintGasUsed(kitchenSinkFixture, "Universe Redeem:", 0):
                assert redeemStake.redeemStake([initialReporter.address, winningDisputeCrowdsourcer1.address, winningDisputeCrowdsourcer2.address], [disputeWindow.address])

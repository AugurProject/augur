from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises, mark
from utils import longToHexString, EtherDelta, TokenDelta, PrintGasUsed, BuyWithCash
from reporting_utils import generateFees


@mark.parametrize('afterMkrShutdown', [
    True,
    False
])
def test_participation_tokens(afterMkrShutdown, kitchenSinkFixture, universe, market, cash):
    reputationToken = kitchenSinkFixture.applySignature("ReputationToken", universe.getReputationToken())

    disputeWindow = kitchenSinkFixture.applySignature("DisputeWindow", universe.getOrCreateNextDisputeWindow(False))

    if (afterMkrShutdown):
        kitchenSinkFixture.MKRShutdown()

    # Generate Fees
    generateFees(kitchenSinkFixture, universe, market)

    # We can't buy participation tokens until the window starts
    with raises(TransactionFailed):
        disputeWindow.buy(300)

    # Fast forward time until the new dispute window starts and we can buy some tokens
    assert reputationToken.transfer(kitchenSinkFixture.accounts[1], 100)
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)
    with TokenDelta(reputationToken, -300, kitchenSinkFixture.accounts[0], "Buying sisnt take REP"):
        with TokenDelta(disputeWindow, 300, kitchenSinkFixture.accounts[0], "Buying didnt give PTs"):
            assert disputeWindow.buy(300)
    with TokenDelta(reputationToken, -100, kitchenSinkFixture.accounts[1], "Buying sisnt take REP"):
        with TokenDelta(disputeWindow, 100, kitchenSinkFixture.accounts[1], "Buying didnt give PTs"):
            assert disputeWindow.buy(100, sender = kitchenSinkFixture.accounts[1])

    # We can't redeem until the window is over
    with raises(TransactionFailed):
        disputeWindow.redeem(kitchenSinkFixture.accounts[0])

    # Fast forward time until the new dispute window is over and we can redeem
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    totalFees = cash.balanceOf(disputeWindow.address)

    with TokenDelta(reputationToken, 300, kitchenSinkFixture.accounts[0], "Redeeming didn't refund REP"):
        with TokenDelta(cash, totalFees * 3 / 4, kitchenSinkFixture.accounts[0], "Redeeming didn't give fees"):
            with TokenDelta(disputeWindow, -300, kitchenSinkFixture.accounts[0], "Redeeming didn't burn PTs"):
                assert disputeWindow.redeem(kitchenSinkFixture.accounts[0])

    with TokenDelta(reputationToken, 100, kitchenSinkFixture.accounts[1], "Redeeming didn't refund REP"):
        with TokenDelta(cash, totalFees * 1 / 4, kitchenSinkFixture.accounts[1], "Redeeming didn't give fees"):
            with TokenDelta(disputeWindow, -100, kitchenSinkFixture.accounts[1], "Redeeming didn't burn PTs"):
                assert disputeWindow.redeem(kitchenSinkFixture.accounts[1])

def test_participation_tokens_convenience(kitchenSinkFixture, universe, market, cash):
    reputationToken = kitchenSinkFixture.applySignature("ReputationToken", universe.getReputationToken())
    buyParticipationTokens = kitchenSinkFixture.contracts["BuyParticipationTokens"]

    # Fast forward time until the new dispute window starts and we can buy some tokens
    assert reputationToken.transfer(kitchenSinkFixture.accounts[1], 100)
    with TokenDelta(reputationToken, -300, kitchenSinkFixture.accounts[0], "Buying disnt take REP"):
        assert buyParticipationTokens.buyParticipationTokens(universe.address, 300)
    with TokenDelta(reputationToken, -100, kitchenSinkFixture.accounts[1], "Buying disnt take REP"):
        assert buyParticipationTokens.buyParticipationTokens(universe.address, 100, sender = kitchenSinkFixture.accounts[1])

    disputeWindow = kitchenSinkFixture.applySignature("DisputeWindow", universe.getOrCreateCurrentDisputeWindow(False))

    # We can't redeem until the window is over
    with raises(TransactionFailed):
        disputeWindow.redeem(kitchenSinkFixture.accounts[0])

    # Fast forward time until the new dispute window is over and we can redeem
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    totalFees = cash.balanceOf(disputeWindow.address)

    with TokenDelta(reputationToken, 300, kitchenSinkFixture.accounts[0], "Redeeming didn't refund REP"):
        with TokenDelta(disputeWindow, -300, kitchenSinkFixture.accounts[0], "Redeeming didn't burn PTs"):
            assert disputeWindow.redeem(kitchenSinkFixture.accounts[0])

    with TokenDelta(reputationToken, 100, kitchenSinkFixture.accounts[1], "Redeeming didn't refund REP"):
        with TokenDelta(disputeWindow, -100, kitchenSinkFixture.accounts[1], "Redeeming didn't burn PTs"):
            assert disputeWindow.redeem(kitchenSinkFixture.accounts[1])

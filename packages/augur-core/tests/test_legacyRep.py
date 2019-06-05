

''' TODO: When we get finer grained test fixture/setup in place make this use a more base fixture without the rep distributed, as without that there is nothing here to test
def test_legacyRepFaucet(contractsFixture):
    legacyRep = contractsFixture.contracts['LegacyReputationToken']
    assert legacyRep.decimals() == 18
    assert legacyRep.totalSupply() == 0

    # With the legacyRep contract funded we can now use its faucet method to distribute REP to new test users
    assert legacyRep.balanceOf(fixture.accounts[0]) == 0
    assert legacyRep.faucet(sender=fixture.accounts[0])
    assert legacyRep.balanceOf(fixture.accounts[0]) == 47 * 10 ** 18

    # Total supply increases by the amount funded
    assert legacyRep.totalSupply() == 47 * 10 ** 18

    # We can request a specific amount from the faucet too
    assert legacyRep.faucet(10)
    assert legacyRep.balanceOf(fixture.accounts[0]) == 47 * 10 ** 18 + 10
'''

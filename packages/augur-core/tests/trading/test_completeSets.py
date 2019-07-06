#!/usr/bin/env python


from eth_tester.exceptions import TransactionFailed
from pytest import raises
from utils import fix, AssertLog, nullAddress
from constants import YES, NO

def test_publicBuyCompleteSets(contractsFixture, universe, cash, market):
    completeSets = contractsFixture.contracts['CompleteSets']
    orders = contractsFixture.contracts['Orders']
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))

    assert not cash.balanceOf(contractsFixture.accounts[1])
    assert universe.marketBalance(market.address) == universe.getOrCacheValidityBond()
    assert not yesShareToken.totalSupply()
    assert not noShareToken.totalSupply()
    assert universe.getOpenInterestInAttoCash() == 0

    cost = 10 * market.getNumTicks()
    assert cash.faucet(cost, sender=contractsFixture.accounts[1])

    completeSetsPurchasedLog = {
        "universe": universe.address,
        "market": market.address,
        "account": contractsFixture.accounts[1],
        "numCompleteSets": 10,
        "marketOI": cost
    }
    with AssertLog(contractsFixture, "CompleteSetsPurchased", completeSetsPurchasedLog):
        assert completeSets.publicBuyCompleteSets(market.address, 10, sender=contractsFixture.accounts[1])

    assert yesShareToken.balanceOf(contractsFixture.accounts[1]) == 10, "Should have 10 shares of outcome 1"
    assert noShareToken.balanceOf(contractsFixture.accounts[1]) == 10, "Should have 10 shares of outcome 2"
    assert cash.balanceOf(contractsFixture.accounts[1]) == 0, "Sender's cash balance should be 0"
    assert universe.marketBalance(market.address) == cost + universe.getOrCacheValidityBond(), "Increase in market's cash should equal the cost to purchase the complete set"
    assert yesShareToken.totalSupply() == 10, "Increase in yes shares purchased for this market should be 10"
    assert noShareToken.totalSupply() == 10, "Increase in yes shares purchased for this market should be 10"
    assert universe.getOpenInterestInAttoCash() == cost, "Open interest in the universe increases by the cost in ETH of the sets purchased"

def test_publicBuyCompleteSets_failure(contractsFixture, universe, cash, market):
    completeSets = contractsFixture.contracts['CompleteSets']
    orders = contractsFixture.contracts['Orders']

    amount = 10
    cost = 10 * market.getNumTicks()

    # Permissions exceptions
    with raises(TransactionFailed):
        completeSets.buyCompleteSets(contractsFixture.accounts[1], market.address, amount, sender=contractsFixture.accounts[1])

    # buyCompleteSets exceptions
    with raises(TransactionFailed):
        completeSets.publicBuyCompleteSets(contractsFixture.accounts[1], amount, sender=contractsFixture.accounts[1])

def test_publicSellCompleteSets(contractsFixture, universe, cash, market, tokensFail):
    completeSets = contractsFixture.contracts['CompleteSets']
    orders = contractsFixture.contracts['Orders']
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))

    assert not cash.balanceOf(contractsFixture.accounts[0])
    assert universe.marketBalance(market.address) == universe.getOrCacheValidityBond()
    assert not yesShareToken.totalSupply()
    assert not noShareToken.totalSupply()

    cost = 10 * market.getNumTicks()
    assert cash.faucet(cost)
    assert universe.getOpenInterestInAttoCash() == 0
    completeSets.publicBuyCompleteSets(market.address, 10)
    assert universe.getOpenInterestInAttoCash() == 10 * market.getNumTicks()

    tokensFail.setFail(True)
    completeSetsSoldLog = {
        "universe": universe.address,
        "market": market.address,
        "account": contractsFixture.accounts[0],
        "numCompleteSets": 9,
        "marketOI": market.getNumTicks(),
        "fees": 9 + 9,
    }
    with AssertLog(contractsFixture, "CompleteSetsSold", completeSetsSoldLog):
        result = completeSets.publicSellCompleteSets(market.address, 9,)

    tokensFail.setFail(False)
    assert universe.getOpenInterestInAttoCash() == 1 * market.getNumTicks()

    assert yesShareToken.balanceOf(contractsFixture.accounts[0]) == 1, "Should have 1 share of outcome yes"
    assert noShareToken.balanceOf(contractsFixture.accounts[0]) == 1, "Should have 1 share of outcome no"
    assert yesShareToken.totalSupply() == 1
    assert noShareToken.totalSupply() == 1
    assert cash.balanceOf(contractsFixture.accounts[0]) == 882
    assert universe.marketBalance(market.address) == universe.getOrCacheValidityBond() + 100 + 9
    assert market.marketCreatorFeesAttoCash() == 9

def test_publicSellCompleteSets_failure(contractsFixture, universe, cash, market):
    completeSets = contractsFixture.contracts['CompleteSets']
    orders = contractsFixture.contracts['Orders']

    cost = 10 * market.getNumTicks()
    cash.faucet(cost, sender=contractsFixture.accounts[1])
    completeSets.publicBuyCompleteSets(market.address, 10, sender = contractsFixture.accounts[1])

    # Permissions exceptions
    with raises(TransactionFailed):
        completeSets.sellCompleteSets(contractsFixture.accounts[1], market.address, 10, nullAddress, sender=contractsFixture.accounts[1])

    # sellCompleteSets exceptions
    with raises(TransactionFailed):
        completeSets.publicSellCompleteSets(market.address, 10 + 1, sender=contractsFixture.accounts[1])

def test_maliciousMarket(contractsFixture, universe, cash, market):
    completeSets = contractsFixture.contracts['CompleteSets']
    orders = contractsFixture.contracts['Orders']

    maliciousMarket = contractsFixture.upload('solidity_test_helpers/MaliciousMarket.sol', 'maliciousMarket', constructorArgs=[market.address])

    with raises(TransactionFailed):
        completeSets.publicBuyCompleteSets(maliciousMarket.address, 10**18, sender = contractsFixture.accounts[1])

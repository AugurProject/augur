#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import fixture, mark, raises
from utils import AssertLog, stringToBytes

@fixture(scope='session')
def testerSnapshot(sessionFixture):
    sessionFixture.uploadAndAddToAugur("solidity_test_helpers/StandardTokenHelper.sol")
    standardToken = sessionFixture.contracts['StandardTokenHelper']
    return sessionFixture.createSnapshot()

@fixture
def testStandardTokenFixture(sessionFixture, testerSnapshot):
    sessionFixture.resetToSnapshot(testerSnapshot)
    return sessionFixture

def test_basic_token_transfer(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.faucet(100, sender = testStandardTokenFixture.accounts[1])
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[1]) == 100
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[2]) == 0

    with raises(TransactionFailed):
        standardToken.transfer(testStandardTokenFixture.accounts[2], 150, sender=testStandardTokenFixture.accounts[1])

    assert standardToken.transfer(testStandardTokenFixture.accounts[2], 100, sender=testStandardTokenFixture.accounts[1])
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[1]) == 0
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[2]) == 100

    value =  2**256-1
    with raises(TransactionFailed):
        assert standardToken.faucet(value, sender = testStandardTokenFixture.accounts[1])

def test_basic_token_emit(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.faucet(101, sender = testStandardTokenFixture.accounts[1])
    transferLog = {
        'value': 101
    }
    with AssertLog(testStandardTokenFixture, "Transfer", transferLog, contract=standardToken):
        assert standardToken.transfer(testStandardTokenFixture.accounts[2], 101, sender=testStandardTokenFixture.accounts[1])

    assert standardToken.balanceOf(testStandardTokenFixture.accounts[2]) == 101

def test_create_negative_balance(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.totalSupply() == 0
    # We get some tokens for tester 0
    assert standardToken.faucet(100)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[0]) == 100
    # Tester 1 tries to send tokens from tester 0 to himself and fails
    with raises(TransactionFailed):
        standardToken.transferFrom(testStandardTokenFixture.accounts[0], testStandardTokenFixture.accounts[1], 101)

def test_transfer_then_create_negative_balance(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.totalSupply() == 0
    # We get some tokens for tester 0
    assert standardToken.faucet(10)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[0]) == 10
    # approve and transfer 10 to other tester
    assert standardToken.transfer(testStandardTokenFixture.accounts[1], 10)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[1]) == 10
    # approve and allow transfer of more tokens than tester has
    assert standardToken.approve(testStandardTokenFixture.accounts[1], 11)
    # try to transfer more than tester has
    with raises(TransactionFailed):
        standardToken.transfer(testStandardTokenFixture.accounts[1], 11, sender=testStandardTokenFixture.accounts[1])

def test_approve_allow_transfer_more_than_allow(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.totalSupply() == 0
    # We get some tokens for tester 0
    assert standardToken.faucet(100000)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[0]) == 100000
    # approve and transfer more than in supply
    assert standardToken.approve(testStandardTokenFixture.accounts[0], 100, sender=testStandardTokenFixture.accounts[1])
    assert standardToken.allowance(testStandardTokenFixture.accounts[1], testStandardTokenFixture.accounts[0]) == 100
    with raises(TransactionFailed):
        standardToken.transferFrom(testStandardTokenFixture.accounts[0], testStandardTokenFixture.accounts[1], 101)

def test_get_balance_correct(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.totalSupply() == 0
    # We get some tokens for tester 0
    assert standardToken.faucet(100000)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[0]) == 100000
    # approve and transfer more than in supply
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[1]) == 0
    assert standardToken.transfer(testStandardTokenFixture.accounts[1], 10)
    assert standardToken.transfer(testStandardTokenFixture.accounts[2], 10)
    assert standardToken.transfer(testStandardTokenFixture.accounts[3], 10)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[1]) == 10
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[2]) == 10
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[3]) == 10

def test_ping_pong_transfers(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.totalSupply() == 0
    # We get some tokens for tester 0
    assert standardToken.faucet(200)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[0]) == 200
    assert standardToken.transfer(testStandardTokenFixture.accounts[1], 100)
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[0]) == 100
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[1]) == 100
    # transfer back and forth
    for x in range(0, 10):
        assert standardToken.transfer(testStandardTokenFixture.accounts[1], 10)
        assert standardToken.transfer(testStandardTokenFixture.accounts[0], 10, sender=testStandardTokenFixture.accounts[1])

    assert standardToken.balanceOf(testStandardTokenFixture.accounts[0]) == 100
    assert standardToken.balanceOf(testStandardTokenFixture.accounts[1]) == 100

def test_transfrom_without_approve(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.totalSupply() == 0
    # We get some tokens for tester 0
    assert standardToken.faucet(10)
    with raises(TransactionFailed):
        standardToken.transferFrom(testStandardTokenFixture.accounts[0],testStandardTokenFixture.accounts[1], 10)

def test_transfrom_more_than_total_supply(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']
    assert standardToken.totalSupply() == 0
    assert standardToken.faucet(10)
    assert standardToken.totalSupply() == 10
    assert standardToken.faucet(10)
    assert standardToken.totalSupply() == 20
    with raises(TransactionFailed):
        standardToken.transfer(testStandardTokenFixture.accounts[1], 21)

def test_approval_increments(testStandardTokenFixture):
    standardToken = testStandardTokenFixture.contracts['StandardTokenHelper']

    assert standardToken.approve(testStandardTokenFixture.accounts[0], 100, sender=testStandardTokenFixture.accounts[1])
    assert standardToken.allowance(testStandardTokenFixture.accounts[1], testStandardTokenFixture.accounts[0]) == 100
    assert standardToken.increaseAllowance(testStandardTokenFixture.accounts[0], 1, sender=testStandardTokenFixture.accounts[1])
    assert standardToken.allowance(testStandardTokenFixture.accounts[1], testStandardTokenFixture.accounts[0]) == 101
    assert standardToken.decreaseAllowance(testStandardTokenFixture.accounts[0], 2, sender=testStandardTokenFixture.accounts[1])
    assert standardToken.allowance(testStandardTokenFixture.accounts[1], testStandardTokenFixture.accounts[0]) == 99
    assert standardToken.decreaseAllowance(testStandardTokenFixture.accounts[0], 99, sender=testStandardTokenFixture.accounts[1])
    assert standardToken.allowance(testStandardTokenFixture.accounts[1], testStandardTokenFixture.accounts[0]) == 0

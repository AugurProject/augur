#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import fixture, mark, raises

def test_nonReentrant(sessionFixture):
    ReentrancyGuardHelper = sessionFixture.uploadAndAddToAugur('solidity_test_helpers/ReentrancyGuardHelper.sol')
    assert ReentrancyGuardHelper.testerCanReentrant()

    with raises(TransactionFailed):
        ReentrancyGuardHelper.testerCanNotReentrant()

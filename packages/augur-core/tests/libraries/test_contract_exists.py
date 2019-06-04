#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import fixture
from utils import nullAddress

def test_contract_exists(fixture):
    contractExistsHelper = fixture.upload('solidity_test_helpers/ContractExistsHelper.sol')

    assert contractExistsHelper.doesContractExist(contractExistsHelper.address)
    assert not contractExistsHelper.doesContractExist(nullAddress)

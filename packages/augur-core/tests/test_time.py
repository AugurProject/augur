#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import stringToBytes, AssertLog


def test_default_controlled_time(localFixture, augur, time):
    # By default in testing we upload a controlled version of time to the augur which we control
    assert time.getTimestamp() == augur.getTimestamp() > 0

    # We can verify that it is the augur version of time
    assert augur.lookup("Time") == time.address

    assert time.getTypeName() == stringToBytes("TimeControlled")

    # Anyone can change this time at will
    newTime = time.getTimestamp() + 1
    with AssertLog(localFixture, "TimestampSet", {"newTimestamp": newTime}):
        assert time.setTimestamp(newTime)

    assert time.getTimestamp() == augur.getTimestamp() == newTime

    # We can also increment the time
    with AssertLog(localFixture, "TimestampSet", {"newTimestamp": newTime + 1}):
        assert time.incrementTimestamp(1)
    assert time.getTimestamp() == augur.getTimestamp() == newTime + 1

def test_real_time(localFixture, augur):
    # Let's test a real Time provider implementation
    time = localFixture.uploadAndAddToAugur("../src/contracts/Time.sol", lookupKey="RealTime")

    # We can verify that it is the augur version of time
    assert augur.lookup("RealTime") == time.address

    assert time.getTypeName() == stringToBytes("Time")

    # If we change the block timestamp it will be reflected in the new time
    curTime = time.getTimestamp()
    localFixture.eth_tester.time_travel(curTime + 500)

    assert time.getTimestamp() == curTime + 500


@pytest_fixture(scope="session")
def localSnapshot(fixture, augurInitializedSnapshot):
    fixture.resetToSnapshot(augurInitializedSnapshot)
    return augurInitializedSnapshot

@pytest_fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@pytest_fixture
def augur(localFixture, localSnapshot):
    return localFixture.contracts["Augur"]

@pytest_fixture
def time(localFixture, localSnapshot):
    return localFixture.contracts["Time"]

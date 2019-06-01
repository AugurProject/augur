from pytest import raises, mark
import conftest

#def test_fixture(fixture, baseSnapshot):
#    augurSnapshot = conftest.augurInitializedSnapshot(fixture, baseSnapshot)
#    kitchenSnapshot = conftest.kitchenSinkSnapshot(fixture, augurSnapshot)
#    pass

'''
def test_initial_greeting(foo_contract):
    hw = foo_contract.caller.bar()
    assert hw == "hello world"

def test_can_update_greeting(w3, foo_contract):
    # send transaction that updates the greeting
    tx_hash = foo_contract.functions.setBar(
        "testing contracts is easy",
    ).transact({
        'from': w3.eth.accounts[1],
    })
    w3.eth.waitForTransactionReceipt(tx_hash, 180)

    # verify that the contract is now using the updated greeting
    hw = foo_contract.caller.bar()
    assert hw == "testing contracts is easy"

def test_updating_greeting_emits_event(w3, foo_contract):
    # send transaction that updates the greeting
    tx_hash = foo_contract.functions.setBar(
        "testing contracts is easy",
    ).transact({
        'from': w3.eth.accounts[1],
    })
    receipt = w3.eth.waitForTransactionReceipt(tx_hash, 180)

    # get all of the `barred` logs for the contract
    logs = foo_contract.events.barred.getLogs()
    assert len(logs) == 1

    # verify that the log's data matches the expected value
    event = logs[0]
    assert event.blockHash == receipt.blockHash
    assert event.args._bar == "testing contracts is easy"
    '''

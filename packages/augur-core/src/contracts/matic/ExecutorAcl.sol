pragma solidity 0.5.15;

import 'ROOT/libraries/Initializable.sol';

contract ExecutorAcl is Initializable {
    bool _isExecuting;
    address internal _augurPredicate;

    modifier onlyPredicate() {
        _assertOnlyPredicate();
        _;
    }

    // When _isExecuting is set, token transfer approvals etc. within the matic sandbox will be bypassed
    modifier isExecuting() {
        _assertIsExecuting();
        _;
    }

    function _assertOnlyPredicate() private view {
        require(msg.sender == _augurPredicate, "ExecutorAcl.onlyPredicate is authorized");
    }

    function _assertIsExecuting() private view {
        require(_isExecuting, 'Needs to be executing');
    }

    function setIsExecuting(bool executing) public onlyPredicate {
        _isExecuting = executing;
    }
}

pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IDisputeWindow.sol';


contract IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, bool _initial) public returns (IDisputeWindow);
}

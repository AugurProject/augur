pragma solidity 0.5.4;

import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IDisputeWindow.sol';


contract IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, bool _initial) public returns (IDisputeWindow);
}

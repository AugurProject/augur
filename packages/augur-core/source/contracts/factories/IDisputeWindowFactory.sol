pragma solidity 0.4.24;

import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IDisputeWindow.sol';


contract IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId) public returns (IDisputeWindow);
}

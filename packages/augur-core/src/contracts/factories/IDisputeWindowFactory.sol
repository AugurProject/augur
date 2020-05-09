pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IDisputeWindow.sol';


contract IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime, bool _participationTokensEnabled) public returns (IDisputeWindow);
}

pragma solidity 0.5.4;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/factories/IDisputeWindowFactory.sol';
import 'ROOT/reporting/Reporting.sol';


contract DisputeWindowFactory is CloneFactory, IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime) public returns (IDisputeWindow) {
        IDisputeWindow _disputeWindow = IDisputeWindow(createClone(_augur.lookup("DisputeWindow")));
        _disputeWindow.initialize(_augur, _universe, _disputeWindowId, _windowDuration, _startTime, _augur.lookup("ERC820Registry"));
        return _disputeWindow;
    }
}

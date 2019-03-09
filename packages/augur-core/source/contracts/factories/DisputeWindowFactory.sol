pragma solidity 0.5.4;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/factories/IDisputeWindowFactory.sol';
import 'ROOT/reporting/Reporting.sol';


contract DisputeWindowFactory is CloneFactory, IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, bool _initial) public returns (IDisputeWindow) {
        IDisputeWindow _disputeWindow = IDisputeWindow(createClone(_augur.lookup("DisputeWindow")));
        uint256 _windowDuration = _initial ? Reporting.getInitialDisputeRoundDurationSeconds() : Reporting.getDisputeRoundDurationSeconds();
        _disputeWindow.initialize(_augur, _universe, _disputeWindowId, _windowDuration, _augur.lookup("ERC820Registry"));
        return _disputeWindow;
    }
}

pragma solidity 0.5.4;

import 'libraries/CloneFactory.sol';
import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IDisputeWindow.sol';
import 'factories/IDisputeWindowFactory.sol';
import 'reporting/Reporting.sol';


contract DisputeWindowFactory is CloneFactory, IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, bool _initial) public returns (IDisputeWindow) {
        IDisputeWindow _disputeWindow = IDisputeWindow(createClone(_augur.lookup("DisputeWindow")));
        uint256 _windowDuration = _initial ? Reporting.getInitialDisputeRoundDurationSeconds() : Reporting.getDisputeRoundDurationSeconds();
        _disputeWindow.initialize(_augur, _universe, _disputeWindowId, _windowDuration);
        return _disputeWindow;
    }
}

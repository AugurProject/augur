pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IDisputeWindow.sol';
import 'factories/IDisputeWindowFactory.sol';


contract DisputeWindowFactory is CloneFactory, IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId) public returns (IDisputeWindow) {
        IDisputeWindow _disputeWindow = IDisputeWindow(createClone(_augur.lookup("DisputeWindow")));
        _disputeWindow.initialize(_augur, _universe, _disputeWindowId);
        return _disputeWindow;
    }
}

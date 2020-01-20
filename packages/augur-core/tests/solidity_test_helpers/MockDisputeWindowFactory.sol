pragma solidity 0.5.15;


import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IDisputeWindow.sol';


contract MockDisputeWindowFactory {
    IUniverse private createDisputeWindowUniverseValue;
    IDisputeWindow private createDisputeWindowValue;
    uint256 private createdisputeWindowIdValue;

    function getCreateDisputeWindowUniverseValue() public returns(IUniverse) {
        return createDisputeWindowUniverseValue;
    }

    function getCreateDisputeWindowValue(IDisputeWindow _disputeWindowValue) public returns(IDisputeWindow) {
        return createDisputeWindowValue;
    }

    function getCreatedisputeWindowIdValue() public returns(uint256) {
        return createdisputeWindowIdValue;
    }

    function setCreateDisputeWindowValue(IDisputeWindow _disputeWindowValue) public {
        createDisputeWindowValue = _disputeWindowValue;
    }

    function createDisputeWindow(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId) public returns (IDisputeWindow) {
        createDisputeWindowUniverseValue = _universe;
        createdisputeWindowIdValue = _disputeWindowId;
        return createDisputeWindowValue;
    }
}

pragma solidity 0.4.24;

import 'libraries/Delegator.sol';
import 'reporting/IDisputeCrowdsourcer.sol';
import 'reporting/IMarket.sol';
import 'IController.sol';


contract DisputeCrowdsourcerFactory {
    function createDisputeCrowdsourcer(IController _controller, IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators) public returns (IDisputeCrowdsourcer) {
        Delegator _delegator = new Delegator(_controller, "DisputeCrowdsourcer");
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(_delegator);
        _disputeCrowdsourcer.initialize(_market, _size, _payoutDistributionHash, _payoutNumerators);
        return _disputeCrowdsourcer;
    }
}

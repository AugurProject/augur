pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'reporting/IDisputeCrowdsourcer.sol';
import 'reporting/IMarket.sol';
import 'IAugur.sol';


contract DisputeCrowdsourcerFactory is CloneFactory {
    function createDisputeCrowdsourcer(IAugur _augur, IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators) public returns (IDisputeCrowdsourcer) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(createClone(_augur.lookup("DisputeCrowdsourcer")));
        _disputeCrowdsourcer.initialize(_augur, _market, _size, _payoutDistributionHash, _payoutNumerators, _augur.lookup("ERC820Registry"));
        return _disputeCrowdsourcer;
    }
}

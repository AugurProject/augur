pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'reporting/IDisputeCrowdsourcer.sol';
import 'reporting/IDisputeOverloadToken.sol';
import 'reporting/IMarket.sol';
import 'IAugur.sol';


contract DisputeCrowdsourcerFactory is CloneFactory {
    function createDisputeCrowdsourcer(IAugur _augur, IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators) public returns (IDisputeCrowdsourcer) {
        IDisputeOverloadToken _disputeOverloadToken = IDisputeOverloadToken(createClone(_augur.lookup("DisputeOverloadToken")));
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(createClone(_augur.lookup("DisputeCrowdsourcer")));
        _disputeCrowdsourcer.initialize(_augur, _market, _size, _payoutDistributionHash, _payoutNumerators, _disputeOverloadToken, _augur.lookup("ERC820Registry"));
        _disputeOverloadToken.initialize(_disputeCrowdsourcer, _augur.lookup("ERC820Registry"));
        return _disputeCrowdsourcer;
    }
}

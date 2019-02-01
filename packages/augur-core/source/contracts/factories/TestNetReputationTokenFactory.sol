pragma solidity 0.4.24;


import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'TestNetReputationToken.sol';


contract TestNetReputationTokenFactory {
    function createReputationToken(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse) public returns (IReputationToken) {
        IReputationToken _reputationToken = IReputationToken(new TestNetReputationToken(_augur, _universe, _parentUniverse, _augur.lookup("ERC820Registry")));
        return _reputationToken;
    }
}

pragma solidity 0.5.4;


import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/TestNetReputationToken.sol';


contract TestNetReputationTokenFactory {
    function createReputationToken(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse) public returns (IReputationToken) {
        IReputationToken _reputationToken = IReputationToken(new TestNetReputationToken(_augur, _universe, _parentUniverse, _augur.lookup("ERC820Registry")));
        return _reputationToken;
    }
}

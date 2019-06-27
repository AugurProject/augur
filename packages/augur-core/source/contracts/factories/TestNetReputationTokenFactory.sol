pragma solidity 0.5.4;


import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/TestNetReputationToken.sol';


contract TestNetReputationTokenFactory {
    function createReputationToken(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse) public returns (IV2ReputationToken) {
        IV2ReputationToken _reputationToken = IV2ReputationToken(new TestNetReputationToken(_augur, _universe, _parentUniverse, _augur.lookup("ERC1820Registry")));
        return _reputationToken;
    }
}

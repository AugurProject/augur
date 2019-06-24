pragma solidity 0.5.4;


import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/reporting/ReputationToken.sol';


contract ReputationTokenFactory {
    function createReputationToken(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse) public returns (IV2ReputationToken) {
        return IV2ReputationToken(new ReputationToken(_augur, _universe, _parentUniverse, _augur.lookup("ERC1820Registry")));
    }
}

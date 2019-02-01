pragma solidity 0.4.24;


import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IV2ReputationToken.sol';
import 'reporting/ReputationToken.sol';


contract ReputationTokenFactory {
    function createReputationToken(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse) public returns (IV2ReputationToken) {
        return IV2ReputationToken(new ReputationToken(_augur, _universe, _parentUniverse, _augur.lookup("ERC820Registry")));
    }
}

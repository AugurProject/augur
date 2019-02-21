pragma solidity 0.5.4;

import 'reporting/IUniverse.sol';
import 'reporting/IReputationToken.sol';


contract MockReputationTokenFactory {
    IUniverse private createReputationTokenUniverseValue;
    IReputationToken private createReputationTokenValue;

    function getCreateReputationTokenUniverse() public returns(IUniverse) {
        return createReputationTokenUniverseValue;
    }

    function setCreateReputationTokenValue(IReputationToken _reputationTokenValue) public {
        createReputationTokenValue = _reputationTokenValue;
    }

    function createReputationToken(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse) public returns (IReputationToken) {
        createReputationTokenUniverseValue = _universe;
        return createReputationTokenValue;
    }
}

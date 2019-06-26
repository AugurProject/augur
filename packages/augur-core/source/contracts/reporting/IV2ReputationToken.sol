pragma solidity 0.5.4;

import 'ROOT/libraries/token/IStandardToken.sol';
import 'ROOT/reporting/IReputationToken.sol';


contract IV2ReputationToken is IReputationToken, IStandardToken {
    function burnForMarket(uint256 _amountToBurn) public returns (bool);
}

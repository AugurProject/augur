pragma solidity 0.5.10;

import 'ROOT/reporting/IReputationToken.sol';


contract IV2ReputationToken is IReputationToken {
    function burnForMarket(uint256 _amountToBurn) public returns (bool);
    function mintForWarpSync(uint256 _amountToMint, address _target) public returns (bool);
}

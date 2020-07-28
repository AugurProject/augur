pragma solidity 0.5.15;

import 'ROOT/reporting/IReputationToken.sol';


contract IV2ReputationToken is IReputationToken {
    function parentUniverse() external returns (IUniverse);
    function burnForMarket(uint256 _amountToBurn) public returns (bool);
    function mintForWarpSync(uint256 _amountToMint, address _target) public returns (bool);
    function getLegacyRepToken() public view returns (IERC20);
}

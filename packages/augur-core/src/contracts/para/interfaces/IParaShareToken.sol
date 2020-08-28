pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaUniverse.sol';


contract IParaShareToken {
    function approveUniverse(IParaUniverse _paraUniverse) external;
    function buyCompleteSets(IMarket _market, address _account, uint256 _amount) external returns (bool);
}
pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';


contract IAMMFactory {
    // market -> para -> amm
    mapping (address => mapping (address => address)) public exchanges;
    uint256 public fee; // [0-1000] how many thousandths of swaps should be kept as fees

    function addAMM(IMarket _market, IParaShareToken _para) external returns (address);
    function addAMMWithLiquidity(IMarket _market, IParaShareToken _para, uint256 _cash, uint256 _ratioFactor, bool _keepYes) external returns (address);
    function salt(IMarket _market, IParaShareToken _para) public pure returns (uint256);
    function transferCash(IMarket _market, IParaShareToken _para, address sender, address recipient, uint256 quantity) public;
}

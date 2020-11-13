pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/para/ParaShareToken.sol';


contract IAMMFactory {
    // market -> para share token -> amm exchange
    mapping (address => mapping (address => address)) public exchanges;
    uint256 public fee; // [0-1000] how many thousandths of swaps should be kept as fees

    function addAMM(IMarket _market, ParaShareToken _para) external returns (address);
    function addAMMWithLiquidity(IMarket _market, ParaShareToken _para, uint256 _cash, uint256 _ratioFactor, bool _keepYes) external returns (address);
    function salt(IMarket _market, ParaShareToken _para) public pure returns (uint256);
    function transferCash(IMarket _market, ParaShareToken _para, address sender, address recipient, uint256 quantity) public;
    function shareTransfer(IMarket _market, ParaShareToken _para, address _from, address _to, uint256 _invalidAmount, uint256 _noAmount, uint256 _yesAmount) public;
}

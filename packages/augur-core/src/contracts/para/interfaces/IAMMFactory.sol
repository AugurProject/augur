pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/para/ParaShareToken.sol';


contract IAMMFactory {
    // market -> para share token -> fee -> amm exchange
    mapping (address => mapping (address => mapping (uint256 => address))) public exchanges;

    function addAMM(IMarket _market, ParaShareToken _para, uint256 _fee) external returns (address);
    function addAMMWithLiquidity(IMarket _market, ParaShareToken _para, uint256 _fee, uint256 _cash, uint256 _ratioFactor, bool _keepYes) external returns (address);
    function salt(IMarket _market, ParaShareToken _para, uint256 _fee) public pure returns (uint256);
    function transferCash(IMarket _market, ParaShareToken _para, uint256 _fee, address sender, address recipient, uint256 quantity) public;
    function shareTransfer(IMarket _market, ParaShareToken _para, uint256 _fee, address _from, address _to, uint256 _invalidAmount, uint256 _noAmount, uint256 _yesAmount) public;
}

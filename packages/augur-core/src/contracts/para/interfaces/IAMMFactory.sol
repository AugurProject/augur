pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';


contract IAMMFactory {
    // market -> para share token -> fee -> amm exchange
    mapping (address => mapping (address => mapping (uint256 => address))) public exchanges;

    function addAMMWithLiquidity(IMarket _market, IParaShareToken _para, uint256 _fee, uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient, string[] memory _symbols) public returns (address _ammAddress, uint256 _lpTokens);
    function addLiquidity(IMarket _market, IParaShareToken _para, uint256 _fee, uint256 _cash, address _recipient, uint256 _cashToInvalidPool, string[] memory _symbols) public returns (uint256);
    function getBPool(IMarket _market, IParaShareToken _para, uint256 _fee) public returns (address);
    function removeLiquidity(IMarket _market, IParaShareToken _para, uint256 _fee, uint256 _poolTokensToSell, string[] memory _symbols) public returns (uint256 _shortShare, uint256 _longShare);
    function balanceOf(IMarket _market, IParaShareToken _para, uint256 _fee, address _account) public returns (uint256);
    function salt(IMarket _market, IParaShareToken _para, uint256 _fee) public pure returns (uint256);
    function transferCash(IMarket _market, IParaShareToken _para, uint256 _fee, address sender, address recipient, uint256 quantity) public;
    function shareTransfer(IMarket _market, IParaShareToken _para, uint256 _fee, address _from, address _to, uint256 _invalidAmount, uint256 _noAmount, uint256 _yesAmount) public;
}

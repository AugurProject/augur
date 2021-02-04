pragma solidity 0.5.15;

import 'ROOT/ICash.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/para/ParaShareToken.sol';
import 'ROOT/para/interfaces/IAMMFactory.sol';
import 'ROOT/balancer/BPool.sol';
import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155Nexus.sol';

contract IAMMExchange is IERC20 {
    IAMMFactory public factory;
    IERC20 public cash;
    ParaShareToken public shareToken;
    IMarket public augurMarket;
    uint256 public numTicks;
    uint256 public INVALID;
    uint256 public NO;
    uint256 public YES;
    uint256 public fee; // [0-1000] how many thousandths of swaps should be kept as fees
    // BPool public _bPool;

    function initialize(IMarket _market, ParaShareToken _shareToken, uint256 _fee, BPool _bPool, IERC20Proxy1155Nexus _erc20Proxy1155Nexus) public;

    // Adds shares to the liquidity pool by minting complete sets.
    function addLiquidity(uint256 _cash, address _recipient) public returns (uint256);
    // Add initial liquidity confirming to a specified ratio, giving the LP shares in addition to LP tokens if not 50:50
    function addInitialLiquidity(uint256 _cash, uint256 _ratioFactor, bool _keepLong, address _recipient) external returns (uint256);
    // returns how many LP tokens you get for providing the given number of sets
    function rateAddLiquidity(uint256 _longs, uint256 _shorts) public view returns (uint256);

    // Removes shares from the liquidity pool.
    // If _minSetsSold > 0 then also sell complete sets through burning and through swapping in the pool.
    function removeLiquidity(uint256 _poolTokensToSell) external returns (uint256 _shortShare, uint256 _longShare);
    // Tells you how many shares you receive from the pool.
    function rateRemoveLiquidity(uint256 _poolTokensToSell) public view returns (uint256 _shortShare, uint256 _longShare);

    function enterPosition(uint256 _cashCost, bool _buyLong, uint256 _minShares) public returns (uint256);

    // Sell as many of the given shares as possible, swapping yes<->no as-needed.
    function exitPosition(uint256 _shortShares, uint256 _longShares, uint256 _minCashPayout) public returns (uint256);
    // Exits as much of the position as possible.
	function exitAll(uint256 _minCashPayout) external returns (uint256);

    function swap(uint256 _inputShares, bool _inputLong, uint256 _minOutputShares) external returns (uint256);
    // How many of the other shares you would get for your shares.
    function rateSwap(uint256 _inputShares, bool _inputLong) public view returns (uint256);

    function shareBalances(address _owner) public view returns (uint256 _invalid, uint256 _no, uint256 _yes);
}

pragma solidity 0.5.15;

import 'ROOT/ICash.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/para/interfaces/IAMMFactory.sol';


contract IAMMExchange is IERC20 {
    IAMMFactory public factory;
    ICash public cash;
    IParaShareToken public shareToken;
    IMarket public augurMarket;
    uint256 public numTicks;
    uint256 public INVALID;
    uint256 public NO;
    uint256 public YES;
    uint256 public fee; // [0-1000] how many thousandths of swaps should be kept as fees

    function initialize(IMarket _market, IParaShareToken _shareToken, uint256 _fee) public;

    // Adds shares to the liquidity pool by minting complete sets.
    function addLiquidity(uint256 _cash, address _recipient) public returns (uint256);
    // Add initial liquidity confirming to a specified ratio, giving the LP shares in addition to LP tokens if not 50:50
    function addInitialLiquidity(uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient) external returns (uint256);
    // returns how many LP tokens you get for providing the given number of sets
    function rateAddLiquidity(uint256 _yesses, uint256 _nos) public view returns (uint256);

    // Removes shares from the liquidity pool.
    // If _minSetsSold > 0 then also sell complete sets through burning and through swapping in the pool.
    function removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) external returns (uint256 _invalidShare, uint256 _noShare, uint256 _yesShare, uint256 _cashShare);
    // Tells you how many shares you receive, how much cash you receive, and how many complete sets you burn for cash.
    function rateRemoveLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) public view returns (uint256 _invalidShare, uint256 _noShare, uint256 _yesShare, uint256 _cashShare, uint256 _setsSold);

    function enterPosition(uint256 _cashCost, bool _buyYes, uint256 _minShares) public returns (uint256);
    // Tells you how many shares you get for given cash.
    function rateEnterPosition(uint256 _cashToSpend, bool _buyYes) public view returns (uint256);

    // Sell as many of the given shares as possible, swapping yes<->no as-needed.
    function exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout) public returns (uint256);
    // Exits as much of the position as possible.
	function exitAll(uint256 _minCashPayout) external returns (uint256);
    function rateExitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares) public view returns (uint256 _cashPayout, uint256 _invalidFromUser, int256 _noFromUser, int256 _yesFromUser);
    function rateExitAll() public view returns (uint256 _cashPayout, uint256 _invalidFromUser, int256 _noFromUser, int256 _yesFromUser);

    function swap(uint256 _inputShares, bool _inputYes, uint256 _minOutputShares) external returns (uint256);
    // How many of the other shares you would get for your shares.
    function rateSwap(uint256 _inputShares, bool _inputYes) public view returns (uint256);

    // When swapping (which includes entering and exiting positions), a fee is taken.
    // The fee is a portion of the shares being swapped.
    // Remove liquidity to collect fees.
    function poolConstant(uint256 _poolYes, uint256 _poolNo) public view returns (uint256);
}

pragma solidity 0.5.15;

import 'ROOT/ICash.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/token/ERC20.sol';
import 'ROOT/libraries/math/SafeMathInt256.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/para/ParaShareToken.sol';
import "ROOT/para/interfaces/IAMMFactory.sol";
import "ROOT/para/interfaces/IAMMExchange.sol";
import 'ROOT/libraries/token/SafeERC20.sol';


contract AMMExchange is IAMMExchange, ERC20 {
    using SafeERC20 for IERC20;
    using SafeMathUint256 for uint256;
	using SafeMathInt256 for int256;

    IAMMFactory public factory;
    IERC20 public cash;
    ParaShareToken public shareToken;
    IMarket public augurMarket;
    uint256 public numTicks;
    uint256 public INVALID;
    uint256 public NO;
    uint256 public YES;
    uint256 public fee; // [0-1000] how many thousandths of swaps should be kept as fees

    event EnterPosition(address sender, uint256 cash, uint256 outputShares, bool buyLong, uint256 priorShares);
    event ExitPosition(address sender, uint256 shortShares, uint256 longShares, uint256 cashPayout);
    event SwapPosition(address sender, uint256 inputShares, uint256 outputShares, bool outputLong);
    event AddLiquidity(address sender, uint256 cash, uint256 shortShares, uint256 longShares, uint256 lpTokens);
    event RemoveLiquidity(address sender, uint256 shortShares, uint256 longShares);

    function initialize(IMarket _market, ParaShareToken _shareToken, uint256 _fee) public {
        require(cash == ICash(0)); // can only initialize once
        require(_fee <= 30); // fee must be [0,30] aka 0-3%

        factory = IAMMFactory(msg.sender);
        cash = _shareToken.cash();
        shareToken = _shareToken;
        augurMarket = _market;
        numTicks = _market.getNumTicks();
        INVALID = _shareToken.getTokenId(_market, 0);
        NO = _shareToken.getTokenId(_market, 1);
        YES = _shareToken.getTokenId(_market, 2);
        fee = _fee;

        // approve cash so sets can be bought
        cash.safeApprove(address(_shareToken.augur()), 2**256-1);
        // approve factory so users can just approve the factory, not each exchange
        shareToken.setApprovalForAll(msg.sender, true);
    }

    // Adds shares to the liquidity pool by minting complete sets.
    function addLiquidity(uint256 _cash, address _recipient) public returns (uint256) {
        (uint256 _poolShort, uint256 _poolLong) = shortLongShareBalances(address(this));
        require(_poolShort != 0, "To add initial liquidity please use addInitialLiquidity");
        uint256 _ratioFactor = 0;
        bool _keepLong = true;
        if (_poolShort > _poolLong) {
            _ratioFactor = _poolLong * 10**18 / _poolShort;
            _keepLong = true;
        } else {
            _ratioFactor = _poolShort * 10**18 / _poolLong;
            _keepLong = false;
        }

        return addLiquidityInternal(msg.sender, _cash, _ratioFactor, _keepLong, _recipient);
    }

    function addInitialLiquidity(uint256 _cash, uint256 _ratioFactor, bool _keepLong, address _recipient) external returns (uint256) {
        (uint256 _poolShort, uint256 _poolLong) = shortLongShareBalances(address(this));
        require(_poolShort == 0, "Cannot add a specified ratio liquidity after initial liquidity has been provided");
        return addLiquidityInternal(msg.sender, _cash, _ratioFactor, _keepLong, _recipient);
    }

    function addLiquidityInternal(address _user, uint256 _cash, uint256 _ratioFactor, bool _keepLong, address _recipient) internal returns (uint256) {
        require(_ratioFactor <= 10**18, "Ratio should be an amount relative to 10**18 (e.g 9 * 10**17 == .9)");
        require(_ratioFactor >= 10**17, "Ratio of 1:10 is the minimum");

        uint256 _setsToBuy = _cash.div(numTicks);
        uint256 _longShares = _setsToBuy;
        uint256 _shortShares = _setsToBuy;

        if (_ratioFactor != 10**18) {
            if (_keepLong) {
                _longShares = _setsToBuy * _ratioFactor / 10**18;
            } else {
                _shortShares = _setsToBuy * _ratioFactor / 10**18;
            }
        }
        uint256 _lpTokens = rateAddLiquidity(_longShares, _shortShares);

        factory.transferCash(augurMarket, shareToken, fee, _user, address(this), _cash);
        shareToken.publicBuyCompleteSets(augurMarket, _setsToBuy);

        if (_ratioFactor != 10**18) {
            uint256 _longSharesToUser = 0;
            uint256 _shortSharesToUser = 0;
            if (_keepLong) {
                _longSharesToUser = _setsToBuy.sub(_longShares);
            } else {
                _shortSharesToUser = _setsToBuy.sub(_shortShares);
            }
            shareTransfer(address(this), _recipient, _shortSharesToUser, _shortSharesToUser, _longSharesToUser);
        }

        _mint(_recipient, _lpTokens);
        emit AddLiquidity(_recipient, _cash, _shortShares, _longShares, _lpTokens);

        return _lpTokens;
    }

    // returns how many LP tokens you get for providing the given number of sets
    function rateAddLiquidity(uint256 _longs, uint256 _shorts) public view returns (uint256) {
        (uint256 _noBalance, uint256 _yesBalance) = shortLongShareBalances(address(this));

        uint256 _prior = 0;
        if (_noBalance + _yesBalance != 0) {
            _prior = (2 * _noBalance * _yesBalance) / (_noBalance + _yesBalance);
        }
        uint256 _valueAdded = (
            ((_noBalance * _longs) + (_yesBalance * _shorts) + (2 * _shorts * _longs))
            / (_noBalance + _yesBalance + _shorts + _longs)
        );

        if (_prior == 0) {
            return _valueAdded;
        } else {
            return _valueAdded.mul(totalSupply).div(_prior);
        }
    }

    // Removes shares from the liquidity pool.
    function removeLiquidity(uint256 _poolTokensToSell) external returns (uint256 _shortShare, uint256 _longShare){
        (_shortShare, _longShare) = rateRemoveLiquidity(_poolTokensToSell);

        require(_poolTokensToSell <= balanceOf(msg.sender), "AugurCP: Trying to sell more LP tokens than owned");
        _burn(msg.sender, _poolTokensToSell);

        shareTransfer(address(this), msg.sender, _shortShare, _shortShare, _longShare);

        emit RemoveLiquidity(msg.sender, _shortShare, _longShare);
    }

    // Tells you how many shares you receive from the pool.
    function rateRemoveLiquidity(uint256 _poolTokensToSell) public view returns (uint256 _shortShare, uint256 _longShare) {
        uint256 _poolSupply = totalSupply;
        (uint256 _poolShort, uint256 _poolLong) = shortLongShareBalances(address(this));

        _shortShare = _poolShort.mul(_poolTokensToSell).div(_poolSupply);
        _longShare = _poolLong.mul(_poolTokensToSell).div(_poolSupply);
    }

    function enterPosition(uint256 _cashCost, bool _buyLong, uint256 _minShares) public returns (uint256) {
        uint256 _setsToBuy = _cashCost.div(numTicks);
        uint256 _sharesToBuy = _setsToBuy.add(rateSwap(_setsToBuy, _buyLong));

        require(_sharesToBuy >= _minShares, "AugurCP: Too few shares would be received for given cash.");

        factory.transferCash(augurMarket, shareToken, fee, msg.sender, address(this), _cashCost);
        shareToken.publicBuyCompleteSets(augurMarket, _setsToBuy);

        (uint256 _priorShort, uint _priorLong) = shortLongShareBalances(msg.sender);
        if (_buyLong) {
            shareTransfer(address(this), msg.sender, 0, 0, _sharesToBuy);
            emit EnterPosition(msg.sender, _cashCost, _sharesToBuy, _buyLong, _priorLong);
        } else {
            shareTransfer(address(this), msg.sender, _sharesToBuy, _sharesToBuy, 0);
            emit EnterPosition(msg.sender, _cashCost, _sharesToBuy, _buyLong, _priorShort);
        }

        return _sharesToBuy;
    }

    // Sell as many of the given shares as possible, swapping long<->short as needed.
    function exitPosition(uint256 _shortShares, uint256 _longShares, uint256 _minCashPayout) public returns (uint256) {
        (uint256 _poolShort, uint256 _poolLong) = shortLongShareBalances(address(this));

        uint256 _sets = _shortShares;  // if short and long to sell are identical, sets to sell is equal to either
        if (_shortShares > _longShares) {
            _sets = _longShares.add(applyFee(calculateReverseSwap(_poolShort, _poolLong, _shortShares.sub(_longShares)), fee));
        } else if (_longShares > _shortShares) {
            _sets = _shortShares.add(applyFee(calculateReverseSwap(_poolLong, _poolShort, _longShares.sub(_shortShares)), fee));
        }

        factory.shareTransfer(augurMarket, shareToken, fee, msg.sender, address(this), _shortShares, _shortShares, _longShares);
        (uint256 _creatorFee, uint256 _reportingFee) = shareToken.publicSellCompleteSets(augurMarket, _sets);
        uint256 _cashPayout = _sets.mul(numTicks).sub(_creatorFee).sub(_reportingFee);
        require(_cashPayout >= _minCashPayout, "AugurCP: Proceeds were less than the required payout");
        cash.transfer(msg.sender, _cashPayout);

        emit ExitPosition(msg.sender, _shortShares, _longShares, _cashPayout);

        return _cashPayout;
    }

    // Exits as much of the position as possible.
	function exitAll(uint256 _minCashPayout) external returns (uint256) {
		(uint256 _userInvalid, uint256 _userNo, uint256 _userYes) = shareBalances(msg.sender);
        _userNo = SafeMathUint256.min(_userInvalid, _userNo); // determine short position
		return exitPosition(_userNo, _userYes, _minCashPayout);
	}

    function swap(uint256 _inputShares, bool _outputLong, uint256 _minOutputShares) external returns (uint256) {
        uint256 _outputShares = rateSwap(_inputShares, _outputLong);

        require(_outputShares >= _minOutputShares, "AugurCP: Swap would yield too few output shares.");

        if (_outputLong) {
            shareToken.unsafeTransferFrom(address(this), msg.sender, YES, _outputShares); // gain Yes
            factory.shareTransfer(augurMarket, shareToken, fee, msg.sender, address(this), _inputShares, _inputShares, uint256(0)); // lose No and Invalid
        } else {
            shareTransfer(address(this), msg.sender, _outputShares, _outputShares, 0); // gain No and Invalid
            factory.shareTransfer(augurMarket, shareToken, fee, msg.sender, address(this), uint256(0), uint256(0), _inputShares); // lose Yes
        }

        emit SwapPosition(msg.sender, _inputShares, _outputShares, _outputLong);

        return _outputShares;
    }

    // How many of the other shares you would get for your shares.
    function rateSwap(uint256 _inputShares, bool _outputLong) public view returns (uint256) {
        (uint256 _reserveShort, uint256 _reserveLong) = shortLongShareBalances(address(this));

        if (_outputLong) {
            return applyFee(calculateSwap(_reserveLong, _reserveShort, _inputShares), fee);
        } else {
            return applyFee(calculateSwap(_reserveShort, _reserveLong, _inputShares), fee);
        }
    }

    // Public because it's an extremely convenient method for other contracts or middleware.
    function shareBalances(address _owner) public view returns (uint256 _invalid, uint256 _no, uint256 _yes) {
        uint256[] memory _tokenIds = new uint256[](3);
        _tokenIds[0] = INVALID;
        _tokenIds[1] = NO;
        _tokenIds[2] = YES;
        address[] memory _owners = new address[](3);
        _owners[0] = _owner;
        _owners[1] = _owner;
        _owners[2] = _owner;
        uint256[] memory _balances = shareToken.balanceOfBatch(_owners, _tokenIds);
        _invalid = _balances[0];
        _no = _balances[1];
        _yes = _balances[2];
        return (_invalid, _no, _yes);
    }

    function shortLongShareBalances(address _owner) internal view returns (uint256 _no, uint256 _yes) {
        uint256[] memory _tokenIds = new uint256[](2);
        _tokenIds[0] = NO;
        _tokenIds[1] = YES;
        address[] memory _owners = new address[](2);
        _owners[0] = _owner;
        _owners[1] = _owner;
        uint256[] memory _balances = shareToken.balanceOfBatch(_owners, _tokenIds);
        _no = _balances[0];
        _yes = _balances[1];
        return (_no, _yes);
    }

    function shareTransfer(address _from, address _to, uint256 _invalidAmount, uint256 _noAmount, uint256 _yesAmount) internal {
        uint256 _size = (_invalidAmount != 0 ? 1 : 0) + (_noAmount != 0 ? 1 : 0) + (_yesAmount != 0 ? 1 : 0);
        uint256[] memory _tokenIds = new uint256[](_size);
        uint256[] memory _amounts = new uint256[](_size);
        if (_size == 0) {
            return;
        } else if (_size == 1) {
            _tokenIds[0] = _invalidAmount != 0 ? INVALID : _noAmount != 0 ? NO : YES;
            _amounts[0] = _invalidAmount != 0 ? _invalidAmount : _noAmount != 0 ? _noAmount : _yesAmount;
        } else if (_size == 2) {
            _tokenIds[0] = _invalidAmount != 0 ? INVALID : NO;
            _tokenIds[1] = _yesAmount != 0 ? YES : NO;
            _amounts[0] = _invalidAmount != 0 ? _invalidAmount : _noAmount;
            _amounts[1] = _yesAmount != 0 ? _yesAmount : _noAmount;
        } else {
            _tokenIds[0] = INVALID;
            _tokenIds[1] = NO;
            _tokenIds[2] = YES;
            _amounts[0] = _invalidAmount;
            _amounts[1] = _noAmount;
            _amounts[2] = _yesAmount;
        }
        shareToken.unsafeBatchTransferFrom(_from, _to, _tokenIds, _amounts);
    }

    function quadratic(int256 _a, int256 _b, int256 _c, uint256 _maximum) internal pure returns (uint256) {
        int256 _piece = SafeMathInt256.sqrt(_b*_b - (_a.mul(_c).mul(4)));
        int256 _resultPlus = (-_b + _piece) / (2 * _a);
        int256 _resultMinus = (-_b - _piece) / (2 * _a);

        // Choose correct answer based on maximum.
        if (_resultMinus < 0) _resultMinus = -_resultMinus;
        if (_resultPlus < 0) _resultPlus = -_resultPlus;
        if (_resultPlus > int256(_maximum)) {
            return uint256(_resultMinus);
        } else {
            return uint256(_resultPlus);
        }
    }

    // Calculates _deltaA, the number of shares gained from the swap.
    // To swap long->short: calculateSwap(shortsInPool, longsInPool, longsToSell).
    // To swap short->long: calculateSwap(longsInPool, shortsInPool, shortsToSell).
    // NOTE: Normally the fee is applied to the input shares. We don't do that here, the fee is later applied to the output shares.
    function calculateSwap(uint256 _reserveA, uint256 _reserveB, uint256 _deltaB) internal pure returns (uint256) {
        uint256 _k = _reserveA.mul(_reserveB);
        return _reserveA.sub(_k.div(_reserveB.add(_deltaB)));
    }

    // Calculates _deltaA, the number of complete sets you get from selling shares.
    // That is equivalent to the number of shares you would swap for to get complete sets.
    // To swap long->short: calculateReverseSwap(longsInPool, shortsInPool, longsToSell).
    // To swap short->long: calculateReverseSwap(shortsInPool, longsInPool, shortsToSell).
    function calculateReverseSwap(uint256 _reserveA, uint256 _reserveB, uint256 _deltaB) internal pure returns (uint256) {
        return quadratic(
            1,
            -int256(_deltaB.add(_reserveA).add(_reserveB)),
            int256(_deltaB.mul(_reserveB)),
            _deltaB
        );
    }

    function applyFee(uint256 _amount, uint256 _fee) internal pure returns (uint256) {
        return _amount.mul(1000 - _fee).div(1000);
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}
}

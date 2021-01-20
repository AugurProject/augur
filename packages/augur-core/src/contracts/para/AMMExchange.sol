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
    event SwapPosition(address sender, uint256 inputShares, uint256 outputShares, bool inputLong);
    event AddLiquidity(address sender, uint256 cash, uint256 shortShares, uint256 longShares, uint256 lpTokens);
    event RemoveLiquidity(address sender, uint256 cash, uint256 shortShares, uint256 longShares);


    function initialize(IMarket _market, ParaShareToken _shareToken, uint256 _fee) public {
        require(cash == ICash(0)); // can only initialize once
        require(_fee <= 150); // fee must be [0,150] aka 0-15%

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
        (uint256 _poolShort, uint256 _poolLong) = yesNoShareBalances(address(this));
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
        (uint256 _poolShort, uint256 _poolLong) = yesNoShareBalances(address(this));
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
        (uint256 _noBalance, uint256 _yesBalance) = yesNoShareBalances(address(this));
        uint256 _cashBalance = cash.balanceOf(address(this)).div(numTicks);

        uint256 _prior = 0;
        if (_noBalance + _yesBalance != 0) {
            _prior = (2 * _noBalance * _yesBalance) / (_noBalance + _yesBalance) + _cashBalance;
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
    function removeLiquidity(uint256 _poolTokensToSell) external returns (uint256 _shortShare, uint256 _longShare, uint256 _cashShare){
        (_shortShare, _longShare, _cashShare) = rateRemoveLiquidity(_poolTokensToSell);

        require(_poolTokensToSell <= balanceOf(msg.sender), "AugurCP: Trying to sell more LP tokens than owned");
        _burn(msg.sender, _poolTokensToSell);

        shareTransfer(address(this), msg.sender, _shortShare, _shortShare, _longShare);
        cash.transfer(msg.sender, _cashShare);

        emit RemoveLiquidity(msg.sender, _cashShare, _shortShare, _longShare);
    }

    // Tells you how many shares you receive, how much cash you receive, and how many complete sets you burn for cash.
    // Cash share does NOT include market fees from burning complete sets.
    function rateRemoveLiquidity(uint256 _poolTokensToSell) public view returns (uint256 _shortShare, uint256 _longShare, uint256 _cashShare) {
        uint256 _poolSupply = totalSupply;
        (uint256 _poolShort, uint256 _poolLong) = yesNoShareBalances(address(this));
        uint256 _poolCash = cash.balanceOf(address(this));

        _shortShare = _poolShort.mul(_poolTokensToSell).div(_poolSupply);
        _longShare = _poolLong.mul(_poolTokensToSell).div(_poolSupply);
        _cashShare = _poolCash.mul(_poolTokensToSell).div(_poolSupply);
    }

    function enterPosition(uint256 _cashCost, bool _buyLong, uint256 _minShares) public returns (uint256) {
        uint256 _sharesToBuy = rateEnterPosition(_cashCost, _buyLong);
        uint256 _setsToBuy = _cashCost.div(numTicks);

        require(_sharesToBuy >= _minShares, "AugurCP: Too few shares would be received for given cash.");

        factory.transferCash(augurMarket, shareToken, fee, msg.sender, address(this), _cashCost);

        (uint256 _priorNo, uint _priorYes) = yesNoShareBalances(msg.sender);
        if (_buyLong) {
            shareTransfer(address(this), msg.sender, 0, 0, _sharesToBuy);
            emit EnterPosition(msg.sender, _cashCost, _sharesToBuy, _buyLong, _priorYes);
        } else {
            shareTransfer(address(this), msg.sender, _sharesToBuy, _sharesToBuy, 0);
            emit EnterPosition(msg.sender, _cashCost, _sharesToBuy, _buyLong, _priorNo);
        }

        return _sharesToBuy;
    }

    // Tells you how many shares you get for given cash.
    function rateEnterPosition(uint256 _cashToSpend, bool _buyLong) public view returns (uint256) {
        uint256 _setsToBuy = _cashToSpend.div(numTicks);
        (uint256 _reserveNo, uint256 _reserveYes) = yesNoShareBalances(address(this));

        // user buys complete sets
        _reserveNo = _reserveNo.subS(_setsToBuy, "AugurCP: The pool doesn't have enough Invalid and NO tokens to fulfill the request.");
        _reserveYes = _reserveYes.subS(_setsToBuy, "AugurCP: The pool doesn't have enough YES tokens to fulfill the request.");

        // user swaps away the side they don't want
        if (_buyLong) {
            return applyFee(_setsToBuy.add(calculateSwap(_reserveYes, _reserveNo, _setsToBuy)), fee);
        } else {
            return applyFee(_setsToBuy.add(calculateSwap(_reserveNo, _reserveYes, _setsToBuy)), fee);
        }
    }

    // Exits as much of the position as possible.
	function exitAll(uint256 _minCashPayout) external returns (uint256) {
		(uint256 _userInvalid, uint256 _userNo, uint256 _userYes) = shareBalances(msg.sender);
        _userNo = SafeMathUint256.min(_userInvalid, _userNo);
		return exitPosition(_userNo, _userYes, _minCashPayout);
	}

    // Sell as many of the given shares as possible, swapping yes<->no as-needed.
    function exitPosition(uint256 _shortShares, uint256 _longShares, uint256 _minCashPayout) public returns (uint256) {
        uint256 _cashPayout = rateExitPosition(_shortShares, _longShares);
        require(_cashPayout >= _minCashPayout, "AugurCP: Proceeds were less than the required payout");

        factory.shareTransfer(augurMarket, shareToken, fee, msg.sender, address(this), _shortShares, _shortShares, _longShares);

        cash.transfer(msg.sender, _cashPayout);

        emit ExitPosition(msg.sender, _shortShares, _longShares, _cashPayout);

        return _cashPayout;
    }

    function rateExitAll() public view returns (uint256) {
        (uint256 _userNo, uint256 _userYes) = yesNoShareBalances(msg.sender);
        return rateExitPosition(_userNo, _userYes);
    }

    function rateExitPosition(uint256 _shortSharesToSell, uint256 _longSharesToSell) public view returns (uint256) {
        (uint256 _poolShort, uint256 _poolLong) = yesNoShareBalances(address(this));
        return calcExitPosition(_poolShort, _poolLong, _shortSharesToSell, _longSharesToSell);
    }

    function calcExitPosition(uint256 _poolShort, uint256 _poolLong, uint256 _shortSharesToSell, uint256 _longSharesToSell) internal view returns (uint256) {
        // Figure out how many shares we're buying in our synthetic swap and use that to figure out the final balance of Yes/No (setsToSell)
        uint256 _setsToSell = _shortSharesToSell; // if short and long to sell are identical, sets to sell is equal to either
        if (_longSharesToSell > _shortSharesToSell) {
            uint256 _delta = _longSharesToSell.sub(_shortSharesToSell);
            uint256 _shortSharesToBuy = quadratic(
                1,
                -int256(_delta.add(_poolLong).add(_poolShort)),
                int256(_delta.mul(_poolShort)),
                _delta
            );

            _setsToSell = _shortSharesToSell.add(_shortSharesToBuy);
        } else if (_shortSharesToSell > _longSharesToSell) {
            uint256 _delta = _shortSharesToSell.sub(_longSharesToSell);
            uint256 _longSharesToBuy = quadratic(
                1,
                -int256(_delta.add(_poolLong).add(_poolShort)),
                int256(_delta.mul(_poolLong)),
                _delta
            );
            _setsToSell = _longSharesToSell.add(_longSharesToBuy);
        }

        return applyFee(_setsToSell.mul(numTicks), fee);
    }

    function swap(uint256 _inputShares, bool _inputLong, uint256 _minOutputShares) external returns (uint256) {
        uint256 _outputShares = rateSwap(_inputShares, _inputLong);

        require(_outputShares >= _minOutputShares, "AugurCP: Swap would yield too few output shares.");

        if (_inputLong) {
            shareTransfer(address(this), msg.sender, _outputShares, _outputShares, 0); // gain No and Invalid
            factory.shareTransfer(augurMarket, shareToken, fee, msg.sender, address(this), uint256(0), uint256(0), _inputShares); // lose Yes
        } else {
            shareToken.unsafeTransferFrom(address(this), msg.sender, YES, _outputShares); // gain Yes
            factory.shareTransfer(augurMarket, shareToken, fee, msg.sender, address(this), _inputShares, _inputShares, uint256(0)); // lose No and Invalid
        }

        emit SwapPosition(msg.sender, _inputShares, _outputShares, _inputLong);

        return _outputShares;
    }

    // How many of the other shares you would get for your shares.
    function rateSwap(uint256 _inputShares, bool _inputLong) public view returns (uint256) {
        (uint256 _reserveNo, uint256 _reserveYes) = yesNoShareBalances(address(this));

        if (_inputLong) {
            return applyFee(calculateSwap(_reserveNo, _reserveYes, _inputShares), fee);
        } else {
            return applyFee(calculateSwap(_reserveYes, _reserveNo, _inputShares), fee);
        }
    }

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

    function yesNoShareBalances(address _owner) public view returns (uint256 _no, uint256 _yes) {
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

    function shareTransfer(address _from, address _to, uint256 _invalidAmount, uint256 _noAmount, uint256 _yesAmount) private {
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
    // NOTE: Normally the fee is applied to the input shares. We don't do that here, the fee is later applied to the output shares.
    function calculateSwap(uint256 _reserveA, uint256 _reserveB, uint256 _deltaB) internal pure returns (uint256) {
        uint256 _k = _reserveA.mul(_reserveB);
        return _reserveA.sub(_k.div(_reserveB.add(_deltaB)));
    }

    function applyFee(uint256 _amount, uint256 _fee) internal pure returns (uint256) {
        return _amount.mul(1000 - _fee).div(1000);
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}
}

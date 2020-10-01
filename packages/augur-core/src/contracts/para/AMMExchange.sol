pragma solidity 0.5.15;

import 'ROOT/ICash.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/token/ERC20.sol';
import 'ROOT/libraries/math/SafeMathInt256.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import "ROOT/para/interfaces/IAMMFactory.sol";
import "ROOT/para/interfaces/IAMMExchange.sol";


contract AMMExchange is IAMMExchange, ERC20 {
    using SafeMathUint256 for uint256;
	using SafeMathInt256 for int256;

    event EnterPosition(address sender, uint256 cash, uint256 outputShares, bool buyYes);
    event ExitPosition(address sender, uint256 invalidShares, uint256 noShares, uint256 yesShares, uint256 cashPayout);
    event SwapPosition(address sender, uint256 inputShares, uint256 outputShares, bool inputYes);


    function initialize(IMarket _market, IParaShareToken _shareToken, uint256 _fee) public {
        require(cash == ICash(0)); // can only initialize once
        require(_fee <= 1000); // fee must be [0,1000]

        factory = IAMMFactory(msg.sender);
        cash = _shareToken.cash();
        shareToken = _shareToken;
        augurMarket = _market;
        numTicks = _market.getNumTicks();
        cash.approve(address(_shareToken), 2**256-1);
        cash.approve(address(_shareToken.augur()), 2**256-1);
        INVALID = _shareToken.getTokenId(_market, 0);
        NO = _shareToken.getTokenId(_market, 1);
        YES = _shareToken.getTokenId(_market, 2);
        fee = _fee;
    }

    // Adds shares to the liquidity pool by minting complete sets.
    function addLiquidity(uint256 _setsToBuy) public returns (uint256) {
        uint256 _lpTokensGained = rateAddLiquidity(_setsToBuy, _setsToBuy);

        factory.transferCash(augurMarket, shareToken, msg.sender, address(this), _setsToBuy.mul(numTicks));
        shareToken.publicBuyCompleteSets(augurMarket, _setsToBuy);
        _mint(msg.sender, _lpTokensGained);
        return _lpTokensGained;
    }

    // Add shares to the liquidity pool by minting complete sets...
    // But then swap away some of those shares for the opposed shares.
    function addLiquidityThenSwap(uint256 _setsToBuy, bool _swapForYes, uint256 _swapHowMuch) external returns (uint256) {
        uint256 _lpTokensGained = rateAddLiquidityThenSwap(_setsToBuy, _swapForYes, _swapHowMuch);

        factory.transferCash(augurMarket, shareToken, msg.sender, address(this), _setsToBuy.mul(numTicks));
        shareToken.publicBuyCompleteSets(augurMarket, _setsToBuy);
        _mint(msg.sender, _lpTokensGained);
        return _lpTokensGained;
    }

    // returns how many LP tokens you get for providing the given number of sets
    function rateAddLiquidity(uint256 _yesses, uint256 _nos) public view returns (uint256) {
        uint256 _yesBalance = shareToken.balanceOf(address(this), YES);
        uint256 _noBalance = shareToken.balanceOf(address(this), NO);

        uint256 _priorLiquidityConstant = SafeMathUint256.sqrt(_yesBalance * _noBalance);
        uint256 _newLiquidityConstant = SafeMathUint256.sqrt((_yesBalance + _yesses) * (_noBalance + _nos));

        if (_priorLiquidityConstant == 0) {
            return _newLiquidityConstant;
        } else {
            uint256 _totalSupply = totalSupply;
            return _totalSupply.mul(_newLiquidityConstant).div(_priorLiquidityConstant).sub(_totalSupply);
        }
    }

    function rateAddLiquidityThenSwap(uint256 _setsToBuy, bool _swapForYes, uint256 _swapHowMuch) public view returns (uint256) {
        uint256 _keptSets = _setsToBuy.subS(_swapHowMuch, "AugurCP: When adding liquidity, tried to swap away more sets than you bought");
        uint256 _gainedShares = rateSwap(_swapHowMuch, !_swapForYes);

        uint256 _yesses; uint256 _nos;
        if (_swapForYes) {
            _yesses = _keptSets.add(_gainedShares);
            _nos = _keptSets;
        } else {
            _yesses = _keptSets;
            _nos = _keptSets.add(_gainedShares);
        }

        return rateAddLiquidity(_yesses, _nos);
    }

    // Removes shares from the liquidity pool.
    // If _minSetsSold > 0 then also sell complete sets through burning and through swapping in the pool.
    function removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) external returns (uint256 _invalidShare, uint256 _noShare, uint256 _yesShare, uint256 _cashShare){
        uint256 _setsSold;
        (_invalidShare, _noShare, _yesShare, _cashShare, _setsSold) = rateRemoveLiquidity(_poolTokensToSell, _minSetsSold);

        require(_setsSold == 0 || _setsSold >= _minSetsSold, "AugurCP: Would not receive the minimum number of sets");

        _burn(msg.sender, _poolTokensToSell);

        shareTransfer(address(this), msg.sender, _invalidShare, _noShare, _yesShare);
        shareToken.publicSellCompleteSets(augurMarket, _setsSold);
        cash.transfer(msg.sender, _cashShare);
        // CONSIDER: convert min(poolInvalid, poolYes, poolNo) to DAI by selling complete sets. Selling complete sets incurs Augur fees, maybe we should let the user sell the sets themselves if they want to pay the fee?
    }

    // Tells you how many shares you receive, how much cash you receive, and how many complete sets you burn for cash.
    function rateRemoveLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) public view returns (uint256 _invalidShare, uint256 _noShare, uint256 _yesShare, uint256 _cashShare, uint256 _setsSold) {
        uint256 _poolSupply = totalSupply;
        (uint256 _poolInvalid, uint256 _poolNo, uint256 _poolYes) = shareBalances(address(this));
        uint256 _poolCash = cash.balanceOf(address(this));

        _invalidShare = _poolInvalid.mul(_poolTokensToSell).div(_poolSupply);
        _noShare = _poolNo.mul(_poolTokensToSell).div(_poolSupply);
        _yesShare = _poolYes.mul(_poolTokensToSell).div(_poolSupply);
        _cashShare = _poolCash.mul(_poolTokensToSell).div(_poolSupply);
        _setsSold = 0;

        if (_minSetsSold > 0) {
            // First, how many complete sets you have
            _setsSold = SafeMathUint256.min(_invalidShare, SafeMathUint256.min(_noShare, _yesShare));
            _invalidShare -= _setsSold;
            _noShare -= _setsSold;
            _yesShare -= _setsSold;
            _cashShare += _setsSold.mul(numTicks);
            // Then, how many you can make from the pool
            (uint256 _cashFromExit, uint256 _invalidFromUser, int256 _noFromUser, int256 _yesFromUser) = rateExitPosition(_invalidShare, _noShare, _yesShare);
            _cashShare += _cashFromExit; // extra cash from selling sets to the pool
            _invalidShare -= _invalidFromUser; // minus the invalids spent selling sets to the pool
            if (_noFromUser > 0) {
                _noShare -= uint256(_noFromUser);
            } else { // user gained some No shares when making complete sets
                _noShare += uint256(-_noFromUser);
            }
            if (_yesFromUser > 0) {
                _yesShare -= uint256(_yesFromUser);
            } else { // user gained some No shares when making complete sets
                _yesShare += uint256(-_yesFromUser);
            }
        }
    }

    function enterPosition(uint256 _cashCost, bool _buyYes, uint256 _minShares) public returns (uint256) {
        uint256 _sharesToBuy = rateEnterPosition(_cashCost, _buyYes);

        require(_sharesToBuy >= _minShares, "AugurCP: Too few shares would be received for given cash.");

        factory.transferCash(augurMarket, shareToken, msg.sender, address(this), _cashCost);

        uint256 _setsToBuy = _cashCost.div(numTicks);

        if (_buyYes) {
            shareTransfer(address(this), msg.sender, _setsToBuy, 0, _sharesToBuy);
        } else {
            shareTransfer(address(this), msg.sender, _setsToBuy, _sharesToBuy, 0);
        }

        emit EnterPosition(msg.sender, _cashCost, _sharesToBuy, _buyYes);

        return _sharesToBuy;
    }

    // Tells you how many shares you get for given cash.
    function rateEnterPosition(uint256 _cashToSpend, bool _buyYes) public view returns (uint256) {
        uint256 _setsToBuy = _cashToSpend.div(numTicks);
        (uint256 _poolInvalid, uint256 _poolNo, uint256 _poolYes) = shareBalances(address(this));

        _poolInvalid = _poolInvalid.subS(_setsToBuy, "AugurCP: The pool doesn't have enough INVALID tokens to fulfill the request.");
        _poolNo = _poolNo.subS(_setsToBuy, "AugurCP: The pool doesn't have enough NO tokens to fulfill the request.");
        _poolYes = _poolYes.subS(_setsToBuy, "AugurCP: The pool doesn't have enough YES tokens to fulfill the request.");

        // simulate user swapping YES to NO or NO to YES
        uint256 _poolConstant = poolConstant(_poolYes, _poolNo);
        if (_buyYes) {
            // yesToUser + poolYes - poolConstant / (poolNo + _setsToBuy)
            return _setsToBuy.add(_poolYes.sub(_poolConstant.div(_poolNo.add(_setsToBuy))));
        } else {
            return _setsToBuy.add(_poolNo.sub(_poolConstant.div(_poolYes.add(_setsToBuy))));
        }
    }

    // Exits as much of the position as possible.
	function exitAll(uint256 _minCashPayout) external returns (uint256) {
		(uint256 _userInvalid, uint256 _userNo, uint256 _userYes) = shareBalances(msg.sender);
		return exitPosition(_userInvalid, _userNo, _userYes, _minCashPayout);
	}

    // Sell as many of the given shares as possible, swapping yes<->no as-needed.
    function exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout) public returns (uint256) {
        (uint256 _cashPayout, uint256 _invalidFromUser, int256 _noFromUser, int256 _yesFromUser) = rateExitPosition(_invalidShares, _noShares, _yesShares);

        require(_cashPayout >= _minCashPayout, "Proceeds were less than the required payout");
        if (_noFromUser < 0) {
            shareToken.unsafeTransferFrom(address(this), msg.sender, NO, uint256(-_noFromUser));
            _noFromUser = 0;
        } else if (_yesFromUser < 0) {
            shareToken.unsafeTransferFrom(address(this), msg.sender, YES, uint256(-_yesFromUser));
            _yesFromUser = 0;
        }

        shareTransfer(msg.sender, address(this), _invalidFromUser, uint256(_noFromUser), uint256(_yesFromUser));
        cash.transfer(msg.sender, _cashPayout);

        emit ExitPosition(msg.sender, _invalidShares, _noShares, _yesShares, _cashPayout);
        return _cashPayout;
    }

    function rateExitAll() public view returns (uint256 _cashPayout, uint256 _invalidFromUser, int256 _noFromUser, int256 _yesFromUser) {
        (uint256 _userInvalid, uint256 _userNo, uint256 _userYes) = shareBalances(msg.sender);
        return rateExitPosition(_userInvalid, _userNo, _userYes);
    }

    function rateExitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares) public view returns (uint256 _cashPayout, uint256 _invalidFromUser, int256 _noFromUser, int256 _yesFromUser) {
        (uint256 _poolNo, uint256 _poolYes) = yesNoShareBalances(address(this));
        _invalidFromUser = _invalidShares;
        _yesFromUser = int256(_yesShares);
        _noFromUser = int256(_noShares);
        uint256 _setsToSell = _invalidShares;

        // Figure out how many shares we're buying in our synthetic swap and use that to figure out the final balance of Yes/No (setsToSell)
        if (_yesShares > _noShares) {
            uint256 _delta = _yesShares.sub(_noShares);
            uint256 _noSharesToBuy = quadratic(1, -int256(_delta.add(_poolYes).add(_poolNo)), int256(_delta.mul(_poolNo)), _yesShares);
            _setsToSell = _noShares.add(_noSharesToBuy);
        } else if (_noShares > _yesShares) {
            uint256 _delta = _noShares.sub(_yesShares);
            uint256 _yesSharesToBuy = quadratic(1, -int256(_delta.add(_poolYes).add(_poolNo)), int256(_delta.mul(_poolYes)), _noShares);
            _setsToSell = _yesShares.add(_yesSharesToBuy);
        }

        if (_invalidShares > _setsToSell) {
            // We have excess Invalid shares that the user will just keep.
            _invalidFromUser = _setsToSell;
        } else {
            // We don't have enough Invalid to actually close out the Yes/No shares. They will be kept by the user.
            // Need to actually receive yes or no shares here since we are swapping to get partial complete sets but dont have enough yes/no to make full complete sets
            if (_yesShares > _noShares) {
                uint256 _noSharesToBuy = _setsToSell.sub(_noShares);
                _noFromUser = _noFromUser.sub(int256(_noSharesToBuy));
                _yesFromUser = int256(_yesShares.sub(_noShares).sub(_noSharesToBuy).sub(_invalidShares));
            } else {
                uint256 _yesSharesToBuy = _setsToSell.sub(_yesShares);
                _yesFromUser = _yesFromUser.sub(int256(_yesSharesToBuy));
                _noFromUser = int256(_noShares.sub(_yesShares.add(_yesSharesToBuy).sub(_invalidShares)));
            }
            _setsToSell = _invalidFromUser;
        }

        _cashPayout = _setsToSell.mul(numTicks);
    }

    function swap(uint256 _inputShares, bool _inputYes, uint256 _minOutputShares) external returns (uint256) {
        uint _outputShares = rateSwap(_inputShares, _inputYes);

        require(_outputShares >= _minOutputShares, "AugurCP: Swap would yield too few output shares.");

        if (_inputYes) { // lose yesses, gain nos
            shareToken.unsafeTransferFrom(msg.sender, address(this), YES, _inputShares);
            shareToken.unsafeTransferFrom(address(this), msg.sender, NO, _outputShares);
        } else { // gain yesses, lose nos
            shareToken.unsafeTransferFrom(address(this), msg.sender, YES, _outputShares);
            shareToken.unsafeTransferFrom(msg.sender, address(this), NO, _inputShares);
        }

        emit SwapPosition(msg.sender, _inputShares, _outputShares, _inputYes);

        return _outputShares;
    }

    // How many of the other shares you would get for your shares.
    function rateSwap(uint256 _inputShares, bool _inputYes) public view returns (uint256) {
        (uint256 _poolNo, uint256 _poolYes) = yesNoShareBalances(address(this));
        uint256 _poolConstant = poolConstant(_poolYes, _poolNo);
        if (_inputYes) {
            return _poolNo.sub(_poolConstant.div(_poolYes.add(_inputShares)));
        } else {
            return _poolYes.sub(_poolConstant.div(_poolNo.add(_inputShares)));
        }
    }

    // When swapping (which includes entering and exiting positions), a fee is taken.
    // The fee is a portion of the shares being swapped.
    // Remove liquidity to collect fees.
    function poolConstant(uint256 _poolYes, uint256 _poolNo) public view returns (uint256) {
        uint256 beforeFee = _poolYes.mul(_poolNo);
        if (beforeFee == 0) {
            return 0;
        } else {
            return beforeFee.mul(1000 - fee).div(1000);
        }
    }

    function shareBalances(address _owner) private view returns (uint256 _invalid, uint256 _no, uint256 _yes) {
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

    function yesNoShareBalances(address _owner) private view returns (uint256 _no, uint256 _yes) {
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
            _tokenIds[1] = _invalidAmount != 0 ? YES : NO;
            _amounts[0] = _invalidAmount != 0 ? _invalidAmount : _noAmount;
            _amounts[1] = _invalidAmount != 0 ? _yesAmount : _noAmount;
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

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}
}

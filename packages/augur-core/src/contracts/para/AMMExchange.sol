pragma solidity 0.5.15;

import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/token/ERC20.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/ICash.sol';


contract AMMExchange is ERC20 {
	using SafeMathUint256 for uint256;

	ICash public cash;
	IParaShareToken public shareToken;
	IMarket public augurMarket;
	uint256 public numTicks;
	uint256 public INVALID;
	uint256 public NO;
	uint256 public YES;

	constructor(IMarket _market, IParaShareToken _shareToken) public {
		cash = _shareToken.cash();
		shareToken = _shareToken;
		augurMarket = _market;
		numTicks = _market.getNumTicks();
		cash.approve(address(_shareToken), 2**256-1);
		cash.approve(address(_shareToken.augur()), 2**256-1);
		INVALID = _shareToken.getTokenId(_market, 0);
		NO = _shareToken.getTokenId(_market, 1);
		YES = _shareToken.getTokenId(_market, 2);
	}

	function addLiquidity(uint256 _sharesToBuy) external {
		uint256 _poolConstantBefore = sqrt(poolConstant());

		cash.transferFrom(msg.sender, address(this), _sharesToBuy.mul(numTicks));
		shareToken.publicBuyCompleteSets(augurMarket, _sharesToBuy);

		if (_poolConstantBefore == 0) {
			_mint(msg.sender, sqrt(poolConstant()));
		} else {
			uint256 _totalSupply = totalSupply;
			_mint(msg.sender, _totalSupply.mul(sqrt(poolConstant())).div(_poolConstantBefore).sub(_totalSupply));
		}
	}

	function removeLiquidity(uint256 _poolTokensToSell) external {
		uint256 _poolSupply = totalSupply;
		(uint256 _poolInvalid, uint256 _poolNo, uint256 _poolYes) = shareBalances(address(this));
		uint256 _poolCash = cash.balanceOf(address(this));
		uint256 _invalidShare = _poolInvalid.mul(_poolTokensToSell).div(_poolSupply);
		uint256 _noShare = _poolNo.mul(_poolTokensToSell).div(_poolSupply);
		uint256 _yesShare = _poolYes.mul(_poolTokensToSell).div(_poolSupply);
		uint256 _cashShare = _poolCash.mul(_poolTokensToSell).div(_poolSupply);
		_burn(msg.sender, _poolTokensToSell);
		shareTransfer(address(this), msg.sender, _invalidShare, _noShare, _yesShare);
		cash.transfer(msg.sender, _cashShare);
		// CONSIDER: convert min(poolInvalid, poolYes, poolNo) to DAI by selling complete sets. Selling complete sets incurs Augur fees, maybe we should let the user sell the sets themselves if they want to pay the fee?
	}

	function enterPosition(uint256 _amountInCash, bool _buyYes) external returns (uint256) {
		(uint256 _poolInvalid, uint256 _poolNo, uint256 _poolYes) = shareBalances(address(this));
		uint256 _setsToBuy = _amountInCash.div(numTicks);

		// simulate the user buying complete sets directly from the exchange
		uint256 _invalidToUser = _setsToBuy;
		uint256 _noToUser = _setsToBuy;
		uint256 _yesToUser = _setsToBuy;
		_poolInvalid = _poolInvalid.subS(_invalidToUser, "AugurCP: The pool doesn't have enough INVALID tokens to fulfill the request.");
		_poolNo = _poolNo.subS(_noToUser, "AugurCP: The pool doesn't have enough NO tokens to fulfill the request.");
		_poolYes = _poolYes.subS(_yesToUser, "AugurCP: The pool doesn't have enough YES tokens to fulfill the request.");

		require(_poolInvalid > 0, "AugurCP: The pool doesn't have enough INVALID tokens to fulfill the request.");
		require(_poolNo > 0, "AugurCP: The pool doesn't have enough NO tokens to fulfill the request.");
		require(_poolYes > 0, "AugurCP: The pool doesn't have enough YES tokens to fulfill the request.");

		// simulate user swapping YES to NO or NO to YES
		uint256 _poolConstant = _poolYes.mul(_poolNo);
		if (_buyYes) {
			// yesToUser += poolYes - poolConstant / (poolNo + noToUser)
			_yesToUser = _yesToUser.add(_poolYes.sub(_poolConstant.div(_poolNo.add(_noToUser))));
			_noToUser = 0;
		} else {
			_noToUser = _noToUser.add(_poolNo.sub(_poolConstant.div(_poolYes.add(_yesToUser))));
			_yesToUser = 0;
		}

		// materialize the final result of the simulation
		cash.transferFrom(msg.sender, address(this), _amountInCash);
		shareTransfer(address(this), msg.sender, _invalidToUser, _noToUser, _yesToUser);
	}

	function exitPosition(uint256 _cashToBuy) external {
		(uint256 _userInvalid, uint256 _userNo, uint256 _userYes) = shareBalances(msg.sender);
		(uint256 _poolNo, uint256 _poolYes) = yesNoShareBalances(address(this));
		uint256 _setsToSell = _cashToBuy.div(numTicks);

		// short circuit if user is closing out their own complete sets
		if (_userInvalid >= _setsToSell && _userNo >= _setsToSell && _userYes >= _setsToSell) {
			shareTransfer(msg.sender, address(this), _setsToSell, _setsToSell, _setsToSell);
			cash.transfer(msg.sender, _cashToBuy);
			return;
		}

		require(_userInvalid >= _setsToSell, "AugurCP: You don't have enough invalid tokens to close out for this amount.");
		require(_userNo > _setsToSell || _userYes > _setsToSell, "AugurCP: You don't have enough YES or NO tokens to close out for this amount.");

		// simulate user swapping enough NO ➡ YES or YES ➡ NO to create setsToSell complete sets
		uint256 _poolConstant = _poolYes.mul(_poolNo);
		uint256 _invalidFromUser = _setsToSell;
		uint256 _noFromUser = 0;
		uint256 _yesFromUser = 0;
		if (_userYes > _userNo) {
			uint256 _noToUser = _setsToSell.sub(_userNo);
			uint256 _yesToPool = _poolConstant.div(_poolNo.sub(_noToUser)).sub(_poolYes);
			require(_yesToPool <= _userYes.sub(_setsToSell), "AugurCP: You don't have enough YES tokens to close out for this amount.");
			_noFromUser = _userNo;
			_yesFromUser = _yesToPool + _setsToSell;
		} else {
			uint256 _yesToUser = _setsToSell.sub(_userYes);
			uint256 _noToPool = _poolConstant.div(_poolYes.sub(_yesToUser)).sub(_poolNo);
			require(_noToPool <= _userNo.sub(_setsToSell), "AugurCP: You don't have enough NO tokens to close out for this amount.");
			_yesFromUser = _userYes;
			_noFromUser = _noToPool + _setsToSell;
		}

		// materialize the complete set sale for cash
		shareTransfer(msg.sender, address(this), _invalidFromUser, _noFromUser, _yesFromUser);
		cash.transfer(msg.sender, _cashToBuy);
	}

	function swap(uint256 _inputShares, bool _inputYes) external returns (uint256) {
		(uint256 _poolNo, uint256 _poolYes) = yesNoShareBalances(address(this));
		uint256 _poolConstant = _poolYes.mul(_poolNo);
		if (_inputYes) {
			uint256 _yesFromUser = _inputShares;
			uint256 _noToUser = _poolNo.sub(_poolConstant.div(_poolYes.add(_yesFromUser)));
			shareToken.unsafeTransferFrom(msg.sender, address(this), YES, _yesFromUser);
			shareToken.unsafeTransferFrom(address(this), msg.sender, NO, _noToUser);
			return _noToUser;
		} else {
			uint256 _noFromUser = _inputShares;
			uint256 _yesToUser = _poolYes.sub(_poolConstant.div(_poolNo.add(_noFromUser)));
			shareToken.unsafeTransferFrom(msg.sender, address(this), NO, _noFromUser);
			shareToken.unsafeTransferFrom(address(this), msg.sender, YES, _yesToUser);
			return _yesToUser;
		}
	}

	function poolConstant() public view returns (uint256) {
		return shareToken.balanceOf(address(this), YES) * shareToken.balanceOf(address(this), NO);
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
		_tokenIds[1] = NO;
		_tokenIds[2] = YES;
		address[] memory _owners = new address[](2);
		_owners[1] = _owner;
		_owners[2] = _owner;
		uint256[] memory _balances = shareToken.balanceOfBatch(_owners, _tokenIds);
		_no = _balances[1];
		_yes = _balances[2];
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

	// babylonian method (https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
	function sqrt(uint y) private pure returns (uint z) {
		if (y > 3) {
			z = y;
			uint x = y / 2 + 1;
			while (x < z) {
				z = x;
				x = (y / x + x) / 2;
			}
		} else if (y != 0) {
			z = 1;
		}
	}

	// TODO Switch sqrt to the constant time algo below
	// Return value in range [0, 0x10000].
	/*
	uint32_t o1_32bit_sqrt_ver3(const uint32_t x) {
		uint32_t s = 0, b = 1u << 15;
		
		// Compute the rounded-down square root:
		while (b) {
			const uint32_t t = (s + b); 
			if (t * t <= x)  s = t;
			b >>= 1;
		}
		return s;
	}
	*/

	// TODO implement fee. Likely just making this adjustment everywhere: poolConstant = poolYes.mul(poolNo).mul(1000).div(997)
	// TODO add method to exit a position based on shares
	// TODO add convenience view methods to see what current rates are for swapping / entering a position

	function onTokenTransfer(address _from, address _to, uint256 _value) internal {}
}
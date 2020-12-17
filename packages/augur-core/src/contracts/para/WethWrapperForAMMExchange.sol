pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import "ROOT/para/interfaces/IAMMExchange.sol";
import "ROOT/para/interfaces/IAMMFactory.sol";
import "ROOT/0x/erc20/contracts/src/WETH9.sol";
import 'ROOT/para/ParaShareToken.sol';


contract WethWrapperForAMMExchange {
    IAMMFactory public factory;
    ParaShareToken public shareToken; // WETH para share token
    WETH9 public weth;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    // For WETH integration, since weth.withdraw() causes ETH to be sent here.
    function() external payable {}

    constructor(IAMMFactory _factory, ParaShareToken _shareToken) public {
        factory = _factory;
        shareToken = _shareToken;
        weth = WETH9(address(uint160(address(_shareToken.cash()))));

        weth.approve(address(_factory), MAX_APPROVAL_AMOUNT);
        _shareToken.setApprovalForAll(address(_factory), true);
    }

    function addAMMWithLiquidity (
        IMarket _market,
        uint256 _fee,
        uint256 _ratioFactor,
        bool _keepLong,
        address _recipient
    ) public payable returns (address _ammAddress, uint256 _lpTokens) {
        weth.deposit.value(msg.value)();
        return factory.addAMMWithLiquidity(
            _market,
            shareToken,
            _fee,
            msg.value,
            _ratioFactor,
            _keepLong,
            _recipient
        );
    }

    function getAMM(IMarket _market, uint256 _fee) public view returns (IAMMExchange) {
        IAMMExchange _amm = IAMMExchange(factory.exchanges(address(_market), address(shareToken), _fee));
        require(address(_amm) != address(0), "No such AMM exists.");
        return _amm;
    }

    function addInitialLiquidity(IMarket _market, uint256 _fee, uint256 _ratioFactor, bool _keepLong, address _recipient) external payable returns (uint256) {
        weth.deposit.value(msg.value)();
        IAMMExchange _amm = getAMM(_market, _fee);
        return _amm.addInitialLiquidity(msg.value, _ratioFactor, _keepLong, _recipient);
    }

    function addLiquidity(IMarket _market, uint256 _fee, address _recipient) public payable returns (uint256) {
        weth.deposit.value(msg.value)();
        IAMMExchange _amm = getAMM(_market, _fee);
        return _amm.addLiquidity(msg.value, _recipient);
    }

    function removeLiquidity(IMarket _market, uint256 _fee, uint256 _poolTokensToSell, uint256 _minSetsSold) external returns (uint256 _shortShare, uint256 _longShare, uint256 _cashShare, uint256 _setsSold) {
        IAMMExchange _amm = getAMM(_market, _fee);
        _amm.transferFrom(msg.sender, address(this), _poolTokensToSell);

        (_shortShare, _longShare, _cashShare, _setsSold) = _amm.removeLiquidity(_poolTokensToSell, _minSetsSold);
        shareTransfer(_market, address(this), msg.sender, _shortShare, _shortShare, _longShare);

        if (_cashShare > 0) {
            weth.withdraw(_cashShare);
            msg.sender.transfer(_cashShare);
        }
    }

    function enterPosition(IMarket _market, uint256 _fee, bool _buyLong, uint256 _minShares) public payable returns (uint256) {
        IAMMExchange _amm = getAMM(_market, _fee);
        uint256 _numTicks = _market.getNumTicks();
        weth.deposit.value(msg.value)();

        uint256 shares = _amm.enterPosition(msg.value, _buyLong, _minShares);
        if (_buyLong) {
            shareTransfer(_market, address(this), msg.sender, 0, 0, shares);
        } else {
            shareTransfer(_market, address(this), msg.sender, shares, shares, 0);
        }
        return shares;
    }

    function exitPosition(IMarket _market, uint256 _fee, uint256 _shortShares, uint256 _longShares, uint256 _minCashPayout) public returns (uint256) {
        IAMMExchange _amm = getAMM(_market, _fee);
        shareTransfer(_market, msg.sender, address(this), _shortShares, _shortShares, _longShares);
        uint256 _cashPayout = _amm.exitPosition(_shortShares, _longShares, _minCashPayout);

        if (_cashPayout > 0) {
            weth.withdraw(_cashPayout);
            msg.sender.transfer(_cashPayout);
        }
        return _cashPayout;
    }

    function exitAll(IMarket _market, uint256 _fee, uint256 _minCashPayout) external returns (uint256) {
        IAMMExchange _amm = getAMM(_market, _fee);
        (uint256 _invalid, uint256 _no, uint256 _yes) = _amm.shareBalances(msg.sender);
        _no = SafeMathUint256.min(_invalid, _no);
        return exitPosition(_market, _fee, _no, _yes, _minCashPayout);
    }

    function shareTransfer(IMarket _market, address _from, address _to, uint256 _invalidAmount, uint256 _noAmount, uint256 _yesAmount) private {
        uint256 _INVALID = shareToken.getTokenId(_market, 0);
        uint256 _NO = shareToken.getTokenId(_market, 1);
        uint256 _YES = shareToken.getTokenId(_market, 2);

        uint256 _size = (_invalidAmount != 0 ? 1 : 0) + (_noAmount != 0 ? 1 : 0) + (_yesAmount != 0 ? 1 : 0);
        uint256[] memory _tokenIds = new uint256[](_size);
        uint256[] memory _amounts = new uint256[](_size);
        if (_size == 0) {
            return;
        } else if (_size == 1) {
            _tokenIds[0] = _invalidAmount != 0 ? _INVALID : _noAmount != 0 ? _NO : _YES;
            _amounts[0] = _invalidAmount != 0 ? _invalidAmount : _noAmount != 0 ? _noAmount : _yesAmount;
        } else if (_size == 2) {
            _tokenIds[0] = _invalidAmount != 0 ? _INVALID : _NO;
            _tokenIds[1] = _yesAmount != 0 ? _YES : _NO;
            _amounts[0] = _invalidAmount != 0 ? _invalidAmount : _noAmount;
            _amounts[1] = _yesAmount != 0 ? _yesAmount : _noAmount;
        } else {
            _tokenIds[0] = _INVALID;
            _tokenIds[1] = _NO;
            _tokenIds[2] = _YES;
            _amounts[0] = _invalidAmount;
            _amounts[1] = _noAmount;
            _amounts[2] = _yesAmount;
        }
        shareToken.unsafeBatchTransferFrom(_from, _to, _tokenIds, _amounts);
    }

    function claimTradingProceeds(IMarket _market, address payable _shareHolder, bytes32 _fingerprint) external {
        require(shareToken.isApprovedForAll(_shareHolder, address(this)), "Weth wrapper contract must be approved to do share token transfers on behalf of the share holder.");

        // Not using shareTransfer method to save gas.
        uint256 _INVALID = shareToken.getTokenId(_market, 0);
        uint256 _NO = shareToken.getTokenId(_market, 1);
        uint256 _YES = shareToken.getTokenId(_market, 2);

        uint256[] memory _tokenIds = new uint256[](3);
        _tokenIds[0] = _INVALID;
        _tokenIds[1] = _NO;
        _tokenIds[2] = _YES;

        address[] memory _shareHolders = new address[](3);
        _shareHolders[0] = _shareHolder;
        _shareHolders[1] = _shareHolder;
        _shareHolders[2] = _shareHolder;

        uint256[] memory _balances = shareToken.balanceOfBatch(_shareHolders, _tokenIds);

        // Get all share tokens from _shareHolder.
        shareToken.unsafeBatchTransferFrom(_shareHolder, address(this), _tokenIds, _balances);

        // Turn em' in.
        shareToken.claimTradingProceeds(_market, address(this), _fingerprint);

        // Unwrap weth
        uint _balance = weth.balanceOf(address(this));
        weth.withdraw(_balance);

        // Send unwrapped eth back to _shareHolder
        _shareHolder.transfer(address(this).balance);
    }
}

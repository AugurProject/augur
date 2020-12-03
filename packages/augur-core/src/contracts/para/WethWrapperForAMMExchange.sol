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
        bool _keepYes,
        address _recipient
    ) public payable returns (address _ammAddress, uint256 _lpTokens) {
        weth.deposit.value(msg.value)();
        return factory.addAMMWithLiquidity(
            _market,
            shareToken,
            _fee,
            msg.value,
            _ratioFactor,
            _keepYes,
            _recipient
        );
    }

    function getAMM(IMarket _market, uint256 _fee) public view returns (IAMMExchange) {
        IAMMExchange _amm = IAMMExchange(factory.exchanges(address(_market), address(shareToken), _fee));
        require(address(_amm) != address(0), "No such AMM exists.");
        return _amm;
    }

    function addInitialLiquidity(IMarket _market, uint256 _fee, uint256 _ratioFactor, bool _keepYes, address _recipient) external payable returns (uint256) {
        weth.deposit.value(msg.value)();
        IAMMExchange _amm = getAMM(_market, _fee);
        return _amm.addInitialLiquidity(msg.value, _ratioFactor, _keepYes, _recipient);
    }

    function addLiquidity(IMarket _market, uint256 _fee, address _recipient) public payable returns (uint256) {
        weth.deposit.value(msg.value)();
        IAMMExchange _amm = getAMM(_market, _fee);
        return _amm.addLiquidity(msg.value, _recipient);
    }

    function removeLiquidity(IMarket _market, uint256 _fee, uint256 _poolTokensToSell, uint256 _minSetsSold) external returns (uint256 _invalidShare, uint256 _noShare, uint256 _yesShare, uint256 _cashShare, uint256 _setsSold) {
        IAMMExchange _amm = getAMM(_market, _fee);
        _amm.transferFrom(msg.sender, address(this), _poolTokensToSell);

        (_invalidShare, _noShare, _yesShare, _cashShare, _setsSold) = _amm.removeLiquidity(_poolTokensToSell, _minSetsSold);
        shareTransfer(_market, address(this), msg.sender, _invalidShare, _noShare, _yesShare);

        if (_cashShare > 0) {
            weth.withdraw(_cashShare);
            msg.sender.transfer(_cashShare);
        }
    }

    function enterPosition(IMarket _market, uint256 _fee, bool _buyYes, uint256 _minShares) public payable returns (uint256) {
        IAMMExchange _amm = getAMM(_market, _fee);
        uint256 _numTicks = _market.getNumTicks();
        uint256 _setsToBuy = msg.value / _numTicks; // safemath division is identical to regular division
        weth.deposit.value(msg.value)();

        uint256 shares = _amm.enterPosition(msg.value, _buyYes, _minShares);
        if (_buyYes) {
            shareTransfer(_market, address(this), msg.sender, _setsToBuy, 0, shares);
        } else {
            shareTransfer(_market, address(this), msg.sender, _setsToBuy, shares, 0);
        }
        return shares;
    }

    function exitPosition(IMarket _market, uint256 _fee, uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout) public returns (uint256) {
        IAMMExchange _amm = getAMM(_market, _fee);
        shareTransfer(_market, msg.sender, address(this), _invalidShares, _noShares, _yesShares);
        uint256 _cashPayout = _amm.exitPosition(_invalidShares, _noShares, _yesShares, _minCashPayout);

        // Exiting a position can involve GAINING some shares
        (uint256 _remainingInvalid, uint256 _remainingNo, uint256 _remainingYes) = _amm.shareBalances(address(this));
        shareTransfer(_market, address(this), msg.sender, _remainingInvalid, _remainingNo, _remainingYes);

        if (_cashPayout > 0) {
            weth.withdraw(_cashPayout);
            msg.sender.transfer(_cashPayout);
        }
        return _cashPayout;
    }

    function exitAll(IMarket _market, uint256 _fee, uint256 _minCashPayout) external returns (uint256) {
        IAMMExchange _amm = getAMM(_market, _fee);
        (uint256 _invalid, uint256 _no, uint256 _yes) = _amm.shareBalances(msg.sender);
        return exitPosition(_market, _fee, _invalid, _no, _yes, _minCashPayout);
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
}

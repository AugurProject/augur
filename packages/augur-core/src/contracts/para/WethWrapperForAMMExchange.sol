pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import "ROOT/para/interfaces/IAMMExchange.sol";
import "ROOT/0x/erc20/contracts/src/WETH9.sol";
import 'ROOT/para/interfaces/IParaShareToken.sol';



contract WethWrapperForAMMExchange {
    IAMMExchange public amm;
    WETH9 public weth;
    IParaShareToken public shareToken;
    uint256 public numTicks;
    uint256 public INVALID;
    uint256 public NO;
    uint256 public YES;

    constructor(IAMMExchange _amm, WETH9 _weth) public {
        amm = _amm;
        weth = _weth;

        IParaShareToken _shareToken = _amm.shareToken();
        IMarket _market = _amm.augurMarket();

        shareToken = _shareToken;
        numTicks = amm.numTicks();
        INVALID = _shareToken.getTokenId(_market, 0);
        NO = _shareToken.getTokenId(_market, 1);
        YES = shareToken.getTokenId(_market, 2);
    }

    function addLiquidity(address recipient) public payable returns (uint256) {
        weth.deposit.value(msg.value);
        uint256 lpTokens = amm.addLiquidity(msg.value, recipient);
        amm.transfer(msg.sender, lpTokens);
        return lpTokens;
    }

    function addInitialLiquidity(uint256 _ratioFactor, bool _keepYes, address _recipient) external payable returns (uint256) {
        weth.deposit.value(msg.value);
        uint256 lpTokens = amm.addInitialLiquidity(msg.value, _ratioFactor, _keepYes, _recipient);
        amm.transfer(msg.sender, lpTokens);
        return lpTokens;
    }

    function removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) external returns (uint256 _invalidShare, uint256 _noShare, uint256 _yesShare, uint256 _cashShare) {
        (_invalidShare, _noShare, _yesShare, _cashShare) = amm.removeLiquidity(_poolTokensToSell, _minSetsSold);

        shareTransfer(address(this), msg.sender, _invalidShare, _noShare, _yesShare);

        weth.withdraw(_cashShare);
        msg.sender.transfer(_cashShare);
    }

    function enterPosition(bool _buyYes, uint256 _minShares) public payable returns (uint256) {
        uint256 _setsToBuy = msg.value / numTicks; // safemath division is identical to regular division
        weth.deposit.value(msg.value);

        uint256 shares = amm.enterPosition(msg.value, _buyYes, _minShares);
        if (_buyYes) {
            shareTransfer(address(this), msg.sender, _setsToBuy, 0, shares);
        } else {
            shareTransfer(address(this), msg.sender, _setsToBuy, shares, 0);
        }
        return shares;
    }

    function exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout) public returns (uint256) {
        uint256 _cashPayout = amm.exitPosition(_invalidShares, _noShares, _yesShares, _minCashPayout);
        weth.withdraw(_cashPayout);
        msg.sender.transfer(_cashPayout);
        return _cashPayout;
    }

    function exitAll(uint256 _minCashPayout) external returns (uint256) {
        uint256 _cashPayout = amm.exitAll(_minCashPayout);
        weth.withdraw(_cashPayout);
        msg.sender.transfer(_cashPayout);
        return _cashPayout;
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

}

pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/CloneFactory2.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/para/interfaces/IAMMFactory.sol';
import 'ROOT/para/interfaces/IAMMExchange.sol';


contract AMMFactory is IAMMFactory, CloneFactory2 {
    using SafeMathUint256 for uint256;

    IAMMExchange internal proxyToClone;

    constructor(address _proxyToClone, uint256 _fee) public {
        require(_fee <= 1000); // fee must be [0,1000]
        fee = _fee;
        proxyToClone = IAMMExchange(_proxyToClone);
    }

    function addAMM(IMarket _market, IParaShareToken _para) external returns (address) {
        IAMMExchange _amm = IAMMExchange(createClone2(address(proxyToClone), salt(_market, _para)));
        _amm.initialize(_market, _para, fee);
        exchanges[address(_market)][address(_para)] = address(_amm);
        return address(_amm);
    }

    function addAMMWithLiquidity(IMarket _market, IParaShareToken _para, uint256 _setsToBuy, bool _swapForYes, uint256 _swapHowMuch) external returns (address) {
        IAMMExchange _amm = IAMMExchange(createClone2(address(proxyToClone), salt(_market, _para)));
        _amm.initialize(_market, _para, fee);
        exchanges[address(_market)][address(_para)] = address(_amm);

        // User sends cash to factory, which turns cash into LP tokens, then returns the tokens returns to the user.
        uint256 _cashAmount = _setsToBuy.mul(_market.getNumTicks());
        _para.cash().transferFrom(msg.sender, address(this), _cashAmount);

        uint256 _lpTokens;
        if (_swapHowMuch == 0) {
            _lpTokens = _amm.addLiquidity(_setsToBuy);
        } else {
            _lpTokens = _amm.addLiquidityThenSwap(_setsToBuy, _swapForYes, _swapHowMuch);
        }

        _amm.transfer(msg.sender, _lpTokens);
        return address(_amm);
    }

    function salt(IMarket _market, IParaShareToken _para) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_market, _para)));
    }

    function transferCash(IMarket _market, IParaShareToken _para, address sender, address recipient, uint256 quantity) public {
        IAMMExchange amm = IAMMExchange(exchanges[address(_market)][address(_para)]);
        require(msg.sender == address(amm), "AugurCP: non-exchange tried to send cash");
        if (sender == address(this)) {
            _para.cash().transfer(recipient, quantity);
        } else {
            _para.cash().transferFrom(sender, recipient, quantity);
        }
    }

    function calculateAMMAddress(IMarket _market, IParaShareToken _para) public view returns (address) {
        return clone2Address(address(proxyToClone), salt(_market, _para), address(this));
    }
}

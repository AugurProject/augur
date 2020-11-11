pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/CloneFactory2.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/para/ParaShareToken.sol';
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

    function addAMM(IMarket _market, ParaShareToken _para) external returns (address) {
        IAMMExchange _amm = IAMMExchange(createClone2(address(proxyToClone), salt(_market, _para)));
        _amm.initialize(_market, _para, fee);
        exchanges[address(_market)][address(_para)] = address(_amm);
        return address(_amm);
    }

    function addAMMWithLiquidity(IMarket _market, ParaShareToken _para, uint256 _cash, uint256 _ratioFactor, bool _keepYes) external returns (address) {
        IAMMExchange _amm = IAMMExchange(createClone2(address(proxyToClone), salt(_market, _para)));
        _amm.initialize(_market, _para, fee);
        exchanges[address(_market)][address(_para)] = address(_amm);

        // User sends cash to factory, which turns cash into LP tokens and shares which it gives to the user.
        _para.cash().transferFrom(msg.sender, address(this), _cash);

        _amm.addInitialLiquidity(_cash, _ratioFactor, _keepYes, msg.sender);

        return address(_amm);
    }

    function salt(IMarket _market, ParaShareToken _para) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_market, _para)));
    }

    function transferCash(IMarket _market, ParaShareToken _para, address sender, address recipient, uint256 quantity) public {
        IAMMExchange amm = IAMMExchange(exchanges[address(_market)][address(_para)]);
        require(msg.sender == address(amm), "AugurCP: non-exchange tried to send cash");

        if (sender == address(this)) {
            _para.cash().transfer(recipient, quantity);
        } else {
            _para.cash().transferFrom(sender, recipient, quantity);
        }
    }

    function shareTransfer(IMarket _market, ParaShareToken _para, address _from, address _to, uint256 _invalidAmount, uint256 _noAmount, uint256 _yesAmount) public {
        IAMMExchange amm = IAMMExchange(exchanges[address(_market)][address(_para)]);
        require(msg.sender == address(amm), "AugurCP: non-exchange tried to send shares");

        uint256 _INVALID = _para.getTokenId(_market, 0);
        uint256 _NO = _para.getTokenId(_market, 1);
        uint256 _YES = _para.getTokenId(_market, 2);

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
        _para.unsafeBatchTransferFrom(_from, _to, _tokenIds, _amounts);
    }


    function calculateAMMAddress(IMarket _market, ParaShareToken _para) public view returns (address) {
        return clone2Address(address(proxyToClone), salt(_market, _para), address(this));
    }
}

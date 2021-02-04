pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/CloneFactory2.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/para/ParaShareToken.sol';
import 'ROOT/para/interfaces/IAMMFactory.sol';
import 'ROOT/para/interfaces/IAMMExchange.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/balancer/BFactory.sol';
import 'ROOT/balancer/BPool.sol';

import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155Nexus.sol';

contract AMMFactory is IAMMFactory, CloneFactory2 {
    using SafeMathUint256 for uint256;

    IAMMExchange internal proxyToClone;
    BFactory internal bFactory;
    IERC20Proxy1155Nexus internal eRC20Proxy1155Nexus;

    event AMMCreated(IAMMExchange amm, IMarket market, ParaShareToken shareToken, uint256 fee, BPool bPool);

    constructor(address _proxyToClone, BFactory _bFactory, IERC20Proxy1155Nexus _erc20Proxy1155Nexus) public {
        bFactory = _bFactory;
        eRC20Proxy1155Nexus = _erc20Proxy1155Nexus;
        proxyToClone = IAMMExchange(_proxyToClone);
    }

    function addAMM(IMarket _market, ParaShareToken _para, uint256 _fee) external returns (address) {
        IAMMExchange _amm = IAMMExchange(createClone2(address(proxyToClone), salt(_market, _para, _fee)));

        BPool _bPool = bFactory.newBPool();
        _bPool.setController(address(_amm));
        _amm.initialize(_market, _para, _fee, _bPool, eRC20Proxy1155Nexus);

        exchanges[address(_market)][address(_para)][_fee] = address(_amm);

        emit AMMCreated(_amm, _market, _para, _fee, _bPool);

        return address(_amm);
    }

    function addAMMWithLiquidity(
        IMarket _market,
        ParaShareToken _para,
        uint256 _fee,
        uint256 _cash,
        uint256 _ratioFactor,
        bool _keepLong,
        address _recipient
    ) external returns (address _ammAddress, uint256 _lpTokens) {
        _ammAddress = createClone2(address(proxyToClone), salt(_market, _para, _fee));
        IAMMExchange _amm = IAMMExchange(_ammAddress);
        BPool _bPool = bFactory.newBPool();
        _bPool.setController(address(_amm));
        _amm.initialize(_market, _para, _fee, _bPool, eRC20Proxy1155Nexus);
        exchanges[address(_market)][address(_para)][_fee] = _ammAddress;

        emit AMMCreated(_amm, _market, _para, _fee, _bPool);

        // User sends cash to factory, which turns cash into LP tokens and shares which it gives to the user.
        _para.cash().transferFrom(msg.sender, address(this), _cash);
        _lpTokens = _amm.addInitialLiquidity(_cash, _ratioFactor, _keepLong, _recipient);
    }

    function transferCash(
        IMarket _market,
        ParaShareToken _para,
        uint256 _fee,
        address _sender,
        address _recipient,
        uint256 _quantity
    ) public {
        IAMMExchange amm = IAMMExchange(exchanges[address(_market)][address(_para)][_fee]);
        require(msg.sender == address(amm), "AugurCP: non-exchange tried to send cash");

        if (_sender == address(this)) {
            _para.cash().transfer(_recipient, _quantity);
        } else {
            _para.cash().transferFrom(_sender, _recipient, _quantity);
        }
    }

    function shareTransfer(
        IMarket _market,
        ParaShareToken _para,
        uint256 _fee,
        address _from,
        address _to,
        uint256 _invalidAmount,
        uint256 _noAmount,
        uint256 _yesAmount
    ) public {
        IAMMExchange amm = IAMMExchange(exchanges[address(_market)][address(_para)][_fee]);
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

    /**
     * @notice Claims winnings for multiple markets/sharetoken pairs for a particular shareholder
     * Note: the next two params work as pairs. e.g. we are claiming _markets[0] winnings from _shareTokens[0]
     * @param _markets Array of markets to claim winnings for
     * @param _shareTokens Array of share tokens contracts to claim winnings from
     * @param _shareHolder The account to claim winnings for
     * @param _fingerprint Fingerprint of the user to restrict affiliate fees
     * @return Bool True
     */
    function claimMarketsProceeds(IMarket[] calldata _markets, IParaShareToken[] calldata _shareTokens , address payable _shareHolder, bytes32 _fingerprint) external returns (bool) {
        for (uint256 i=0; i < _markets.length; i++) {
            _shareTokens[i].claimTradingProceeds(_markets[i], _shareHolder, _fingerprint);
        }
        return true;
    }

    function calculateAMMAddress(IMarket _market, ParaShareToken _para, uint256 _fee) public view returns (address) {
        return clone2Address(address(proxyToClone), salt(_market, _para, _fee), address(this));
    }


    function salt(IMarket _market, ParaShareToken _para, uint256 _fee) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_market, _para, _fee)));
    }
}

pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/CloneFactory2.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/para/ParaShareToken.sol';
import 'ROOT/para/interfaces/IAMMFactory.sol';
import 'ROOT/para/interfaces/IAMMExchange.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/balancer/BFactory.sol';
import 'ROOT/balancer/BPool.sol';
import 'ROOT/trading/wrappedShareToken/WrappedShareTokenFactoryFactory.sol';

contract AMMFactory is IAMMFactory, CloneFactory2 {
    using SafeMathUint256 for uint256;

    IAMMExchange internal proxyToClone;
    BFactory internal bFactory;
    IERC20Proxy1155Nexus internal erc20Proxy1155Nexus;
    WrappedShareTokenFactoryFactory wrappedShareTokenFactoryFactory;
    mapping (address => address) public balancerPools;

    event AMMCreated(IAMMExchange amm, IMarket market, IParaShareToken shareToken, uint256 fee, BPool bPool);
    event BPoolCreated(IERC20Proxy1155 _invalidERC20Proxy1155);

    constructor(address _proxyToClone, BFactory _bFactory, IERC20Proxy1155Nexus _erc20Proxy1155Nexus, WrappedShareTokenFactoryFactory _wrappedShareTokenFactoryFactory) public {
        bFactory = _bFactory;
        erc20Proxy1155Nexus = _erc20Proxy1155Nexus;
        proxyToClone = IAMMExchange(_proxyToClone);
        wrappedShareTokenFactoryFactory = _wrappedShareTokenFactoryFactory;
    }

    function addLiquidity(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee,
        uint256 _cash,
        address _recipient,
        uint256 _cashToInvalidPool
    ) public returns (uint256) {
        _para.cash().transferFrom(msg.sender, address(this), _cash);
        address _ammAddress = exchanges[address(_market)][address(_para)][_fee];
        IAMMExchange _amm = IAMMExchange(_ammAddress);

        if(_cashToInvalidPool > 0) {
            BPool _bPool = BPool(balancerPools[_ammAddress]);

            addLiquidityToBPool(_market, _para, _bPool, _cashToInvalidPool, _recipient);

            _cash = _para.cash().balanceOf(address(this));
        }

        return _amm.addLiquidity(_cash, _recipient);
    }

    function addAMMWithLiquidity(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee,
        uint256 _cash,
        uint256 _ratioFactor,
        bool _keepLong,
        address _recipient,
        string[] memory _symbols
    ) public returns (address _ammAddress, uint256 _lpTokens) {
        // User sends cash to factory, which turns cash into LP tokens and shares which it gives to the user.
        _para.cash().transferFrom(msg.sender, address(this), _cash);
        _para.setApprovalForAll(address(erc20Proxy1155Nexus), true);
        _para.cash().approve(address(_para.augur()), 2**256-1);

        IAMMExchange _amm = createAMM(_market, _para, _fee);
        BPool _bPool = createBPool(_ammAddress, _para, _market, _fee, _recipient);
        balancerPools[address(_amm)] = address(_bPool);

        emit AMMCreated(_amm, _market, _para, _fee, _bPool);

        _ammAddress = address(_amm);

        _cash = _para.cash().balanceOf(address(this));

        // Move 10% of remaining cash to the balancer pool.
        uint256 _cashToSendToPool = (_cash * 10 * 10**16) / 10**18;
        addLiquidityToBPool(_market, _para, _bPool, _cashToSendToPool, _recipient);

        _cash = _para.cash().balanceOf(address(this));
        _lpTokens = _amm.addInitialLiquidity(_cash, _ratioFactor, _keepLong, _recipient);
    }

    // This method assumes cash has already been transfer to the factory.
    function addLiquidityToBPool(
        IMarket _market,
        IParaShareToken _para,
        BPool _bPool,
        uint256 _cashToInvalidPool,
        address _recipient
    ) internal {
        uint _poolCashBalance = _bPool.getBalance(address(_para.cash()));
        uint _poolLPTokenTotalSupply = _bPool.totalSupply();

        _cashToInvalidPool = _cashToInvalidPool.div(2);

        uint256 _lpTokenOut = _cashToInvalidPool.mul(_poolLPTokenTotalSupply).div(_poolCashBalance);
        uint256 _setsToBuy = _cashToInvalidPool.div(_market.getNumTicks());

        _para.publicBuyCompleteSets(_market, _setsToBuy);

        uint256[] memory _maxAmountsIn = new uint256[](2);
        // The max amount is constrained by the _lpTokenOut.
        _maxAmountsIn[0] = 2**128-1;
        _maxAmountsIn[1] = 2**128-1;

        _bPool.joinPool(_lpTokenOut, _maxAmountsIn);

        // Send back unused shares.
        uint256[] memory _tokenIds = new uint256[](2);
        _tokenIds[0] = _para.getTokenId(_market, 1);
        _tokenIds[1] = _para.getTokenId(_market, 2);

        uint256[] memory _amounts = new uint256[](2);
        _amounts[0] = _setsToBuy;
        _amounts[1] = _setsToBuy;

        _para.unsafeBatchTransferFrom(address(this), _recipient, _tokenIds, _amounts);

        // transfer balancer lp tokens back to liquidity provider.
        _bPool.transfer(_recipient, _lpTokenOut);
    }

    function createAMM(IMarket _market, IParaShareToken _para, uint256 _fee) private returns (IAMMExchange _amm) {
        uint256 _numTicks = _market.getNumTicks();
        address _ammAddress = createClone2(address(proxyToClone), salt(_market, _para, _fee));

        _amm = IAMMExchange(_ammAddress);
        _amm.initialize(_market, _para, _fee);
        exchanges[address(_market)][address(_para)][_fee] = _ammAddress;
    }

    function createBPool(address _ammAddress, IParaShareToken _para, IMarket _market, uint256 _fee, address _recipient) private returns (BPool _bPool){
        _bPool = bFactory.newBPool();

        IERC20Proxy1155 _invalidERC20Proxy1155 = erc20Proxy1155Nexus.newERC20(_para.getTokenId(_market, 0));

        _invalidERC20Proxy1155.approve(address(_bPool), 2**256-1);
        _para.cash().approve(address(_bPool), 2**256-1);

        uint256 _numTicks = _market.getNumTicks();

        // Create pool.
        // MIN_BALANCE needed to setup pool is 10**18 / 10**12.
        // Will send MIN_BALANCE * numTicks cash because we need MIN_BALANCE complete sets.
        uint256 MIN_BALANCE = 10**6 * _numTicks;

        // Setup bPool....
        uint256 _setsToBuy = MIN_BALANCE.div(_numTicks);
        _para.publicBuyCompleteSets(_market, _setsToBuy);

        // Send cash to balancer bPool
        // Pool weight == 90%
        _bPool.bind(address(_para.cash()), MIN_BALANCE, 45 * 10**18);

        // Move just minted invalid shares to the balancer pool.
        // Pool weight == 10%
        _bPool.bind(address(_invalidERC20Proxy1155),  _setsToBuy, 5 * 10**18);

        _bPool.finalize();

        uint256[] memory _tokenIds = new uint256[](2);
        _tokenIds[0] = _para.getTokenId(_market, 1);
        _tokenIds[1] = _para.getTokenId(_market, 2);

        uint256[] memory _amounts = new uint256[](2);
        _amounts[0] = _setsToBuy;
        _amounts[1] = _setsToBuy;

        _para.unsafeBatchTransferFrom(address(this), _recipient, _tokenIds, _amounts);
    }

    function transferCash(
        IMarket _market,
        IParaShareToken _para,
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
        IParaShareToken _para,
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

    function calculateAMMAddress(IMarket _market, IParaShareToken _para, uint256 _fee) public view returns (address) {
        return clone2Address(address(proxyToClone), salt(_market, _para, _fee), address(this));
    }


    function salt(IMarket _market, IParaShareToken _para, uint256 _fee) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_market, _para, _fee)));
    }
}

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
import 'ROOT/trading/wrappedShareToken/WrappedShareTokenFactory.sol';
import 'ROOT/trading/wrappedShareToken/WrappedShareToken.sol';

contract AMMFactory is IAMMFactory, CloneFactory2 {
    using SafeMathUint256 for uint256;

    IAMMExchange internal proxyToClone;
    BFactory internal bFactory;
    WrappedShareTokenFactory internal wrappedShareTokenFactory;
    mapping (address => address) public balancerPools;

    event AMMCreated(IAMMExchange amm, IMarket market, IParaShareToken shareToken, uint256 fee, BPool bPool, string[] _symbols);

    constructor(address _proxyToClone, BFactory _bFactory, WrappedShareTokenFactory _wrappedShareTokenFactory) public {
        bFactory = _bFactory;
        proxyToClone = IAMMExchange(_proxyToClone);
        wrappedShareTokenFactory = _wrappedShareTokenFactory;
    }

    function addLiquidity(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee,
        uint256 _cash,
        address _recipient,
        uint256 _cashToInvalidPool,
        string[] memory _symbols
    ) public returns (uint256) {
        _para.cash().transferFrom(msg.sender, address(this), _cash);
        address _ammAddress = exchanges[address(_market)][address(_para)][_fee];
        IAMMExchange _amm = IAMMExchange(_ammAddress);

        if(_cashToInvalidPool > 0) {
            BPool _bPool = BPool(balancerPools[_ammAddress]);

            addLiquidityToBPool(_market, _para, _bPool, _cashToInvalidPool, _recipient, _symbols);

            _cash = _para.cash().balanceOf(address(this));
        }

        return _amm.addLiquidity(_cash, _recipient);
    }

    function removeLiquidity(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee,
        uint256 _poolTokensToSell,
        string[] memory _symbols
    ) public returns (uint256 _shortShare, uint256 _longShare) {
        address _ammAddress = exchanges[address(_market)][address(_para)][_fee];
        IAMMExchange _amm = IAMMExchange(_ammAddress);

        exitBPool(_market, _para, wrappedShareTokenFactory, _ammAddress, _symbols[0]);

        _amm.transferFrom(msg.sender, address(this), _poolTokensToSell);
        _amm.removeLiquidity(_poolTokensToSell);

        // Send all cash from bPool back to LP.
        _para.cash().transfer(msg.sender, _para.cash().balanceOf(address(this)));

        return sendAllShares(_market, _para, _fee, msg.sender);
    }

    function exitBPool(
        IMarket _market,
        IParaShareToken _para,
        WrappedShareTokenFactory wrappedShareTokenFactory,
        address _ammAddress,
        string memory _symbol
    ) internal {
        BPool _bPool = BPool(balancerPools[_ammAddress]);

        uint256 _lpTokenBalance = _bPool.balanceOf(msg.sender);

        uint256[] memory _minAmountsOut = new uint256[](2);
        // The min amount is constrained by the _lpTokenBalance.
        _minAmountsOut[0] = 0;
        _minAmountsOut[1] = 0;

        // Will need approval.
        _bPool.transferFrom(msg.sender, address(this), _lpTokenBalance);
        _bPool.exitPool(_lpTokenBalance, _minAmountsOut);

        wrappedShareTokenFactory.unwrapAllShares(_para, _para.getTokenId(_market, 0), _symbol);
    }

    function sendAllShares(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee,
        address _target
    ) internal returns (uint256, uint256) {
        address _ammAddress = exchanges[address(_market)][address(_para)][_fee];
        IAMMExchange _amm = IAMMExchange(_ammAddress);
        (uint256 _invalidAmount, uint256  _yesAmount, uint256  _noAmount) = _amm.shareBalances(address(this));

        shareTransferInternal(_market, _para, _fee, address(this), msg.sender, _invalidAmount, _noAmount, _yesAmount);

        return (
            _yesAmount,
            _noAmount
        );
    }

    function getAMM(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee
    ) public returns (address) {
        return exchanges[address(_market)][address(_para)][_fee];
    }

    function getBPool(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee
    ) public returns (address) {
        return balancerPools[getAMM(_market, _para, _fee)];
    }

    function balanceOf(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee,
        address _account
    ) public returns (uint256) {
        address _ammAddress = exchanges[address(_market)][address(_para)][_fee];
        IAMMExchange _amm = IAMMExchange(_ammAddress);

        return _amm.balanceOf(_account);
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
        _para.cash().approve(address(_para.augur()), 2**256-1);

        IAMMExchange _amm = createAMM(_market, _para, _fee);

        // Move 10% of remaining cash to the balancer pool.
        uint256 _cashToSendToPool = (_cash * 10 * 10**16) / 10**18;
        BPool _bPool = createBPool(_ammAddress, _para, _market, _fee, _recipient, _symbols, _cashToSendToPool);

        balancerPools[address(_amm)] = address(_bPool);

        emit AMMCreated(_amm, _market, _para, _fee, _bPool, _symbols);

        _ammAddress = address(_amm);

        _cash = _para.cash().balanceOf(address(this));
        _lpTokens = _amm.addInitialLiquidity(_cash, _ratioFactor, _keepLong, _recipient);
    }

    // This method assumes cash has already been transfer to the factory.
    function addLiquidityToBPool(
        IMarket _market,
        IParaShareToken _para,
        BPool _bPool,
        uint256 _cashToInvalidPool,
        address _recipient,
        string[] memory _symbols
    ) internal {
        uint _poolCashBalance = _bPool.getBalance(address(_para.cash()));
        uint _poolLPTokenTotalSupply = _bPool.totalSupply();

        _cashToInvalidPool = _cashToInvalidPool.div(2);

        uint256 _lpTokenOut = _cashToInvalidPool.mul(_poolLPTokenTotalSupply).div(_poolCashBalance);
        uint256 _setsToBuy = _cashToInvalidPool.div(_market.getNumTicks());

        _para.publicBuyCompleteSets(_market, _setsToBuy);

        wrappedShareTokenFactory.wrapShares(_para, _para.getTokenId(_market, 0), _symbols[0], address(this), _setsToBuy);

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

    function createBPool(address _ammAddress, IParaShareToken _para, IMarket _market, uint256 _fee, address _recipient, string[] memory _symbols, uint256 _cashToSendToPool) private returns (BPool _bPool){
        _bPool = bFactory.newBPool();

        uint256 _invalidTokenId = _para.getTokenId(_market, 0);

        WrappedShareToken wrappedShareToken = wrappedShareTokenFactory.getOrCreateWrappedShareToken(_para, _invalidTokenId, _symbols[0]);

        _para.setApprovalForAll(address(wrappedShareTokenFactory), true);
        wrappedShareToken.approve(address(_bPool), 2**256-1);
        _para.cash().approve(address(_bPool), 2**256-1);

        uint256 _numTicks = _market.getNumTicks();

        // Create pool.
        // Send 90% of the cash as cash to the bpool.
        uint256 cashToBPool = (_cashToSendToPool * 90 * 10**16) / 10**18;

        // Send 10% of the cash as invalid shares to the bpool.
        uint256 _setsToBuy = (_cashToSendToPool.div(_numTicks) * 10 * 10**16) / 10**18;
        _para.publicBuyCompleteSets(_market, _setsToBuy);

        wrappedShareTokenFactory.wrapShares(_para, _invalidTokenId, _symbols[0], address(this), _setsToBuy);
        uint256 amountToBPool = wrappedShareToken.balanceOf(address(this));

        // Send cash to balancer bPool
        // Pool weight == 90%
        _bPool.bind(address(_para.cash()), cashToBPool, 45 * 10**18);

        // Move just minted invalid shares to the balancer pool.
        // Pool weight == 10%
        _bPool.bind(address(wrappedShareToken),  amountToBPool, 5 * 10**18);

        _bPool.finalize();

        uint256[] memory _tokenIds = new uint256[](2);
        _tokenIds[0] = _para.getTokenId(_market, 1);
        _tokenIds[1] = _para.getTokenId(_market, 2);

        uint256[] memory _amounts = new uint256[](2);
        _amounts[0] = _setsToBuy;
        _amounts[1] = _setsToBuy;

        _para.unsafeBatchTransferFrom(address(this), _recipient, _tokenIds, _amounts);

        uint256 _lpTokenBalance = _bPool.balanceOf(address(this));
        _bPool.transferFrom(address(this), _recipient, _lpTokenBalance);
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

        return shareTransferInternal(_market, _para, _fee, _from, _to, _invalidAmount, _noAmount, _yesAmount);
    }

    function shareTransferInternal(
        IMarket _market,
        IParaShareToken _para,
        uint256 _fee,
        address _from,
        address _to,
        uint256 _invalidAmount,
        uint256 _noAmount,
        uint256 _yesAmount
    ) internal {
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

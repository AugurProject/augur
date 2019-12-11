pragma solidity 0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/reporting/IRepPriceOracle.sol';


contract RepPriceOracle is IRepPriceOracle, Initializable {

    IAugur public augur;
    address public cash;
    uint256 public tau = 1 days / 15; // The time period (in blocks) of the twa, assuming a block is mined every 15 seconds. TODO: Review this value
    IUniswapV2Factory public uniswapFactory;

    struct ExchangeData {
        IUniswapV2 exchange;
        uint256 cashAmount;
        uint256 repAmount;
        uint256 blockNumber;
        uint256 price;
    }

    mapping(address => ExchangeData) public exchangeData;

    uint256 public genesisInitialRepPriceinAttoCash = 9 * 10**18;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        cash = _augur.lookup("Cash");
        require(cash != address(0));
        uniswapFactory = IUniswapV2Factory(_augur.lookup("UniswapV2Factory"));
        require(uniswapFactory != IUniswapV2Factory(0));
    }

    // TODO: Consider when this should be called other than when the price is requested as part of new fee setting
    function pokeRepPriceInAttoCash(IV2ReputationToken _reputationToken) external returns (uint256) {
        if (exchangeData[address(_reputationToken)].exchange == IUniswapV2(0)) {
            initializeUniverse(_reputationToken);
        }
        ExchangeData memory _newExchangeData = calculateNewExchangeData(_reputationToken);
        exchangeData[address(_reputationToken)] = _newExchangeData;
        return _newExchangeData.price;
    }

    function getRepPriceInAttoCash(IV2ReputationToken _reputationToken) external view returns (uint256) {
        return calculateNewExchangeData(_reputationToken).price;
    }

    function calculateNewExchangeData(IV2ReputationToken _reputationToken) private view returns (ExchangeData memory) {
        ExchangeData memory _exchangeData = exchangeData[address(_reputationToken)];
        uint256 _blockNumber = block.number;
        if (_blockNumber == _exchangeData.blockNumber) {
            return _exchangeData;
        }

        IUniswapV2 _exchange = _exchangeData.exchange;
        // No fee has ever been calculated in this universe and this is being called in a view context. Just return the data with the initial price.
        if (_exchange == IUniswapV2(0)) {
            _exchangeData.price = getInitialPrice(_reputationToken);
            return _exchangeData;
        }
        (uint256 _token0Amount, uint256 _token1Amount) = _exchange.getReservesCumulative();
        if (_token0Amount == 0 || _token1Amount == 0) {
            return _exchangeData;
        }

        uint256 _cashAmount = cash < address(_reputationToken) ? _token0Amount : _token1Amount;
        uint256 _repAmount = cash < address(_reputationToken) ? _token1Amount : _token0Amount;

        uint256 _cashDelta = _cashAmount - _exchangeData.cashAmount;
        uint256 _repDelta = _repAmount - _exchangeData.repAmount;
        // TODO: This should not be possible normally. When the real Uniswap contracts are in this condition can be removed.
        if (_repDelta == 0) {
            return _exchangeData;
        }
        uint256 _deltaPrice = _cashDelta * 1 ether / _repDelta;

        uint256 _weight = getWeight(_blockNumber - _exchangeData.blockNumber);
        uint256 _price = (((1 ether - _weight) * _exchangeData.price) + (_weight * _deltaPrice)) / 1 ether;

        _exchangeData.price = _price;
        _exchangeData.blockNumber = _blockNumber;
        _exchangeData.cashAmount = _cashAmount;
        _exchangeData.repAmount = _repAmount;

        return _exchangeData;
    }

    function getWeight(uint256 _blockDelta) public view returns (uint256) {
        uint256 _weight = _blockDelta * 1 ether / tau;
        if (_weight > 1 ether) {
            return 1 ether;
        }
        return _weight;
    }

    function initializeUniverse(IV2ReputationToken _reputationToken) private {
        exchangeData[address(_reputationToken)].exchange = getOrCreateUniswapExchange(_reputationToken);
        uint256 _initialPrice = getInitialPrice(_reputationToken);
        exchangeData[address(_reputationToken)].price = _initialPrice;
        exchangeData[address(_reputationToken)].blockNumber = block.number;
    }

    function getInitialPrice(IV2ReputationToken _reputationToken) private view returns (uint256) {
        IUniverse _parentUniverse = _reputationToken.getUniverse().getParentUniverse();
        uint256 _initialPrice = genesisInitialRepPriceinAttoCash;
        if (_parentUniverse != IUniverse(0)) {
            IV2ReputationToken _parentReputationToken = _parentUniverse.getReputationToken();
            _initialPrice = exchangeData[address(_parentReputationToken)].price;
        }
        return _initialPrice;
    }

    function getOrCreateUniswapExchange(IV2ReputationToken _reputationToken) public returns (IUniswapV2) {
        address _exchangeAddress = uniswapFactory.getExchange(cash, address(_reputationToken));
        if (_exchangeAddress == address(0)) {
            _exchangeAddress = uniswapFactory.createExchange(cash, address(_reputationToken));
        }
        return IUniswapV2(_exchangeAddress);
    }
}

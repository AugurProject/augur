pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/Augur.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/factories/IAugurWalletFactory.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract AccountLoader is Initializable {
    using SafeMathUint256 for uint256;

    struct AccountData {
        uint256 signerETH;
        uint256 signerDAI;
        uint256 signerREP;
        uint256 signerLegacyREP;
        uint256 walletETH;
        uint256 walletDAI;
        uint256 walletREP;
        uint256 walletLegacyREP;
        uint256 attoDAIperREP;
        uint256 attoDAIperETH;
    }

    IAugurWalletFactory public augurWalletFactory;
    IERC20 public cash;
    IERC20 public weth;
    IERC20 public legacyReputationToken;
    IUniswapV2Pair public ethExchange;
    bool public token0IsCashInETHExchange;
    IUniswapV2Factory public uniswapFactory;

    function initialize(Augur _augur, IAugurTrading _augurTrading) public beforeInitialized {
        endInitialization();
        cash = IERC20(_augur.lookup("Cash"));
        weth = IERC20(_augurTrading.lookup("WETH9"));
        augurWalletFactory = IAugurWalletFactory(_augurTrading.lookup("AugurWalletFactory"));
        legacyReputationToken =  IERC20(_augur.lookup("LegacyReputationToken"));

        uniswapFactory = IUniswapV2Factory(_augur.lookup("UniswapV2Factory"));

        // ETH / DAI Exchange
        address _ethExchangeAddress = uniswapFactory.getPair(address(weth), address(cash));
        if (_ethExchangeAddress == address(0)) {
            _ethExchangeAddress = uniswapFactory.createPair(address(weth), address(cash));
        }
        ethExchange = IUniswapV2Pair(_ethExchangeAddress);
        token0IsCashInETHExchange = ethExchange.token0() == address(cash);
    }

    function loadAccountData(address _account, IERC20 _reputationToken) public view returns (AccountData memory _data) {
        _data.signerETH = _account.balance;
        _data.signerDAI = cash.balanceOf(_account);
        _data.signerREP = _reputationToken.balanceOf(_account);
        _data.signerLegacyREP = legacyReputationToken.balanceOf(_account);

        address _wallet = augurWalletFactory.getCreate2WalletAddress(_account);
        _data.walletETH = _wallet.balance;
        _data.walletDAI = cash.balanceOf(_wallet);
        _data.walletREP = _reputationToken.balanceOf(_wallet);
        _data.walletLegacyREP = legacyReputationToken.balanceOf(_wallet);

        (uint256 _reserve0, uint256 _reserve1, uint32 _blockTimestampLast) = ethExchange.getReserves();
        if (_reserve0 > 0 && _reserve1 > 0) {
            _data.attoDAIperETH = token0IsCashInETHExchange ? _reserve0.mul(10**18).div(_reserve1) : _reserve1.mul(10**18).div(_reserve0);
        }

        address _repExchangeAddress = uniswapFactory.getPair(address(_reputationToken), address(cash));
        if (_repExchangeAddress != address(0)) {
            IUniswapV2Pair _repExchange = IUniswapV2Pair(_repExchangeAddress);
            (_reserve0, _reserve1, _blockTimestampLast) = _repExchange.getReserves();
            if (_reserve0 > 0 && _reserve1 > 0) {
                _data.attoDAIperREP = _repExchange.token0() == address(cash) ? _reserve0.mul(10**18).div(_reserve1) : _reserve1.mul(10**18).div(_reserve0);
            }
        }

        return _data;
    }
}

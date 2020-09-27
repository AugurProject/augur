pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/Augur.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract AccountLoader is Initializable {
    using SafeMathUint256 for uint256;

    struct AccountData {
        uint256 signerETH;
        uint256 signerDAI;
        uint256 signerREP;
        uint256 signerLegacyREP;
        uint256 attoDAIperREP;
        uint256 attoDAIperETH;
        uint256 attoDAIperUSDC;
        uint256 attoDAIperUSDT;
        uint256 attoETHperREP;
        uint256 attoETHperUSDC;
        uint256 attoETHperUSDT;
        uint256 attoREPperUSDC;
        uint256 attoREPperUSDT;
        uint256 attoUSDCperUSDT;
        uint256 signerUSDC;
        uint256 signerUSDT;
    }

    IERC20 public cash;
    IERC20 public weth;
    IERC20 public legacyReputationToken;
    IUniswapV2Factory public uniswapFactory;

    function initialize(Augur _augur, IAugurTrading _augurTrading) public beforeInitialized {
        endInitialization();
        cash = IERC20(_augur.lookup("Cash"));
        weth = IERC20(_augurTrading.lookup("WETH9"));
        legacyReputationToken =  IERC20(_augur.lookup("LegacyReputationToken"));

        uniswapFactory = IUniswapV2Factory(_augur.lookup("UniswapV2Factory"));
    }

    function loadAccountData(address _account, IERC20 _reputationToken, IERC20 _USDC, IERC20 _USDT) public view returns (AccountData memory _data) {
        _data.signerETH = _account.balance;
        _data.signerDAI = cash.balanceOf(_account);
        _data.signerREP = _reputationToken.balanceOf(_account);
        _data.signerLegacyREP = legacyReputationToken.balanceOf(_account);
        _data.signerUSDC = _USDC.balanceOf(_account);
        _data.signerUSDT = _USDT.balanceOf(_account);

        _data.attoDAIperREP = getExchangeRate(address(_reputationToken), address(cash));
        _data.attoDAIperETH = getExchangeRate(address(weth), address(cash));
        _data.attoDAIperUSDC = getExchangeRate(address(_USDC), address(cash));
        _data.attoDAIperUSDT = getExchangeRate(address(_USDT), address(cash));
        _data.attoETHperREP = getExchangeRate(address(_reputationToken), address(weth));
        _data.attoETHperUSDC = getExchangeRate(address(_USDC), address(weth));
        _data.attoETHperUSDT = getExchangeRate(address(_USDT), address(weth));
        _data.attoREPperUSDC = getExchangeRate(address(_USDC), address(_reputationToken));
        _data.attoREPperUSDT = getExchangeRate(address(_USDT), address(_reputationToken));
        _data.attoUSDCperUSDT = getExchangeRate(address(_USDT), address(_USDC));

        return _data;
    }

    function getExchangeRate(address _firstToken, address _secondToken) public view returns (uint256) {
        address _exchangeAddress = uniswapFactory.getPair(_firstToken, _secondToken);
        if (_exchangeAddress != address(0)) {
            IUniswapV2Pair _exchange = IUniswapV2Pair(_exchangeAddress);
            (uint256 _reserve0, uint256 _reserve1, uint256 _blockTimestampLast) = _exchange.getReserves();
            if (_reserve0 > 0 && _reserve1 > 0) {
                return _exchange.token0() == _secondToken ? _reserve0.mul(10**18).div(_reserve1) : _reserve1.mul(10**18).div(_reserve0);
            }
        }
    }
}

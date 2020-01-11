pragma solidity 0.5.15;

import "ROOT/Augur.sol";
import "ROOT/ICPExchange.sol";
import "ROOT/CashSender.sol";
import "ROOT/libraries/token/IERC20.sol";
import "ROOT/libraries/token/VariableSupplyToken.sol";
import "ROOT/libraries/Initializable.sol";
import "ROOT/libraries/ReentrancyGuard.sol";
import "ROOT/libraries/math/SafeMathUint256.sol";


contract CPExchange is Initializable, ReentrancyGuard, VariableSupplyToken, CashSender {
    using SafeMathUint256  for uint256;

    string constant public name = "Constant Product Exchange";
    string constant public symbol = "CPE";

    IAugur public augur;
    address public token;
    IERC20 public cash;

    uint256 public tokenReserve;
    uint256 public cashReserve;
    uint256 public blockNumberLast;
    uint256 public tokenPriceCumulativeLast;
    uint256 public cashPriceCumulativeLast;

    uint256 private invariantLast;

    event Mint(address indexed sender, uint256 tokenAmount, uint256 cashAmount);
    event Burn(address indexed sender, uint256 tokenAmount, uint256 cashAmount, address indexed to);
    event Swap(address indexed sender, address indexed tokenIn, uint256 amountIn, uint256 amountOut, address indexed to);
    event Sync(uint256 tokenReserve, uint256 cashReserve);

    // TODO: Abstract transferToken
    function transferToken(address _to, uint256 _value) private {
        if (token == address(0)) {
            address payable _payable = address(uint160(_to));
            _payable.transfer(_value);
        } else {
            IV2ReputationToken(token).transfer(_to, _value);
        }
    }

    // TODO: Abstract getTokenBalance()
    function getTokenBalance() private returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        }
        return IERC20(token).balanceOf(address(this));
    }

    function transferCash(address _to, uint _value) private {
        cashTransfer(_to, _value);
    }

    function getCashBalance() public returns (uint256) {
        return cash.balanceOf(address(this));
    }

    function initialize(address _augurAddress, address _token) public beforeInitialized {
        endInitialization();
        IAugur _augur = IAugur(_augurAddress);
        augur = _augur;
        cash = IERC20(_augur.lookup("Cash"));
        require(cash != IERC20(0));
        token = _token;

        initializeCashSender(_augur.lookup("DaiVat"), address(cash));
    }

    function update(uint256 _tokenBalance, uint256 _cashBalance) private {
        uint256 _blockNumber = block.number;
        uint256 _blocksElapsed = _blockNumber - blockNumberLast;
        uint256 _cashReserve = cashReserve;
        uint256 _tokenReserve = tokenReserve;
        if (_tokenReserve != 0 && _cashReserve != 0 && _blocksElapsed > 0) {
            // cannot reasonably overflow unless the supply of Cash, REP, or ETH became several OOM larger
            tokenPriceCumulativeLast += _cashReserve.mul(10**18).mul(_blocksElapsed).div(_tokenReserve);
            cashPriceCumulativeLast += _tokenReserve.mul(10**18).mul(_blocksElapsed).div(_cashReserve);
        }
        tokenReserve = _tokenBalance;
        cashReserve = _cashBalance;
        blockNumberLast = _blockNumber;
        emit Sync(_tokenBalance, _cashBalance);
    }

    function publicMint(address _to) external nonReentrant returns (uint256 _liquidity) {
        uint256 _tokenBalance = getTokenBalance();
        uint256 _cashBalance = getCashBalance();
        uint256 _tokenReserve = tokenReserve;
        uint256 _cashReserve = cashReserve;
        uint256 _tokenAmount = _tokenBalance.sub(_tokenReserve);
        uint256 _cashAmount = _cashBalance.sub(_cashReserve);

        _liquidity = totalSupply == 0 ?
            _tokenAmount.mul(_cashAmount).sqrt() :
            (_tokenAmount.mul(totalSupply) / _tokenReserve).min(_cashAmount.mul(totalSupply) / _cashReserve);
        require(_liquidity > 0, "Insufficient liquidity");
        mint(_to, _liquidity);

        update(_tokenBalance, _cashBalance);
        emit Mint(msg.sender, _tokenAmount, _cashAmount);
    }

    function publicBurn(address _to) external nonReentrant returns (uint256 _tokenAmount, uint256 _cashAmount) {
        uint256 _liquidity = balances[address(this)];

        // there's a funny case here where if a token deflates uniswap's balance, we give too many tokens...
        _tokenAmount = _liquidity.mul(tokenReserve) / totalSupply;
        _cashAmount = _liquidity.mul(cashReserve) / totalSupply;
        require(_tokenAmount > 0 && _cashAmount > 0, "Insufficient liquidity");
        transferToken(_to, _tokenAmount);
        transferCash(_to, _cashAmount);
        burn(address(this), _liquidity);

        update(getTokenBalance(), getCashBalance());
        emit Burn(msg.sender, _tokenAmount, _cashAmount, _to);
    }

    function getInputPrice(uint256 _inputAmount, uint256 _inputReserve, uint256 _outputReserve) public pure returns (uint256) {
        require(_inputReserve > 0 && _outputReserve > 0, "inputReserve & outputReserve must be > 0");
        uint256 _amountInputWithFee = _inputAmount.mul(997);
        uint256 _numerator = _amountInputWithFee.mul(_outputReserve);
        uint256 _denominator = _inputReserve.mul(1000).add(_amountInputWithFee);
        return _numerator / _denominator;
    }

    // TODO: abstract
    function autoSellToken(address _recipient, uint256 _tokenAmount) external payable returns (uint256 _cashAmount) {
        if (token != address(0)) {
            IV2ReputationToken(token).trustedREPExchangeTransfer(msg.sender, address(this), _tokenAmount);
        }
        sellToken(_recipient);
    }

    function sellToken(address _recipient) public nonReentrant returns (uint _cashAmount) {
        uint256 _tokenBalance = getTokenBalance();
        uint256 _tokenAmount = _tokenBalance.sub(tokenReserve);

        _cashAmount = getInputPrice(_tokenAmount, tokenReserve, cashReserve);
        require(_cashAmount > 0, "cashAmount must be > 0");
        transferCash(_recipient, _cashAmount);

        update(_tokenBalance, getCashBalance());
        emit Swap(msg.sender, token, _tokenAmount, _cashAmount, _recipient);
    }

    function autoBuyToken(address _recipient, uint256 _cashAmount) external returns (uint256 _tokenAmount) {
        augur.trustedCashTransfer(msg.sender, address(this), _cashAmount);
        buyToken(_recipient);
    }

    function buyToken(address _recipient) public nonReentrant returns (uint256 _tokenAmount) {
        uint256 _cashBalance = getCashBalance();
        uint256 _cashAmount = _cashBalance.sub(cashReserve);

        _tokenAmount = getInputPrice(_cashAmount, cashReserve, tokenReserve);
        require(_tokenAmount > 0, "tokenAmount must be > 0");
        transferToken(_recipient, _tokenAmount);

        update(getTokenBalance(), _cashBalance);
        emit Swap(msg.sender, address(cash), _cashAmount, _tokenAmount, _recipient);
    }

    // force balances to match reserves
    function skim(address to) external nonReentrant {
        transferToken(to, getTokenBalance().sub(tokenReserve));
        transferCash(to, getCashBalance().sub(cashReserve));
    }

    // force reserves to match balances
    function sync() external nonReentrant {
        update(getTokenBalance(), getCashBalance());
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
    }

    function onMint(address _target, uint256 _amount) internal {
    }

    function onBurn(address _target, uint256 _amount) internal {
    }
}
pragma solidity 0.5.15;

import 'ROOT/gsn/v1/RLPReader.sol';
import 'ROOT/gsn/v1/GSNRecipient.sol';
import 'ROOT/gsn/v1/IRelayHub.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/IAugurWallet.sol';
import 'ROOT/AugurWallet.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/LibBytes.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/uniswap/interfaces/IWETH.sol';
import 'ROOT/factories/IAugurWalletFactory.sol';


contract AugurWalletRegistry is Initializable, GSNRecipient {
    using LibBytes for bytes;
    using ContractExists for address;

    using SafeMathUint256  for uint256;

    enum GSNRecipientERC20FeeErrorCodes {
        OK,
        TX_COST_TOO_HIGH,
        INSUFFICIENT_BALANCE
    }

    event ExecuteTransactionStatus(bool success, bool fundingSuccess);

    IAugur public augur;
    IAugurTrading public augurTrading;

    IERC20 public cash;
    IUniswapV2Pair public ethExchange;
    IWETH public WETH;
    bool public token0IsCash;
    IAugurWalletFactory public augurWalletFactory;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    uint256 private constant MAX_TX_FEE_IN_ETH = 10**17;

    function initialize(IAugur _augur, IAugurTrading _augurTrading) public payable beforeInitialized returns (bool) {
        require(msg.value >= MAX_TX_FEE_IN_ETH, "Must provide initial Max TX Fee Deposit");
        endInitialization();
        augur = _augur;
        cash = IERC20(_augur.lookup("Cash"));

        augurTrading = _augurTrading;
        WETH = IWETH(_augurTrading.lookup("WETH9"));
        augurWalletFactory = IAugurWalletFactory(_augurTrading.lookup("AugurWalletFactory"));
        IUniswapV2Factory _uniswapFactory = IUniswapV2Factory(_augur.lookup("UniswapV2Factory"));
        address _ethExchangeAddress = _uniswapFactory.getPair(address(WETH), address(cash));
        if (_ethExchangeAddress == address(0)) {
            _ethExchangeAddress = _uniswapFactory.createPair(address(WETH), address(cash));
        }
        ethExchange = IUniswapV2Pair(_ethExchangeAddress);
        token0IsCash = ethExchange.token0() == address(cash);

        IRelayHub(getHubAddr()).depositFor.value(address(this).balance)(address(this));
        return true;
    }

    function acceptRelayedCall(
        address,
        address _from,
        bytes calldata _encodedFunction,
        uint256,
        uint256,
        uint256,
        uint256,
        bytes calldata,
        uint256 _maxPossibleCharge
    )
        external
        view
        returns (uint256 _reason, bytes memory _context)
    {
        // executeWalletTransaction is the only encodedFunction that can succesfully be called through the relayHub
        uint256 _payment = getPaymentFromEncodedFunction(_encodedFunction);
        GSNRecipientERC20FeeErrorCodes _code = getAcceptRelayCallStatus(_from, _payment, _maxPossibleCharge);
        if (_code != GSNRecipientERC20FeeErrorCodes.OK) {
            return _rejectRelayedCall(uint256(_code));
        }
        uint256 _initialEth = address(this).balance;
        return _approveRelayedCall(abi.encode(_from, _initialEth));
    }

    function getPaymentFromEncodedFunction(bytes memory _encodedFunction) private pure returns (uint256) {
        bytes memory _encodedFunctionParams = _encodedFunction.sliceDestructive(4, _encodedFunction.length);
        (address _to, bytes memory _data, uint256 _value, uint256 _payment, address _affilate, bytes32 _fingerprint) = abi.decode(_encodedFunctionParams, (address, bytes, uint256, uint256, address, bytes32));
        return _payment;
    }

    function getAcceptRelayCallStatus(address _from, uint256 _payment, uint256 _maxPossibleCharge) private view returns (GSNRecipientERC20FeeErrorCodes _code) {
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = ethExchange.getReserves();
        uint256 _maxDaiNeeded = getAmountIn(_maxPossibleCharge, token0IsCash ? _reserve0 : _reserve1, token0IsCash ? _reserve1 : _reserve0);
        if (_maxDaiNeeded > _payment) {
            return GSNRecipientERC20FeeErrorCodes.TX_COST_TOO_HIGH;
        }
        if (cash.balanceOf(getCreate2WalletAddress(_from)) < _payment) {
            return GSNRecipientERC20FeeErrorCodes.INSUFFICIENT_BALANCE;
        }
        return GSNRecipientERC20FeeErrorCodes.OK;
    }

    function _preRelayedCall(bytes memory _context) internal returns (bytes32) { }

    function _postRelayedCall(bytes memory _context, bool, uint256 _actualCharge, bytes32) internal {
        (address _from, uint256 _initialEth) = abi.decode(_context, (address, uint256));

        // Refund any excess ETH paid back to the wallet
        uint256 _ethPaid = address(this).balance.sub(_initialEth);
        uint256 _ethRefund = _ethPaid.sub(_actualCharge);
        (bool _success,) = address(_from).call.value(_ethRefund)("");
        require(_success);

        // Top off Relay Hub balance with whatever ETH we have
        uint256 _depositAmount = address(this).balance;
        _depositAmount = _depositAmount.min(2 ether); // This is the maximum single RelayHub deposit
        IRelayHub(getHubAddr()).depositFor.value(_depositAmount)(address(this));
    }

    function getEthFromWallet(IAugurWallet _wallet, uint256 _cashAmount) private {
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = ethExchange.getReserves();
        uint256 _ethAmount = getAmountOut(_cashAmount, token0IsCash ? _reserve0 : _reserve1, token0IsCash ? _reserve1 : _reserve0);
        _wallet.transferCash(address(ethExchange), _cashAmount);
        ethExchange.swap(token0IsCash ? 0 : _ethAmount, token0IsCash ? _ethAmount : 0, address(this), "");
        WETH.withdraw(_ethAmount);
    }

    // Returns whether the signer eth balance was funded as desired
    function fundMsgSender(uint256 _desiredSignerBalance, uint256 _maxExchangeRateInDai) private returns (bool) {
        address _msgSender = address(_msgSender());
        IAugurWallet _wallet = getWallet(_msgSender);
        uint256 _msgSenderBalance = _msgSender.balance;
        if (_msgSenderBalance >= _desiredSignerBalance) {
            return true;
        }
        uint256 _ethDelta = _desiredSignerBalance - _msgSenderBalance;
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = ethExchange.getReserves();
        uint256 _cashAmount = getAmountIn(_ethDelta, token0IsCash ? _reserve0 : _reserve1, token0IsCash ? _reserve1 : _reserve0);
        uint256 _exchangeRate = _cashAmount.mul(10**18).div(_ethDelta);
        if (_maxExchangeRateInDai < _exchangeRate) {
            return false;
        }
        _wallet.transferCash(address(ethExchange), _cashAmount);
        ethExchange.swap(token0IsCash ? 0 : _ethDelta, token0IsCash ? _ethDelta : 0, address(this), "");
        WETH.withdraw(_ethDelta);
        (bool _success,) = _msgSender.call.value(_ethDelta)("");
        return _success;
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        require(amountIn > 0);
        require(reserveIn > 0 && reserveOut > 0);
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) public pure returns (uint amountIn) {
        require(amountOut > 0);
        require(reserveIn > 0 && reserveOut > 0);
        uint numerator = reserveIn.mul(amountOut).mul(1000);
        uint denominator = reserveOut.sub(amountOut).mul(997);
        amountIn = (numerator / denominator).add(1);
    }

    function createAugurWallet(address _referralAddress, bytes32 _fingerprint) private returns (IAugurWallet) {
        return augurWalletFactory.createAugurWallet(_msgSender(), _referralAddress, _fingerprint);
    }

    function getCreate2WalletAddress(address _owner) public view returns (address) {
        return augurWalletFactory.getCreate2WalletAddress(_owner);
    }

/**
     * @notice Get the Wallet for the given account
     * @param _account The account to look up
     * @return IAugurWallet for the account or 0x if none exists
     */
    function getWallet(address _account) public view returns (IAugurWallet) {
        address _walletAddress = getCreate2WalletAddress(_account);
        if (!_walletAddress.exists()) {
            return IAugurWallet(0);
        }
        return IAugurWallet(_walletAddress);
    }

    // 1. Create a user's wallet if it does not exist
    // 2. Get funds from the wallet to compensate this contract for paying the relayer
    // 3. Execute the transaction and return success status, or revert if appropriate
    // 4. Fund the signer with ETH as specified
    function executeWalletTransaction(address _to, bytes calldata _data, uint256 _value, uint256 _payment, address _referralAddress, bytes32 _fingerprint, uint256 _desiredSignerBalance, uint256 _maxExchangeRateInDai, bool _revertOnFailure) external {
        address _user = _msgSender();
        IAugurWallet _wallet = getWallet(_user);
        if (_wallet == IAugurWallet(0)) {
            _wallet = createAugurWallet(_referralAddress, _fingerprint);
        }
        // If the user is having this sent via relay we need to reimburse this contract for paying the relayer. We do the payment here to avoid hard coded gas stipend problems in GSN V1
        if (_user != msg.sender) {
            getEthFromWallet(_wallet, _payment);
        }
        bool _success = _wallet.executeTransaction(_to, _data, _value);
        // We need to be able to fail in order to get accurate gas estimates. We only allow this however when not using the relayhub since otherwise funds could be drained this way
        if (_user == msg.sender && _revertOnFailure) {
            require(_success, "Transaction Execution Failed");
        }
        // We keep the signing account's ETH balance funded up to an offchain provided value so it can send txs itself without the use of a relay
        bool _fundingSuccess = fundMsgSender(_desiredSignerBalance, _maxExchangeRateInDai);
        emit ExecuteTransactionStatus(_success, _fundingSuccess);
    }

    function getRelayMessageHash(
        address relay,
        address from,
        address to,
        bytes memory encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce) public view returns (bytes32) {
        bytes memory packed = abi.encodePacked("rlx:", from, to, encodedFunction, transactionFee, gasPrice, gasLimit, nonce, getHubAddr());
        return keccak256(abi.encodePacked(packed, relay));
    }

    function () external payable {}
}
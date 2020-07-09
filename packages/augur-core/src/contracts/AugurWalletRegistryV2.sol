pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/gsn/v2/BaseRelayRecipient.sol';
import 'ROOT/gsn/v2/BasePaymaster.sol';
import 'ROOT/gsn/v2/Forwarder.sol';
import 'ROOT/gsn/v2/interfaces/IRelayHub.sol';
import 'ROOT/gsn/v2/interfaces/ISignatureVerifier.sol';
import 'ROOT/gsn/v2/interfaces/IPaymaster.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/IAugurWallet.sol';
import 'ROOT/AugurWallet.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IAffiliates.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/LibBytes.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/uniswap/interfaces/IWETH.sol';
import 'ROOT/factories/IAugurWalletFactory.sol';


contract AugurWalletRegistryV2 is Initializable, BaseRelayRecipient, Forwarder {
    using LibBytes for bytes;
    using ContractExists for address;

    using SafeMathUint256  for uint256;

    event ExecuteTransactionStatus(bool success, bool fundingSuccess);

    string public versionRecipient = "augur-wallet-registry-2";

    IRelayHub internal relayHub;

    IAugur public augur;
    IAugurTrading public augurTrading;

    IERC20 public cash;

    IUniswapV2Pair public ethExchange;
    IWETH public WETH;
    bool public token0IsCash;
    IAugurWalletFactory public augurWalletFactory;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;
    uint256 private constant MAX_TX_FEE_IN_ETH = 10**17;
    uint256 private constant POST_RELAY_GAS_COST = 200000;

    // Gas stipends for acceptRelayedCall, preRelayedCall and postRelayedCall
    uint256 constant private ACCEPT_RELAYED_CALL_GAS_LIMIT = 75000;
    uint256 constant private PRE_RELAYED_CALL_GAS_LIMIT = 5000;
    uint256 constant private POST_RELAYED_CALL_GAS_LIMIT = 200000;

    modifier relayHubOnly() {
        require(msg.sender == getHubAddr(), "Function can only be called by RelayHub");
        _;
    }

    function initialize(IAugur _augur, IAugurTrading _augurTrading) public payable beforeInitialized returns (bool) {
        require(msg.value >= MAX_TX_FEE_IN_ETH, "Must provide initial Max TX Fee Deposit");
        endInitialization();
        augur = _augur;
        trustedForwarder = address(this);
        relayHub = IRelayHub(_augurTrading.lookup("RelayHubV2"));
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

        relayHub.depositFor.value(address(this).balance)(address(this));
        return true;
    }

    function getGasLimits() external pure returns (IPaymaster.GasLimits memory limits) {
        return IPaymaster.GasLimits(
            ACCEPT_RELAYED_CALL_GAS_LIMIT,
            PRE_RELAYED_CALL_GAS_LIMIT,
            POST_RELAYED_CALL_GAS_LIMIT
        );
    }

    function getHubAddr() public view returns (address) {
        return address(relayHub);
    }

    function acceptRelayedCall(GsnTypes.RelayRequest memory relayRequest, bytes memory signature, bytes memory approvalData, uint256 maxPossibleGas) public view returns (bytes memory context) {
        (approvalData);
        GsnEip712Library.verify(relayRequest, signature);
        // executeWalletTransaction is the only encodedFunction that can succesfully be called through the relayHub
        uint256 _payment = getPaymentFromEncodedFunction(relayRequest.request.data);
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = ethExchange.getReserves();
        uint256 _maxDaiNeeded = getAmountIn(maxPossibleGas, token0IsCash ? _reserve0 : _reserve1, token0IsCash ? _reserve1 : _reserve0);
        require(_payment > _maxDaiNeeded, "Transaction cost too high");
        address _walletAddress = getCreate2WalletAddress(relayRequest.request.from);
        require(_payment <= cash.balanceOf(_walletAddress), "Insufficient balance");
        return abi.encode(_walletAddress, _payment);
    }

    function getPaymentFromEncodedFunction(bytes memory _encodedFunction) private pure returns (uint256) {
        bytes memory _encodedFunctionParams = _encodedFunction.sliceDestructive(4, _encodedFunction.length);
        (address _to, bytes memory _data, uint256 _value, uint256 _payment, address _affilate, bytes32 _fingerprint) = abi.decode(_encodedFunctionParams, (address, bytes, uint256, uint256, address, bytes32));
        return _payment;
    }

    function preRelayedCall(bytes calldata context) external pure returns (bool) {
        return true;
    }

    function postRelayedCall(bytes calldata context, bool success, bytes32 preRetVal, uint256 gasUseWithoutPost, GsnTypes.RelayData calldata relayData) external relayHubOnly returns (bool) {
        (success, preRetVal);
        (address _walletAddress, uint256 _payment) = abi.decode(context, (address, uint256));

        uint256 _ethActualCharge = relayHub.calculateCharge(gasUseWithoutPost + POST_RELAY_GAS_COST, relayData);
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = ethExchange.getReserves();
        uint256 _tokenActualCharge = getAmountIn(_ethActualCharge, token0IsCash ? _reserve0 : _reserve1, token0IsCash ? _reserve1 : _reserve0);

        // Refund payer excess Cash
        cash.transfer(_walletAddress, _payment - _tokenActualCharge);

        // Get ETH with our Cash balance from Uniswap
        uint256 _cashBalance = cash.balanceOf(address(this));
        uint256 _ethReceived = getAmountOut(_cashBalance, token0IsCash ? _reserve0 : _reserve1, token0IsCash ? _reserve1 : _reserve0);
        cash.transfer(address(ethExchange), _cashBalance);
        ethExchange.swap(token0IsCash ? 0 : _ethReceived, token0IsCash ? _ethReceived : 0, address(this), "");
        WETH.withdraw(_ethReceived);

        // Top off Relay Hub balance with whatever ETH we have
        uint256 _depositAmount = address(this).balance;
        _depositAmount = _depositAmount.min(2 ether); // This is the maximum single RelayHub deposit
        relayHub.depositFor.value(_depositAmount)(address(this));

        return true;
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
        // If the user is having this sent via relay we need to reimburse this contract for paying the relayer. We do the payment here to avoid complexity handling the wallet not existing in the pre relay call
        if (_user != msg.sender) {
            _wallet.transferCash(address(this), _payment);
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

    /// check current deposit on relay hub.
    function getRelayHubDeposit() public view returns (uint) {
        return relayHub.balanceOf(address(this));
    }

    function () external payable {}
}
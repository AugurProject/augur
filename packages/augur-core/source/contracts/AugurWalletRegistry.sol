pragma solidity 0.5.15;

import 'ROOT/gsn/RLPReader.sol';
import 'ROOT/gsn/GSNRecipient.sol';
import 'ROOT/gsn/IRelayHub.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/IAugurWallet.sol';
import 'ROOT/AugurWallet.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IAffiliates.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/LibBytes.sol';


contract AugurWalletRegistry is Initializable, GSNRecipient {
    using LibBytes for bytes;

    using SafeMathUint256  for uint256;

    enum GSNRecipientERC20FeeErrorCodes {
        OK,
        TX_COST_TOO_HIGH,
        INSUFFICIENT_BALANCE
    }

    event ExecuteTransactionStatus(bool success);

    mapping (address => IAugurWallet) public wallets;

    IAugur public augur;
    IAugurTrading public augurTrading;

    IERC20 public cash;
    address public affiliates;
    address public shareToken;
    address public createOrder;
    address public fillOrder;
    address public zeroXTrade;

    ISimpleDex public ethExchange;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    uint256 private constant MAX_TX_FEE_IN_ETH = 10**17;

    function initialize(IAugur _augur, IAugurTrading _augurTrading) public payable beforeInitialized returns (bool) {
        require(msg.value >= MAX_TX_FEE_IN_ETH, "Must provide initial Max TX Fee Deposit");
        endInitialization();
        augur = _augur;
        cash = IERC20(_augur.lookup("Cash"));
        affiliates = augur.lookup("Affiliates");
        shareToken = augur.lookup("ShareToken");

        augurTrading = _augurTrading;
        createOrder = _augurTrading.lookup("CreateOrder");
        fillOrder = _augurTrading.lookup("FillOrder");
        zeroXTrade = _augurTrading.lookup("ZeroXTrade");
        ethExchange = ISimpleDex(_augur.lookup("EthExchange"));
        require(ethExchange != ISimpleDex(0));

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
        uint256 _maxDaiNeeded = ethExchange.getTokenPurchaseCost(_maxPossibleCharge);
        if (_maxDaiNeeded > _payment) {
            return GSNRecipientERC20FeeErrorCodes.TX_COST_TOO_HIGH;
        }
        if (cash.balanceOf(getCreate2WalletAddress(_from)) < _maxDaiNeeded) {
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
        (bool _success,) = address(wallets[_from]).call.value(_ethRefund)("");
        require(_success);

        // Top off Relay Hub balance with whatever ETH we have
        uint256 _depositAmount = address(this).balance;
        _depositAmount = _depositAmount.min(2 ether); // This is the maximum single RelayHub deposit
        IRelayHub(getHubAddr()).depositFor.value(_depositAmount)(address(this));
    }

    function getEthFromWallet(IAugurWallet _wallet, uint256 _cashAmount) private {
        uint256 _ethAmount = ethExchange.getCashSaleProceeds(_cashAmount);
        // If the wallet has sufficient ETH just make it send it to us, otherwise do a swap using its Cash
        if (address(_wallet).balance >= _ethAmount) {
            _wallet.giveRegistryEth(_ethAmount);
            return;
        }
        _wallet.transferCash(address(ethExchange), _cashAmount);
        ethExchange.buyToken(address(this));
    }

    function createAugurWallet(address _referralAddress, bytes32 _fingerprint) private returns (IAugurWallet) {
        // Create2 creation of wallet based on msg.sender
        address _owner = _msgSender();
        if (wallets[_owner] != IAugurWallet(0)) {
            return wallets[_owner];
        }
        address _walletAddress;
        {
            bytes32 _salt = keccak256(abi.encodePacked(_owner));
            bytes memory _deploymentData = abi.encodePacked(type(AugurWallet).creationCode);
            assembly {
                _walletAddress := create2(0x0, add(0x20, _deploymentData), mload(_deploymentData), _salt)
                if iszero(extcodesize(_walletAddress)) {
                    revert(0, 0)
                }
            }
        }
        IAugurWallet _wallet = IAugurWallet(_walletAddress);
        _wallet.initialize(_owner, _referralAddress, _fingerprint, address(augur), cash, IAffiliates(affiliates), IERC1155(shareToken), createOrder, fillOrder, zeroXTrade);
        wallets[_owner] = _wallet;
        return _wallet;
    }

    function getCreate2WalletAddress(address _owner) public view returns (address) {
        bytes1 _const = 0xff;
        bytes32 _salt = keccak256(abi.encodePacked(_owner));
        return address(uint160(uint256(keccak256(abi.encodePacked(
            _const,
            address(this),
            _salt,
            keccak256(abi.encodePacked(type(AugurWallet).creationCode))
        )))));
    }

    /**
     * @notice Get the registered Wallet for the given account
     * @param _account The account to look up
     * @return IAugurWallet for the account or 0x if none is registered
     */
    function getWallet(address _account) public view returns (IAugurWallet) {
        return wallets[_account];
    }

    function executeWalletTransaction(address _to, bytes memory _data, uint256 _value, uint256 _payment, address _referralAddress, bytes32 _fingerprint) public {
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
        // If the transaction is being executed directly we fail if the execution failed. If its being done via relay we do not fail so that payment still occurs.
        if (_user == msg.sender) {
            require(_success);
        }
        emit ExecuteTransactionStatus(_success);
    }

    function walletTransferedOwnership(address _oldOwner, address _newOwner) external {
        require(wallets[_newOwner] == IAugurWallet(0));
        IAugurWallet _wallet = IAugurWallet(_msgSender());
        require(_wallet == wallets[_oldOwner]);
        wallets[_oldOwner] = IAugurWallet(0);
        wallets[_newOwner] = _wallet;
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
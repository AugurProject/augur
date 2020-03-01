pragma solidity 0.5.15;

import 'ROOT/gsn/GSNRecipient.sol';
import 'ROOT/gsn/IRelayHub.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/IAugurWallet.sol';
import 'ROOT/AugurWallet.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/external/IGnosisSafe.sol';
import 'ROOT/external/IProxyFactory.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/external/IProxy.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IAffiliates.sol';


contract AugurWalletRegistry is Initializable, GSNRecipient {
    enum GSNRecipientERC20FeeErrorCodes {
        INSUFFICIENT_BALANCE
    }

    mapping (address => IAugurWallet) public wallets;
    // The intent of the mapping below is to prevent a catastrophicly large fee. With a cap on potential gains for a malicious part set at some reasonable relatively high level the cost to manioulate the exchange in order to get this payoff should be higher than worth it.
    mapping (address => uint256) public maxDaiTransactionFee;

    IAugur public augur;
    IAugurTrading public augurTrading;
    bytes32 public proxyCodeHash;
    bytes32 public deploymentData;
    address public gnosisSafeMasterCopy;
    IProxyFactory public proxyFactory;

    IERC20 public cash;
    address public affiliates;
    address public shareToken;
    address public createOrder;
    address public fillOrder;
    address public zeroXTrade;

    ISimpleDex public ethExchange;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    function initialize(IAugur _augur, IAugurTrading _augurTrading) public beforeInitialized returns (bool) {
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
        return true;
    }

    function acceptRelayedCall(
        address,
        address _from,
        bytes calldata,
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
        uint256 _maxDaiNeeded = ethExchange.getTokenPurchaseCost(_maxPossibleCharge); // TODO Apply slippage from approvalData
        address _walletAddress = getCreate2WalletAddress(_from);
        // TODO if Wallet
        // TODO check approval
        // TODO uint256 _maxDaiTxFee = maxDaiTransactionFee[_from]; // TODO Should be from approvalData
        // TODO require(_cost <= _maxDaiTxFee, "Cost of purchasing ETH to cover TX Fee on the exchange was too high");
        if (cash.balanceOf(_walletAddress) < _maxDaiNeeded) {
            return _rejectRelayedCall(uint256(GSNRecipientERC20FeeErrorCodes.INSUFFICIENT_BALANCE));
        }
        return _approveRelayedCall(abi.encode(_from));
    }

    function _preRelayedCall(bytes memory _context) internal returns (bytes32) {
        IRelayHub(getHubAddr()).depositFor.value(address(this).balance)(address(this));
    }

    function _postRelayedCall(bytes memory _context, bool, uint256 _actualCharge, bytes32) internal {
        (address _from) = abi.decode(_context, (address));

        // After the relayed call has been executed and the actual charge estimated we reimburse the relay hub for this contract from the senders wallet. This does not top off the hub as we have a limited gas stipend. Instead that is done in pre-relay calls.
        IAugurWallet _wallet = getWallet(_from);
        uint256 _cost = ethExchange.getTokenPurchaseCost(_actualCharge);
        cash.transferFrom(address(_wallet), address(ethExchange), _cost);
        ethExchange.buyToken(address(this));
    }

    function createAugurWallet(address _referralAddress, bytes32 _fingerprint) public returns (address) {
        // Create2 creation of wallet based on msg.sender
        address _owner = _msgSender();
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
        _wallet.initialize(_referralAddress, _fingerprint, address(augur), cash, IAffiliates(affiliates), IERC1155(shareToken), createOrder, fillOrder, zeroXTrade);
        wallets[_owner] = _wallet;
        return _walletAddress;
        // TODO augurTrading.logGnosisSafeRegistered(address(_wallet), _owner);
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

    function executeWalletTransaction(address _to, bytes memory _data, uint256 _value) public {
        address _user = _msgSender();
        IAugurWallet _wallet = getWallet(_user);
        _wallet.executeTransaction(_to, _data, _value);
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
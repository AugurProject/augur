pragma solidity 0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/external/IGnosisSafe.sol';
import 'ROOT/external/IProxyFactory.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/external/IProxy.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IAffiliates.sol';


contract GnosisSafeRegistry is Initializable {
    // mapping of user to created safes. The first safe wins but we store additional safes in case a user somehow makes multiple. The current safe may be de-registered by itself and the current safe will simply become the next one in line
    mapping (address => IGnosisSafe[]) public accountSafes;
    mapping (address => uint256) public accountSafeIndexes;

    IAugur public augur;
    bytes32 public proxyCodeHash;
    address public gnosisSafeMasterCopy;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        gnosisSafeMasterCopy = _augur.lookup("GnosisSafe");
        require(gnosisSafeMasterCopy != address(0));
        IProxyFactory _proxyFactory = IProxyFactory(_augur.lookup("ProxyFactory"));
        proxyCodeHash = keccak256(_proxyFactory.proxyRuntimeCode());
        return true;
    }

    // The misdirection here is because this is called through a delegatecall execution initially. We just direct that into making an actual call to the register method
    function callRegister(address _gnosisSafeRegistry, address _augur, address _createOrder, address _fillOrder, IERC20 _cash, IERC1155 _shareToken, IAffiliates _affiliates, bytes32 _fingerprint, address _referralAddress) public {
        _cash.approve(_augur, MAX_APPROVAL_AMOUNT);

        _cash.approve(_createOrder, MAX_APPROVAL_AMOUNT);
        _shareToken.setApprovalForAll(_createOrder, true);

        _cash.approve(_fillOrder, MAX_APPROVAL_AMOUNT);
        _shareToken.setApprovalForAll(_fillOrder, true);

        GnosisSafeRegistry _gnosisSafeRegistry = GnosisSafeRegistry(_gnosisSafeRegistry);
        _gnosisSafeRegistry.register();

        _affiliates.setFingerprint(_fingerprint);

        if (_referralAddress != address(0)) {
            _affiliates.setReferrer(_referralAddress);
        }
    }

    function register() external {
        IGnosisSafe _safe = getAndValidateSafeFromSender();
        address[] memory _owners = _safe.getOwners();
        address _owner = _owners[0];
        accountSafes[_owner].push(_safe);
    }

    function deRegister() external {
        IGnosisSafe _safe = getAndValidateSafeFromSender();
        address[] memory _owners = _safe.getOwners();
        address _owner = _owners[0];
        require(_safe == getSafe(_owner), "Can only deRegister the current account safe");
        accountSafeIndexes[_owner] += 1;
    }

    function getAndValidateSafeFromSender() internal view returns (IGnosisSafe) {
        // Caller context is a proxy instance (proxy contract supposedly delegating to gnosisSafe master copy)
        IGnosisSafe _safe = IGnosisSafe(msg.sender);
        bytes32 _codeHash;
        assembly {
            _codeHash := extcodehash(_safe)
        }
        require(_codeHash == proxyCodeHash, "Safe instance does not match expected code hash of the Proxy contract");
        require(IProxy(msg.sender).masterCopy() == gnosisSafeMasterCopy, "Proxy master contract is not the Gnosis Safe");
        require(_safe.getThreshold() == 1, "Safe may only have a threshold of 1");
        address[] memory _owners = _safe.getOwners();
        require(_owners.length == 1, "Safe may only have 1 user");
        return _safe;
    }

    function getSafe(address _account) public view returns (IGnosisSafe) {
        uint256 accountSafeIndex = accountSafeIndexes[_account];
        if (accountSafes[_account].length < accountSafeIndex + 1) {
            return IGnosisSafe(0);
        }
        return accountSafes[_account][accountSafeIndex];
    }
}

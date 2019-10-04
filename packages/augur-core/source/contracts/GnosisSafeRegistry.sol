pragma solidity 0.5.10;

import 'ROOT/Augur.sol';
import 'ROOT/external/IGnosisSafe.sol';
import 'ROOT/external/IProxyFactory.sol';


contract GnosisSafeRegistry {
    // mapping of user to created safes. The first safe wins but we store additional safes in case a user accidentally makes multiple.
    mapping (address => IGnosisSafe[]) public accountSafes;

    IAugur public augur;
    bytes32 public proxyCodeHash;
    address public gnosisSafeMasterCopy;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    function initialize(IAugur _augur) public returns (bool) {
        augur = _augur;
        gnosisSafeMasterCopy = _augur.lookup("GnosisSafe");
        IProxyFactory _proxyFactory = IProxyFactory(_augur.lookup("ProxyFactory"));
        proxyCodeHash = keccak256(_proxyFactory.proxyRuntimeCode());
        return true;
    }

    // The misdirection here is because this is called through a delegatecall execution initially. We just direct that into making an actual call to the register method
    function callRegister(address _gnosisSafeRegistry, address _augur, IERC20 _cash) public {
        _cash.approve(_augur, MAX_APPROVAL_AMOUNT);
        GnosisSafeRegistry _gnosisSafeRegistry = GnosisSafeRegistry(_gnosisSafeRegistry);
        _gnosisSafeRegistry.register();
    }

    function register() external {
        // Caller context is a proxy instance (proxy contract supposedly delegating to gnosisSafe master copy)
        IGnosisSafe _safe = IGnosisSafe(msg.sender);
        bytes32 _codeHash;
        assembly {
            _codeHash := extcodehash(_safe)
        }
        require(_codeHash == proxyCodeHash, "Safe instance does not match expected code hash of the Proxy contract");
        // TODO: Below will not work in production currently as the proxy contract does not expose the masterCopy param
        require(_safe.masterCopy() == gnosisSafeMasterCopy, "Proxy master contract is not the Gnosis Safe");
        require(_safe.getThreshold() == 1, "Safe may only have a threshold of 1");
        address[] memory _owners = _safe.getOwners();
        require(_owners.length == 1, "Safe may only have 1 user");
        address _owner = _owners[0];
        accountSafes[_owner].push(_safe);
    }

    function getSafe(address _account) public view returns (IGnosisSafe) {
        if (accountSafes[_account].length < 1) {
            return IGnosisSafe(0);
        }
        return accountSafes[_account][0];
    }
}

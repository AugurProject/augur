pragma solidity 0.5.15;

import 'ROOT/libraries/Initializable.sol';
import 'ROOT/IAugurWallet.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IAffiliates.sol';
import 'ROOT/ISimpleDex.sol';

contract AugurWallet is Initializable, IAugurWallet {

    address public registry;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    function initialize(address _referralAddress, bytes32 _fingerprint, address _augur, IERC20 _cash, IAffiliates _affiliates, IERC1155 _shareToken, address _createOrder, address _fillOrder, address _zeroXTrade) external beforeInitialized {
        endInitialization();
        registry = msg.sender;

        _cash.approve(msg.sender, MAX_APPROVAL_AMOUNT);

        _cash.approve(_augur, MAX_APPROVAL_AMOUNT);

        _cash.approve(_createOrder, MAX_APPROVAL_AMOUNT);
        _shareToken.setApprovalForAll(_createOrder, true);

        _cash.approve(_fillOrder, MAX_APPROVAL_AMOUNT);
        _shareToken.setApprovalForAll(_fillOrder, true);

        _cash.approve(_zeroXTrade, MAX_APPROVAL_AMOUNT);

        _affiliates.setFingerprint(_fingerprint);

        if (_referralAddress != address(0)) {
            _affiliates.setReferrer(_referralAddress);
        }
    }

    function executeTransaction(address _to, bytes calldata _data, uint256 _value) external {
        require(msg.sender == registry);
        (bool _didSucceed, bytes memory _resultData) = address(_to).call.value(_value)(_data);
        require(_didSucceed);
    }
}
pragma solidity 0.5.15;

import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IAffiliates.sol';
import 'ROOT/ISimpleDex.sol';


interface IAugurWallet {
    function initialize(address _owner, address _referralAddress, bytes32 _fingerprint, address _augur, IERC20 _cash, IAffiliates _affiliates, IERC1155 _shareToken, address _createOrder, address _fillOrder, address _zeroXTrade) external;
    function transferCash(address _to, uint256 _amount) external;
    function giveRegistryEth(uint256 _amount) external;
    function executeTransaction(address _to, bytes calldata _data, uint256 _value) external returns (bool);
}
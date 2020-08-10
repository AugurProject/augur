pragma solidity 0.5.15;

import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155Nexus.sol';


contract IERC20Proxy1155 is IERC20 {
    uint8 constant public decimals = 18;

    uint256 public tokenId;
    IERC20Proxy1155Nexus nexus;

    function initialize(IERC20Proxy1155Nexus _nexus, uint256 _tokenId) public;
    function logApproval(address _owner, address _spender, uint256 _amount) public;
    function logTransfer(address _sender, address _recipient, uint256 _amount) public;
}

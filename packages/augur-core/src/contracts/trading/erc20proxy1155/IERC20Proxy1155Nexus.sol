pragma solidity 0.5.15;

import 'ROOT/reporting/IShareToken.sol';
import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155.sol';

// To use these ERC20s, the user will have to call
// setApprovalForAll(ERC20Proxy1155Nexus, true)
// on the ShareToken contract themselves.

contract IERC20Proxy1155Nexus {
    IShareToken public target1155;

    function newERC20(uint256 _tokenId) public returns (IERC20Proxy1155);

    function newERC20s(uint256[] memory _tokenIds) public returns (IERC20Proxy1155[] memory);

    function transfer(IERC20Proxy1155 _proxy, address _caller, address _to, uint256 _amount) public returns (bool);

    function transferFrom(IERC20Proxy1155 _proxy, address _caller, address _from, address _to, uint256 _amount) public returns (bool);

    function approve(IERC20Proxy1155 _proxy, address _caller, address _spender, uint256 _amount) public returns (bool);

    function allowance(IERC20Proxy1155 _proxy, address _owner, address _spender) public view returns (uint256);
}

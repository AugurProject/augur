pragma solidity 0.5.15;


import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155Nexus.sol';
import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155.sol';


contract ERC20Proxy1155 is IERC20Proxy1155 {
    function initialize(IERC20Proxy1155Nexus _nexus, uint256 _tokenId) public {
        require(nexus == IERC20Proxy1155Nexus(0));
        nexus = _nexus;
        tokenId = _tokenId;
    }

    function totalSupply() external view returns (uint256) {
        return nexus.target1155().totalSupply(tokenId);
    }

    function balanceOf(address _account) public view returns (uint256) {
        return nexus.target1155().balanceOf(_account, tokenId);
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        return nexus.transfer(this, msg.sender, _to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
        return nexus.transferFrom(this, msg.sender, _from, _to, _amount);
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        return nexus.approve(this, msg.sender, _spender, _amount);
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return nexus.allowance(this, _owner, _spender);
    }

    function logApproval(address _owner, address _spender, uint256 _amount) public {
        require(msg.sender == address(nexus));
        emit Approval(_owner, _spender, _amount);
    }

    function logTransfer(address _sender, address _recipient, uint256 _amount) public {
        require(msg.sender == address(nexus));
        emit Transfer(_sender, _recipient, _amount);
    }
}

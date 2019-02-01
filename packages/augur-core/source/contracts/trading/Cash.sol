pragma solidity 0.4.24;

import 'IAugur.sol';
import 'trading/ICash.sol';
import 'libraries/ITyped.sol';
import 'libraries/token/VariableSupplyToken.sol';


/**
 * @title Cash
 * @dev ETH wrapper contract to make it look like an ERC20Token token.
 */
contract Cash is ITyped, VariableSupplyToken, ICash {

    string constant public name = "Cash";
    string constant public symbol = "CASH";

    function initialize(IAugur _augur) public returns (bool) {
        erc820Registry = IERC820Registry(_augur.lookup("ERC820Registry"));
        initialize820InterfaceImplementations();
        return true;
    }

    function depositEther() external payable returns(bool) {
        mint(msg.sender, msg.value);
        assert(address(this).balance >= totalSupply());
        return true;
    }

    function depositEtherFor(address _to) external payable returns(bool) {
        mint(_to, msg.value);
        assert(address(this).balance >= totalSupply());
        return true;
    }

    function withdrawEther(uint256 _amount) external returns(bool) {
        withdrawEtherInternal(msg.sender, msg.sender, _amount);
        return true;
    }

    function withdrawEtherTo(address _to, uint256 _amount) external returns(bool) {
        withdrawEtherInternal(msg.sender, _to, _amount);
        return true;
    }

    function withdrawEtherInternal(address _from, address _to, uint256 _amount) private returns(bool) {
        require(_amount > 0 && _amount <= balances[_from]);
        burn(_from, _amount);
        _to.transfer(_amount);
        assert(address(this).balance >= totalSupply());
        return true;
    }

    function withdrawEtherToIfPossible(address _to, uint256 _amount) external returns (bool) {
        require(_amount > 0 && _amount <= balances[msg.sender]);
        if (_to.send(_amount)) {
            burn(msg.sender, _amount);
        } else {
            internalTransfer(msg.sender, _to, _amount, true);
        }
        assert(address(this).balance >= totalSupply());
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "Cash";
    }

    function onMint(address, uint256) internal returns (bool) {
        return true;
    }

    function onBurn(address, uint256) internal returns (bool) {
        return true;
    }

    function onTokenTransfer(address, address, uint256) internal returns (bool) {
        return true;
    }
}

pragma solidity 0.5.15;

import "ROOT/BaseSimpleDex.sol";


contract EthExchange is BaseSimpleDex {

    function initialize(address _augurAddress) public beforeInitialized {
        super.initialize(_augurAddress, address(0));
    }

    function transferToken(address _to, uint256 _value) private {
        address payable _payable = address(uint160(_to));
        _payable.transfer(_value);
    }

    function getTokenBalance() public returns (uint256) {
        return address(this).balance;
    }

    function autoSellToken(address _recipient, uint256 _tokenAmount) external payable returns (uint256 _cashAmount) {
        sellToken(_recipient);
    }

    function () external payable {
    }
}
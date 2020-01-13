pragma solidity 0.5.15;

import "ROOT/BaseSimpleDex.sol";
import "ROOT/reporting/IV2ReputationToken.sol";


contract RepExchange is BaseSimpleDex {

    function initialize(address _augurAddress, address _token) public beforeInitialized {
        super.initialize(_augurAddress, _token);

        // There is no trust given to this contract except for a particular instance per universe which is validated furing transfer so this is just for saftey from programmer error
        require(_token != address(0));
    }

    function transferToken(address _to, uint256 _value) private {
        IV2ReputationToken(token).transfer(_to, _value);
    }

    function getTokenBalance() public returns (uint256) {
        return IV2ReputationToken(token).balanceOf(address(this));
    }

    function autoSellToken(address _recipient, uint256 _tokenAmount) external payable returns (uint256 _cashAmount) {
        IV2ReputationToken(token).trustedREPExchangeTransfer(msg.sender, address(this), _tokenAmount);
        sellToken(_recipient);
    }
}
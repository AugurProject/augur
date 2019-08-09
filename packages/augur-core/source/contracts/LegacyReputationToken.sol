pragma solidity 0.5.10;

import 'ROOT/libraries/IERC1820Registry.sol';
import 'ROOT/legacy_reputation/OldLegacyRepToken.sol';


contract LegacyReputationToken is OldLegacyReputationToken {
    event FundedAccount(address indexed _universe, address indexed _sender, uint256 _repBalance, uint256 _timestamp);

    string public constant name = "Reputation";
    string public constant symbol = "REP";
    uint8 public constant decimals = 18;

    function initializeERC1820(IAugur _augur) public returns (bool) {
        erc1820Registry = IERC1820Registry(_augur.lookup("ERC1820Registry"));
        initialize1820InterfaceImplementations();
        return true;
    }

    function faucet(uint256 _amount) public returns (bool) {
        require(_amount < 2 ** 128);
        mint(msg.sender, _amount);
        emit FundedAccount(address(this), msg.sender, _amount, block.timestamp);
        return true;
    }

    function onMint(address, uint256) internal {
    }

    function onBurn(address, uint256) internal {
    }

    function onTokenTransfer(address, address, uint256) internal {
    }
}

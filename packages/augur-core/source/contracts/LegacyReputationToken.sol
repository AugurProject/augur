pragma solidity 0.5.4;

import 'ROOT/libraries/IERC820Registry.sol';
import 'ROOT/legacy_reputation/OldLegacyRepToken.sol';


contract LegacyReputationToken is OldLegacyReputationToken {
    event FundedAccount(address indexed _universe, address indexed _sender, uint256 _repBalance, uint256 _timestamp);

    string public constant name = "Reputation";
    string public constant symbol = "REP";
    uint256 public constant decimals = 18;

    function initializeERC820(IAugur _augur) public returns (bool) {
        erc820Registry = IERC820Registry(_augur.lookup("ERC820Registry"));
        initialize820InterfaceImplementations();
        return true;
    }

    function faucet(uint256 _amount) public returns (bool) {
        require(_amount < 2 ** 128);
        mint(msg.sender, _amount);
        emit FundedAccount(address(this), msg.sender, _amount, block.timestamp);
        return true;
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

pragma solidity 0.4.24;

import 'libraries/Ownable.sol';
import 'libraries/token/ERC20Token.sol';
import 'libraries/Initializable.sol';
import 'reporting/IMailbox.sol';
import 'reporting/IMarket.sol';
import 'trading/ICash.sol';
import 'IAugur.sol';


contract Mailbox is Ownable, Initializable, IMailbox {
    IMarket private market;
    ICash public cash;
    IAugur public augur;

    function initialize(IAugur _augur, address _owner, IMarket _market) public beforeInitialized returns (bool) {
        endInitialization();
        owner = _owner;
        market = _market;
        augur = _augur;
        cash = ICash(augur.lookup("Cash"));
        return true;
    }

    //As a delegation target we cannot override the fallback, so we provide a specific method to deposit ETH
    function depositEther() public payable returns (bool) {
        return true;
    }

    function withdrawEther() public onlyOwner returns (bool) {
        // Withdraw any Cash balance
        uint256 _tokenBalance = cash.balanceOf(this);
        if (_tokenBalance > 0) {
            cash.withdrawEtherTo(owner, _tokenBalance);
        }
        // Withdraw any ETH balance
        if (address(this).balance > 0) {
            owner.transfer(address(this).balance);
        }
        return true;
    }

    function withdrawTokens(ERC20Token _token) public onlyOwner returns (bool) {
        uint256 _balance = _token.balanceOf(this);
        require(_token.transfer(owner, _balance));
        return true;
    }

    function onTransferOwnership(address _owner, address _newOwner) internal returns (bool) {
        augur.logMarketMailboxTransferred(market.getUniverse(), market, _owner, _newOwner);
        return true;
    }
}

pragma solidity 0.4.24;

import 'reporting/IMarket.sol';
import 'IAugur.sol';


contract IMailbox {
    function initialize(IAugur _augur, address _owner, IMarket _market) public returns (bool);
    function depositEther() public payable returns (bool);
}

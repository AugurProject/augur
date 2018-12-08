pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'IAugur.sol';
import 'reporting/IMailbox.sol';
import 'reporting/IMarket.sol';


contract MailboxFactory is CloneFactory {
    function createMailbox(IAugur _augur, address _owner, IMarket _market) public returns (IMailbox) {
        IMailbox _mailbox = IMailbox(createClone(_augur.lookup("Mailbox")));
        _mailbox.initialize(_augur, _owner, _market);
        return _mailbox;
    }
}

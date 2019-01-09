pragma solidity 0.4.24;


import 'libraries/CloneFactory.sol';
import 'reporting/IMarket.sol';
import 'IAugur.sol';


contract ShareTokenFactory is CloneFactory {
    function createShareToken(IAugur _augur, IMarket _market, uint256 _outcome) public returns (IShareToken) {
        IShareToken _shareToken = IShareToken(createClone(_augur.lookup("ShareToken")));
        _shareToken.initialize(_augur, _market, _outcome, _augur.lookup("ERC820Registry"));
        return _shareToken;
    }
}

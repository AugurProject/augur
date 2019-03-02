pragma solidity 0.5.4;


import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/IAugur.sol';


contract ShareTokenFactory is CloneFactory {
    function createShareToken(IAugur _augur, IMarket _market, uint256 _outcome) public returns (IShareToken) {
        IShareToken _shareToken = IShareToken(createClone(_augur.lookup("ShareToken")));
        _shareToken.initialize(_augur, _market, _outcome, _augur.lookup("ERC820Registry"));
        return _shareToken;
    }
}

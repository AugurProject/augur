pragma solidity 0.4.24;


import 'libraries/CloneFactory.sol';
import 'reporting/IMarket.sol';
import 'reporting/IReputationToken.sol';
import 'trading/ICash.sol';
import 'factories/IMarketFactory.sol';
import 'IAugur.sol';


contract MarketFactory is CloneFactory, IMarketFactory {
    function createMarket(IAugur _augur, IUniverse _universe, uint256 _endTime, uint256 _feePerEthInWei, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) public returns (IMarket _market) {
        _market = IMarket(createClone(_augur.lookup("Market")));
        IReputationToken _reputationToken = _universe.getReputationToken();
        require(_reputationToken.transfer(_market, _reputationToken.balanceOf(this)));
        require(_augur.trustedTransfer(ICash(_augur.lookup("Cash")), _sender, _market, _universe.getOrCacheValidityBond()));
        _market.initialize(_augur, _universe, _endTime, _feePerEthInWei, _designatedReporterAddress, _sender, _numOutcomes, _numTicks);
        return _market;
    }
}

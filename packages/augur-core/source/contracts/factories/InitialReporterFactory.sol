pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'reporting/IInitialReporter.sol';
import 'reporting/IMarket.sol';
import 'IAugur.sol';


contract InitialReporterFactory is CloneFactory {
    function createInitialReporter(IAugur _augur, IMarket _market, address _designatedReporter) public returns (IInitialReporter) {
        IInitialReporter _initialReporter = IInitialReporter(createClone(_augur.lookup("InitialReporter")));
        _initialReporter.initialize(_augur, _market, _designatedReporter);
        return _initialReporter;
    }
}

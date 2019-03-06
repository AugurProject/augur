pragma solidity 0.5.4;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/reporting/IInitialReporter.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/IAugur.sol';


contract InitialReporterFactory is CloneFactory {
    function createInitialReporter(IAugur _augur, IMarket _market, address _designatedReporter) public returns (IInitialReporter) {
        IInitialReporter _initialReporter = IInitialReporter(createClone(_augur.lookup("InitialReporter")));
        _initialReporter.initialize(_augur, _market, _designatedReporter);
        return _initialReporter;
    }
}

from textwrap import dedent


def add_all(contracts):
    market(contracts)
    return contracts


def market(contracts):
    contracts['MockMarket'].functions['callForkOnUniverse'] = dedent("""\
    function callForkOnUniverse(IUniverse _universe) public returns(bool) {
        return _universe.fork();
    }
    """)

    contracts['MockMarket'].imports.add('reporting/IUniverse.sol')

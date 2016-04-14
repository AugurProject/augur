import React from 'react';
import classnames from 'classnames';

import MarketsHeader from './markets-header';
import Filters from './filters';
import MarketItem from './market-item';
import Input from '../../common/components/input';
import Link from '../../link/components/link';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,

		markets: React.PropTypes.array,
		keywords: React.PropTypes.string,
		filtersProps: React.PropTypes.object,
		marketsHeader: React.PropTypes.object,

		onChangeKeywords: React.PropTypes.func
    },

    render: function() {
        var p = this.props;
        return (
            <section className={ p.className }>
                <div className="search-sort-bar">
                    <Input className="search-bar" value={ p.keywords } placeholder="Search" onChange={ p.onChangeKeywords } />
                    <select className="sort-control" />
                </div>

                <div className="markets-header-bar">
                    <Link className="button make" { ...p.createMarketLink }>Make a Market</Link>
                    <MarketsHeader { ...p.marketsHeader } />
                </div>

                <Filters { ...p.filtersProps } />

                <div className="markets-list">
                    { (p.markets || []).slice(0, 50).map(market =>
                        <MarketItem
                            key={ market.id }
                            { ...market } />
                    )}
                </div>
            </section>
        );
    }
});
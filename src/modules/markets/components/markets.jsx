import React from 'react';
import classnames from 'classnames';

import MarketsHeader from './markets-header';
import Filters from './filters';
import MarketItem from '../../market/components/market-item';
import Input from '../../common/components/input';
import Link from '../../link/components/link';
import DropDown from '../../common/components/dropdown';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,

		markets: React.PropTypes.array,
		keywords: React.PropTypes.string,
		filtersProps: React.PropTypes.object,
		marketsHeader: React.PropTypes.object,

		selectedSort: React.PropTypes.object,
		sortOptions: React.PropTypes.array,

		onChangeKeywords: React.PropTypes.func,
		onChangeSort: React.PropTypes.func
    },

    render: function() {
        var p = this.props;
        return (
            <section className={ p.className }>
                <div className="search-sort-bar">
                    <Input className="search-bar" value={ p.keywords } placeholder="Search" onChange={ p.onChangeKeywords } />

                    <div className="sort-container">
                        <span className="title">Sort By</span>
                        <DropDown
                            className="sort"
                            selected={ p.sortOptions.find(opt => opt.value === p.selectedSort.prop) }
                            options={ p.sortOptions }
                            onChange={ (prop) => { var sortOption = p.sortOptions.find(opt => opt.value === prop); p.onChangeSort(sortOption.value, sortOption.isDesc) }} />
                        <button
                            className="sort-direction-button"
                            title={ p.selectedSort.isDesc ? 'descending selected' : 'ascending selected' }
                            onClick={ () => p.onChangeSort(p.selectedSort.prop, !p.selectedSort.isDesc) }>{ p.selectedSort.isDesc ? <span>&#xf161;</span> : <span>&#xf160;</span> }</button>
                    </div>
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
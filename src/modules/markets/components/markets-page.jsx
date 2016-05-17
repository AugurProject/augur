import React from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import SearchSort from '../../markets/components/search-sort';
import Markets from '../../markets/components/markets';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,

        siteHeader: React.PropTypes.object,
        createMarketLink: React.PropTypes.object,

		markets: React.PropTypes.array,
		favoriteMarkets: React.PropTypes.array,

		marketsHeader: React.PropTypes.object,
		keywords: React.PropTypes.string,
		filters: React.PropTypes.array,
		pagination: React.PropTypes.object,

		selectedSort: React.PropTypes.object,
		sortOptions: React.PropTypes.array,

		onChangeKeywords: React.PropTypes.func,
		onChangeSort: React.PropTypes.func
    },

    shouldComponentUpdate: shouldComponentUpdatePure,

    render: function() {
        var p = this.props;
        return (
			<div className="page markets">
				<SiteHeader { ...p.siteHeader } />

				<header className="page-header">
					<div className="l-container">
						<span className="big-line">Augur lets you trade any market</span>.
						Find a market you can beat,
						and buy shares on the side that <b><i>you think</i></b> should go up.
						When you're right, you make money.
					</div>
				</header>

				<div className="page-content">
					<SearchSort
						keywords={ p.keywords }

						selectedSort={ p.selectedSort }
						sortOptions={ p.sortOptions }

						onChangeKeywords={ p.onChangeKeywords }
						onChangeSort={ p.onChangeSort }	/>

					<Markets className="page-content markets-content" { ...p } />
				</div>

				<SiteFooter />
			</div>
		);
    }
});
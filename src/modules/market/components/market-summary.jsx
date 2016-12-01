import React, { Component } from 'react';
import shouldComponentUpdatePure from 'utils/should-component-update-pure';
import Market from 'modules/my-markets/components/my-market';
import MarketSummaryHeader from 'modules/my-markets/components/my-market-summary-header';

export default class MarketSummary extends Component {
	// TODO -- Prop Validations
	// static propTypes = {
	// 	marketSummary: PropTypes.object.isRequired
	// };

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	render() {
		const p = this.props;

		return (
			<section className="market-summary">
				<MarketSummaryHeader {...p.marketSummary} className="market-section-header" />
				<section className="portfolio-list">
					<Market {...p.marketSummary} />
				</section>
			</section>
		);
	}
}

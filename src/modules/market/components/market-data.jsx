import React, { Component } from 'react';

import ComponentNav from 'modules/common/components/component-nav';

export default class MarketData extends Component {
	constructor(props){
		super(props);

		console.log('props -- ', props);

		this.state = {
			selectedOutcome: props.market.outcomes[0].id || null
		};
	}

	render() {
		const p = this.props;

		return (
			<article className="market-data">
				<h3>{p.market.description}</h3>
				<ComponentNav navItems={p.marketDataNavItems} />
			</article>
		)
	}
}

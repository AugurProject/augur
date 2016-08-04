import React from 'react';
import Market from '../../../modules/my-markets/components/market';
import ValueDenomination from '../../../modules/common/components/value-denomination';

const PortfolioMarkets = (p) => (
	<div>
		{!!p.markets && !!p.markets.length && p.markets.map(market => (
			<div key={market.id}>
				<span className="description">{market.description}</span>
				{!!market &&
					<section className="portfolio-list">
						<Market {...market} />
					</section>
				}
			</div>
		))}
	</div>
);

PortfolioMarkets.propTypes = {
	markets: React.PropTypes.array.isRequired
};

export default PortfolioMarkets;

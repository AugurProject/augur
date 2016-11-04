import React from 'react';
import Market from 'modules/my-markets/components/my-market';
import Link from 'modules/link/components/link';

const PortfolioMarkets = p => (
	<div>
		{!!p.markets && !!p.markets.length && p.markets.map(market => (
			<Link key={market.id} {...market.marketLink} >
				<div className="">
					<span className="description">{market.description}</span>
					{!!market &&
						<article className="portfolio-list">
							<Market {...market} />
						</article>
					}
				</div>
			</Link>
		))}
	</div>
);

// TODO -- Prop Validations
// PortfolioMarkets.propTypes = {
// 	markets: React.PropTypes.array.isRequired
// };

export default PortfolioMarkets;

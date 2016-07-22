import React from 'react';
import PortfolioMarketsRow from '../../../modules/markets/components/portfolio-row';

const PortfolioMarkets = (p) => {
	console.log('PortfolioMarkets -- ', p);

	return (
		<table>
			<thead>
				<tr>
					<th></th>
					<th>Ends</th>
					<th>Fees Collected</th>
					<th>Volume</th>
					<th># Trades</th>
				</tr>
			</thead>
			{p.markets.map(market => (
				<PortfolioMarketsRow market={market} />
			))}
			<tfoot></tfoot>
		</table>
	);
};

PortfolioMarkets.propTypes = {
	markets: React.PropTypes.array
};

export default PortfolioMarkets;

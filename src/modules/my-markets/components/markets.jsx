import React from 'react';
import Market from '../../../modules/my-markets/components/market';

const MyMarkets = (p) => (
	<table className="my-markets">
		<thead>
			<tr>
				<th className="market-description"></th>
				<th className="end-date">Ends</th>
				<th className="open-volume">Open Volume</th>
				<th className="volume">Volume</th>
				<th className="num-trades"># Trades</th>
				<th className="avg-trade-size">Avg Trade Size</th>
				<th className="fees-collected">Fees Collected</th>
			</tr>
		</thead>
		{p.markets.map((market, id) => (
			<Market
				key={id}
				market={market}
			/>
		))}
	</table>
);

MyMarkets.propTypes = {
	markets: React.PropTypes.array.isRequired
};

export default MyMarkets;

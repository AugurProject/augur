import React from 'react';

const PortfolioMarkets = (p) => (
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
			<tbody key={id} >
				<tr>
					<td className="market-description">{market.description}</td>
					<td className="end-date">{market.endDate.formatted}</td>
					<td className="open-volume">{market.openVolume.formatted}</td>
					<td className="volume">{market.volume.formatted}</td>
					<td className="num-trades">{market.numberOfTrades.formatted}</td>
					<td className="avg-trade-size">{market.averageTradeSize.full}</td>
					<td className="fees-collected">{market.fees.full}</td>
				</tr>
			</tbody>
		))}
	</table>
);

PortfolioMarkets.propTypes = {
	markets: React.PropTypes.array.isRequired
};

export default PortfolioMarkets;

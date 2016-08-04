import React from 'react';

const Market = (p) => (
	<tbody>
		<tr>
			<td className="market-description">{p.market.description}</td>
			<td className="end-date">{p.market.endDate.formatted}</td>
			<td className="open-volume">{p.market.openVolume.formatted}</td>
			<td className="volume">{p.market.volume.formatted}</td>
			<td className="num-trades">{p.market.numberOfTrades.formatted}</td>
			<td className="avg-trade-size">{p.market.averageTradeSize.full}</td>
			<td className="fees-collected">{p.market.fees.full}</td>
		</tr>
	</tbody>
);

Market.propTypes = {
	market: React.PropTypes.object.isRequired
};

export default Market;

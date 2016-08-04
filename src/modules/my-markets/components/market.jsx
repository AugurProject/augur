import React, { PropTypes } from 'react';
import ValueDenomination from '../../../modules/common/components/value-denomination';

const Market = (p) => (
	<div className="portfolio-row">
		<div className="portfolio-group">
			<div className="portfolio-pair">
				<span className="title">end date</span>
				<ValueDenomination {...p.endDate} />
			</div>
			<div className="portfolio-pair">
				<span className="title">open volume</span>
				<ValueDenomination {...p.openVolume} />
			</div>
			<div className="portfolio-pair">
				<span className="title">volume</span>
				<ValueDenomination {...p.volume} />
			</div>
		</div>
		<div className="portfolio-group">
			<div className="portfolio-pair total-cost">
				<span className="title"># of trades</span>
				<ValueDenomination {...p.numberOfTrades} />
			</div>
			<div className="portfolio-pair total-value">
				<span className="title">Avg Trade Size</span>
				<ValueDenomination {...p.averageTradeSize} />
			</div>
			<div className="portfolio-pair net-change">
				<span className="title">fees collected</span>
				<ValueDenomination className="colorize" {...p.fees} />
			</div>
		</div>
	</div>
);

Market.propTypes = {
	endDate: PropTypes.object.isRequired,
	openVolume: PropTypes.object.isRequired,
	volume: PropTypes.object.isRequired,
	numberOfTrades: PropTypes.object.isRequired,
	averageTradeSize: PropTypes.object.isRequired,
	fees: PropTypes.object.isRequired
};

export default Market;

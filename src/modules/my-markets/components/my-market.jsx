import React, { PropTypes } from 'react';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import ValueDate from '../../../modules/common/components/value-date';

const Market = p => (
	<div className="portfolio-row">
		<div className="portfolio-group portfolio-main-group">
			<span className="market-main-group-title">ends: </span>
			<ValueDate {...p.endDate} />
		</div>
		<div className="portfolio-group">
			<div className="portfolio-pair total-value">
				<span className="title">fees collected</span>
				<ValueDenomination
					className="colorize"
					{...p.fees}
				/>
			</div>
			<div className="portfolio-pair">
				<span className="title">open volume</span>
				<ValueDenomination {...p.openVolume} />
			</div>
			<div className="portfolio-pair">
				<span className="title">volume</span>
				<ValueDenomination {...p.volume} />
			</div>
			<div className="portfolio-pair total-cost">
				<span className="title"># of trades</span>
				<ValueDenomination {...p.numberOfTrades} />
			</div>
			<div className="portfolio-pair total-value">
				<span className="title">avg trade size</span>
				<ValueDenomination {...p.averageTradeSize} />
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

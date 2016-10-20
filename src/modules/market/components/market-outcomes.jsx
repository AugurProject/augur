import React from 'react';
import ValueDenomination from 'modules/common/components/value-denomination';

const MarketOutcomes = p => (
	<div className="market-outcomes">
		{p.outcomes.map((outcome, i) => (
			<div
				key={outcome.id}
				className="outcome"
			>
				{!!outcome.lastPricePercent &&
					<ValueDenomination
						className="outcome-price"
						{...outcome.lastPricePercent}
						formatted={outcome.lastPricePercent.rounded}
						formattedValue={outcome.lastPricePercent.roundedValue}
					/>
				}
				<span className="outcome-name">{outcome.name}</span>
			</div>
		))}
	</div>
);

// TODO -- Prop Validations
// MarketOutcomes.propTypes = {
// 	outcomes: React.PropTypes.array
// };

export default MarketOutcomes;

import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../common/components/value-denomination';

const PositionsSummary = (p) => (
	<div className={classnames('positions-summary', p.className)}>
		{!!p.numPositions &&
			<ValueDenomination {...p.numPositions} className="num-positions" />
		}

		{p.totalValue &&
			<ValueDenomination {...p.totalValue} className="total-value" />
		}

		{p.gainPercent &&
			<ValueDenomination
				{...p.gainPercent}
				className="gain-percent"
				formatted={p.gainPercent.formatted}
			/>
		}
	</div>
);

PositionsSummary.propTypes = {
	className: React.PropTypes.string
};

export default PositionsSummary;

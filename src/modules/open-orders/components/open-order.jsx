/*
 * Author: priecint
 */

import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';

const OpenOrder = (p) => (
	<tr className={classnames('open-order', { isDisabled: p.isCancelling || p.isCancelled })}>
		<td>
			{p.type}
		</td>
		<td>
			<ValueDenomination {...p.originalShares} />
		</td>
		<td>
			<ValueDenomination {...p.avgPrice} />
		</td>
		<td>
			<ValueDenomination {...p.matchedShares} />
		</td>
		<td>
			<ValueDenomination {...p.unmatchedShares} />
		</td>
		<td>
			<button
				className="button cancel-order-action"
				disabled={p.isCancelling || p.isCancelled}
				title="Cancel order"
				onClick={(event) => { p.cancelOrder(p.id, p.marketID, p.type); }}
			>x</button>

		</td>
	</tr>
);

OpenOrder.propTypes = {
	id: React.PropTypes.string.isRequired,
	marketID: React.PropTypes.string.isRequired,
	type: React.PropTypes.string.isRequired,
	originalShares: React.PropTypes.object.isRequired,
	avgPrice: React.PropTypes.object.isRequired,
	matchedShares: React.PropTypes.object.isRequired,
	unmatchedShares: React.PropTypes.object.isRequired,
	isCancelling: React.PropTypes.bool.isRequired,
	isCancelled: React.PropTypes.bool.isRequired,
	cancelOrder: React.PropTypes.func.isRequired
};

export default OpenOrder;

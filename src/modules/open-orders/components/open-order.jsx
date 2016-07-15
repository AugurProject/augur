/*
 * Author: priecint
 */

import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';

const OpenOrder = (p) => (
	<tr className={classnames('open-order', { isCancelling: p.isCancelling })}>
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
				disabled={p.isCancelling}
				title="Cancel order"
				onClick={(event) => { p.cancelOrder(p.id); }}
			>x</button>

		</td>
	</tr>
);

OpenOrder.propTypes = {
	id: React.PropTypes.string,
	type: React.PropTypes.string,
	originalShares: React.PropTypes.object,
	avgPrice: React.PropTypes.object,
	matchedShares: React.PropTypes.object,
	unmatchedShares: React.PropTypes.object,
	isCancelling: React.PropTypes.bool,
	onCancelOrder: React.PropTypes.func
};

export default OpenOrder;

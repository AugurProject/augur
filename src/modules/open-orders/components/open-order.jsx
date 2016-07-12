/*
 * Author: priecint
 */

import React from 'react';

import ValueDenomination from '../../common/components/value-denomination';

const OpenOrder = (p) => (
	<tr className="open-order">
		<td>
			{p.type}
		</td>
		<td>
			<ValueDenomination {...p.originalShares}/>
		</td>
		<td>
			<ValueDenomination {...p.avgPrice}/>
		</td>
		<td>
			<ValueDenomination {...p.matchedShares}/>
		</td>
		<td>
			<ValueDenomination {...p.unmatchedShares}/>
			<button className="cancel-order-action" disabled={p.isCancelling} title="Cancel order" onClick={p.onCancelOrder(p.id)}>x</button>
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
	isCancelling: React.PropTypes.bool
};

export default OpenOrder;
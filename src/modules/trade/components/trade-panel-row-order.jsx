import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../../modules/common/components/value-denomination';

const TradePanelRowOrder = (p) => (
	<tr className={classnames('trade-panel-row', { displayNone: !(p.selectedOutcomeID === p.outcome.id) })} >
		<td colSpan="2"></td>
		<td>
			{!!p.outcome.orderBook.bids[p.itemIndex] &&
				<div className="order-book-data bid">
					<ValueDenomination
						className={classnames('shares')}
						{...p.outcome.orderBook.bids[p.itemIndex].shares}
						denomination={undefined}
					/>

					<span className="shares-at">@</span>

					<ValueDenomination
						className={classnames('price')}
						{...p.outcome.orderBook.bids[p.itemIndex].price}
					/>
				</div>
			}
		</td>
		<td>
			{!!p.outcome.orderBook.asks[p.itemIndex] &&
				<div className="order-book-data ask">

					<ValueDenomination
						className={classnames('shares')}
						{...p.outcome.orderBook.asks[p.itemIndex].shares}
						denomination={undefined}
					/>

					<span className="shares-at">@</span>

					<ValueDenomination
						className={classnames('price')}
						{...p.outcome.orderBook.asks[p.itemIndex].price}
					/>
				</div>
			}
		</td>
		<td colSpan="5"></td>
	</tr>
);

TradePanelRowOrder.propTypes = {
	outcomes: React.PropTypes.array,
	selectedOutcomeID: React.PropTypes.string,
	itemIndex: React.PropTypes.number
};

export default TradePanelRowOrder;

import React from 'react';
import Link from '../../link/components/link';

const MarketsPagination = p => (
	<div className="markets-pagination">
		<div className="markets-pagination-group-1">
			{!!p.pagination && !!p.pagination.previousPageNum &&
				<Link
					{...p.pagination.previousPageLink}
					className="button"
				>
					<i></i>
				</Link>
			}
		</div>

		<div className="markets-pagination-group-2">
			<span className="pagination-count">{`${p.pagination.startItemNum} - ${p.pagination.endItemNum}`} <strong>of</strong> {p.pagination.numUnpaginated}</span>
		</div>

		<div className="markets-pagination-group-3">
			{!!p.pagination && !!p.pagination.nextPageNum &&
				<Link
					{...p.pagination.nextPageLink}
					className="button"
				>
					<i></i>
				</Link>
			}
		</div>
	</div>
);

export default MarketsPagination;

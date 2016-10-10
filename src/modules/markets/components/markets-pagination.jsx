import React from 'react';

const MarketsPagination = p => (
	<div className="markets-pagination">
		<div className="markets-pagination-group-1">
			{!!p.pagination && !!p.pagination.previousPageNum &&
				<button
					className="button-container prev"
					onClick={() => p.pagination.onUpdateSelectedPageNum(p.pagination.previousPageNum)}
				>
					<i></i>
				</button>
			}
		</div>

		<div className="markets-pagination-group-2">
			<span className="pagination-count">{`${p.pagination.startItemNum} - ${p.pagination.endItemNum}`} <strong>of</strong> {p.pagination.numUnpaginated}</span>
		</div>

		<div className="markets-pagination-group-3">
			{!!p.pagination && !!p.pagination.nextPageNum &&
				<button
					className="button-container next"
					onClick={() => p.pagination.onUpdateSelectedPageNum(p.pagination.nextPageNum)}
				>
					<i></i>
				</button>
			}
		</div>
	</div>
);

export default MarketsPagination;

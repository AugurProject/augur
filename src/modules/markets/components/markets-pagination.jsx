import React from 'react';

const MarketsPagination = (p) => (
	<div className="markets-pagination">
		<div className="markets-pagination-group-1">
			{!!p.pagination && !!p.pagination.previousPageNum &&
				<span className="button-container prev" onClick={() => p.pagination.onUpdateSelectedPageNum(p.pagination.previousPageNum)}>
					<button><i></i></button>
				</span>
			}
		</div>

		<div className="markets-pagination-group-2">
			<span className="pagination-count">{`${p.pagination.startItemNum} - ${p.pagination.endItemNum}`} <strong>of</strong> {p.pagination.numUnpaginated}</span>
		</div>

		<div className="markets-pagination-group-3">
			{!!p.pagination && !!p.pagination.nextPageNum &&
				<span className="button-container next" onClick={() => p.pagination.onUpdateSelectedPageNum(p.pagination.nextPageNum)}>
					<button><i></i></button>
				</span>
			}
		</div>
	</div>
);

export default MarketsPagination;
import React from 'react';

const SummaryItem = (p) => (
	<div className="summary-item">
		<div className="summary-content">
			<span>{`${p.label}:`}</span><span className="summary-value">{p.value}</span>
		</div>
	</div>
);

export default SummaryItem;
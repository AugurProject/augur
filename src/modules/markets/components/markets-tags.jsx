import React, { PropTypes } from 'react';
import Checkbox from '../../common/components/checkbox';

const Filters = (p) => (
	<div className="filters">
		{p.filters.map(filter =>
			<div key={filter.title} className="filters-group">
				<span className="title">{filter.title}</span>
				{filter.options.map(option =>
					<Checkbox key={option.value} className="filter" text={option.name} text2={`(${option.numMatched})`} isChecked={option.isSelected} onClick={option.onClick} />
				)}
			</div>
		)}
	</div>
);

Filters.propTypes = {
	filters: PropTypes.array
};

export default Filters;

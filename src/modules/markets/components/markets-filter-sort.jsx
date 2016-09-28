import React, { PropTypes } from 'react';
import DropDown from '../../common/components/dropdown';

const MarketsFilterSort = (p) => (
	<div className="view-header">
		<DropDown
			default={p.selectedFilterSort.type}
			options={p.types}
			onChange={type => { p.onChange(type, null, null); }}

		/>
		<DropDown
			default={p.selectedFilterSort.sort}
			options={p.sorts}
			onChange={sort => { p.onChange(null, sort, null); }}
		/>
	</div>
);

MarketsFilterSort.propTypes = {
	selectedFilterSort: PropTypes.object,
	sorts: PropTypes.array,
	types: PropTypes.array,
	order: PropTypes.object
};

export default MarketsFilterSort;

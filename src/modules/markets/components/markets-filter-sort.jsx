import React, { PropTypes } from 'react';
import DropDown from '../../common/components/dropdown';

const MarketsFilterSort = (p) => (
	<div className="view-header">
		<DropDown
			selected={p.types.find(opt => opt.value === p.selectedFilterSort.types)}
			options={p.types}
			onChange={type => { const selectedTypeOption = p.types.find(opt => opt.value === type); p.onChange(null, selectedTypeOption, null); }}
		/>
	</div>
);

MarketsFilterSort.propTypes = {
	selectedFilterSort: PropTypes.object,
	sorts: PropTypes.array,
	types: PropTypes.array,
	order: PropTypes.object
}

export default MarketsFilterSort;

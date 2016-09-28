import React, { PropTypes } from 'react';
import DropDown from '../../common/components/dropdown';

const MarketsFilterSort = (p) => (
	<div className="view-header markets-view-header">
		<DropDown
			default={p.selectedFilterSort.type}
			options={p.types}
			onChange={type => { p.onChange(type, null, null); }}

		/>
		<div className="companion-fields">
			<DropDown
				className="companion-field"
				default={p.selectedFilterSort.sort}
				options={p.sorts}
				onChange={sort => { p.onChange(null, sort, null); }}
			/>
			<i
				className="fa"
				onClick={() => { p.onChange(null, null, !p.selectedFilterSort.isDesc); }}
			>
				{p.selectedFilterSort.isDesc ? '' : ''}
			</i>
		</div>
	</div>
);

MarketsFilterSort.propTypes = {
	selectedFilterSort: PropTypes.object,
	sorts: PropTypes.array,
	types: PropTypes.array,
	order: PropTypes.object
};

export default MarketsFilterSort;

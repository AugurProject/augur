import React, { PropTypes } from 'react';
import DropDown from '../../common/components/dropdown';

const MarketsFilterSort = (p) => (
	<article className={`markets-view-header ${p.className}`}>
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
	</article>
);

MarketsFilterSort.propTypes = {
	className: PropTypes.string,
	selectedFilterSort: PropTypes.object,
	sorts: PropTypes.array,
	types: PropTypes.array,
	order: PropTypes.object
};

export default MarketsFilterSort;

import React from 'react';
import Input from '../../common/components/input';
import DropDown from '../../common/components/dropdown';

const SearchSort = (p) => (
	<div className="search-sort">
		<div className="search-sort-content">
			<Input className="search-bar" value={p.keywords} placeholder="Search" onChange={p.onChangeKeywords} />

			<div className="sort-container">
				<span className="title">Sort By</span>

				<DropDown
					className="sort"
					selected={p.sortOptions.find(opt => opt.value === p.selectedSort.prop)}
					options={p.sortOptions}
					onChange={(prop) => { const sortOption = p.sortOptions.find(opt => opt.value === prop); p.onChangeSort(sortOption.value, sortOption.isDesc); }}
				/>

				<button
					className="sort-direction-button"
					title={p.selectedSort.isDesc ? 'descending selected' : 'ascending selected'}
					onClick={() => p.onChangeSort(p.selectedSort.prop, !p.selectedSort.isDesc)}
				>
					{p.selectedSort.isDesc ? <span>&#xf161;</span> : <span>&#xf160;</span>}
				</button>
			</div>
		</div>
	</div>
);

SearchSort.propTypes = {
	keywords: React.PropTypes.string,
	selectedSort: React.PropTypes.object,
	sortOptions: React.PropTypes.array,
	onChangeKeywords: React.PropTypes.func,
	onChangeSort: React.PropTypes.func
};

export default SearchSort;

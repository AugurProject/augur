import React from 'react';

import Dropdown from 'modules/common/components/dropdown';
import MarketsSearch from 'modules/markets/components/markets-search';

const MarketsFilterSort = p => (
	<article className="markets-filter-sort view-header">
		<div className="view-header-group">
			<Dropdown
				default={p.selectedFilterSort.type}
				options={p.types}
				onChange={(type) => { p.onChange(type, null, null); }}

			/>
			<div className="companion-fields">
				<Dropdown
					className="companion-field"
					default={p.selectedFilterSort.sort}
					options={p.sorts}
					onChange={(sort) => { p.onChange(null, sort, null); }}
				/>
				<button
					className="unstyled"
					onClick={() => { p.onChange(null, null, !p.selectedFilterSort.isDesc); }}
				>
					<i>
						{p.selectedFilterSort.isDesc ? '' : ''}
					</i>
				</button>
			</div>
		</div>
		<div className="view-header-group">
			<MarketsSearch keywords={p.keywords} />
		</div>
	</article>
);


// TODO -- Prop Validations
// MarketsFilterSort.propTypes = {
// 	className: PropTypes.string,
// 	selectedFilterSort: PropTypes.object,
// 	sorts: PropTypes.array,
// 	types: PropTypes.array,
// 	order: PropTypes.object,
// 	onChange: PropTypes.func,
// 	keywords: PropTypes.object
// };

export default MarketsFilterSort;

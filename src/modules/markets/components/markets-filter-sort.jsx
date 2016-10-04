import React from 'react';
import DropDown from '../../common/components/dropdown';
import MarketsSearch from '../../markets/components/markets-search';

const MarketsFilterSort = p => (
	<article className={`markets-view-header ${p.className}`}>
		<div className="view-header-group-1">
			<DropDown
				default={p.selectedFilterSort.type}
				options={p.types}
				onChange={(type) => { p.onChange(type, null, null); }}

			/>
			<div className="companion-fields">
				<DropDown
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
		<div className="view-header-group-2">
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

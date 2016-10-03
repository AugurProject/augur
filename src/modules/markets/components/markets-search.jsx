import React, { PropTypes } from 'react';
import Input from '../../common/components/input';

const MarketsSearch = (p) => (
	<article className={`search-input ${p.className}`} >
		<i></i>
		<Input
			placeholder="Search Markets"
			value={p.keywords}
			onChange={p.onChangeKeywords}
		/>
	</article>
);

MarketsSearch.propTypes = {
	className: PropTypes.string,
	keywords: PropTypes.string,
	onChangeKeywords: PropTypes.func
};

export default MarketsSearch;

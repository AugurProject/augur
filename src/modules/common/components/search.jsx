import React, { PropTypes } from 'react';
import Input from './input';

const Search = (p) => (
	<Input
		className="search-input"
		placeholder="Search Markets + Categories"
		value={p.keywords}
		onChange={p.onChangeKeywords}
	/>
);

Search.propTypes = {
	className: PropTypes.string,
	keywords: PropTypes.string,
	onChangeKeywords: PropTypes.func
};

export default Search;

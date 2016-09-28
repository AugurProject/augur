import React, { PropTypes } from 'react';
import Input from '../../common/components/input';
import classnames from 'classnames';

const Search = (p) => <Input className={classnames('search', p.className)} value={p.keywords} placeholder="Search Markets + Categories" onChange={p.onChangeKeywords} />;

Search.propTypes = {
	className: PropTypes.string,
	keywords: PropTypes.string,
	onChangeKeywords: PropTypes.func
};

export default Search;

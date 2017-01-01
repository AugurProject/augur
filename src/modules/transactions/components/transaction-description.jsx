import React from 'react';
import Link from 'modules/link/components/link';

const TransactionDescription = (p) => {
	if (!p.description) return <span />;
	let shortDescription;
	if (p.description.indexOf('\n') > -1) {
		shortDescription = p.description.split('\n').map(text => <li key={text}>{text}</li>);
		shortDescription = <ul>{shortDescription}</ul>;
	} else {
		shortDescription = p.description.substring(0, 100) + ((p.description.length > 100 && '...') || '');
	}
	const description = (isShortened) => {
		if (isShortened) {
			return (
				<span className="market-description" data-tip={p.description}>
					{shortDescription}
				</span>
			);
		}
		return (
			<span className="market-description">
				{shortDescription}
			</span>
		);
	};
	const isShortened = shortDescription !== p.description;
	if (shortDescription && p.marketLink) {
		return (
			<Link href={p.marketLink.href} onClick={p.marketLink.onClick}>
				{description(isShortened)}
			</Link>
		);
	}
	return <span>{description(isShortened)}</span>;
};

TransactionDescription.propTypes = {
	className: React.PropTypes.string,
	description: React.PropTypes.string,
	marketLink: React.PropTypes.object
};

export default TransactionDescription;

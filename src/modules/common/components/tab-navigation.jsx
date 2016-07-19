import React from 'react';
import Link from '../../../modules/link/components/link';

const TabNavigation = (p) => {
	console.log('p -- ', p);

	return (
		<div className="tab-navigator">
			{p.navItems.map((navItem, i) => (
				<Link
					key={`${i}`}
					className="nav-item"
					href={navItem.link.href}
					onClick={navItem.link.onClick}
				>
					{navItem.label}
				</Link>
			))}
		</div>
	);
};

TabNavigation.propTypes = {
	activePage: React.PropTypes.string,
	navItems: React.PropTypes.array
};

export default TabNavigation;

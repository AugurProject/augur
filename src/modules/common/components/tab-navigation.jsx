import React from 'react';
import Link from '../../../modules/link/components/link';
import classnames from 'classnames';

const TabNavigation = (p) => (
	<div className="tab-navigator">
		{p.navItems.map((navItem, i) => (
			<Link
				key={`${i}`}
				className={classnames('nav-item', { active: navItem.page.indexOf(p.activePage) > -1 })}
				href={navItem.link.href}
				onClick={navItem.link.onClick}
			>
				{navItem.label}
			</Link>
		))}
	</div>
);

TabNavigation.propTypes = {
	activePage: React.PropTypes.string,
	navItems: React.PropTypes.array
};

export default TabNavigation;

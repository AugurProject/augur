import React from 'react';

import Link from 'modules/link/components/link';

const ComponentNav = p => (
	<ul className="component-nav">
		{p.navItems && Object.keys(p.navItems).map(nav => (
			<Link
				key={nav}
				onClick={p.navItems[nav].onClick}
			>
				<li className={`${p.navItems.selected === nav && 'selected'}`} >
					{p.navItems[nav].label}
				</li>
			</Link>
		))}
	</ul>
);

export default ComponentNav;

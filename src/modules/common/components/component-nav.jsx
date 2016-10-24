import React from 'react';

import Link from 'modules/link/components/link';

const ComponentNav = p => (
	<ul className="component-nav">
		{p.navItems.length && p.navItems.map(nav => (
			<Link {...nav.link} >
				<li key={nav.label} className={`${nav.selected && 'selected'}`}>
					{nav.label}
				</li>
			</Link>
		))}
	</ul>
);

export default ComponentNav;

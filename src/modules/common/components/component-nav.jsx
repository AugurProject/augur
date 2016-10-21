import React from 'react';

import Link from 'modules/link/components/link';

const ComponentNav = p => (
	<ul className="internal-nav">
		{p.navItems.length && p.navItems.map(nav => (
			<li>
				<Link {...nav.link} >
					{nav.label}
				</Link>
			</li>
		))}
	</ul>
);

export default ComponentNav;

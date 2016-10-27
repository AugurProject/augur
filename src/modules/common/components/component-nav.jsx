import React from 'react';

import Link from 'modules/link/components/link';

const ComponentNav = p => (
	<ul className="component-nav">
		{Object.keys(p.navItems || {}).map(nav => (
			<Link
				key={nav}
				onClick={p.navItems[nav].onClick}
			>
				<li className={`${p.selected === nav && 'selected'}`} >
					{p.navItems[nav].label}
				</li>
			</Link>
		))}
	</ul>
);

export default ComponentNav;

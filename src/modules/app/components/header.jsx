import React from 'react';

import Nav from 'modules/app/components/nav';

const Header = p => (
	<header className="app-header">
		<Nav
			className="nav-header"
			{...p}
		/>
	</header>
);

export default Header;

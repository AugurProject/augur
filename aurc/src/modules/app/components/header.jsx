import React, { Component, PropTypes } from 'react';

import Nav from 'modules/app/components/nav';

import debounce from 'utils/debounce';

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			headerHeight: 0
		};

		this.setHeaderHeight = debounce(this.setHeaderHeight.bind(this));
	}

	componentDidMount() {
		this.setHeaderHeight();
		window.addEventListener('resize', this.setHeaderHeight);
	}

	componentDidUpdate(pP, pS) {
		if (pS.headerHeight !== this.state.headerHeight && this.props.updateHeaderHeight) {
			this.props.updateHeaderHeight(this.state.headerHeight);
		}
	}

	setHeaderHeight() {
		const headerHeight = this.navRef.offsetHeight;

		this.setState({ headerHeight });
	}

	render() {
		const p = this.props;

		return (
			<header className="app-header">
				<Nav
					{...p}
					className="nav-header"
					navRef={(navRef) => { this.navRef = navRef; }}
				/>
			</header>
		);
	}
}

Header.propTypes = {
	updateHeaderHeight: PropTypes.func
};

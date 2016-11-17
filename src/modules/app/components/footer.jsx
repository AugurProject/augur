import React, { Component } from 'react';

import Nav from 'modules/app/components/nav';

import debounce from 'utils/debounce';

export default class Footer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFooterCollapsed: true,
			verticalOffset: 0
		};

		this.handleWindowResize = debounce(this.handleWindowResize.bind(this));
		this.toggleFooter = this.toggleFooter.bind(this);
		this.slideFooter = this.slideFooter.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleWindowResize);
		this.slideFooter();
	}

	componentDidUpdate(pP, pS) {
		if (pS.isFooterCollapsed !== this.state.isFooterCollapsed) {
			this.slideFooter();
		}
	}

	toggleFooter() {
		this.setState({ isFooterCollapsed: !this.state.isFooterCollapsed });
	}

	handleWindowResize() {
		if (this.navRef.offsetHeight) { // navs present
			this.slideFooter();
		} else if (this.state.verticalOffset !== 0) {
			this.slideFooter();
		}
	}

	slideFooter() {
		const s = this.state;
		const navHeight = this.navRef.offsetHeight;
		const footerHeight = this.footer.offsetHeight;

		if (navHeight) { // navs are present
			if (s.isFooterCollapsed) { // collapse
				this.setState({ verticalOffset: -(footerHeight - navHeight) });
			} else { // expand
				this.setState({ verticalOffset: 0 });
			}
		} else { // navs are absent
			this.setState({ verticalOffset: 0 });
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<footer
				ref={(footer) => { this.footer = footer; }}
				style={{ bottom: s.verticalOffset }}
			>
				<Nav
					className="nav-footer"
					navRef={(navRef) => { this.navRef = navRef; }}
					toggleFooter={this.toggleFooter}
					{...p}
				/>
				<div id="footer_content">
					<a className="link" href="https://augur.net" target="_blank" rel="noopener noreferrer" >About</a>
					<a className="link" href="http://augur.link/augur-beta-ToS-v2.pdf" target="_blank" rel="noopener noreferrer" >Terms of Service</a>
				</div>
			</footer>
		);
	}
}

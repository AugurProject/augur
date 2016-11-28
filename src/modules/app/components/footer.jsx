import React, { Component, PropTypes } from 'react';
import Hammer from 'react-hammerjs';

import Nav from 'modules/app/components/nav';

import debounce from 'utils/debounce';

export default class Footer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFooterCollapsed: true,
			verticalOffset: 0,
			footerHeight: 0
		};

		this.handleWindowResize = debounce(this.handleWindowResize.bind(this));
		this.toggleFooter = this.toggleFooter.bind(this);
		this.slideFooter = this.slideFooter.bind(this);
		this.handleSwipe = this.handleSwipe.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleWindowResize);
		this.slideFooter();
	}

	componentDidUpdate(pP, pS) {
		if ((pP.logged !== this.props.logged) || (pS.isFooterCollapsed !== this.state.isFooterCollapsed)) {
			this.slideFooter();
		}

		if (pS.footerHeight !== this.state.footerHeight && this.props.updateFooterHeight) {
			this.props.updateFooterHeight(this.state.footerHeight);
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

	handleSwipe(swipe) {
		if (swipe.deltaY > 0) {
			this.setState({ isFooterCollapsed: true });
		} else {
			this.setState({ isFooterCollapsed: false });
		}
	}

	slideFooter() {
		const s = this.state;
		const navHeight = this.navRef.offsetHeight;
		const footerHeight = this.footer.offsetHeight;
		const togglerHeight = this.toggler.offsetHeight;

		if (navHeight) { // navs are present
			if (s.isFooterCollapsed) { // collapse
				this.setState({
					verticalOffset: -(footerHeight - togglerHeight - navHeight),
					footerHeight: navHeight
				});
			} else { // expand
				this.setState({
					verticalOffset: 0,
					footerHeight: footerHeight - togglerHeight
				});
			}
		} else { // navs are absent
			this.setState({
				verticalOffset: 0,
				footerHeight: footerHeight - togglerHeight
			});
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<Hammer onSwipe={this.handleSwipe} direction="DIRECTION_VERTICAL">
				<footer
					ref={(footer) => { this.footer = footer; }}
					style={{ bottom: s.verticalOffset }}
				>
					<button
						ref={(toggler) => { this.toggler = toggler; }}
						className="nav-toggler unstyled"
						onClick={this.toggleFooter}
					>
						<span className="nav-toggler-button">
							<i>{s.isFooterCollapsed ? '' : ''}</i>
						</span>
					</button>
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
			</Hammer>
		);
	}
}

Footer.propTypes = {
	updateFooterHeight: PropTypes.func,
	logged: PropTypes.bool
};

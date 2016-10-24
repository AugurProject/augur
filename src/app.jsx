import React, { Component } from 'react';
import { render } from 'react-dom';

import Router from 'base/router';

export default function (appElement, selectors) {
	render(<AppComponent {...selectors} />, appElement);
}

class AppComponent extends Component {
	// constructur(props){
	// 	super(props);
	//
	// 	this.state = {
	// 		isSideBarAllowed: false,
	// 		isSideBarCollapsed: false,
	// 		doScrollTop: false
	// 	};
	//
	// 	this.shouldComponentUpdate = shouldComponentUpdatePure;
	//
	// 	this.currentRoute = this.currentRoute.bind(this);
	// 	this.handleScrollTop = this.handleScrollTop.bind(this);
	// 	this.shouldDisplaySideBar = this.shouldDisplaySideBar.bind(this);
	// }
	//
	// componentDidMount() {
	// 	this.shouldDisplaySideBar();
	// }
	//
	// componentDidUpdate() {
	// 	this.shouldDisplaySideBar();
	// 	this.handleScrollTop();
	// }

	render() {
		return <span>Heyo!</span>
	}
}

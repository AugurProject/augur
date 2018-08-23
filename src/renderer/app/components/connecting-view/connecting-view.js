import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './connecting-view.styles.less'

export class ConnectingView extends Component {
 	static propTypes = {
	    connected: PropTypes.bool,
	    connecting: PropTypes.bool,
	    lookingForPeers: PropTypes.bool,
	    synced: PropTypes.bool,
	    syncing: PropTypes.bool,
	};

	constructor(props) {
	    super(props);
	}

  	render() {
	  	return (
	  		<section className={Styles.ConnectingView}>
	  			<div className={Styles.ConnectingView__connectingContainer}>
				    <div className={Styles.ConnectingView__conectingTitle}>Connecting to Ethereum</div>
				    <div className={Styles.ConnectingView__conectingText}>Disconnected</div>
			    </div>
			    <div className={Styles.ConnectingView__loadingIndicator}></div>
			</section>
	  	)
	}
}

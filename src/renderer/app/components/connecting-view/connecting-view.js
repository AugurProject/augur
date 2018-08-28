import React from "react";
import { Component } from 'react'
// import { PulseLoader } from "react-spinners";

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
  		const {
  			connected,
  			connecting,
  			lookingForPeers,
  			synced,
  			syncing
  		} = this.props

  		const showConnecting = connecting && !connected
  		const showDisconnected = !connecting && !connected
  		const showConnected = connecting && connected

	  	return (
	  		<section className={Styles.ConnectingView}>
	  			<div className={Styles.ConnectingView__connectingContainer}>
				    <div className={Styles.ConnectingView__conectingTitle}>Connecting to Ethereum</div>
				    <div className={Styles.ConnectingView__conectingText}>
				    	{showConnecting && 'Connecting'}
				    	{showDisconnected && 'Disconnected'}
				    	{showConnected && 'Connected'}
				    </div>
			    </div>
			    <div className={Styles.ConnectingView__loadingIndicator}></div>
			</section>
	  	)
	}
}

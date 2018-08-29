import React from "react";
import { Component } from 'react'
import { PulseLoader } from "react-spinners";
import classNames from "classnames";

import PropTypes from "prop-types";
import Styles from './connecting-view.styles.less'

export class ConnectingView extends Component {
 	static propTypes = {
	    connected: PropTypes.bool,
	    connecting: PropTypes.bool,
	    lookingForPeers: PropTypes.bool,
	    synced: PropTypes.bool,
	    syncing: PropTypes.bool,
	    isLocalLighNode: PropTypes.bool,
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
  			syncing,
  			isLocalLighNode,
  		} = this.props

  		const showConnecting = connecting && !connected
  		const showConnected = connecting && connected
  		const showDisconnected = !showConnecting && !showConnected

	  	return (
	  		<section className={classNames(Styles.ConnectingView, {
		               			[Styles['ConnectingView-connecting']]: showConnecting,
		               			[Styles['ConnectingView-connected']]: showConnected,
		           			})}
	  			>
	  			<div className={classNames(Styles.ConnectingView__connectingContainer, {
		               			[Styles['ConnectingView__connectingContainer-connecting']]: showConnecting,
		               			[Styles['ConnectingView__connectingContainer-connected']]: showConnected,
		           			})}
	  			>
					<div className={classNames(Styles.ConnectingView__conectingTitle, {
		               			[Styles['ConnectingView__conectingTitle-connecting']]: showConnecting,
		               			[Styles['ConnectingView__conectingTitle-connected']]: showConnected,
		           			})}
	  				>
				    	Connecting to Ethereum
				    </div>
				    <div className={classNames(Styles.ConnectingView__conectingText, {
		               			[Styles['ConnectingView__conectingText-connecting']]: showConnecting,
		               			[Styles['ConnectingView__conectingText-connected']]: showConnected,
		           			})}
	  				>
				    	{showDisconnected && 'Disconnected'}

				    	{showConnected && (isLocalLighNode ? 'Synced' : 'Connected')}
				   		{showConnected && 
				   			<div className={Styles.ConnectingView__connectedSvg}/>
				   		}

				    	{showConnecting && (isLocalLighNode ? 'Syncing' : 'Connecting')}
				    	{showConnecting && 
				    		<PulseLoader
				    		  sizeUnit={"px"}
					          size={6}
					          color={'#a7a2b2'}
					          className={Styles.ConnectingView__loader}
					          loading={true}
				    		/>
				    	}
				    </div>
			    </div>
			    <div className={classNames(Styles.ConnectingView__loadingIndicator, {
		               			[Styles['ConnectingView__loadingIndicator-connecting']]: showConnecting,
		               			[Styles['ConnectingView__loadingIndicator-connected']]: showConnected,
		           			})}
	  			/>
			</section>
	  	)
	}
}

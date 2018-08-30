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
	    isLocalLightNode: PropTypes.bool,
	    serverStatus: PropTypes.object,
	};

	constructor(props) {
	    super(props);
	}

  	render() {
  		const {
  			connected,
  			connecting,
  			isLocalLightNode,
  			serverStatus,
  		} = this.props

  		const showConnecting = connecting && !connected
  		const showConnected = connecting && connected
  		const showDisconnected = !showConnecting && !showConnected

  		let syncing = false
  		if (isLocalLightNode) {
  			if (serverStatus.PEER_COUNT_DATA > 0 && !serverStatus.GETH_FINISHED_SYNCING) {
  				syncing = true
  			} 
  		}

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

				    	{showConnected && (isLocalLightNode ? 'Synced' : 'Connected')}
				   		{showConnected && 
				   			<div className={Styles.ConnectingView__connectedSvg}/>
				   		}

				    	{showConnecting && (isLocalLightNode ? (syncing ? 'Syncing' : 'Looking For Peers') : 'Connecting')}
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

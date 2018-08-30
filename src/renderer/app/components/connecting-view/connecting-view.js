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

  		const showDisconnected = !connected && !connecting

  		let syncing = false
  		if (isLocalLightNode) {
  			if (serverStatus.PEER_COUNT_DATA > 0 && !serverStatus.GETH_FINISHED_SYNCING) {
  				syncing = true
  			}
  		}

	  	return (
	  		<section className={classNames(Styles.ConnectingView, {
		               			[Styles['ConnectingView-connecting']]: connecting,
		               			[Styles['ConnectingView-connected']]: connected,
		           			})}
	  			>
	  			<div className={classNames(Styles.ConnectingView__connectingContainer, {
		               			[Styles['ConnectingView__connectingContainer-connecting']]: connecting,
		               			[Styles['ConnectingView__connectingContainer-connected']]: connected,
		           			})}
	  			>
					<div className={classNames(Styles.ConnectingView__conectingTitle, {
		               			[Styles['ConnectingView__conectingTitle-connecting']]: connecting,
		               			[Styles['ConnectingView__conectingTitle-connected']]: connected,
		           			})}
	  				>
				    	Connecting to Ethereum
				    </div>
				    <div className={classNames(Styles.ConnectingView__conectingText, {
		               			[Styles['ConnectingView__conectingText-connecting']]: connecting,
		               			[Styles['ConnectingView__conectingText-connected']]: connected,
		           			})}
	  				>
				    	{showDisconnected && 'Disconnected'}

				    	{connected && (isLocalLightNode ? 'Synced' : 'Connected')}
				   		{connected &&
				   			<div className={Styles.ConnectingView__connectedSvg}/>
				   		}

				    	{(!connected && connecting) && (isLocalLightNode ? (syncing ? 'Syncing' : 'Looking For Peers') : 'Connecting')}
				    	{(!connected && connecting) &&
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
		               			[Styles['ConnectingView__loadingIndicator-connecting']]: (!connected && connecting),
		               			[Styles['ConnectingView__loadingIndicator-connected']]: connected,
		           			})}
	  			/>
			</section>
	  	)
	}
}

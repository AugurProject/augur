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
      gethBlockInfo: PropTypes.object,
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
        gethBlockInfo,
  		} = this.props

  		let showDisconnected = !connected && !connecting
		const syncing = connecting && serverStatus.GETH_SYNCING
  		const showConnecting = !connected && !showDisconnected

		let currentPercentStyle = {
	      width: '0%',
	      backgroundColor: 'transparent',
	    };


  		if (isLocalLightNode) {
  			showDisconnected = syncing ? !syncing : showDisconnected

  			const pct = gethBlockInfo.lastSyncBlockNumber ? ((gethBlockInfo.lastSyncBlockNumber - gethBlockInfo.uploadBlockNumber) / (gethBlockInfo.highestBlockNumber - gethBlockInfo.uploadBlockNumber) * 100) : 0
  			let percent = Math.floor(pct * Math.pow(10, 2)) / Math.pow(10, 2)
  			if (connected) {
  				percent = 0
  			}
  			currentPercentStyle = {
		      width: `${percent}%`,
		      backgroundColor: (syncing ? '#cbc5d9' : 'transparent'),
		    };
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

				    	{showConnecting && !isLocalLightNode && 'Connecting'}
				    	{(showConnecting && isLocalLightNode) && (syncing ? 'Syncing' : 'Looking For Peers')}
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
		               			[Styles['ConnectingView__loadingIndicator-connected']]: connected,
		           			})}
	  			>
	  				<div className={Styles.ConnectingView__graph}>
                      <div className={Styles["ConnectingView__graph-current"]}>
                        <div style={currentPercentStyle} />
                      </div>
                    </div>
	  			</div>
			</section>
	  	)
	}
}

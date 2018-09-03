import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './processing-view.styles.less'
import classNames from "classnames";

function addCommas(number) {
  if (!number || isNaN(number)) {
    return number
  }
  let sides = []

  sides = number.toString().split('.')
  sides[0] = sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return sides.join('.')
}

export class ProcessingView extends Component {
 	static propTypes = {
	    processing: PropTypes.bool,
	    fullyProcessed: PropTypes.bool,
	    augurNodeBlockInfo: PropTypes.object,
	    openBrowserEnabled: PropTypes.bool,
	};

	constructor(props) {
	    super(props);
	    this.state = {
	      hideDetails: true,
	    };

	    this.toggleHideDetails = this.toggleHideDetails.bind(this);
	}

	toggleHideDetails() {
	    this.setState({hideDetails: !this.state.hideDetails});
	 }

  	render() {
  		const {
  			processing,
  			augurNodeBlockInfo,
  			openBrowserEnabled,
  		} = this.props

		const pct = augurNodeBlockInfo.lastSyncBlockNumber ? ((augurNodeBlockInfo.lastSyncBlockNumber - augurNodeBlockInfo.uploadBlockNumber) / (augurNodeBlockInfo.highestBlockNumber - augurNodeBlockInfo.uploadBlockNumber) * 100) : 0
  		let pctLbl = (pct * Math.pow(10, 2)) / Math.pow(10, 2)
  		pctLbl = pctLbl.toFixed(2)
  		let percent = pctLbl
  		if (!processing) percent = 0

  		const blocksRemaining = parseInt(augurNodeBlockInfo.highestBlockNumber, 10) - parseInt(augurNodeBlockInfo.lastSyncBlockNumber, 10)
  		if (blocksRemaining <= 5) {
	      percent = 100
	    }

  		const blocksBehind = addCommas(blocksRemaining) || 0

  		const blocksProcessed = addCommas(augurNodeBlockInfo.lastSyncBlockNumber) || 0
  		const highestBlocks = addCommas(augurNodeBlockInfo.highestBlockNumber) || 0

  		const currentPercentStyle = {
	      width: `${percent}%`,
	      backgroundColor: (openBrowserEnabled && processing ? '#00f1c4' : (processing ? '#cbc5d9' : 'transparent')),
	    };


	   


	  	return (
	  		<section className={classNames(Styles.ProcessingView, {
		               			[Styles['ProcessingView-processing']]: processing,
		               			[Styles['ProcessingView-tall']]: processing && !this.state.hideDetails,
		           			})}
	  		>
	  			<div className={Styles.ProcessingView__connectingContainer}>
				    <div className={classNames(Styles.ProcessingView__processingTitle, {
		               			[Styles['ProcessingView__processingTitle-processing']]: processing,
		           			})}
				    >Processing Market Data</div>
				    <div
				    	className={classNames(Styles.ProcessingView__processingText, {
		               			[Styles['ProcessingView__processingText-processing']]: processing,
		           			})}
				    >
				    	{percent} <span className={Styles['ProcessingView__processingText-percent']}>%</span>
				    	{ processing &&
				    		<div className={Styles['ProcessingView__showDetails']} onClick={this.toggleHideDetails}>
				    			{this.state.hideDetails ? 'Show details' : 'Hide details'}
				    			<div
						    		className={classNames(Styles['ProcessingView__showDetails-arrow'], {
				               			[Styles['ProcessingView__showDetails-arrow-turned']]: this.state.hideDetails,
				           			})}
				    			/>
				    		</div>
				    	}
				    </div>
				    { processing && !this.state.hideDetails &&
			    		<div className={Styles.ProcessingView__blocksInfo}>
			    			<div className={Styles.ProcessingView__blocksBehind}>
			    				{blocksBehind}
			    			</div>
			    			<div className={Styles.ProcessingView__blocksLabel}>
			    				blocks behind
			    			</div>
			    			<div className={Styles.ProcessingView__blocksInfoBreak} />
			    			<div className={Styles.ProcessingView__blocksFraction}>
			    				<div className={Styles.ProcessingView__blocksProcessed}>
			    					{blocksProcessed}
			    				</div>
			    				<div className={Styles.ProcessingView__highestBlocks}>
			    					/ {highestBlocks}
			    				</div>
			    			</div>
			    			<div className={Styles.ProcessingView__blocksLabel}>
			    				blocks processed
			    			</div>
			    		</div>
				    }
			    </div>
			    <div className={classNames(Styles.ProcessingView__loadingIndicator, {
		               			[Styles['ProcessingView__loadingIndicator-processing']]: processing,
		           			})}
	  			>
	  				<div className={Styles.ProcessingView__graph}>
                      <div className={Styles["ProcessingView__graph-current"]}>
                        <div style={currentPercentStyle} />
                      </div>
                    </div>
	  			</div>
			</section>
	  	)
	}
}

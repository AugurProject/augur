import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './processing-view.styles.less'
import classNames from "classnames";

export class ProcessingView extends Component {
 	static propTypes = {
	    processing: PropTypes.bool,
	    fullyProcessed: PropTypes.bool, 
	    blockInfo: PropTypes.object,
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
  			processing, blockInfo 
  		} = this.props
  		// let processing = true
  		console.log(blockInfo)

	  	return (
	  		<section className={classNames(Styles.ProcessingView, {
		               			[Styles['ProcessingView-processing']]: processing,
		               			[Styles['ProcessingView-tall']]: !this.state.hideDetails,
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
				    	0 <span className={Styles['ProcessingView__processingText-percent']}>%</span>
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
			    </div>
			    <div className={classNames(Styles.ProcessingView__loadingIndicator, {
		               			[Styles['ProcessingView__loadingIndicator-processing']]: processing,
		           			})}
	  			/>
			</section>
	  	)
	}
}

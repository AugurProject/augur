import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './processing-view.styles.less'

export class ProcessingView extends Component {
 	static propTypes = {
	    processing: PropTypes.bool,
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
	  	return (
	  		<section className={Styles.ProcessingView}>
	  			<div className={Styles.ProcessingView__connectingContainer}>
				    <div className={Styles.ProcessingView__processingTitle}>Processing Market Data</div>
				    <div className={Styles.ProcessingView__processingText}>
				    	0 <span className={Styles['ProcessingView__processingText-percent']}>%</span>
				    </div>
			    </div>
			    <div className={Styles.ProcessingView__loadingIndicator}></div>
			</section>
	  	)
	}
}

import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import './connecting-view.styles.css';

export class ConnectingView extends Component {
 	static propTypes = {
	    connected: PropTypes.bool,
	};

	constructor(props) {
	    super(props);
	}

  	render() {
  		console.log(this.props.connected)
	  	return (
	  		<section className='ConnectingView'>
			    <div>Connecting to Ethereum</div>
			    <div>Disconnected</div>
			    <div>loading</div>
			</section>
	  	)
	}
}

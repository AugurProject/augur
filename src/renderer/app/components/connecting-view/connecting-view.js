import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import './connecting-view.styles.css';

export class ConnectingView extends Component {
  render() {
  	return (
  		<section className='ConnectingView'>
		    <div>Connecting to Ethereum</div>
		    <div>Disconnected</div>
		    <div>loading</div>
		</section>
  	)
  }
}
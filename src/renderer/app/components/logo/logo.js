import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
// import Styles from './logo.styles.less'
import './logo.styles.css';

export class Logo extends Component {
  render() {
  	return (
  		<section className='Logo'>
		    <span className='Logo__text'>Augur</span>
		</section>
  	)
  }
}
import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './logo.styles.less'

export class Logo extends Component {
  render() {
  	return (
  		<section className={Styles.Logo}>
		    <span className={Styles.Logo__text}>Augur</span>
		</section>
  	)
  }
}
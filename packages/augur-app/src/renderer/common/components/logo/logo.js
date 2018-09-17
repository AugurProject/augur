import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './logo.styles.less'

export class Logo extends Component {
  render() {
  	return (
  		<section className={Styles.Logo}>
       		<div className={Styles.Logo_image} />
		</section>
  	)
  }
}

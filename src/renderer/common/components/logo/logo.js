import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './logo.styles.less'
import logoPng from '../../../../assets/images/logo@3x.png'

export class Logo extends Component {
  render() {
  	return (
  		<section className={Styles.Logo}>
            <img src={logoPng} alt="augur" width="100" />
		</section>
  	)
  }
}
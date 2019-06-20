import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/create-market/components/form/form.styles";

export default class Form extends Component {

  componentWillReceiveProps = (nextProps) => {
  }

  prevPage = () => {
  }

  nextPage = () =>  {
  }

  render() {
    const {
      addOrderToNewMarket,
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.Form}>
      </div>
    );
  }
}

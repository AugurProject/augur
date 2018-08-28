import React, { Component } from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

export class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.object.isRequired,
    removeNotification: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}

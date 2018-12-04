import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import makePath from "modules/routes/helpers/make-path";
import { DEFAULT_VIEW } from "modules/routes/constants/views";

import Styles from "modules/common/components/main-error-boundary/main-error-boundary.styles";

export default class MainErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    const { children } = this.props;
    if (this.state.hasError) {
      return (
        <section className={Styles.MainErrorBoundary}>
          <div className={Styles.MainErrorBoundary__container}>
            <h1 className={Styles.MainErrorBoundary__header}>Error</h1>
            <p className={Styles.MainErrorBoundary__description}>
              Sorry, something went wrong! Try reloading this page or returning
              home.
            </p>
            <div className={Styles.MainErrorBoundary__buttons}>
              <button
                className={Styles.MainErrorBoundary__refresh}
                onClick={e => {
                  window.location.reload();
                }}
              >
                Refresh Page
              </button>
              <Link
                className={Styles.MainErrorBoundary__return}
                to={{
                  pathname: makePath(DEFAULT_VIEW)
                }}
                onClick={e => {
                  // change location to DEFAULT_VIEW and update state.
                  this.setState({ hasError: false });
                }}
              >
                Return Home
              </Link>
            </div>
          </div>
        </section>
      );
    }

    return children;
  }
}

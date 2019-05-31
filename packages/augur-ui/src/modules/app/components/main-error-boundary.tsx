import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import makePath from "modules/routes/helpers/make-path";
import { DEFAULT_VIEW } from "modules/routes/constants/views";
import { SecondaryButton } from "modules/common-elements/buttons";

import Styles from "modules/app/components/main-error-boundary.styles";
import ButtonStyles from "modules/common-elements/buttons.styles";

interface MEBProps {
  children: Element;
}

interface MEBState {
  hasError: Boolean;
}

export default class MainErrorBoundary extends Component<MEBProps, MEBState> {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  state: MEBState = {
    hasError: false
  };

  componentWillReceiveProps(nextProps: MEBProps) {
    if (this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return (
        <section className={Styles.MainErrorBoundary}>
          <div>
            <h1>Error</h1>
            <p>
              Sorry, something went wrong! Try reloading this page or returning
              home.
            </p>
            <div>
              <SecondaryButton
                text="Refresh Page"
                action={() => window.location.reload()}
              />
              <Link
                className={ButtonStyles.PrimaryButton}
                to={{
                  pathname: makePath(DEFAULT_VIEW, false)
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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';
import { DEFAULT_VIEW } from 'modules/routes/constants/views';
import { SecondaryButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/main-error-boundary.styles';
import ButtonStyles from 'modules/common/buttons.styles';

interface MEBState {
  hasError: boolean;
}

export default class MainErrorBoundary extends Component<{}, MEBState> {
  state: MEBState = {
    hasError: false,
  };

  componentDidUpdate(prevProps: {}, prevState: MEBState) {
    const { hasError } = this.state
    if (hasError) {
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
                  pathname: makePath(DEFAULT_VIEW, false),
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

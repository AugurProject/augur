import React, { Component } from "react";
import classNames from "classnames";

import { ACCOUNT_TYPES, ERROR_TYPES } from "modules/common/constants";
import { errorIcon } from "modules/common/icons";

import StylesDropdown from "modules/auth/components/connect-dropdown/connect-dropdown.styles";
import Styles from "modules/auth/components/common/error-container.styles";
import ToggleHeightStyles from "utils/toggle-height.styles";

interface ErrorContainerProps {
  error?: any;
  connect: (accountTypes: string) => void;
  isSelected: boolean;
}

interface ErrorContainerState {
  errorShown: boolean;
}

export default class ErrorContainer extends Component<ErrorContainerProps, ErrorContainerState> {
  static defaultProps = {
    error: null
  };

  state = {
    errorShown: false
  };

  constructor(props) {
    super(props);

    this.hideError = this.hideError.bind(this);
    this.showError = this.showError.bind(this);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      this.props.error !== nextProps.error &&
      nextProps.isSelected &&
      nextProps.error
    ) {
      this.showError();
    } else if (
      this.props.isSelected !== nextProps.isSelected &&
      !nextProps.isSelected
    ) {
      this.hideError();
    } else if (!nextProps.error && this.state.errorShown) {
      this.hideError();
    }
  }

  showError() {
    this.setState({ errorShown: true });
  }

  hideError() {
    this.setState({ errorShown: false });
  }

  render() {
    const { error, connect } = this.props;
    const { errorShown } = this.state;
    return (
      <div
        ref={error => {
          this.error = error;
        }}
        className={classNames(
          StylesDropdown.ConnectDropdown__hardwareContent,
          ToggleHeightStyles.target,
          {
            [ToggleHeightStyles.open]: errorShown
          }
        )}
      >
        <div className={classNames(StylesDropdown.ConnectDropdown__content)}>
          <div className={Styles.ErrorContainer__header}>
            <div className={Styles.ErrorContainer__headerIcon}>
              {error && errorIcon}
            </div>
            {error && error.header}
          </div>
          <div className={Styles.ErrorContainer__subheader}>
            {error === ERROR_TYPES.UNABLE_TO_CONNECT && (
              <div className={Styles.ErrorContainer__words}>
                Please install or enable the MetaMask browser plug-in from
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={Styles.ErrorContainer__link}
                >
                  Metamask.io
                </a>
              </div>
            )}
            {error !== ERROR_TYPES.UNABLE_TO_CONNECT &&
              error &&
              error.subheader}
            {error === ERROR_TYPES.NOT_SIGNED_IN && (
              <div className={StylesDropdown.ConnectDropdown__retryContainer}>
                <button
                  className={StylesDropdown.ConnectDropdown__retryButton}
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    connect(ACCOUNT_TYPES.METAMASK);
                  }}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

import React from 'react';
import classNames from 'classnames';

import { ACCOUNT_TYPES, ERROR_TYPES } from 'modules/common/constants';
import { errorIcon } from 'modules/common/icons';

import StylesDropdown from 'modules/auth/components/connect-dropdown/connect-dropdown.styles';
import Styles from 'modules/auth/components/common/error-container.styles';
import ToggleHeightStyles from 'utils/toggle-height.styles';

interface ErrorContainerProps {
  error?: {
    header: string;
    subheader: string;
  };
  connect: (accountTypes: string) => void;
  isSelected: boolean;
}

const ErrorContainer: React.FC<ErrorContainerProps> = props => {
  const { error, connect, isSelected } = props;

  // funcs
  const onRetry: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    e.preventDefault();

    connect(ACCOUNT_TYPES.METAMASK);
  };

  const errorShown = error && isSelected;

  return (
    <div
      className={classNames(
        StylesDropdown.ConnectDropdown__hardwareContent,
        ToggleHeightStyles.target,
        {
          [ToggleHeightStyles.open]: errorShown,
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
          {error !== ERROR_TYPES.UNABLE_TO_CONNECT && error && error.subheader}
          {error === ERROR_TYPES.NOT_SIGNED_IN && (
            <div className={StylesDropdown.ConnectDropdown__retryContainer}>
              <button
                className={StylesDropdown.ConnectDropdown__retryButton}
                onClick={onRetry}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ErrorContainer.defaultProps = {
  error: null,
};

export default ErrorContainer;

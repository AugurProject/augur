import React, { Component } from 'react';
import classNames from 'classnames';

import { Close } from 'modules/common/icons';
import { FAILURE } from 'modules/common/constants';
import Styles from 'modules/alerts/components/alert.styles.less';
import { ViewTransactionDetailsButton } from 'modules/common/buttons';
import { convertUnixToFormattedDate } from 'utils/format-date';

interface AlertProps {
  id: string;
  uniqueId: string;
  title: string;
  description?: string;
  details?: string;
  linkPath?: string | any;
  onClick?: Function;
  removeAlert: Function;
  seen: boolean;
  timestampInMilliseconds: number;
  toggleAlerts: Function;
  noShow?: boolean;
  showToast?: boolean;
  status: string;
}

export default class Alert extends Component<AlertProps, {}> {
  render() {
    const {
      id,
      details,
      description,
      removeAlert,
      seen,
      timestampInMilliseconds,
      title,
      noShow,
      showToast,
      status
    } = this.props;

    if (!title || title === '') return null;

    if (noShow) return null;
    return (
      <article
        className={classNames(Styles.Alert, {
          [Styles.Seen]: seen,
          [Styles.Failure]: status === FAILURE
        })}
      >
        <div>
          <div className={Styles.Row}>
            <div className={Styles.Status}>{title}</div>
            <button
              className={Styles.Close}
              onClick={e => {
                removeAlert();
              }}
            >
              {Close}
            </button>
          </div>
          <div className={Styles.Row}>
            <span className={Styles.Title}>{description}</span>
          </div>
          {description && description !== '' && (
            <div className={Styles.Row}>
              <span className={Styles.Description}>{details}</span>
            </div>
          )}
          <div className={Styles.Row}>
            {!showToast && (
              <>
                <span className={Styles.Timestamp}>
                  {
                    convertUnixToFormattedDate(timestampInMilliseconds / 1000)
                      .formattedLocalShortWithUtcOffset
                  }
                </span>
                <span className={Styles.EtherLink}>
                  <ViewTransactionDetailsButton
                    light
                    transactionHash={id}
                    label="view etherscan"
                  />
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }
}

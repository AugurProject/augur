import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';

import { Close } from 'modules/common/icons';
import Styles from 'modules/alerts/components/alert.styles.less';
import { ViewTransactionDetailsButton } from 'modules/common/buttons';
import { convertUnixToFormattedDate } from 'utils/format-date';

interface AlertProps {
  id: string;
  title: string;
  description?: string;
  details?: string;
  linkPath?: string | any;
  onClick?: Function;
  removeAlert: Function;
  seen: boolean;
  timestampInMilliseconds: number;
  status: string;
  toggleAlerts: Function;
  noShow?: boolean;
  toast?: boolean;
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
      toast,
    } = this.props;

    if (!title || title === '') return null;

    if (noShow) return null;
    return (
      <article
        className={classNames(Styles.Alert, {
          [Styles.Seen]: seen,
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
            {!toast && (
              <>
                <span className={Styles.Timestamp}>
                  {
                    convertUnixToFormattedDate(timestampInMilliseconds / 1000)
                      .formattedLocalShortTime
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

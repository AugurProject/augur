import React from 'react';
import Styles from 'modules/common/filter-notice.styles.less';
import {ExclamationCircle, XIcon} from 'modules/common/icons';

interface FilterNoticeProps {
  color?: string;
  content: JSX.Element;
  show: boolean;
  isInvalidMarketsBanner?: boolean;
  updateLoginAccountSettings?: Function;
  showInvalidMarketsBanner?: boolean;
}

export const FilterNotice = (props: FilterNoticeProps) => {
  const showNotice = () => props.isInvalidMarketsBanner ? props.showInvalidMarketsBanner && props.show : props.show;

  return (
    <div className={Styles.filterNotice}>
      {showNotice() ? (
        <div>
          <span className={props.color === 'red' ? Styles.red : Styles.grey}>
            {ExclamationCircle}
          </span>
          {props.content}
          {
            props.isInvalidMarketsBanner &&
            <button
              type='button'
              onClick={() => props.updateLoginAccountSettings({showInvalidMarketsBanner: false})}
            >
              {XIcon}
            </button>
          }
        </div>
      ) : null}
    </div>
  );
};

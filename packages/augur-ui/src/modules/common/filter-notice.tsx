import React from 'react';
import Styles from 'modules/common/filter-notice.styles.less';
import { ExclamationCircle } from 'modules/common/icons';

interface FilterNoticeProps {
  color?: string;
  content: JSX.Element;
  show: boolean;
}

export const FilterNotice = (props: FilterNoticeProps) => {
  return (
    <div className={Styles.filterNotice}>
      {props.show ? (
        <div>
          <span className={props.color === 'red' ? Styles.red : Styles.grey}>
            {ExclamationCircle}
          </span>
          {props.content}
        </div>
      ) : null}
    </div>
  );
};

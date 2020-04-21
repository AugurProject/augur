import React from 'react';
import Styles from 'modules/common/filter-notice.styles.less';
import {ExclamationCircle, XIcon} from 'modules/common/icons';
import classNames from 'classnames';

interface Settings {
  propertyName: string;
  propertyValue: boolean;
}

interface FilterNoticeProps {
  color?: string;
  content: JSX.Element;
  show: boolean;
  settings?: Settings;
  showDismissButton?: boolean;
  updateLoginAccountSettings?: Function;
}

export const FilterNotice = (props: FilterNoticeProps) => {
  const showNotice = () => props.showDismissButton ? props.settings.propertyValue && props.show : props.show;

  return (
    <div className={classNames(Styles.filterNotice,{[Styles.active]: props.color === 'active'})}>
      {showNotice() ? (
        <div>
          <span className={props.color === 'active' ? Styles.active : Styles.primary}>
            {ExclamationCircle}
          </span>
          {props.content}
          {
            props.showDismissButton &&
            <button
              type='button'
              onClick={() => props.updateLoginAccountSettings({[props.settings.propertyName]: false})}
            >
              {XIcon}
            </button>
          }
        </div>
      ) : null}
    </div>
  );
};

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

export const FilterNotice = ({
  showDismissButton,
  show,
  color,
  content,
  updateLoginAccountSettings,
  settings
}: FilterNoticeProps) => {
  const showNotice = () => showDismissButton ? settings.propertyValue && show : show;

  return (
    <div className={classNames(Styles.filterNotice,{[Styles.active]: color === 'active'})}>
      {showNotice() ? (
        <div>
          <span className={color === 'active' ? Styles.active : Styles.primary}>
            {ExclamationCircle}
          </span>
          {content}
          {
            showDismissButton &&
            <button
              type='button'
              onClick={() => updateLoginAccountSettings({[settings.propertyName]: false})}
            >
              {XIcon}
            </button>
          }
        </div>
      ) : null}
    </div>
  );
};

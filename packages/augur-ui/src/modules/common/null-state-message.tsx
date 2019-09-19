import React from 'react';
import classNames from 'classnames';
import Styles from 'modules/common/null-state-message.styles.less';

interface NullStateProps {
  message?: string;
  subMessage?: string;
  icon?: JSX.Element;
  addNullPadding?: boolean;
  className?: string;
}
const NullStateMessage = (p: NullStateProps) => {
  return (
    <article
      className={classNames(p.className, Styles.NullState, {
        [`${Styles.Padding}`]: p.addNullPadding,
      })}
    >
      {p.icon && <span>{p.icon}</span>}
      <span>{p.message}</span>
      {p.subMessage && <span>{p.subMessage}</span>}
    </article>
  );
};

NullStateMessage.defaultProps = {
  message: 'No Data Available',
  addNullPadding: false,
};

export default NullStateMessage;

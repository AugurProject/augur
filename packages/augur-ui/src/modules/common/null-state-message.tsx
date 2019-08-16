import React from "react";
import classNames from "classnames";
import Styles from "modules/common/null-state-message.styles.less";

interface NullStateProps {
  message?: string;
  addNullPadding: Boolean;
  className?: string;
}
const NullStateMessage = (p: NullStateProps) => {
    return (
      <article
      className={classNames(p.className, Styles.NullState, {
        [`${Styles.Padding}`]: p.addNullPadding
      })}
    >
    <span>{p.message}</span>
    </article>
    )
};

NullStateMessage.defaultProps = {
  message: "No Data Available"
};

export default NullStateMessage;

import React from "react";
import classNames from "classnames";

import { isPopulated } from "utils/is-populated";

import Styles from "modules/common/null-state-message.styles";
interface NullStateProps {
  message?: string;
  addNullPadding: Boolean;
  className?: string;
}
const NullStateMessage = (p: NullStateProps) => (
  <article
    className={classNames(p.className, Styles.NullState, {
      [`${Styles.Padding}`]: p.addNullPadding
    })}
  >
    {!isPopulated(p.message) ? (
      <span>No Data Available</span>
    ) : (
      <span>{p.message}</span>
    )}
  </article>
);

export default NullStateMessage;

import React from "react";
import classNames from "classnames";

import isPopulated from "utils/is-populated";

import Styles from "modules/common/components/null-state-message/null-state-message.styles";

const NullStateMessage = p => (
  <article
    className={classNames(p.className, Styles.NullState, {
      [`${Styles.NullState__padding}`]: p.addNullPadding
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

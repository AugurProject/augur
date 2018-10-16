import React from "react";
import classNames from "classnames";

import MarketsHeaderStyles from "modules/markets-list/components/markets-header/markets-header.styles";

const MarketsHeaderLabel = p => (
  <article
    className={classNames({
      [MarketsHeaderStyles.MarketsHeader]: !p.noTopPadding,
      [MarketsHeaderStyles.MarketsHeader__top]: p.noTopPadding
    })}
  >
    <h4 className={MarketsHeaderStyles.MarketsHeader__subheading}>{p.title}</h4>
  </article>
);

export default MarketsHeaderLabel;

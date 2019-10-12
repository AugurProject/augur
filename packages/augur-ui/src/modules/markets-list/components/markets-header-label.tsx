import React from "react";
import classNames from "classnames";

import Styles from "modules/markets-list/components/markets-header.styles.less";

interface MarketsHeaderLabelProps {
  noTopPadding?: boolean;
  title: string;
}

const MarketsHeaderLabel: React.FC<MarketsHeaderLabelProps> = ({
  noTopPadding,
  title
}) => (
    <article
      className={classNames({
        [Styles.MarketsHeader]: !noTopPadding
      })}
    >
      <h4>{title}</h4>
    </article>
  );

MarketsHeaderLabel.defaultProps = {
  noTopPadding: false
};

export default MarketsHeaderLabel;

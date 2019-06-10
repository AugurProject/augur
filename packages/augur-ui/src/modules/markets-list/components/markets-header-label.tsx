import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/markets-list/components/markets-header.styles.less";

interface MarketsHeaderLabel {
  noTopPadding?: Boolean;
  title: string;
}

const MarketsHeaderLabel = ({
  noTopPadding = false,
  title
}: MarketsHeaderLabel) => (
  <article
    className={classNames({
      [Styles.MarketsHeader]: !noTopPadding
    })}
  >
    <h4>{title}</h4>
  </article>
);

MarketsHeaderLabel.propTypes = {
  noTopPadding: PropTypes.bool,
  title: PropTypes.string.isRequired
};

MarketsHeaderLabel.defaultProps = {
  noTopPadding: false
};

export default MarketsHeaderLabel;

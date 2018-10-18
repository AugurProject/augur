import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketsHeaderStyles from "modules/markets-list/components/markets-header/markets-header.styles";

const MarketsHeaderLabel = ({ noTopPadding = false, title }) => (
  <article
    className={classNames({
      [MarketsHeaderStyles.MarketsHeader]: !noTopPadding,
      [MarketsHeaderStyles.MarketsHeader__top]: noTopPadding
    })}
  >
    <h4 className={MarketsHeaderStyles.MarketsHeader__subheading}>{title}</h4>
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

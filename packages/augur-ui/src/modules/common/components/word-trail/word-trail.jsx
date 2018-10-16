import React from "react";
import PropTypes from "prop-types";
import Styles from "modules/common/components/word-trail/word-trail.styles";
import { SimpleButton } from "src/modules/common/components/simple-button";

const WordTrail = ({ items = [], typeLabel }) => (
  <div className={Styles.WordTrail}>
    <div className={Styles.WordTrail__label}>{typeLabel}</div>
    {items.map(({ label, onClick }, index) => (
      <SimpleButton
        testid={typeLabel + "-" + index}
        className="tag-trail-button"
        key={label}
        text={label}
        onClick={onClick}
      />
    ))}
  </div>
);

WordTrail.propTypes = {
  typeLabel: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  ).isRequired
};

export default WordTrail;

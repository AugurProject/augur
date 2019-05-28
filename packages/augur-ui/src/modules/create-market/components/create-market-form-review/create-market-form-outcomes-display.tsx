import React from "react";
import PropTypes from "prop-types";

export const DisplayOutcomes = ({ outcomes }) =>
  outcomes
    .filter(o => o.length !== 0)
    .map((o, n) => <li key={n.toString()}>{o}</li>);

DisplayOutcomes.propTypes = {
  outcomes: PropTypes.array.isRequired
};

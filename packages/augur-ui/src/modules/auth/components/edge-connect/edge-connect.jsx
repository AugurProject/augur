import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Helmet from "react-helmet";

import Styles from "modules/auth/components/edge-connect/edge-connect.styles";

const Edge = p => (
  <section className={Styles.Edge}>
    <Helmet>
      <title>Edge</title>
    </Helmet>
    <button
      className={classNames(
        Styles.button,
        Styles[`button--purple`],
        Styles.Edge__button
      )}
      disabled={p.edgeLoading}
      onClick={() => p.edgeLoginLink(p.history)}
    >
      {p.edgeLoading ? "Loading..." : "Login With Edge"}
    </button>
  </section>
);

Edge.propTypes = {
  history: PropTypes.object.isRequired,
  edgeLoading: PropTypes.bool.isRequired,
  edgeLoginLink: PropTypes.func.isRequired
};

export default Edge;

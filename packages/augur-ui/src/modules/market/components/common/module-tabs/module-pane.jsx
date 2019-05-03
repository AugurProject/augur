import PropTypes from "prop-types";

const ModulePane = p => p.children;

ModulePane.propTypes = {
  label: PropTypes.string,
  onClickCallback: PropTypes.func
};

export default ModulePane;

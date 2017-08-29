import React from 'react';
import PropTypes from 'prop-types';

const spritemap = 'assets/images/spritemap.svg';

const SVG = ({ className, role, title, id, onClick, disabled }) => (
  <svg
    className={className}
    onClick={onClick}
    role={role || 'img'}
    title={title}
    disabled={disabled}
    dangerouslySetInnerHTML={{
      __html: `<title>${title}</title><use xlink:href='${spritemap}#${id}' />`
    }}
  />
);

SVG.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.string,
  title: PropTypes.string,
  role: PropTypes.string,
  onClick: PropTypes.func,
};

export default SVG;

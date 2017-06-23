import React from 'react';
import PropTypes from 'prop-types';
import Link from 'modules/link/components/link';

const Paginator = p => (
  <article className="paginator">
    <div className="pagination-control-container">
      <div className="pagination-group-1">
        {!!p.previousPageLink &&
          <Link
            {...p.previousPageLink}
            className="button"
          >
            <i className="fa fa-angle-left" />
          </Link>
        }
      </div>

      <div className="pagination-group-2">
        <span className="pagination-count">
          {p.startItemNum}{!!p.endItemNum && p.endItemNum > 1 && ` - ${p.endItemNum}`} <strong>of</strong> {p.numUnpaginated}
        </span>
      </div>

      <div className="pagination-group-3">
        {!!p.nextPageLink &&
          <Link
            {...p.nextPageLink}
            className="button"
          >
            <i className="fa fa-angle-right" />
          </Link>
        }
      </div>
    </div>
  </article>
);

Paginator.propTypes = {
  previousPageNum: PropTypes.number,
  previousPageLink: PropTypes.object,
  startItemNum: PropTypes.number,
  endItemNum: PropTypes.number,
  numUnpaginated: PropTypes.number,
  nextPageNum: PropTypes.number,
  nextPageLink: PropTypes.object,
  isMobile: PropTypes.bool
};

export default Paginator;

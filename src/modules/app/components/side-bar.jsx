import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import Checkbox from 'modules/common/components/checkbox';
// import NullStateMessage from 'modules/common/components/null-state-message';

import FilterSort from 'modules/filter-sort/container';

export default class SideBar extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      filteredMarkets: [],
      filteredTags: []
    };
  }

  // componentWillMount:
  //
  // updateCurrentTags(filteredMarkets) {
  //
  // }

  render() {
    const p = this.props;

    return (
      <aside
        className="side-bar"
        style={{
          top: p.headerHeight,
          bottom: p.footerHeight
        }}
      >
        <h3>All Tags</h3>
        <div className="tags">
          <span>Sidebar</span>
        </div>
      </aside>
    );
  }
}

// const SideBar = p => (
//   <aside
//     className="side-bar"
//     style={{
//       top: p.headerHeight,
//       bottom: p.footerHeight
//     }}
//   >
//     <h3>All Tags</h3>
//     <div className="tags">
//       <FilterSort
//         items={p.markets}
//       />
//     </div>
//   </aside>
// );
//
// export default SideBar;
//
// SideBar.propTypes = {
//   location: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired,
//   headerHeight: PropTypes.number.isRequired,
//   footerHeight: PropTypes.number.isRequired,
//   markets: PropTypes.array.isRequired
// };

// {p.tags.length ? p.tags.map(tag =>
//   <Checkbox
//     key={tag.value}
//     className="tag"
//     text={tag.name}
//     text2={`(${tag.numMatched})`}
//     isChecked={tag.isSelected}
//     onClick={() => p.toggleTag(tag.value, p.location, p.history)}
//   />
// ) : <NullStateMessage message="No Tags Available" />
// }

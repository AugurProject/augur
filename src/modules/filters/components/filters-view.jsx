import React, { Component } from 'react';

// TODO -- refactored reusable structure
//  props:
//    Full List
//    Location (full obj)
//    History
//    {...filter types desired (bools)}
//    update method

export default class FiltersView extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <article>
        <span>Filters!</span>
      </article>
    );
  }
}

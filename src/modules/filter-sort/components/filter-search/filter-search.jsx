import React, { Component } from "react";
import PropTypes from "prop-types";
import Input from "modules/common/components/input/input";

import parseQuery from "modules/routes/helpers/parse-query";
import makeQuery from "modules/routes/helpers/make-query";

import { FILTER_SEARCH_PARAM } from "modules/filter-sort/constants/param-names";

import Styles from "modules/filter-sort/components/filter-search/filter-search.styles";

export default class FilterSearch extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hasLoadedMarkets: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      search: "",
      placeholder: "Search",
      width: "250px"
    };

    this.updateQuery = this.updateQuery.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.timeout = null;
  }

  componentWillMount() {
    const { location } = this.props;
    const search = parseQuery(location.search)[FILTER_SEARCH_PARAM];
    if (search) this.setState({ search });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.search !== nextState.search) {
      this.updateQuery(nextState.search, nextProps.location);
    }
  }

  onFocus() {
    this.setState({ placeholder: "", width: "400px" });
  }

  onBlur() {
    this.setState({ placeholder: "Search", width: "250px" });
  }

  onChange(search) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.setState({ search });
    }, 500);
  }

  updateQuery(search, location) {
    const { history } = this.props;
    let updatedSearch = parseQuery(location.search);

    if (search === "") {
      delete updatedSearch[FILTER_SEARCH_PARAM];
    } else {
      updatedSearch[FILTER_SEARCH_PARAM] = search;
    }

    updatedSearch = makeQuery(updatedSearch);

    history.push({
      ...location,
      search: updatedSearch
    });
  }

  render() {
    const { hasLoadedMarkets } = this.props;
    const s = this.state;

    return (
      <article className={Styles.FilterSearch} style={{ minWidth: s.width }}>
        <Input
          className={Styles.FilterSearch__input}
          isSearch
          isClearable
          noFocus
          placeholder={s.placeholder}
          value={s.search}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          isLoading={Boolean(!hasLoadedMarkets && s.search && s.search !== "")}
        />
      </article>
    );
  }
}

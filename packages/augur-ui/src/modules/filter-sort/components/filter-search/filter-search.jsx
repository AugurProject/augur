import React, { Component } from "react";
import PropTypes from "prop-types";
import Input from "modules/common/components/input/input";
import classNames from "classnames";
import parseQuery from "modules/routes/helpers/parse-query";
import makeQuery from "modules/routes/helpers/make-query";

import { PAGINATION_PARAM_NAME } from "modules/routes/constants/param-names";
import { FILTER_SEARCH_PARAM } from "modules/filter-sort/constants/param-names";
import { Hint } from "modules/common/components/icons";
import Styles from "modules/filter-sort/components/filter-search/filter-search.styles";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.styles";

export default class FilterSearch extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hasLoadedMarkets: PropTypes.bool,
    isMobileSmall: PropTypes.bool
  };

  static defaultProps = {
    hasLoadedMarkets: false,
    isMobileSmall: false
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
    this.resetSearch = this.resetSearch.bind(this);
    this.timeout = null;
  }

  componentWillMount() {
    const { location } = this.props;
    const search = parseQuery(location.search)[FILTER_SEARCH_PARAM];
    if (search) this.setState({ search });
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextProps.location !== this.props.location &&
      !nextProps.location.search.includes(FILTER_SEARCH_PARAM)
    ) {
      clearTimeout(this.timeout);
      this.resetSearch();
    }
    if (this.state.search !== nextState.search) {
      this.updateQuery(nextState.search, nextProps.location);
    }
  }

  onFocus() {
    const width = this.props.isMobileSmall ? "85vw" : "400px";
    this.setState({ placeholder: "", width });
  }

  onBlur() {
    this.setState({ placeholder: "Search", width: "250px" });
  }

  onChange(search) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (this.parent) {
        this.setState({ search });
      }
    }, 500);
  }

  resetSearch() {
    this.setState({ search: "", placeholder: "Search" });
  }

  updateQuery(search, location) {
    const { history } = this.props;
    let updatedSearch = parseQuery(location.search);

    if (search === "") {
      delete updatedSearch[FILTER_SEARCH_PARAM];
    } else {
      delete updatedSearch[PAGINATION_PARAM_NAME];
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
    const { width, placeholder, search } = this.state;

    return (
      <article
        className={Styles.FilterSearch}
        ref={parent => {
          this.parent = parent;
        }}
      >
        <label
          className={classNames(
            TooltipStyles.TooltipHint,
            Styles.FilterSearch__tooltip
          )}
          data-tip
          data-for="tooltip--search-input"
        >
          {Hint}
        </label>
        <ReactTooltip
          id="tooltip--search-input"
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="bottom"
          type="light"
        >
          <h4>Search Syntax</h4>
          <u>Specific field search:</u> prepend the field name:
          <b> category</b>, <b>title</b>, <b>details</b>, <b>source</b>,{" "}
          <b>tags</b>
          <p style={{ color: "#372e4b" }} />
          <p>
            Example: <b>title: ethereum</b>, returns markets with ethereum in
            market title.
          </p>
          <p>
            <u>Exact match:</u> Use a <b>double quoted string</b> to search
            exact phrase.
          </p>
          <p>
            Example: <b>&#34;price of bitcoin&#34;</b>
          </p>
          <p>
            <u>Either/Or:</u> Use capitalized <b>OR</b> between word(s) and/or
            phrase(s) to get matches for either word(s) or phrase(s)
          </p>
          <p>
            Example: <b>bitcoin OR ethereum OR litecoin</b>
          </p>
          <p>
            <u>All words:</u> Markets will contain all word(s) and phrase(s)
          </p>
          <p>
            Example: <b>bitcoin ethereum litecoin</b>
          </p>
        </ReactTooltip>
        <div
          className={Styles.FilterSearch__transition}
          style={{ minWidth: width }}
        >
          <Input
            className={Styles.FilterSearch__input}
            isSearch
            isClearable
            noFocus
            placeholder={placeholder}
            value={search}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            isLoading={Boolean(!hasLoadedMarkets && search && search !== "")}
          />
        </div>
      </article>
    );
  }
}

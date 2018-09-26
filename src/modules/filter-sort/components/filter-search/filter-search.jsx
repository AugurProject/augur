import React, { Component } from "react";
import PropTypes from "prop-types";
import Input from "modules/common/components/input/input";
import classNames from "classnames";
import parseQuery from "modules/routes/helpers/parse-query";
import makeQuery from "modules/routes/helpers/make-query";

import { FILTER_SEARCH_PARAM } from "modules/filter-sort/constants/param-names";
import { Hint } from "modules/common/components/icons";
import Styles from "modules/filter-sort/components/filter-search/filter-search.styles";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip";

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

  resetSearch() {
    this.setState({ search: "", placeholder: "Search" });
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
      <article className={Styles.FilterSearch}>
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
          Search specific fields,
          <ul>
            <li>
              <b>category:</b> word or phrase
            </li>
            <li>
              <b>title:</b> word or phrase
            </li>
            <li>
              <b>details:</b> word or phrase
            </li>
            <li>
              <b>source:</b> word or phrase
            </li>
            <li>
              <b>tags:</b> word or phrase
            </li>
          </ul>
          <p style={{ color: "#372e4b" }} />
          <p>
            example, <b>title: ethereum</b>, returns only markets with ethereum
            in market title.
          </p>
          <hr />
          <p>
            Use a <b>double quoted string</b> to search exact phrase.
          </p>
          <p>
            example, <b>&#34;price of bitcoin&#34;</b>
          </p>
          <hr />
          <p>
            Use capitalized <b>OR</b> between word(s) and/or phrase(s) to get
            matches for either word(s) or phrase(s)
          </p>
          <p>
            example, <b>bitcoin OR ethereum OR litecoin</b>
          </p>
          <hr />
          <p>
            By default words and phrases are ANDed. Markets returned will
            contain all word(s) and phrase(s)
          </p>
          <p>
            example, <b>bitcoin ethereum litecoin</b>
          </p>
        </ReactTooltip>
        <div
          className={Styles.FilterSearch__transition}
          style={{ minWidth: s.width }}
        >
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
            isLoading={Boolean(
              !hasLoadedMarkets && s.search && s.search !== ""
            )}
          />
        </div>
      </article>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import TransactionSingle from "modules/portfolio/components/transaction-single/transaction-single";
import TransactionMultiple from "modules/portfolio/components/transaction-multiple/transaction-multiple";
import Dropdown from "modules/common/components/dropdown/dropdown";
import Paginator from "modules/common/components/paginator/paginator";
import {
  DAY,
  WEEK,
  MONTH
} from "modules/transactions/constants/transaction-periods";

import {
  ALL,
  MARKET_CREATION,
  TRANSFER,
  REPORTING,
  TRADE,
  OPEN_ORDER,
  COMPLETE_SETS_SOLD
} from "modules/transactions/constants/types";

import { getBeginDate } from "src/utils/format-date";
import { isEqual, orderBy } from "lodash";
import Styles from "modules/portfolio/components/transactions/transactions.styles";
import PortfolioStyles from "modules/portfolio/components/portfolio-view/portfolio-view.styles";

export default class Transactions extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    transactions: PropTypes.array.isRequired,
    loadAccountHistoryTransactions: PropTypes.func.isRequired,
    transactionPeriod: PropTypes.string.isRequired,
    transactionsLoading: PropTypes.bool,
    updateTransactionPeriod: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      lowerBound: null,
      boundedLength: null,
      transactionPeriodOptions: [
        { label: "Past 24hrs", value: DAY },
        { label: "Past Week", value: WEEK },
        { label: "Past Month", value: MONTH },
        { label: "All", value: ALL }
      ],
      transactionTypeOptions: [
        { label: "All", value: ALL },
        { label: "Trades", value: TRADE },
        { label: "Orders", value: OPEN_ORDER },
        { label: "Transfers", value: TRANSFER },
        { label: "Market Creation", value: MARKET_CREATION },
        { label: "Reporting", value: REPORTING },
        { label: "Complete Sets", value: COMPLETE_SETS_SOLD }
      ],
      transactionPeriodDefault: props.transactionPeriod,
      transactionPeriod: props.transactionPeriod,
      filteredTransactions: [],
      transactionTypeDefault: ALL,
      transactionType: ALL
    };

    this.setSegment = this.setSegment.bind(this);
    this.changeTransactionDropdown = this.changeTransactionDropdown.bind(this);
    this.changeTransactionTypeDropdown = this.changeTransactionTypeDropdown.bind(
      this
    );
  }

  componentWillMount() {
    this.loadTransactions(
      this.state.transactionPeriodDefault,
      this.state.transactionTypeDefault
    );
    this.updateFilteredTransactions(this.props.transactions);
  }

  componentWillUpdate(nextProp) {
    if (!isEqual(nextProp.transactions, this.props.transactions)) {
      this.updateFilteredTransactions(nextProp.transactions);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.transactionPeriod !== this.state.transactionPeriod ||
      prevState.transactionType !== this.state.transactionType
    ) {
      this.loadTransactions(
        this.state.transactionPeriod,
        this.state.transactionType
      );
    }
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength });
  }

  updateFilteredTransactions(transactions) {
    const { transactionType } = this.state;
    let filteredTransactions = transactions;

    if (transactionType !== ALL) {
      filteredTransactions = transactions.filter(
        t => t.type === transactionType
      );
    }

    const sortedFilteredTransactions = orderBy(
      filteredTransactions,
      ["sortOrder"],
      ["timestamp.timestamp"]
    );

    this.setState({
      filteredTransactions: sortedFilteredTransactions
    });
  }

  loadTransactions(period, type) {
    const { currentTimestamp, loadAccountHistoryTransactions } = this.props;
    const beginDate = getBeginDate(currentTimestamp, period);
    loadAccountHistoryTransactions(beginDate, null, type);
  }

  changeTransactionDropdown(value) {
    let newPeriod = this.state.transactionPeriod;

    this.state.transactionPeriodOptions.forEach((period, ind) => {
      if (period.value === value) {
        newPeriod = value;
      }
    });

    this.setState({ transactionPeriod: newPeriod });
    this.props.updateTransactionPeriod(newPeriod);
  }

  changeTransactionTypeDropdown(value) {
    let newType = this.state.transactionType;

    this.state.transactionTypeOptions.forEach((type, ind) => {
      if (type.value === value) {
        newType = value;
      }
    });

    this.setState({ transactionType: newType });
  }

  render() {
    const { history, location, transactionsLoading } = this.props;
    const s = this.state;

    return (
      <section>
        <Helmet>
          <title>Transactions</title>
        </Helmet>
        <div className={Styles.Transaction__data}>
          <div className={Styles["Transaction__data-title"]}>
            <h2 className={Styles.Transactions__heading}>Transactions</h2>
          </div>
          <div className={Styles["Transaction__data-filter"]}>
            <Dropdown
              default={s.transactionTypeDefault}
              options={s.transactionTypeOptions}
              onChange={this.changeTransactionTypeDropdown}
            />
            <Dropdown
              default={s.transactionPeriodDefault}
              options={s.transactionPeriodOptions}
              onChange={this.changeTransactionDropdown}
            />
          </div>
        </div>

        {transactionsLoading === true && (
          <div className={PortfolioStyles.Loading__container}>
            <span>Loading...</span>
          </div>
        )}
        {transactionsLoading === false &&
          s.filteredTransactions.length === 0 && (
            <div className={PortfolioStyles.NoMarkets__container}>
              <span>You don&apos;t have any transactions.</span>
            </div>
          )}
        <div className={Styles.Transactions__list}>
          {transactionsLoading === false &&
            s.filteredTransactions.length > 0 &&
            s.boundedLength &&
            [...Array(s.boundedLength)].map((unused, i) => {
              const transaction = s.filteredTransactions[s.lowerBound - 1 + i];
              if (transaction) {
                if (
                  !transaction.transactions ||
                  (transaction.transactions &&
                    transaction.transactions.length <= 1)
                ) {
                  return (
                    <TransactionSingle
                      key={transaction.hash}
                      transaction={transaction}
                    />
                  );
                }
                return (
                  <TransactionMultiple
                    key={transaction.hash}
                    transaction={transaction}
                  />
                );
              }
              return null;
            })}
        </div>
        {transactionsLoading === false &&
          s.filteredTransactions.length > 0 && (
            <Paginator
              itemsLength={s.filteredTransactions.length}
              itemsPerPage={10}
              location={location}
              history={history}
              setSegment={this.setSegment}
            />
          )}
      </section>
    );
  }
}

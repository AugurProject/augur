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
  MONTH,
  ALL
} from "modules/transactions/constants/transaction-periods";

import { getBeginDate } from "src/utils/format-date";

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
    updateTransactionPeriod: PropTypes.func.isRequired,
    loadAccountCompleteSets: PropTypes.func.isRequired
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
      transactionPeriodDefault: props.transactionPeriod,
      transactionPeriod: props.transactionPeriod
    };

    this.setSegment = this.setSegment.bind(this);
    this.changeTransactionDropdown = this.changeTransactionDropdown.bind(this);
  }

  componentWillMount() {
    this.loadTransactions(this.state.transactionPeriodDefault);
    this.props.loadAccountCompleteSets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.transactionPeriod !== this.state.transactionPeriod) {
      this.loadTransactions(this.state.transactionPeriod);
    }
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength });
  }

  loadTransactions(value) {
    const { currentTimestamp, loadAccountHistoryTransactions } = this.props;
    const beginDate = getBeginDate(currentTimestamp, value);
    loadAccountHistoryTransactions(beginDate, null);
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

  render() {
    const { history, location, transactions, transactionsLoading } = this.props;
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
          transactions.length === 0 && (
            <div className={PortfolioStyles.NoMarkets__container}>
              <span>You don&apos;t have any transactions.</span>
            </div>
          )}
        <div className={Styles.Transactions__list}>
          {transactionsLoading === false &&
            transactions.length > 0 &&
            s.boundedLength &&
            [...Array(s.boundedLength)].map((unused, i) => {
              const transaction = transactions[s.lowerBound - 1 + i];
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
          transactions.length > 0 && (
            <Paginator
              itemsLength={transactions.length}
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

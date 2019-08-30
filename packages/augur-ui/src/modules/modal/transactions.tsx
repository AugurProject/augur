import React from "react";
import moment from "moment";
import {
  PrimaryButton,
  SecondaryButton,
  ExportButton,
  ViewTransactionDetailsButton,
  SortButton,
} from "modules/common/buttons";
import {
  ASCENDING,
  DESCENDING,
  NEUTRAL,
} from "modules/common/constants";
import { Pagination } from "modules/common/pagination";
import { ValueLabel, TextLabel } from "modules/common/labels";
import { DatePicker, FormDropdown } from "modules/common/form";
import { Title } from "modules/modal/common";
import { formatEther, formatShares } from "utils/format-number";
import Styles from "modules/modal/modal.styles.less";

interface TransactionsProps {
  closeAction: Function;
  title: string;
  currentTimestamp: any;
  getTransactionsHistory: Function;
}

interface TransactionInfo {
  transactionHash: string;
  timestamp: number;
  marketDescription: string;
  outcome: number | null;
  outcomeDescription: string | null;
  action: string;
  price: string;
  quantity: string;
  coin: string;
  fee: string;
  total: string;
  details: string;
}

interface TransactionsState {
  coin: string;
  action: string;
  itemsPerPage: number;
  page: number;
  startDate: Date | any;
  endDate: Date | any;
  startFocused: boolean;
  endFocused: boolean;
  AllTransactions: Array<TransactionInfo>;
  filteredTransactions: Array<TransactionInfo>;
  priceSort: typeof ASCENDING | typeof DESCENDING | typeof NEUTRAL;
  quantitySort: typeof ASCENDING | typeof DESCENDING | typeof NEUTRAL;
}

const coinOptions = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "ETH",
    value: "ETH",
  },
  {
    label: "REP",
    value: "REP",
  },
];

const actionOptions = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Buy",
    value: "BUY",
  },
  {
    label: "Sell",
    value: "SELL",
  },
  {
    label: "Cancelled",
    value: "CANCEL",
  },
  {
    label: "Claim Market Creator Fees",
    value: "CLAIM_MARKET_CREATOR_FEES",
  },
  {
    label: "Claim Participation Tokens",
    value: "CLAIM_PARTICIPATION_TOKENS",
  },
  {
    label: "Claim Staked REP & Reporting Fees",
    value: "CLAIM_WINNING_CROWDSOURCERS",
  },
  {
    label: "Claim Trading Proceeds",
    value: "CLAIM_TRADING_PROCEEDS",
  },
  {
    label: "Dispute",
    value: "DISPUTE",
  },
  {
    label: "Initial Report",
    value: "INITIAL_REPORT",
  },
  // { // Removed until V2
  //   label: "Finalize Market",
  //   value: "FINALIZE_MARKET",
  // },
  {
    label: "Market Creation",
    value: "MARKET_CREATION",
  },
  {
    label: "Complete Sets",
    value: "COMPLETE_SETS",
  },
];

const paginationOptions = [
  {
    label: "10 per page",
    value: 10,
  },
  {
    label: "20 per page",
    value: 20,
  },
  {
    label: "30 per page",
    value: 30,
  },
  {
    label: "40 per page",
    value: 40,
  },
  {
    label: "50 per page",
    value: 50,
  },
];

const DEFAULT_STATE = {
  coin: "ALL",
  action: "ALL",
  itemsPerPage: 20,
  page: 1,
  priceSort: NEUTRAL,
  quantitySort: NEUTRAL,
};

export class Transactions extends React.Component<
  TransactionsProps,
  TransactionsState
> {
  // @ts-ignore
  state: TransactionsState = {
    ...DEFAULT_STATE,
    startDate: moment(this.props.currentTimestamp * 1000).subtract(6, "M"),
    endDate: moment(this.props.currentTimestamp * 1000),
    startFocused: false,
    endFocused: false,
    AllTransactions: [],
    filteredTransactions: [],
  };

  public tableHeaderRef: any = null;
  public tableBodyRef: any = null;

  componentWillMount = () => {
    this.triggerSearch();
  }

  componentDidMount = () => {
    this.tableBodyRef.addEventListener("scroll", this.handleScroll);
    this.tableHeaderRef.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount = () => {
    this.tableBodyRef.removeEventListener("scroll", this.handleScroll);
    this.tableHeaderRef.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const body = this.tableBodyRef.scrollLeft;
    const head = this.tableHeaderRef.scrollLeft;
    if (body !== head) {
      this.tableHeaderRef.scrollTo(body, 0);
    }
  }

  cyclePriceSort = (e: Event) => {
    const { filteredTransactions, priceSort } = this.state;
    let updatedPriceSort = NEUTRAL;
    switch (priceSort) {
      case ASCENDING:
        // if ascending cycle to descending
        updatedPriceSort = DESCENDING;
        filteredTransactions.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price),
        );
        break;
      case NEUTRAL:
        // if neutral cycle to ascending
        updatedPriceSort = ASCENDING;
        filteredTransactions.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price),
        );
        break;
      default:
        // if descending cycle to neutral;
        filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }
    // @ts-ignore
    this.setState({ priceSort: updatedPriceSort, filteredTransactions });
  }

  cycleQuantitySort = (e: any) => {
    const { filteredTransactions, quantitySort } = this.state;
    let updatedQuantitySort = NEUTRAL;
    switch (quantitySort) {
      case ASCENDING:
        // if ascending cycle to descending
        updatedQuantitySort = DESCENDING;
        filteredTransactions.sort(
          (a, b) => parseFloat(b.quantity) - parseFloat(a.quantity),
        );
        break;
      case NEUTRAL:
        // if neutral cycle to ascending
        updatedQuantitySort = ASCENDING;
        filteredTransactions.sort(
          (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
        );
        break;
      default:
        // if descending cycle to neutral;
        filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }
    // @ts-ignore
    this.setState({ quantitySort: updatedQuantitySort, filteredTransactions });
  };

  triggerSearch = () => {
    const { getTransactionsHistory } = this.props;
    const { startDate, endDate, coin, action } = this.state;
    getTransactionsHistory(
      startDate.unix().valueOf(),
      endDate.unix().valueOf(),
      coin,
      action,
      (err: any, AllTransactions: Array<TransactionInfo>) => {
        if (!err) {
          const filteredTransactions = this.filterTransactions(
            AllTransactions,
            coin,
            action
          );
          if (this.tableHeaderRef)
            this.setState({ AllTransactions, filteredTransactions });
        }
      }
    );
  };

  resetSearch = () => {
    const { currentTimestamp } = this.props;
    const { AllTransactions } = this.state;
    this.setState(
      // @ts-ignore
      {
        ...DEFAULT_STATE,
        startDate: moment(currentTimestamp * 1000).subtract(6, "M"),
        endDate: moment(currentTimestamp * 1000),
        filteredTransactions: AllTransactions,
      },
      () => this.triggerSearch(),
    );
  };

  filterTransactions = (
    transactions: Array<TransactionInfo>,
    coin: string,
    action: string,
  ) => {
    const filteredTransactions = transactions.filter(
      (Transaction: TransactionInfo) =>
        (Transaction.coin === coin || coin === "ALL") &&
        (Transaction.action === action || action === "ALL")
    );
    return filteredTransactions;
  };

  triggerTransactionsExport = () => {
    const { AllTransactions } = this.state;
    const items = AllTransactions;
    const replacer = (key: string, value: any) => (value === null ? "" : value);
    const header = Object.keys(items[0]);
    const csv = items.map((row: any) =>
      header
        .map((fieldName: any) => JSON.stringify(row[fieldName], replacer))
        .join(","),
    );
    csv.unshift(header.join(","));
    const exportCSV = csv.join("\r\n");
    const transactionsDataString =
      "data:text/plain;charset=utf-8," + encodeURIComponent(exportCSV);
    const a = document.createElement("a");

    a.setAttribute("href", transactionsDataString);
    a.setAttribute("download", "AugurTransactions.csv");
    a.click();
  };

  addTransactionRow = (tx: TransactionInfo) => {
    const timestamp = moment(tx.timestamp * 1000).format("D MMM YYYY HH:mm:ss");
    const key = `${tx.transactionHash}-${tx.timestamp}-${tx.outcome}-${
      tx.quantity
    }-${tx.price}-${tx.total}-${tx.action}-${tx.marketDescription}-${
      tx.outcomeDescription
    }`;
    // we never show the coin type outside of tx.coin so we can just format by shares always here.
    const quantity = formatShares(tx.quantity);
    const actionLabel = actionOptions.find((option: any) => {
      if (option.value === tx.action) return true;
      return false;
    });
    return (
      <React.Fragment key={key}>
        <span>{timestamp}</span>
        <span>
          <TextLabel text={tx.marketDescription} />
        </span>
        <span>
          <TextLabel text={tx.outcomeDescription || ""} />
        </span>
        <span>
          <TextLabel
            text={
              (actionLabel && actionLabel.label) || tx.action.replace(/_/g, " ").toLowerCase()
            }
          />
        </span>
        <ValueLabel value={formatEther(Number(tx.price))} showDenomination={false} showEmptyDash={false} />
        <ValueLabel value={quantity} showDenomination={false} showEmptyDash={false} />
        <span>{tx.coin}</span>
        <ValueLabel value={formatEther(Number(tx.fee))} showDenomination={false} showEmptyDash={false} />
        <ValueLabel value={formatEther(Number(tx.total))} showDenomination={false} showEmptyDash={false} />
        <ViewTransactionDetailsButton transactionHash={tx.transactionHash} />
      </React.Fragment>
    );
  }

  render() {
    const { title, closeAction, currentTimestamp } = this.props;
    const {
      coin,
      action,
      startDate,
      startFocused,
      endDate,
      endFocused,
      itemsPerPage,
      page,
      filteredTransactions,
      priceSort,
      quantitySort,
    } = this.state;
    const pageInfo = {
      page,
      itemsPerPage,
      itemCount: filteredTransactions.length,
      action: (page: number) => this.setState({ page }),
    };
    const pageTransactions = filteredTransactions.slice(
      page * itemsPerPage - itemsPerPage,
      page * itemsPerPage,
    );

    const startDatePicker = {
      id: "startDatePicker",
      date: startDate,
      placeholder: "Start Date",
      onDateChange: (startDate: number) =>
        this.setState({ startDate }, () => this.triggerSearch()),
      onFocusChange: ({ focused }) => {
        if (this.state.startDate == null) {
          const startDate = moment(currentTimestamp * 1000);
          this.setState({
            startDate,
          });
        }
        this.setState({ startFocused: focused });
      },
      focused: startFocused,
      displayFormat: "D MMM YYYY",
      numberOfMonths: 1,
    };

    const endDatePicker = {
      id: "endDatePicker",
      date: endDate,
      placeholder: "End Date",
      onDateChange: (endDate: number) =>
        this.setState({ endDate }, () => this.triggerSearch()),
      onFocusChange: ({ focused }) => {
        if (this.state.endDate == null) {
          const endDate = moment(currentTimestamp * 1000);
          this.setState({
            endDate,
          });
        }
        this.setState({ endFocused: focused });
      },
      isOutsideRange: (day: any) =>
        day.isAfter(moment(currentTimestamp * 1000).add(1, "hour")) ||
        day.isBefore(startDate),
      focused: endFocused,
      displayFormat: "D MMM YYYY",
      numberOfMonths: 1,
    };

    return (
      <div className={Styles.Transactions}>
        <Title title={title} closeAction={closeAction} />
        <section>
          <span>Date From</span>
          <span>Date To</span>
          <span>Action</span>
          <span>Coin</span>
          <FormDropdown
            options={paginationOptions}
            defaultValue={itemsPerPage}
            onChange={(itemsPerPage: number) => this.setState({ itemsPerPage })}
          />
          <DatePicker {...startDatePicker} />
          <DatePicker {...endDatePicker} />
          <FormDropdown
            options={actionOptions}
            defaultValue={action}
            onChange={(action: string) =>
              this.setState((state) => {
                const filteredTransactions = this.filterTransactions(
                  state.AllTransactions,
                  state.coin,
                  action,
                );
                return { filteredTransactions, action };
              })
            }
          />
          <FormDropdown
            options={coinOptions}
            defaultValue={coin}
            onChange={(coin: string) =>
              this.setState((state) => {
                const filteredTransactions = this.filterTransactions(
                  state.AllTransactions,
                  coin,
                  state.action,
                );
                return { filteredTransactions, coin };
              })
            }
          />
          <div>
            <SecondaryButton action={this.resetSearch} text="Reset" />
            <PrimaryButton action={this.triggerSearch} text="Search" />
          </div>
          <ExportButton action={this.triggerTransactionsExport} />
        </section>
        <div
          ref={(tableHeader) => {
            this.tableHeaderRef = tableHeader;
          }}
        >
          <span>Date</span>
          <span>Market</span>
          <span>Outcome</span>
          <span>Action</span>
          <span>
            <SortButton
              text="Price"
              sortOption={priceSort}
              action={(e: any) => this.cyclePriceSort(e)}
            />
          </span>
          <span>
            <SortButton
              text="Quantity"
              sortOption={quantitySort}
              action={(e: any) => this.cycleQuantitySort(e)}
            />
          </span>
          <span>Coin</span>
          <span>Fee</span>
          <span>Total</span>
          <span>Etherscan</span>
        </div>
        <section
          ref={(tableBody) => {
            this.tableBodyRef = tableBody;
          }}
        >
          {pageTransactions.length === 0 && (
            <span className={Styles.NullTransactionsRow}>No Transactions</span>
          )}
          {pageTransactions.map((transaction: TransactionInfo) =>
            this.addTransactionRow(transaction),
          )}
        </section>
        <div>
          <Pagination {...pageInfo} />
          <span>Show</span>
          <FormDropdown
            options={paginationOptions}
            defaultValue={itemsPerPage}
            onChange={(itemsPerPage: number) => this.setState({ itemsPerPage })}
            openTop
          />
        </div>
      </div>
    );
  }
}

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';
import ValueTimestamp from 'modules/common/components/value-timestamp';
import ReportEthics from 'modules/my-reports/components/report-ethics';

import { CREATE_MARKET, BUY, SELL, BID, ASK, SHORT_SELL, SHORT_ASK, MATCH_BID, MATCH_ASK, COMMIT_REPORT, REVEAL_REPORT, GENERATE_ORDER_BOOK, CANCEL_ORDER, SELL_COMPLETE_SETS } from 'modules/transactions/constants/types';
import { FUND_ACCOUNT } from 'modules/auth/constants/auth-types';
import { SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

const TransactionSummary = p => (
  <article className={classNames('transaction-summary', p.isGroupedTransaction && 'transaction-grouped')}>
    {p.data.marketLink ?
      <Link {...p.data.marketLink}>
        <TransactionSummaryContent {...p} />
      </Link> :
      <TransactionSummaryContent {...p} />
    }
  </article>
);

const TransactionSummaryContent = p => (
  <div className="transaction-summary-content">
    <div className="transaction-action">
      {transactionAction(p)}
      {transactionActionDetails(p)}
    </div>
    <div className="transaction-description">
      <span>{transactionDescription(p)}</span>
    </div>
    <ValueTimestamp
      className="transaction-timestamp"
      {...p.timestamp}
    />
  </div>
);

function transactionAction(transaction) {
  const action = () => {
    switch (transaction.type) {
      case FUND_ACCOUNT:
        return 'Fund Account';
      case BUY:
        return 'Buy';
      case BID:
        return 'Bid';
      case SELL:
        return 'Sell';
      case ASK:
        return 'Ask';
      case SHORT_SELL:
        return 'Short Sell';
      case SHORT_ASK:
        return 'Short Ask';
      case MATCH_BID:
        return 'Bid Filled';
      case MATCH_ASK:
        return 'Ask Filled';
      case CANCEL_ORDER:
        return 'Cancel Order';
      case SELL_COMPLETE_SETS:
        return `Redeem ${transaction.numShares.formatted} Complete Sets`;
      case CREATE_MARKET:
        return 'Create Market';
      case GENERATE_ORDER_BOOK:
        return 'Generate Order Book';
      case COMMIT_REPORT:
      case REVEAL_REPORT:
        return transaction.type === COMMIT_REPORT ? 'Commit Report' : 'Reveal Report';
      default:
        return transaction.type;
    }
  };

  return <span className="transaction-action-type">{action()}</span>;
}

function transactionActionDetails(transaction) {
  switch (transaction.type) {
    case BUY:
    case BID:
    case SELL:
    case ASK:
    case SHORT_SELL:
    case SHORT_ASK:
    case MATCH_BID:
    case MATCH_ASK: {
      return (
        <div className="transaction-trade-action-details">
          <ValueDenomination
            className="transaction-shares"
            {...transaction.numShares}
          />
          {transaction.data.marketType === CATEGORICAL &&
            <span>
              <span className="of">of</span> <span className="outcome-name">{transaction.data.outcomeName && transaction.data.outcomeName.toString().substring(0, 35) + ((transaction.data.outcomeName.toString().length > 35 && '...') || '')}</span>
            </span>
          }
          <span className="at">@</span>
          <ValueDenomination className="noFeePrice" {...transaction.noFeePrice} />
        </div>
      );
    }
    case CANCEL_ORDER: {
      return (
        <div className="transaction-trade-action-details">
          <span className="at">to {transaction.data.order.type}</span>
          <ValueDenomination className="shares" {...transaction.data.order.shares} />
          <span className="of">of</span>
          <span className="outcome-name">{transaction.data.outcome.name && transaction.data.outcome.name.substring(0, 35) + ((transaction.data.outcome.name.length > 35 && '...') || '')}</span>
        </div>
      );
    }
    case COMMIT_REPORT:
    case REVEAL_REPORT: {
      const type = getValue(transaction, 'data.market.type');
      const outcomeName = getValue(transaction, 'data.outcome.name');
      const reportedOutcome = (transaction.data.isScalar || type === SCALAR) ?
        transaction.data.reportedOutcomeID :
        outcomeName && `${outcomeName.substring(0, 35)}${outcomeName.length > 35 && '...'}`;

      return (
        <div className="transaction-trade-action-report-details">
          {!!reportedOutcome &&
            <span className="transaction-reported-outcome">{reportedOutcome}</span>
          }
          {!!transaction.data.isUnethical &&
            <ReportEthics isUnethical={transaction.data.isUnethical} />
          }
        </div>
      );
    }
    default:
      break;
  }
}

function transactionDescription(transaction) {
  switch (transaction.type) {
    case FUND_ACCOUNT:
      return 'Request testnet Ether and Reputation';
    default:
      return transaction.description;
  }

  // NOTE -- leaving temporarily for historical ref
  //   if (!p.description) return <span />;
  // let shortDescription;
  // if (p.description.indexOf('\n') > -1) {
  //   shortDescription = p.description.split('\n').map(text => <li key={text}>{text}</li>);
  //   shortDescription = <ul>{shortDescription}</ul>;
  // } else {
  //   shortDescription = p.description.substring(0, 100) + ((p.description.length > 100 && '...') || '');
  // }
  // const description = (isShortened) => {
  //   if (isShortened) {
  //     return (
  //       <span className="market-description" data-tip={p.description}>
  //         {shortDescription}
  //       </span>
  //     );
  //   }
  //   return (
  //     <span className="market-description">
  //       {shortDescription}
  //     </span>
  //   );
  // };
  // const isShortened = shortDescription !== p.description;
  // if (shortDescription && p.marketID && p.marketLink) {
  //   return (
  //     <Link href={p.marketLink.href} onClick={p.marketLink.onClick}>
  //       {description(isShortened)}
  //     </Link>
  //   );
  // }
  // return <span>{description(isShortened)}</span>;
}

TransactionSummary.propTypes = {
  type: PropTypes.string.isRequired
};

export default TransactionSummary;

// NOTE -- leaving temporarily for historical ref
// function TransactionDescription (p) {
//   switch (p.type) {
//     case BUY:
//     case BID:
//     case SELL:
//     case ASK:
//     case SHORT_SELL:
//     case SHORT_ASK:
//     case MATCH_BID:
//     case MATCH_ASK:
//       switch (p.type) {
//         case BUY:
//           nodes.action = 'Buy';
//           break;
//         case BID:
//           nodes.action = 'Bid';
//           break;
//         case SELL:
//           nodes.action = 'Sell';
//           break;
//         case ASK:
//           nodes.action = 'Ask';
//           break;
//         case SHORT_SELL:
//           nodes.action = 'Short Sell';
//           break;
//         case SHORT_ASK:
//           nodes.action = 'Short Ask';
//           break;
//         case MATCH_BID:
//           nodes.action = 'Bid Filled';
//           break;
//         case MATCH_ASK:
//           nodes.action = 'Ask Filled';
//           break;
//         default:
//           break;
//       }
//
//       nodes.description = (
//         <span className="description">
//           <span className="action">{nodes.action}</span>
//           <ValueDenomination className="shares" {...p.numShares} />
//           {p.data.marketType === CATEGORICAL &&
//             <span>
//               <span className="of">of</span> <span className="outcome-name">{p.data.outcomeName && p.data.outcomeName.toString().substring(0, 35) + ((p.data.outcomeName.toString().length > 35 && '...') || '')}</span>
//             </span>
//           }
//           <span className="at">@</span>
//           <ValueDenomination className="noFeePrice" {...p.noFeePrice} />
//           <br className="hide-in-tx-display" />
//           <ValueDenomination className="avgPrice" {...p.avgPrice} prefix="estimated total (including trading fees):" postfix="/ share" />
//           <br />
//           <TransactionDescription description={p.description} marketLink={p.data.marketLink} marketID={p.data.marketID} />
//           <br className="hide-in-trade-summary-display" />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//       );
//
//       break;
//
//     case SELL_COMPLETE_SETS:
//       nodes.action = `Redeem ${p.numShares.formatted} Complete Sets`;
//       nodes.description = (
//         <span className="description">
//           <span className="action">{nodes.action}</span>
//           <br />
//           <TransactionDescription description={p.description} marketLink={p.data.marketLink} marketID={p.data.marketID} />
//           <br />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//       );
//       break;
//
//     case FUND_ACCOUNT:
//       nodes.action = 'Fund Account';
//       nodes.description = (
//         <span className="description">
//           <span className="action">{nodes.action}</span>
//           <br />
//           <span className="market-description">Request testnet Ether and Reputation</span>
//           <br />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//       );
//       break;
//
//     case CREATE_MARKET:
//       return (
//         <span className="description">
//           <span className="action">Create Market</span>
//           <br />
//           <TransactionDescription description={p.description} marketLink={p.data.marketLink} marketID={p.data.marketID} />
//           <br />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//       );
//     case COMMIT_REPORT:
//     case REVEAL_REPORT: {
//       const reportedOutcome = (p.data.isScalar || (p.data.market && p.data.market.type === SCALAR)) ?
//         p.data.reportedOutcomeID :
//         p.data.outcome && p.data.outcome.name && p.data.outcome.name.substring(0, 35) + ((p.data.outcome.name.length > 35 && '...') || '');
//
//       return (
//         <span className="description">
//           <span className="action">{p.type === COMMIT_REPORT ? 'Commit Report' : 'Reveal Report'}</span>
//           <strong>{reportedOutcome}</strong>
//           <ReportEthics isUnethical={p.data.isUnethical} />
//           <br />
//           <TransactionDescription description={p.description} marketLink={p.data.marketLink} marketID={p.data.marketID} />
//           <br />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//       );
//     }
//     case GENERATE_ORDER_BOOK:
//       return (
//         <span className="description">
//           <span className="action">Generate order book</span>
//           <br />
//           <TransactionDescription description={p.description} marketLink={p.data.marketLink} marketID={p.data.marketID} />
//           <br />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//       );
//     case CANCEL_ORDER: {
//       return (
//         <span className="description">
//           <span className="action">Cancel order</span>
//           <span className="at">to {p.data.order.type}</span>
//           <ValueDenomination className="shares" {...p.data.order.shares} />
//           <span className="of">of</span>
//           <span className="outcome-name">{p.data.outcome.name && p.data.outcome.name.substring(0, 35) + ((p.data.outcome.name.length > 35 && '...') || '')}</span>
//           <br />
//           <TransactionDescription description={p.description} marketLink={p.data.marketLink} marketID={p.data.marketID} />
//           <br />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//
//       );
//     }
//     default:
//       return (
//         <span className="description">
//           <span className="action">{p.type}</span>
//           <br />
//           <TransactionDescription description={p.description} marketLink={p.data.marketLink} marketID={p.data.marketID} />
//           <br />
//           {p.timestamp &&
//             <ValueTimestamp className="property-value" {...p.timestamp} />
//           }
//         </span>
//       );
//   }
// }

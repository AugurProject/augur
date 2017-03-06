import React, { PropTypes } from 'react';
import Link from 'modules/link/components/link';

const LoginMessagePage = p => (
  <section id="login_message_view" >
    <div className="page-content">
      <h1>{`Welcome to the Augur beta test!`}</h1>
      <p>{`This is a beta test in advance of Augur's live release. There are bugs. There are features being
        added, improved, and re-designed. There are a few hundred enhancements scheduled to be added in the next few
        months. Your thoughtful feedback now is essential. Please use the feedback button at the bottom left of
        every page to submit your feedback, or feel free to send an email to `}
        <a
          className="link"
          href="mailto:hugs@augur.net?subject=Beta Testing feedback"
        >
          {'hugs@augur.net'}
        </a>
        {`. From your submissions, the development team will coordinate fixes and new features. Changes and fixes will be
        displayed when you log in again.`}
      </p>
      <h2>Important information:</h2>
      <ol>
        <li>
          Because Augur is a <b>completely decentralized</b> system, if you lose your login credentials it
          is impossible to recover them. Please <a className="link" href="http://blog.augur.net/faq/how-do-i-savebackup-my-wallet/" target="_blank" rel="noopener noreferrer">take
          appropriate measures</a> to protect the safety of your password, and create a way to
          recover your credentials if you forget them.
        </li>
        <li>
          Do not send real Ether (ETH) to your Augur account while we are testing! Each account will be given
          10,000 testnet ETH tokens for beta testing. Please note that testnet ETH has no value except for testing:
          it is merely an on-contract IOU (a token) for testnet Ether.
        </li>
        <li>
          {`Reputation (REP) is a unique and important part of the Augur trading platform. If you own REP tokens, you must visit
          the site periodically to fulfill your reporting obligations. During beta testing, each new account will
          receive 47 testnet REP (they have no value except for testing). Each reporting cycle will last 2 days. Every
          two-day cycle will consist of a commit phase, a reveal phase, and a challenge phase. Because the test
          cycle is dramatically compressed (the main net cycle will be 60 days long) it is recommended that
          users visit the site at least every 2 days to maintain your REP and simulate “real money” trading,
          resolution, and reporting conditions. Learn `}
          <a
            className="link"
            href="https://www.youtube.com/watch?v=sCms-snzHk4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`how Augur's Reputation tokens work`}
          </a>.
        </li>
        <li>
          {`A note on price/time priority on the blockchain.  The site is only as fast as Ethereum blocks are mined.  Augur's matching engine sorts order books by price, then by block number, then by transaction index. Within a single block, transactions are ordered by the miner who mines the block.  When constructing a block, miners typically order transactions first by gasprice (highest to lowest), and then by the order received (oldest to newest).  So, Augur's "price/blocknumber/transaction index priority" ordering is generally equivalent to price/time priority, if there are differing gasprices within the block, the transaction index is not guaranteed to be time-ordered.  (Presently, Augur does not attempt to adjust gasprices in response to other pending transactions, although, if desired, gasprice can be adjusted manually using the API, by changing the "gasPrice" field attached to every sendTransaction payload.)`}
        </li>
      </ol>
      <h2>Technical updates:</h2>
      <h3>March 6, 2017</h3>
      <ol>
        <li>
          Added QR codes for the deposit address and keystore file for ease of transfer / sending of funds. 
        </li>
      </ol>
      <h3>March 5, 2017</h3>
      <ol>
        <li>
          The &quot;Snitch&quot; tab on the market detail page now displays any time an event is available for reporting, even if the user is not selected to report on it.
        </li>
        <li>
          Fixed the conditions for whether the Report tab appears on the market detail page.
        </li>
        <li>
          The browser console now always has debugging objects available (state/selectors/augurjs).  This will remain true for the rest of the beta.
        </li>
      </ol>
      <h3>March 4, 2017</h3>
      <ol>
        <li>
          The getEventsToReportOn method on the reportingThreshold contract is now indexed correctly.
        </li>
        <li>
          Fixed a bug in keythereum where the &quot;recover&quot; function could overwrite the scrypt memory constant.
        </li>
        <li>
          Scalar limit price now displays correctly for bids and asks in the trade preview.
        </li>
        <li>
          De-adjusted scalar prices for display in transactions which create new orders.
        </li>
        <li>
          Renamed Bid Q and Ask Q to Bid Qty and Ask Qty in order-book-header component.
        </li>
      </ol>
      <h3>March 3, 2017</h3>
      <ol>
        <li>
          ethereumjs-connect is now compatible with the new refactored version of ethrpc.
        </li>
        <li>
          ShapeShift and Coinbase buttons are now integrated into the accounts page in the UI.  Note that these are disabled while beta testing.
        </li>
        <li>
          Broke off the stub RPC server from ethrpc and published it to the ethereumjs group, <a href="https://github.com/ethereumjs/ethereumjs-stub-rpc-server" className="link" target="_blank" rel="noopener noreferrer">ethereumjs-stub-rpc-server</a>.
        </li>
      </ol>
      <h3>March 2, 2017</h3>
      <ol>
        <li>
          Added a Reporting diagram and a new Reporting section to the <a href="http://docs.augur.net" className="link" target="_blank" rel="noopener noreferrer">Augur API documentation</a>.
        </li>
        <li>
          The augur.js unit tests are now complete.
        </li>
      </ol>
      <h3>March 1, 2017</h3>
      <ol>
        <li>
          Fixed the Node version to 6.5.0 for augur UI and augur.js automated builds, due to a Node 7+ build error encountered after updating the middleware npm dependencies.
        </li>
      </ol>
      {p.topicsLink &&
        <Link className="lets-do-this-button" {...p.topicsLink} >{`Let's do this!`}</Link>
      }
    </div>
  </section>
);

LoginMessagePage.propTypes = {
  topicsLink: PropTypes.object // TODO
};

export default LoginMessagePage;

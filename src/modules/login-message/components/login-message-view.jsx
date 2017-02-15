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
      <h3>February 15, 2017</h3>
      <ol>
        <li>
          Fixed derived key references in the front-end.
        </li>
        <li>
          Refactored report-encryption module and added unit tests.
        </li>
      </ol>
      <h3>February 14, 2017</h3>
      <ol>
        <li>
          Refactored the register module in augur.js and removed its unused methods.
        </li>
        <li>
          Moved checkPeriodLock to syncReporterData.
        </li>
        <li>
          Fixed in-progress relay display.
        </li>
        <li>
          Removed unused fundNewAccount callback from loadAccountData.
        </li>
        <li>
          Added loadRegisterBlockNumber action to fundNewAccount callbacks.
        </li>
        <li>
          Used displayLoginMessageOrMarkets in init-augur.
        </li>
      </ol>
      <h3>February 13, 2017</h3>
      <ol>
        <li>
          Added enum like construct for current RPC status. This should improve readability by removing the magic numbers, without breaking backwards compatibility.
        </li>
        <li>
          Added docker support. This makes it so the tests can be run inside docker, to minimize local environment and compatibility issues and allow for turn-key development.  The readme has been updated with instructions on how to run the tests from inside Docker.
        </li>
        <li>
          Update loginAccount during setupAndFundNewAccount to avoid UI side effects.
        </li>
        <li>
          Fixed loadAccountDataFromLocalStorage position in loadAccountData sequence.
        </li>
        <li>
          Use loginAccount state instead of account parameter in display-login-message.
        </li>
        <li>
          Consolidated fundNewAccount calls in loadAccountData; split functions in load-account-data into separate files.
        </li>
        <li>
          Removed conditional fundNewAccount/registerTimestamp callbacks from login, register, login-with-airbitz, and import-account actions.
        </li>
        <li>
          fundNewAccount action no longer accepts a callback.
        </li>
        <li>
          Expanded augur.Register.register wrapper and renamed to loadRegisterBlockNumber.
        </li>
        <li>
          Moved savePersistentAccountToLocalStorage to new save-persistent-account auth action.
        </li>
      </ol>
      <h3>February 12, 2017</h3>
      <ol>
        <li>
          Updated check-filters script.
        </li>
        <li>
          Combined loadFullAccountData and loadLoginAccountDependents functions.
        </li>
        <li>
          Fixed sentCash event label in the front-end listeners.
        </li>
      </ol>
      <h3>February 11, 2017</h3>
      <ol>
        <li>
          Fixed manage Airbitz account button display.
        </li>
        <li>
          Refactored loadLoginAccount in auth module.
        </li>
        <li>
          Cleanup of auth cruft in components.
        </li>
      </ol>
      <h3>February 10, 2017</h3>
      <ol>
        <li>
          Removed &quot;name&quot; from importAccount, login, and register actions / augur.js calls.
        </li>
        <li>
          Fixed importAccount loginID.
        </li>
        <li>
          Replaced loginID argument of login with keystore. Removed loginID and name properties from account object.
        </li>
        <li>
          Renamed loadLocalLoginAccount to setAccountObject in augur.js.
        </li>
        <li>
          Removed unused onSubmitClosePosition prop from market selector.
        </li>
        <li>
          Refactored import-account.
        </li>
        <li>
          Fixed keystore reference in account export.
        </li>
        <li>
          Removed extra base58Encode.
        </li>
        <li>
          Fixed loginID calculation argument.
        </li>
        <li>
          Fixed loadFullAccountData error message.
        </li>
        <li>
          Refactored login action; moved displayLoginMessageOrMarkets and loadFullAccountData to load-login-account.
        </li>
        <li>
          Refactored load-login-account actions for augur.js/loginAccount data split.
        </li>
        <li>
          Set height for mobile logo.
        </li>
        <li>
          Removed account-settings (no longer contains relevant properties).
        </li>
      </ol>
      <h3>February 9, 2017</h3>
      <ol>
        <li>
          Added on-chain topic search to augur.js.
        </li>
        <li>
          Added topic (first tag) as an indexed parameter to the marketCreated event on the createMarket contract.
        </li>
        <li>
          Updated account references in loadLoginAccountDependents.
        </li>
        <li>
          Refactored register actions in auth module.
        </li>
        <li>
          Removed duplicate data in state.loginAccount and augur.accounts.account in augur.js.
        </li>
      </ol>
      <h3>February 8, 2017</h3>
      <ol>
        <li>
          Fix to account registration action that was causing initial funding to fail.
        </li>
      </ol>
      {p.marketsLink &&
        <Link className="lets-do-this-button" {...p.marketsLink} >{`Let's do this!`}</Link>
      }
    </div>
  </section>
);

LoginMessagePage.propTypes = {
  marketsLink: PropTypes.object // TODO
};

export default LoginMessagePage;

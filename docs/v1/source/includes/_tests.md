Tests
=====
The [Augur UI](https://github.com/AugurProject/augur-ui) repository, and the middleware [augur.js](https://github.com/AugurProject/augur.js) repository both contain tests. Tests are run using [Mocha](https://mochajs.org/). Mocha does not need to be installed globally to run the test suites, but if you would like to run specific tests explicitly then it is helpful to globally install Mocha.

To globally install Mocha using `npm` you would run the following command:

`$ npm install -g mocha`

To globally install Mocha using `yarn`, you would run the following command:

`$ yarn global add mocha`

Once you have Mocha installed, you can run a specific test case like so:

`$ mocha ./test/unit/filters/add-filter.js`

Augur and augur.js both contain their own sets of unit tests and augur.js has a an integration test suite as well. The following sections will provide more details about the differences between the two.

Running Tests In augur-ui
-------------------------
[augur-ui](https://github.com/AugurProject/augur-ui) has a suite of unit tests that can be run using `npm` or `yarn`. To run these tests, first make sure you have installed the dependencies by using the following command:

`$ npm install`

or if you are using `yarn`:

`$ yarn`

Once you have installed the dependencies for augur-ui, you can run the following command using `npm` to run the unit tests:

`$ npm test`

or, if you prefer to use `yarn`, the command becomes:

`$ yarn test`

Additionally, the augur-ui code has a series of integration tests. Before running these, the dependencies must be installed (as described above), and a local Ethereum node and [Augur Node](#augur-node) must be running. To quickly start up a Geth Ethereum node and Augur Node using Docker, run the following command:

`npm run docker:spin-up`

or 

`yarn docker:spin-up`

Then, in a seperate terminal window, start up the Augur UI with the `--auto-login` option by running:

`npm run dev --auto-login`

or 

`yarn dev --auto-login`

After that, the integration tests can be started in another termial window by running:

`$ npm run integration`

to run all tests. To run a specific integration test, such as `create-market.test.ts`, execute the command:

`$ npm run integration create-market.test.ts`

To do this in yarn, it's:

`$ yarn integration`

and 

`$ yarn integration create-market.test.ts`

The augur-ui repository also follows a set of standard coding rules. In order to check if your code is following the standards, you can run a linting command. To lint the Augur repository using `npm`, you would run the following command:

`$ npm run lint`

and to issue the same command with `yarn`, you would enter this:

`$ yarn lint`

<aside class="notice">All pull requests made to the Augur project must be properly linted first and any new functionality added must include tests or updated tests. The Augur team will not accept a pull request that doesn't include updated tests or breaks the linting standards we have for the Augur codebase.</aside>

Running Tests in augur.js
-------------------------
[augur.js](https://github.com/AugurProject/augur.js) includes both Unit tests and integration tests that can be run with `npm` or `yarn`. In order to run tests, makes sure you have installed the dependencies for augur.js first by using the following command:

`$ npm install`

or if you are using `yarn`:

`$ yarn`

Once you have installed the dependencies for augur.js, you can run the following command using `npm` to run the unit tests:

`$ npm run test`

To run integration tests with `npm`, use the following command:

`$ npm run integration-test`

If you would prefer to use `yarn` the command to run unit tests becomes:

`$ yarn test`

to run integration tests, the command is:

`$ yarn integration-test`

augur.js also follows a standard for it's code and also has a linting command. The command using `npm` is:

`$ npm run lint`

And if you prefer `yarn` then the command is:

`$ yarn lint`

<aside class="notice">All pull requests made to the augur.js project must be properly linted first and any new functionality added must include tests or updated tests. The Augur team will not accept a pull request that doesn't include updated tests or breaks the linting standards we have for the augur.js codebase.</aside>

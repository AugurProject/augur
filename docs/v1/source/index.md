---
title: Augur Documentation
description: Technical documentation for the AugurJS API library used to interact with the Augur protocol. 
canonical: http://www.docs.augur.net

language_tabs:
  - javascript: Code

toc_footers:
  - <a href="https://augur.net">Augur</a>
  - <a href="https://dev.augur.net">App</a>
  - <a href="https://github.com/AugurProject">Github</a>
  - <a href="https://twitter.com/AugurProject">Twitter</a>

[//]: # The Errors section (listed after the Tests section) has temporarily been removed from the sidebar menu. Once the errors have been better organized, and the _errors.md page has been updated, it should be reinstated to the menu.
includes:
  - architecture
  - trading
  - reporting
  - apiOverview
  - simplifiedAPI
  - callAPI
  - transactionAPI
  - events
  - typeDefinitions
  - constants
  - tests
  - uiConventions
  - glossary
  - contributing

search: true
---
Overview
========
Augur is a decentralized prediction market platform that runs on [Ethereum](https://www.ethereum.org). For a detailed, high-level explanation of how Augur works, please refer to the [Augur whitepaper](https://www.augur.net/whitepaper.pdf).

If you want to use or help test Augur, please install the [Augur App](https://github.com/AugurProject/augur-app).  If you want to use our cutting-edge development client, this is maintained at [https://dev.augur.net](https://dev.augur.net). However, be warned -- we push changes here pretty rapidly, so it can be a bit buggy!

Augur has its own dedicated [Stack Exchange](https://augur.stackexchange.com), which allows anyone to ask questions about Augur and get answers to those questions. It's a great resource to find the answers for questions you might have that aren't answered directly in these documents. Additionally, you can chat with us on [Discord](https://discordapp.com). If you'd like to join the conversation, just go to [invite.augur.net](https://invite.augur.net) and sign up. Most questions are best asked in the `#dev` or `#general` channels.

Getting Started
---------------

If you would like to help develop Augur, you'll need to build the client from source. To do this, first install version 8 of [Node.js](https://nodejs.org/) (note that the version number is important), and [Git](https://git-scm.com/downloads).

Next, clone the [Augur UI GitHub repository](https://github.com/AugurProject/augur-ui) by opening a terminal window and typing:

`$ git clone https://github.com/AugurProject/augur-ui.git`

Navigate to the newly created `augur-ui` folder by running:

`$ cd augur-ui`

Once this has been done, Augur's dependencies will need to be installed. This can be done using `npm` or `yarn`. Both methods are detailed in the next sections.

If you plan on submitting a pull request to the Augur Project, please be sure to read through the [Contributing](#contributing) section of these documents before submitting the request.

<aside class="notice"><b>If you are using or helping to develop the Augur client (i.e., the front-end/user interface), it usually is not necessary for you to run a local Ethereum node on your computer.</b> We're already running several <a href="#hosted-node">hosted nodes</a> to which you can connect! If you are running an Ethereum node, the client will automatically detect it and begin talking to it; if you are not, the client will default to using the hosted nodes.</aside>

Using NPM
---------
[Node.js](https://nodejs.org/) comes with a built in package manager called `npm`. (Again, please note that version 8 of Node.js is required for Augur.) `npm` is used to install dependencies for Augur, build the Augur project from source code, run [tests](#tests), and start a web server to host Augur, among other things. To install Augur's dependencies using `npm`, run the following command:

`$ npm install`

To build Augur from the source code, run:

`$ npm run build`

After building Augur from the source files, a local web server will need to be started. This can be done using the following command:

`$ npm start`

To enable hot-reloading (which automatically loads changes made locally), run the following instead of `npm start`:

`$ npm run dev`

Doing this is an easy way to do some hacking on the Augur source code and see the changes reflected in real time.

Now open a web browser and go to [http://localhost:8080](http://localhost:8080). This should load Augur's most popular categories page. 

Congratulations, you're ready to start hacking!

Using Yarn
----------
Some people prefer to use [yarn](https://yarnpkg.com/en/) instead of `npm`. To use yarn, execute the following command to install the Augur dependencies:

`$ yarn`

To build Augur from the source code, run:

`$ yarn build`

After building, the following command will start a local web server:

`$ yarn start`

To enable hot-reloading for development purposes, run the following instead of `yarn start`:

`$ yarn dev`

Finally, open a web browser and go to [http://localhost:8080](http://localhost:8080). This should load Augur's most popular categories page.  

Congratulations, you're ready to start hacking!

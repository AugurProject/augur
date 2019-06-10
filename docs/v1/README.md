Augur JavaScript API documentation
==================================
This repository is for the documentation files at https://docs.augur.net. If you would like to submit a PR for these docs, the Markdown files to edit are in https://github.com/AugurProject/docs/tree/master/source/includes.

To view your changes locally before creating a PR, open a terminal and run:
```
brew install rbenv
rbenv install 2.3.3
rbenv local 2.3.3
rbenv global 2.3.3
brew install v8
```
Then open `~/.bash_profile` and add the line:
```
eval "$(rbenv init -)"
```
Save `~/.bash_profile` and run:
```
gem install therubyracer
gem install libv8 -v '3.16.14.7' --with-system-v8
gem install bundler
```
Navigate to the `docs` folder and run:
```
bundle install
bundle exec middleman server -p <port number>
```
Then open a browser and go to `http://localhost/:<port number>`

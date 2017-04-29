About
=====
A content aggregator about Turbolinks 5 and Progressive Web Apps (Made with TL5 and PWA! :D)

The current content was wrote in pt-BR (brazilian portuguese) and will be translated to english as soon as possible.

Installation
------------
```sh
# 1. Install Node.js (https://nodejs.org/en/download/)
# 2. Install yarn (https://yarnpkg.com/en/docs/install)
# 3. Install Ruby (https://www.ruby-lang.org/en/downloads/)
# 4. Install bundler (gem install bundler)
# 5. Install all dependencies
  yarn install
  bundle install
```

Development
-----------
```sh
# How to start the server
bundle exec middleman server

# How to clear the Chrome browser cache
# Desktop:
# https://developers.google.com/web/tools/chrome-devtools/manage-data/local-storage#clear-storage
#
# Mobile Devices:
# https://support.google.com/chrome/answer/2392709?co=GENIE.Platform%3DAndroid&hl=en
```

Deployment
----------
```sh
# 1. Install the firebase-cli
# npm install -g firebase-tools

# 2. Build the project
bundle exec middleman build

# 3. Deploy it
firebase deploy
```

web: browserify app/main.jsx -t [ babelify ] -t [ envify --AUGUR_BRANCH_ID $BRANCH_ID --RPC_HOST $RPC_HOST ] --extension=.jsx -o app/app.js; node server.js

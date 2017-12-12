#!/bin/bash
# Requires sqlite3 CLI installed
# .open augur.db
# .mode column
# .headers on

set -e
trap "exit" INT

PWD=$(pwd)
SCRIPT=$(readlink -f "$0")

sqlite3 "$(dirname $SCRIPT)/../augur.db" -column -header

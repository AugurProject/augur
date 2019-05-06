#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until curl -sSf $host; do
  >&2 echo "$host is unavailable - sleeping"
  sleep 1
done

sleep 4;
>&2 echo "$host is up - executing command"
exec $cmd

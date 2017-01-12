#!/bin/bash

set -e
trap "exit" INT

declare -a ports=("8545" "8546" "8547" "30303" "30304" "8388")
for port in "${ports[@]}"; do
  UDP="INPUT -p udp --dport ${port} -j ACCEPT"
  TCP="INPUT -p tcp --dport ${port} -j ACCEPT"
  set +e
  sudo iptables -D $UDP >> /dev/null 2>&1
  sudo iptables -D $TCP >> /dev/null 2>&1
  set -e
  sudo iptables -A $UDP
  sudo iptables -A $TCP
  echo -e "Opened port ${port}"
done

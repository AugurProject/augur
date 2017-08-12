#!/bin/bash
# Requirements: serpent, js-beautify

set -e

for file in $AUGUR_CORE/src/*.se
do
  filename=$(basename "$file")
  abipath=$AUGURJS/src/contracts/abi/"${filename%.*}".abi
  echo $abipath
  serpent mk_full_signature $file | js-beautify --indent-size 2 > $abipath
done

for file in $AUGUR_CORE/src/**/*.se
do
  filename=$(basename "$file")
  foldername=$(basename $(dirname $file))
  abipath=$AUGURJS/src/contracts/abi/$foldername/"${filename%.*}".abi
  echo $abipath
  serpent mk_full_signature $file | js-beautify --indent-size 2 > $abipath
done

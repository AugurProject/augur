#!/bin/bash
# Requirements: serpent, js-beautify

set -e

for file in $AUGUR_CORE/src/*.se
do
  filename=$(basename "$file")
  if [ $filename = "legacyRepContract.se" ]
  then
    filename="${filename%.*}"
    abipath=$AUGURJS/src/contracts/abi/"${filename^}".abi.json
    echo $abipath
    serpent mk_full_signature $file | js-beautify --indent-size 2 > $abipath
  fi
done

for file in $AUGUR_CORE/src/**/*.se
do
  filename=$(basename "$file")
  foldername=$(basename $(dirname $file))
  if [ $foldername = "extensions" ] || [ $foldername = "reporting" ] || [ $foldername = "trading" ]
  then
    filename="${filename%.*}"
    abipath=$AUGURJS/src/contracts/abi/$foldername/"${filename^}".abi.json
    echo $abipath
    serpent mk_full_signature $file | js-beautify --indent-size 2 > $abipath
  fi
done

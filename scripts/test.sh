#!/bin/bash

echo "env: $1";
echo "debug: $2";
echo "coin: $3";

env=$1
debug=$2
coin=$3


test_eth_debug () {
  if [[ $coin = 'eth' || $coin = 'false' ]]
  then
    echo "Starting eth test"
    cd e2e/sdk-swaps/ethereum-e2e-swap && npm run dev && cd ../../../
  fi
}

test_bch_debug () {
  if [[ $coin = 'bch' || $coin = 'false' ]]
  then
    echo "Starting bch test"
    cd e2e/sdk-swaps/bitcoincash-e2e-swap && npm run dev && cd ../../../
  fi
}

test_rune_debug () {
  if [[ $coin = 'rune' || $coin = 'false' ]]
  then
    echo "Starting rune test"
    cd e2e/sdk-swaps/thorchain-e2e-swap && npm run dev && cd ../../../
  fi
}

test_eth () {
  if [[ $coin = 'eth' || $coin = 'false' ]]
  then
    echo "Starting rune test"
    cd e2e/sdk-swaps/etherum-e2e-swap && npm run test && cd ../../../
  fi
}

test_bch () {
  if [[ $coin = 'bch' || $coin = 'false' ]]
  then
    echo "Starting bch test"
    cd e2e/sdk-swaps/bitcoincash-e2e-swap && npm run test && cd ../../../
  fi
}


test_rune () {
  if [[ $coin = 'rune' || $coin = 'false' ]]
  then
    echo "Starting rune test"
    cd e2e/sdk-swaps/thorchain-e2e-swap && npm run test && cd ../../../
  fi
}

#if [[ $2 = 'true' ]]
#then
#  test_eth_debug
#  test_bch_debug
#  test_rune_debug
#
#else
#  test_eth
#  test_bch
#  test_rune
#fi


if [[ $2 = 'true' ]]
then
  cd e2e/sdk-transfers/thorchain-e2e-transfer && npm run dev && cd ../../../ &&/
  cd e2e/sdk-transfers/ethereum-e2e-transfer && npm run dev && cd ../../../ &&/
#   cd e2e/sdk-support/rbf-ethereum && npm run dev && cd ../../../ &&/
  cd e2e/sdk-support/abort-tx && npm run dev && cd ../../../ &&/
  cd e2e/sdk-support/forget-user && npm run dev && cd ../../../ &&/
  cd e2e/sdk-support/querykey-migration && npm run dev && cd ../../../ &&/
#  cd e2e/sdk-support/context-switching && npm run dev && cd ../../../ &&/
#  cd e2e/sdk-swaps/bitcoincash-e2e-swap && npm run dev && cd ../../../ &&/
#  cd e2e/sdk-swaps/etherum-e2e-swap && npm run dev && cd ../../../ &&/
#  cd e2e/sdk-swaps/thorchain-e2e-swap && npm run dev && cd ../../../

else
#  cd e2e/sdk-swaps/bitcoincash-e2e-swap && npm run test && cd ../../../ &&/
  cd e2e/sdk-support/abort-tx && npm run test && cd ../../../ &&/
#  cd e2e/sdk-swaps/etherum-e2e-swap && npm run test && cd ../../../ &&/
#  cd e2e/sdk-swaps/thorchain-e2e-swap && npm run test
fi

#	cd e2e/sdk-swaps/thorchain-e2e-swap && npm run dev
#	cd e2e/sdk-swaps/thorchain-e2e-swap && npm run test &&/
#	cd e2e/sdk-swaps/etherum-e2e-swap && npm run dev
#	cd e2e/sdk-swaps/etherum-e2e-swap && npm run test &&/
#	cd e2e/sdk-swaps/tokens-e2e-swap && npm run dev
#	cd e2e/sdk-swaps/tokens-e2e-swap && npm run test
#	cd e2e/sdk-support/abort-tx && npm run dev
#	cd e2e/sdk-support/abort-tx && npm run test

#!/bin/bash

echo "env: $1";
echo "debug: $2";

if [[ $2 = 'true' ]]
then
  cd e2e/sdk-swaps/etherum-e2e-swap && npm run run-dev
else
  cd e2e/sdk-swaps/etherum-e2e-swap && npm run test
fi

#	cd e2e/sdk-swaps/thorchain-e2e-swap && npm run run-dev
#	cd e2e/sdk-swaps/thorchain-e2e-swap && npm run test &&/
#	cd e2e/sdk-swaps/etherum-e2e-swap && npm run run-dev
#	cd e2e/sdk-swaps/etherum-e2e-swap && npm run test &&/
#	cd e2e/sdk-swaps/tokens-e2e-swap && npm run run-dev
#	cd e2e/sdk-swaps/tokens-e2e-swap && npm run test
#	cd e2e/sdk-support/abort-tx && npm run run-dev
#	cd e2e/sdk-support/abort-tx && npm run test

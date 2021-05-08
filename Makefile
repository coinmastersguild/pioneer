# Project Pioneer
# multi-asset development platform

SHELL=/bin/bash

clean:
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

#Todo
#make config
#generate new seed and .env file usinging pioneer-cli


#make install
install:
    yarn


test:
	npm run --prefix ./e2e/sdk/bitcoin-e2e-sdk test


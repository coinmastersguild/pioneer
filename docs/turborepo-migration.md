# Pioneer Turborepo Migration

## Overview

This document tracks the migration of Pioneer from Lerna to Turborepo using pnpm.

## Completed Tasks

- [x] Removed Lerna dependencies and references
- [x] Added Turborepo configuration in turbo.json
- [x] Converted all npm scripts to use pnpm
- [x] Updated package.json scripts to use pnpm recursive commands
- [x] Added Changesets for versioning
- [x] Updated .npmrc for pnpm compatibility
- [x] Updated .gitignore to include Turborepo specific entries
- [x] Updated CircleCI configuration for pnpm and Turborepo
- [x] Fixed build issues with the following packages:
  - [x] modules/coins/osmosis/osmosis-tx-codecs
  - [x] modules/coins/cosmos/cosmos-tx-encode
  - [x] modules/coins/cosmos/cosmos-tx-builder
  - [x] modules/coins/evm/evm-network

## Remaining Tasks

- [ ] Resolve build issues with remaining packages
- [ ] Update all packages to use TypeScript locally instead of globally
- [ ] Test Changesets for versioning
- [ ] Verify CI/CD pipeline works with new setup
- [ ] Update documentation for development workflow

## Encountered Issues and Solutions

### Build Issues

#### Missing Dependencies
Several packages had missing dependencies that were needed at runtime but were defined as devDependencies:

```bash
# For osmosis-tx-codecs
pnpm add long protobufjs @cosmjs/proto-signing cosmjs-types

# For cosmos-tx-builder
pnpm add @cosmjs/proto-signing cosmjs-types protobufjs long @keepkey/hdwallet-core

# For evm-network
pnpm add ethers
```

#### TypeScript Global vs Local
Some packages were relying on globally installed TypeScript. It's recommended to add TypeScript as a local dependency in each package.

### Benefits of Migration

### Turborepo vs Lerna

1. **Performance**: Turborepo offers significantly faster builds with intelligent caching
2. **Task Graph**: Better dependency management and task orchestration
3. **Modern Tooling**: Better integration with current JavaScript ecosystem

### pnpm vs npm

1. **Disk Space**: pnpm uses a content-addressable store to avoid duplication
2. **Performance**: Faster installation times
3. **Strict Mode**: Better dependency management and avoidance of phantom dependencies
4. **Workspace Support**: Better monorepo support built-in

## Workflow Changes

### Before (with Lerna)

```bash
# Install dependencies
npm install

# Build all packages
lerna run build

# Version bump
lerna version patch --yes

# Publish packages
lerna publish from-package --no-private --yes
```

### After (with Turborepo and pnpm)

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r run build

# Version bump and publish
pnpm changeset
pnpm version
pnpm publish
```

## Troubleshooting

- If experiencing TypeScript issues, ensure TypeScript is installed globally or locally in each package
- If Turborepo caching issues occur, try running with `--force` flag
- For CI issues, ensure proper setup of Turborepo remote caching tokens 
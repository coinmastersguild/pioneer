# Pioneer Platform Turborepo Migration

This document provides instructions for completing the migration from Lerna to Turborepo using pnpm.

## Current Status

The migration is in progress. The following steps have been completed:

- Lerna has been removed from the project
- Turborepo has been added and configured
- pnpm is now the package manager
- Package.json scripts have been updated
- CircleCI configuration has been updated
- Some package dependencies have been fixed

See `docs/turborepo-migration.md` for more details.

## Remaining Steps

1. **Fix build issues with remaining packages**
   - Some packages still have dependency issues that need to be resolved

2. **Add TypeScript as a local dependency**
   - Run the script to add TypeScript to packages that need it:
   ```
   node add-typescript-to-packages.js
   ```
   
3. **Test Changesets for versioning**
   - Try creating a changeset:
   ```
   pnpm changeset
   ```
   - Test versioning:
   ```
   pnpm version
   ```
   - Test publishing (you may want to use `--dry-run` flag):
   ```
   pnpm publish --dry-run
   ```

4. **Verify CI/CD Pipeline**
   - Push a small change to a branch and verify that CircleCI builds correctly with the new configuration

## Scripts

### add-typescript-to-packages.js
This script identifies packages that use TypeScript but don't have it as a dependency, and adds it as a devDependency.

```
node add-typescript-to-packages.js
```

## Migration Benefits

- **Faster Builds**: Turborepo provides cached builds, making subsequent builds much faster
- **Better Workspace Management**: pnpm provides a more efficient and reliable workspace management
- **Modern Tooling**: Changesets provide a better way to manage versioning and changelogs
- **Improved CI/CD**: The updated CI configuration provides better caching and faster builds

## Troubleshooting

If you encounter build issues:

1. Check for missing dependencies in the failing package
2. Ensure TypeScript is installed properly (either globally or locally)
3. For packages with complex dependencies, consider installing dependencies directly
4. In some cases, you may need to update the versions of certain dependencies

For more information, see the migration document at `docs/turborepo-migration.md`. 
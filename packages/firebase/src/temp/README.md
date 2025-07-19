# Firebase SDK Persistence Workaround

## Overview

This directory contains temporary files copied from the Firebase SDK to work around build errors encountered in Next.js applications when using Firebase Auth persistence functionality.

## Problem

The Firebase Auth SDK has compatibility issues with Next.js builds, particularly related to persistence mechanisms that handle React Native and web environments differently. The build errors occur due to:

- Module resolution conflicts between React Native and web builds
- Incompatible persistence type definitions
- Missing or incorrectly resolved internal Firebase SDK dependencies

## Attempted Solutions

Before implementing the current workaround, several approaches were tried:

### 1. Custom Type Definitions

- Created a custom `firebase.d.ts` file to provide missing type definitions
- Did not resolve the underlying module resolution issues

### 2. Webpack Ignore Plugin

- Used Next.js webpack configuration with ignore plugins to skip problematic imports
- Caused runtime errors when the ignored modules were actually needed

### 3. TypeScript Ignore Annotations

- Added TypeScript `// @ts-ignore` comments to suppress compilation errors
- Only masked the problem without fixing the underlying build issues
- Led to runtime errors in production builds

### 4. Module Resolution Overrides

- Attempted to override module resolution in `tsconfig.json` and Next.js config
- Firebase SDK's internal dependencies still caused conflicts

### 5. Dynamic Imports with Environment Detection

- Considered dynamically importing React Native persistence only in React Native environments
- This approach could potentially work by conditionally loading the persistence mechanism
- However, it would make the entire `getFirebase` singleton usage asynchronous
- This would complicate the codebase significantly, requiring `await` calls throughout the application
- The complexity added would be disproportionate to the problem, especially since:
  - The required persistence files are small dependencies
  - These files are available in the Firebase SDK, just not exported from `firebase/auth`
  - The current workaround maintains synchronous Firebase initialization

## Solution

As none of the above approaches provided a stable solution, we implemented a temporary workaround by copying the necessary persistence-related files directly from the Firebase SDK source code to our local codebase:

### Files Copied

- **`nativePersistence.ts`** - React Native AsyncStorage persistence implementation
- **`persistence.ts`** - Core persistence interfaces and types
- **`publicTypes.ts`** - Public interface definitions for persistence mechanisms

### Usage

These files are imported in `/src/index.ts` to provide the `getReactNativePersistence` function:

```typescript
import { getReactNativePersistence } from './temp/nativePersistence';
```

The persistence is then used conditionally based on the environment:

```typescript
const _getPersistence = (): Persistence => {
  if (_isReactNative()) {
    return getReactNativePersistence(ReactNativeAsyncStorage);
  }
  return browserSessionPersistence;
};
```

## Important Notes

⚠️ **This is a temporary workaround** - These files should be removed once Firebase SDK resolves the Next.js compatibility issues.

📄 **License Compliance** - All copied files retain their original Google LLC license headers and are used under the Apache License, Version 2.0.

🔄 **Version Sync** - If updating Firebase SDK versions, these files may need to be updated to match the new SDK version to avoid compatibility issues.

## Future Action Items

- [ ] Monitor Firebase SDK releases for Next.js compatibility fixes
- [ ] Remove this workaround once official support is available
- [ ] Test builds after Firebase SDK updates to determine if workaround is still needed

## Related Issues

This workaround addresses build errors that typically manifest as:

- Module not found errors for internal Firebase paths
- TypeScript compilation errors related to persistence types
- Runtime errors in Next.js applications when initializing Firebase Auth

Example:

```shell
../../packages/firebase/dist/index.mjs
Attempted import error: 'getReactNativePersistence' is not exported from 'fireb
ase/auth' (imported as 'getReactNativePersistence').

Import trace for requested module:
../../packages/firebase/dist/index.mjs
consume shared module (default) @fiap-farms/firebase@* (singleton) (fallback: .
./../packages/firebase/dist/index.mjs)
../../packages/auth-store/dist/index.mjs
consume shared module (default) @fiap-farms/auth-store@* (singleton) (fallback:
 ../../packages/auth-store/dist/index.mjs)
```

On Firebase JS SDK:
  - https://github.com/firebase/firebase-js-sdk/issues/7615
  - https://github.com/firebase/firebase-js-sdk/issues/7584

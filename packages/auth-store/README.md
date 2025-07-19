# @fiap-farms/auth-store

A global authentication store for managing Firebase authentication state across microfrontends and React Native applications.

## Features

- **Global State Management**: Uses Zustand for lightweight, performant state management
- **Firebase Integration**: Built-in integration with Firebase Authentication
- **Cross-Platform**: Works with web applications and React Native
- **TypeScript Support**: Fully typed for better development experience
- **Simple API**: Just two hooks for all your auth needs
- **Persistence**: Authentication persistence is handled by `@fiap-farms/firebase`

## Installation

```bash
npm install @fiap-farms/auth-store
```

## Setup

Authentication persistence is configured in the `@fiap-farms/firebase` package. The auth store automatically uses whatever Firebase Auth instance is provided by the config.

### Initialize Auth Listener

In your app's root component, set up the Firebase auth state listener:

```tsx
import { useAuthListener } from '@fiap-farms/auth-store';

function App() {
  // Setup Firebase auth state listener
  useAuthListener();

  return <YourAppContent />;
}
```

## Usage

### Using the Auth Hook

```tsx
import { useAuth, useAuthListener } from '@fiap-farms/auth-store';

function LoginComponent() {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signOut,
    signUp,
    clearError,
  } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      await signUp(email, password);
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.email}!</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={() => handleLogin('user@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => handleSignUp('user@example.com', 'password')}>
        Sign Up
      </button>
    </div>
  );
}
```

## API Reference

### Hooks

- `useAuth()`: Returns complete auth state and actions
- `useAuthListener()`: Sets up Firebase auth state listener

### Types

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

## Integration Examples

### Next.js App

```tsx
// pages/_app.tsx
import { useAuthListener } from '@fiap-farms/auth-store';

export default function App({ Component, pageProps }) {
  // Setup auth listener once at app level
  useAuthListener();

  return <Component {...pageProps} />;
}
```

### React Native

```tsx
// App.tsx
import { useAuth, useAuthListener } from '@fiap-farms/auth-store';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Set up auth listener
  useAuthListener();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <LoginScreen />;
}
```

## Dependencies

- `zustand`: State management
- `@fiap-farms/firebase`: Firebase configuration
- `firebase`: Firebase SDK
- `react`: React (peer dependency)
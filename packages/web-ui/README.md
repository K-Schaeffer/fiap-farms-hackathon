# @fiap-farms/web-ui

A shared UI components library for web React applications.

## Features

- 🎨 Modern, customizable React components
- 📦 Built with TypeScript for type safety
- 🚀 Optimized bundle with tsup
- 📱 Responsive design principles
- 🎯 Web-only focus (no React Native dependencies)

## Installation

```bash
npm install @fiap-farms/web-ui
# or
yarn add @fiap-farms/web-ui
# or
pnpm add @fiap-farms/web-ui
```

## Usage

### Individual Component Import

```tsx
import { FButton, FCard, FInput, FBadge } from '@fiap-farms/web-ui';

function App() {
  return (
    <FCard>
      <FInput label="Email" type="email" placeholder="Enter your email" />
      <FButton variant="primary" size="md">
        Submit
      </FButton>
      <FBadge variant="success">Active</FBadge>
    </FCard>
  );
}
```

### Components Object Import

```tsx
import { Components } from '@fiap-farms/web-ui';

function App() {
  return (
    <Components.FCard>
      <Components.FButton>Click me</Components.FButton>
    </Components.FCard>
  );
}
```

## Components

### FButton

A versatile button component with multiple variants and sizes.

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `fullWidth`: boolean
- `onClick`: click handler
- `type`: 'button' | 'submit' | 'reset'

### FCard

A flexible card container component.

**Props:**

- `variant`: 'default' | 'elevated' | 'outlined'
- `padding`: 'sm' | 'md' | 'lg'
- `hoverable`: boolean
- `onClick`: click handler

### FInput

A comprehensive input component with labels and validation support.

**Props:**

- `type`: standard HTML input types
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'outlined' | 'filled'
- `label`: string
- `helperText`: string
- `errorMessage`: string
- `error`: boolean
- `disabled`: boolean
- `required`: boolean
- `fullWidth`: boolean

### FBadge

A small status indicator component.

**Props:**

- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `outlined`: boolean

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Watch mode for development
pnpm dev

# Type check
pnpm type-check
```

## License

MIT

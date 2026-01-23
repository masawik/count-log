# Zubo Counter

> A mobile-only application for tracking real-world data, logging facts, and discovering insights through analytics. Currently a simple counter app, but designed to evolve into a comprehensive tracking and analytics platform.

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![Effector](https://img.shields.io/badge/Effector-23.4.4-FF6B6B)](https://effector.dev/)
[![FSD](https://img.shields.io/badge/FSD-3193FF?logoColor=white)](https://feature-sliced.design/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.0.0-119EFF?logo=capacitor)](https://capacitorjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## 🎯 Overview

**Zubo Counter** is a mobile-only application designed for those who believe that there's no such thing as too much information when it comes to logging real-world facts and events. The core idea is simple: capture data from your daily life, track it over time, and then analyze it to discover patterns, correlations, and insights that might not be immediately obvious.

Whether you're tracking books read, workouts completed, habits formed, or any other quantifiable aspect of your life, Zubo Counter aims to help you understand your data through powerful analytics, visualizations, and comparisons. It's built for people who love statistics, year-end summaries, and visualizing changes and progress over time.

**Currently**, the app provides a solid foundation with basic counter functionality. The underlying architecture is designed to support future features.

### Current Features

- ✅ Create and manage counters
- ✅ Customizable counter names and emoji icons
- ✅ Increment/decrement with configurable step values
- ✅ Counter change log
- ✅ Built-in stopwatch

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (required - project uses pnpm-specific features)

### Installation

```bash
# Clone the repository
git clone https://github.com/masawik/count-log.git
cd count-log

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Building for Production

```bash
# Build frontend and sync with Android
pnpm build

# Or build separately
pnpm build:front      # Build React app
pnpm sync:android     # Sync with Capacitor
```

### Running Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run visual regression tests
pnpm test:s

# Update visual snapshots
pnpm test:us
```

### Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# CSS linting
pnpm stylelint

# FSD architecture validation
pnpm fsdcheck

# Run all checks
pnpm fullcheck
```

## 📱 Android Setup

1. Ensure Android Studio is installed with Android SDK
2. Build the project: `pnpm build`
3. Run on Android device/emulator:

   ```bash
   npx cap run android
   ```

## 🏗️ Architecture

This project is built with a focus on **scalability**, **maintainability**, and **performance**. The architecture choices reflect a long-term vision:

### Technology Stack

#### Core Framework

- **React 19** - Latest React with concurrent features
- **React Router v7** - Modern routing with SSR support
- **TypeScript** - Full type safety

#### State Management

- **Effector** - Reactive state management with excellent TypeScript support

#### Architecture Pattern

- **Feature-Sliced Design (FSD)** - Scalable, maintainable code organization
  - Enforced with [Steiger](https://github.com/feature-sliced/steiger) linter
  - Clear separation of concerns: `entities`, `features`, `widgets`, `pages`, `shared`

#### Database

- **SQLite** (via Capacitor Community SQLite) - Local, encrypted database
- **sql.js** - SQLite compiled to WebAssembly for browser support
- **Kysely** - Type-safe SQL query builder
- **Capacitor SQLite Kysely** - Integration layer for native environments

#### UI & Styling

- **Radix UI Themes** - Accessible, customizable component library
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library

#### Mobile

- **Capacitor 8** - Native mobile app framework
- **Android** - Native Android app support

#### Development Tools

- **Playwright** - E2E and visual regression testing
- **ESLint** - Code quality and consistency
- **Stylelint** - CSS linting
- **Prettier** - Code formatting

## 🤝 Contributing

Contributions are welcome! I'm happy to receive any help with the project.

### Getting Started

If you want to practice your skills or tackle a small task, check out the [**good first issues**](https://github.com/masawik/count-log/issues?q=state%3Aopen%20label%3A%22good%20first%20issue%22). These are beginner-friendly issues that are great for getting familiar with the codebase.

If you're interested in making a significant contribution and developing a feature, take a look at the [**project backlog**](https://github.com/users/masawik/projects/1) to see what's planned and where you can make an impact.

### Development Guidelines

This project follows **Feature-Sliced Design** principles, so please ensure your changes align with the architecture.

If you're new to open source contributions, check out this excellent guide: [Fork, Commit, Merge](https://github.com/fork-commit-merge/fork-commit-merge) - it walks you through the entire contribution workflow on GitHub.

Before submitting a pull request, make sure to run `pnpm fullcheck` to ensure code quality.

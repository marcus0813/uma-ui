# UMA-UI: React Frontend for UMA Platform

### Tech Stacks
- React 19
- Axios
- React Router v7
- CSS(custom)
- JWT
- Font Awesome
- Dropzone

### Prerequisites

- [Node.js (LTS)](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (npm used in development)
- [Visual Studio Code](https://code.visualstudio.com/) with recommended extensions:
  - ESLint
  - Prettier
  - React Developer Tools

### Computer Specifications (Development Environment)

- Operating System: Windows 10/11, macOS or Linux (Windows 11 used in development)
- RAM: 8 GB or more recommended (32 GB used in development)
- Processor: Quad-core processor or better (Intel i5-1135G7 used in development)
- Storage: At least 5 GB free disk space for node modules and build artifacts
- IDE/Editor: Visual Studio Code (used in development)

### Setup Project

**1. Clone the Repository**

```bash
git clone https://github.com/marcus0813/uma-ui.git
```

**2. Navigate to the Project Directory**

```bash
cd uma-ui
```

**3. Install Dependencies (*may use --force if got error*)**

```bash
npm install
# or
yarn install
```

**4. Configure Environment Variables**

Create a .env file in the project root with values matching your backend API:

```env
REACT_APP_BACK_END_API=https://localhost:7073
# API URL may refer from launchSettings.json from UMA-API
```

**5. Run the Project**

```bash
npm start
# or
yarn start
```

The app should now be running at http://localhost:3000.

## Assumptions
This project is a React-based frontend designed to integrate with UMA-API. It follows modular architecture principles for scalability and maintainability.

### Architecture Overview
- **src/components (UI Layer)**
  - Reusable UI components (header, footer, etc.).

- **src/pages (Page Layer)**
  -  Defines application routes and user-facing views (Login, Profile, Register).

- **src/hooks (Custom Hooks Layer)**
  - Reusable React hooks for API calls, authentication, and state handling.

- **src/services (API Layer)**
  -  Handles UMA-API communication with Axios.
  
**src/context (State Management Layer)**
  -  Provides React Context for global state (authentication, user session).

-  **src/utils (Utility Layer)**
  -  Validators reused across components.

### Key Features
**1. Authentication & Authorization**

-  Integrates with UMA-API using JWT tokens.
-  Tokens stored securely via HTTP-only cookies.

**2. State Management**
-  React Context and hooks manage global authentication state.
-  Axios interceptors handle automatic token refresh.

**3. API Integration**
-  Axios service modules for UMA-API endpoints.
-  Supports CORS and withCredentials for secure communication.

**4. Styling & UI**
-  Component-driven UI with responsive design.
-  Prettier + ESLint for consistent code style.

**5. Error & Logging**
-  API error handling in Axios service hooks.
-  Graceful fallback UI using React error boundaries.

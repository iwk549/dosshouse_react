# dosshouse_react

React frontend for the Dosshouse sports prediction app (World Cup picks, leaderboards, groups, etc.).

## Stack

- **Runtime**: Node 20.x, npm 10.x
- **Framework**: React 17 via Create React App (react-scripts 5)
- **Routing**: React Router v6 (useNavigate, useSearchParams)
- **HTTP Client**: axios 0.26.1 wrapped in `src/services/nodeHttpService.js`
- **State**: React Context API (`loadingContext`) + useReducer for complex state — no Redux
- **UI**: react-toastify (toasts), react-modal, framer-motion, react-dnd (drag & drop), victory (charts), react-svg-tournament-bracket
- **Validation**: joi-browser 13.4.0
- **Auth**: JWT stored in cookies (js-cookie); auto-injected via axios interceptor; Google OAuth via Firebase (configured in `public/index.html`)
- **Analytics**: react-ga4 (Google Analytics 4)
- **Testing**: Jest + React Testing Library + Cypress (E2E)
- **Linting**: ESLint 8 (plugin:react recommended)

## Project Structure

```
public/               # Static assets, index.html (Firebase config here)
src/
  App.js              # Root component
  index.js            # Entry point — imports global CSS
  components/
    common/           # Reusable UI (form, modal, loading, pageSections, table, tooltip, cards)
    navigation/       # Navbar, navDropDown
    predictions/      # Main feature: home, maker (bracket builder), leaderboard, groups
    user/             # Login, Registration, Profile
    switchRouter.jsx  # Route configuration
  services/           # API layer (one file per resource)
    nodeHttpService.js   # Axios wrapper with JWT interceptor
    userService.js
    competitionService.js
    predictionsService.js
    matchService.js
    groupsService.js
    resultsService.js
    cookieService.js
  context/
    loadingContext.jsx  # Global state: loading, user, cookiesAccepted
  css/                # Global stylesheets (buttons, inputs, nav, table, etc.)
  utils/              # Business logic helpers
    predictionsUtil.js  # Core prediction reducers/handlers
    bracketsUtil.js
    leaderboardUtil.js
    allowables.js
    useWindowDimensions.js  # Custom hook for responsive design
  textMaps/           # Static data (logos, groups, rules, pageTitles)
  __test__/           # Jest + RTL tests
cypress/              # E2E tests
```

## Running

```bash
npm run dev          # Dev server without auto-opening browser (port 3000)
npm start            # Dev server + opens browser
npm run build        # Production build
npm run lint         # ESLint on all .jsx files
npm run cypress      # Open Cypress runner
```

## Testing

```bash
npm test             # Jest watch mode
npm run test:all     # All tests with coverage, no watch (CI mode)
```

- Coverage thresholds: statements 65%, branches 55%, functions 60%, lines 65%
- Test files in `src/__test__/`, named `*.test.js`
- Shared fixtures in `__test__/testData.js`, mock helpers in `__test__/mockHelpers.js`
- Services directory excluded from coverage
- Cypress E2E baseUrl: `http://localhost:3000`

## Config / Environment

- `.env.development` — dev API URLs (`REACT_APP_RENDER_API_URL` → `http://localhost:3001/api/v1`)
- `.env.production` — prod API URLs (Render.com)
- All env vars use `REACT_APP_*` prefix (CRA requirement)
- Firebase config lives in `public/index.html` (not in env vars)

## Git

- Do not add `Co-Authored-By` trailers to commit messages.

## Key Conventions

- **Routing**: Query params drive sub-routing (`id`, `competitionID`, `groupID`, `tab`, `type`). `switchRouter.jsx` is the single route config; navigate with `useNavigate`, not `<Link>`.
- **Service layer**: Every API resource has a service file in `src/services/`. Components call service functions, never axios directly.
- **State**: Context (`loadingContext`) for global user/loading state; `useReducer` for complex local state (e.g., prediction maker); `useState` for UI state.
- **Forms**: Custom form components in `components/common/form/`; Joi for validation; manual state via useState.
- **Styling**: Global CSS files imported in `index.js`; class-based with Bootstrap-like naming (`btn btn-sm btn-info`). Responsive via `useWindowDimensions` hook. Avoid inline styles — add CSS classes instead.
- **Toasts**: Use react-toastify for user feedback on API success/errors.
- **Legacy code**: `components/activeSites/` and `components/spotifyApi/` are unrouted legacy features — do not modify or add to them.

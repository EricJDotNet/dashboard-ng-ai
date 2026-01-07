# Copilot / AI agent instructions for dashboard-ng-ai

Purpose: quick, actionable rules to help an AI coding agent be productive in this repo.

- **Project type:** Angular 20 single-page application using standalone components and `bootstrapApplication`.
  - Entry: [src/main.ts](src/main.ts)
  - Global app config & providers: [src/app.config.ts](src/app.config.ts)

- **Routing & app structure:**
  - Top-level routes live in [src/app.routes.ts](src/app.routes.ts). The root layout component is `AppLayout` ([src/app/layout/component/app.layout.ts](src/app/layout/component/app.layout.ts)).
  - Pages are organized under `src/app/pages/*`. Lazy-loaded route modules use `loadChildren` pointing to route files (example: `./app/pages/uikit/uikit.routes`).

- **Component conventions:**
  - Components are implemented as Angular standalone components (`standalone: true`) and import their dependencies locally (see [src/app.component.ts](src/app.component.ts)).
  - Styles use SCSS by default (see `angular.json` and component schematics).
  - When adding or editing components, preserve `standalone: true` and the `imports` array rather than moving imports to NgModules.

- **State & layout patterns:**
  - The layout is controlled by a `LayoutService` which uses Angular Signals (`signal`, `computed`, `effect`) together with a few RxJS Subjects for events. Inspect [src/app/layout/service/layout.service.ts](src/app/layout/service/layout.service.ts) for common patterns:
    - `layoutConfig` and `layoutState` are Signals; changes are emitted via Subjects (`overlayOpen$`, `menuSource$`).
    - UI components subscribe to these Observables and read Signals directly when needed.
  - When modifying layout behavior, update both the `LayoutService` and the layout components (`app.layout`, `app.sidebar`, `app.topbar`).

- **Third-party integrations & theming:**
  - PrimeNG theme preset: provided in `app.config.ts` via `providePrimeNG` and Aura theme package (`@primeuix/themes`).
  - Auth: Auth0 is configured with `provideAuth0` in [src/app.config.ts](src/app.config.ts) and reads values from [src/environments/environment.ts].
  - Styling: uses SCSS + Tailwind. Key entry: [src/assets/styles.scss](src/assets/styles.scss) and `src/assets/tailwind.css`.

- **Build / run / test commands:** (from `package.json`)
  - Dev server: `npm start` → runs `ng serve`.
  - Build: `npm run build` → runs `ng build` (default configuration is `production` per `angular.json`).
  - Watch: `npm run watch` → `ng build --watch --configuration development`.
  - Tests: `npm test` → `ng test` (Karma + Jasmine).

- **Code style / tooling:**
  - Prettier is used for formatting (`npm run format`).
  - ESLint configs are present; follow existing lint rules when editing code.

- **When changing routing or providers:**
  - Add new app-wide providers in [src/app.config.ts](src/app.config.ts).
  - Update top-level routes in [src/app.routes.ts](src/app.routes.ts). Use existing lazy-load pattern for large page sets.

- **Files and examples to reference for common tasks:**
  - bootstrap & providers: [src/main.ts](src/main.ts), [src/app.config.ts](src/app.config.ts)
  - Routing: [src/app.routes.ts](src/app.routes.ts)
  - Layout + signals: [src/app/layout/service/layout.service.ts](src/app/layout/service/layout.service.ts)
  - Layout components: [src/app/layout/component/app.layout.ts](src/app/layout/component/app.layout.ts)
  - Styling entry: [src/assets/styles.scss](src/assets/styles.scss)
  - Scripts & deps: [package.json](package.json)

Guidance for the AI agent: make minimal, focused edits; when touching cross-cutting areas (routing, app providers, layout service), update both the service and the UI components that consume it. Prefer adding new standalone components with explicit `imports` and SCSS styles. When adding credentials or secrets, do not hardcode — use [src/environments/environment.ts].

If any section is unclear or you'd like more examples (component skeletons, common tests), tell me which area to expand.

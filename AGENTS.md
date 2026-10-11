# AGENTS.md — Development Agent Instructions

> This file guides Codex or any other coding agent working in the repository.  
> **Priority order:** Instructor's assignment > [`REQUIREMENTS.md`](./REQUIREMENTS.md) > [`FLOWS.md`](./FLOWS.md) > this file. If requirements conflict, **do not improvise**: report the conflict before writing code.

## 1. Objective

Implement an **academic tourism app** using Expo + React Native + TypeScript that runs in Expo Go and supports:

- **Local** sign-up/sign-in and sign-out.
- A read-only catalog of **20 predefined tourist destinations**.
- Destination Details and independent favorites for each user.
- Creating, editing, and deleting **user-owned destinations**, shown in a dynamic `FlatList`.
- Persisting users, session, custom destinations, and favorites in **AsyncStorage**.
- Displaying an **approximate compass direction toward a destination** using device sensors and location.

Prioritize **rubric compliance, readability, and the ability to explain the code during the oral defense** over sophisticated architecture or extra features.

## 2. Mandatory constraints

1. Use **Expo (a stable SDK compatible with Expo Go)**, **React Native**, and **TypeScript**.
2. Use **functional components and hooks only**. Do not introduce class components.
3. Implement real **Stack/Tab navigation**. Prefer Expo Router if the existing project uses it or the project is initialized from a suitable template.
4. Use **FlatList** for the main dynamic list.
5. Validate forms and provide consistent visual feedback.
6. Use **Flexbox** and avoid layouts designed for only one screen size.
7. **Do not** implement a backend, endpoints, remote authentication, online maps, or cloud persistence.
8. **Do not** add libraries requiring custom native development or a custom development build: the demo must work in **Expo Go**.
9. Use `npx expo install` for Expo-managed dependencies, choosing versions compatible with the installed SDK.
10. Do not store passwords in plain text. If using a locally salted/hashed password verifier, describe it as an **educational demonstration**, not production authentication. Do not ask for real credentials during the demo.
11. Camera, compass, and location are **not** interchangeable: the required native feature here is **location and heading/orientation**, not scanning or UWB.

## 3. Suggested architecture (adapt to an existing project)

```text
src/
├── app/
│   ├── _layout.tsx                 # providers + root navigation
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (app)/
│       ├── _layout.tsx             # authenticated route protection
│       ├── (tabs)/
│       │   ├── _layout.tsx
│       │   ├── index.tsx           # Explore
│       │   └── favorites.tsx       # Favorites
│       └── destination/
│           ├── [id].tsx            # Details + orientation
│           └── form.tsx            # Create/edit using id parameter
├── components/                     # reusable UI
├── features/
│   ├── auth/                       # forms and session logic
│   ├── destinations/               # CRUD, lists, validation
│   ├── favorites/                  # toggle, per-user selectors
│   └── compass/                    # sensors and bearing calculations
├── data/
│   └── defaultDestinations.ts      # exactly 20 fixed destinations
├── storage/                        # AsyncStorage + serialization
├── context/                        # minimal shared state (session/data)
├── types/                          # shared types
└── utils/                          # pure helpers
README.md
REQUIREMENTS.md
FLOWS.md
AGENTS.md
```

This structure is a **suggestion**, not an instruction to create empty folders. If the repository already has a reasonable structure, preserve it and explain changes. Avoid duplicating state and business logic across screens.

## 4. Minimum data model

```ts
type User = {
  id: string;
  name: string;
  email: string; // normalized to lowercase
  passwordVerifier: string; // no plaintext password; academic prototype
  passwordSalt: string;
};

type Destination = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  source: 'seed' | 'custom';
  ownerId?: string; // required when source === 'custom'
};

type Session = { userId: string };
type Favorite = { userId: string; destinationId: string };
```

Invariants:

- The **20 seeded destinations** are constants with stable IDs and real coordinates.
- A `custom` destination requires an `ownerId` and must not be exposed to another user.
- Seed and custom IDs must never collide (for example, use `seed-` and `custom-` prefixes).
- Favorites may reference only destinations visible to the active user.
- Check ownership in **domain functions**, not merely by hiding UI buttons.
- When deleting a custom destination, also remove its associated favorites in the same logical update.

## 5. Persistence and state

- Maintain a **single source of truth** for sessions and mutable data. Expose clear actions (`signUp`, `signIn`, `signOut`, `createDestination`, `updateDestination`, `deleteDestination`, `toggleFavorite`).
- Keep seeded destinations **in source code**; **do not** store or reinsert them into AsyncStorage at app launch.
- Use versioned storage keys, for example: `tourism.users.v1`, `tourism.session.v1`, `tourism.destinations.v1`, `tourism.favorites.v1`.
- Read and validate stored data before enabling navigation; handle invalid JSON, missing keys, and orphaned sessions without crashing or silently losing data.
- For asynchronous operations, handle `try/catch`, feedback, and loading state; do not announce success if persistence fails.
- A local installation **does not** sync accounts or data with another device. Explain this in the README.

## 6. Native compass feature

- Prefer **`expo-location`** (position and heading), ensuring compatibility with the installed Expo Go version.
- Request **foreground location permission when the user taps the orientation action**, not during registration or app launch.
- Use a **pure function** to calculate the geographic bearing toward the destination and its relative angle based on device orientation.
- Verify heading availability and quality. If invalid, show an error state rather than inventing a direction.
- Subscribe and unsubscribe from listeners when starting/stopping orientation or unmounting the screen.
- Do not request background location permissions. Do not promise AirTag/UWB functionality or street-by-street navigation.
- Test on a **physical phone** and document differences from emulators.

## 7. Conventions and code quality

- Write code, types, and function names in **English**. Keep `AGENTS.md`, `FLOWS.md`, and `REQUIREMENTS.md` in **English**. The **application interface must be in Spanish**, including screen titles, buttons, labels, form validations, status messages, errors, and explanations of device permissions. The README language has not yet been confirmed; do not impose a language without approval.
- Type props, routes, entities, and functions; avoid `any`, unnecessary casts, and unvalidated objects loaded from storage.
- Give UI components a single responsibility; separate bearing calculations and CRUD operations from screen JSX.
- Prefer small, explicit solutions. Do not introduce Redux, ORM, HTTP services, complex patterns, or empty layers without a concrete reason.
- Centralize constants and messages when it reduces duplication; avoid overengineering.
- Every screen should show loading/error/empty states where relevant.
- Keep each user's history and data isolated by `userId`.
- Provide basic accessibility: `accessibilityLabel` for icon-only buttons, visible error text, and reasonable touch target sizes.

## 8. Expected agent workflow

1. **Before coding:** read `REQUIREMENTS.md`, `FLOWS.md`, and this file; inspect existing code.
2. First identify rubric essentials: **Expo Go, navigation, FlatList, CRUD, validation, Flexbox, native feature, and technical defense**.
3. Build in verifiable increments: **(a)** navigation/authentication, **(b)** catalog/details, **(c)** CRUD, **(d)** per-user favorites, **(e)** AsyncStorage/restart, **(f)** compass and fallbacks.
4. For each change, check TypeScript errors and run **existing** project validation commands. Do not claim tests passed unless they were executed.
5. Manually test at least the **12 scenarios** in Section 8 of `REQUIREMENTS.md`, distinguishing those that require a physical phone.
6. If a requirement cannot work in Expo Go, **stop and explain why**; do not silently replace it or add custom native development.
7. Before final submission, update `README.md` with installation, `npx expo start`, structure, dependencies, **justifications**, and AI-use disclosure.
8. When delivering changes, summarize **what changed, which files were affected, how to test, and what remains pending**.

## 9. Do not assume or fabricate

- **Do not invent** coordinates for the 20 destinations or present them as verified.
- Do not assume a backend/API is required.
- Do not assume an emulator has a working physical compass.
- Do not confuse local, per-user favorites with Internet-based account synchronization.
- Do not attribute unconfirmed security, visual design, or date requirements to the instructor.
- Do not pin an Expo version without checking which stable version is compatible when setting up the project.
- Do not modify earlier exercises or existing repository components unless necessary for this final project.

## 10. Documented pending decisions

See Section 9 of `REQUIREMENTS.md`. Items needing external confirmation are: **catalog/region of the 20 destinations (S-01)**, **instructor's expected screen count (S-06)**, **phone/platform for demonstrating sensors (S-07)**, and **current dates (S-08)**.

Until these answers are available, architecture, screens, and features may be implemented using **clearly labeled sample data**, but **do not** consider the catalog final or the real-device compass demonstration complete.

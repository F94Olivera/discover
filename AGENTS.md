# AGENTS.md — Development Agent Instructions

> This file guides Codex or any other coding agent working in the repository.  
> **Priority order:** Instructor's assignment > [`REQUIREMENTS.md`](./REQUIREMENTS.md) > [`FLOWS.md`](./FLOWS.md) > this file. If requirements conflict, **do not improvise**: report the conflict before writing code.

## 1. Objective

Implement an **academic tourism app** using Expo + React Native + TypeScript that runs in Expo Go and supports:

- **Local** sign-up/sign-in and sign-out.
- A read-only catalog of **20 predefined tourist destinations**.
- Destination Details and independent favorites integrated into Places for each user, with favorites sorted first.
- Creating, editing, and deleting **user-owned destinations**, shown in a dynamic `FlatList`.
- Persisting users, session, custom destinations, and favorites in **AsyncStorage**.
- Displaying an **approximate compass direction toward a destination** on a dedicated Compass screen using device sensors and location.

Prioritize **rubric compliance, readability, and the ability to explain the code during the oral defense** over sophisticated architecture or extra features.

## 2. Mandatory constraints

1. Use **Expo (a stable SDK compatible with Expo Go)**, **React Native**, and **TypeScript**.
2. Use **functional components and hooks only**. Do not introduce class components.
3. Implement real **Stack navigation**; Tabs are optional. Prefer Expo Router if the existing project uses it or the project is initialized from a suitable template.
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
│   ├── _layout.tsx                 # providers + root Stack
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (app)/
│       ├── _layout.tsx             # protected Stack
│       ├── index.tsx               # Places + favorite hearts/order + sign-out
│       ├── compass/[id].tsx        # dedicated orientation screen
│       └── destination/
│           ├── [id].tsx            # Details
│           └── form.tsx            # create/edit
├── components/                     # reusable UI as needed
├── features/                       # auth, destinations, favorites, compass
├── data/defaultDestinations.ts     # exactly 20 seeds from PLACES.md
├── storage/                        # validation, persistence and recovery
├── context/                        # minimal single source of truth
├── types/
└── utils/                          # pure helpers
README.md                           # Spanish
REQUIREMENTS.md
FLOWS.md
AGENTS.md
PLACES.md
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
- Request **foreground location permission when the user taps Start Orientation on the dedicated Compass screen**, not during registration or app launch.
- Use a **pure function** to calculate the geographic bearing toward the destination and its relative angle based on device orientation.
- Verify heading availability and quality. If invalid, show an error state rather than inventing a direction.
- Subscribe and unsubscribe from listeners when starting/stopping orientation or unmounting the screen.
- Do not request background location permissions. Do not promise AirTag/UWB functionality or street-by-street navigation.
- Test on a **physical phone** and document differences from emulators.

## 7. Conventions and code quality

- Write code, types, and function names in **English**. Keep `AGENTS.md`, `FLOWS.md`, and `REQUIREMENTS.md` in **English**. The **application interface must be in Spanish**, including screen titles, buttons, labels, form validations, status messages, errors, and explanations of device permissions. The README must be in Spanish. Profile and i18n are deferred until the core assignment is complete.
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
3. Build one small feature per delivery using REQUIREMENTS.md Section 10. Include AsyncStorage/restart checks with each mutable feature from the beginning; implement user isolation alongside every relevant action. Review each increment with the user before advancing. Review framework/hardware compatibility at baseline; test physical sensors on the iPhone 14 Pro at step 13.
4. For each change, check TypeScript errors and run **existing** project validation commands. Do not claim tests passed unless they were executed.
5. Manually test all **16 scenarios** in Section 8 of `REQUIREMENTS.md`, distinguishing those that require a physical phone.
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

## 10. Confirmed decisions and remaining verification

- The user has already checked assignment/rubric coverage; do not request the original assignment again.
- S-01: the confirmed 20 CABA destinations and source-linked coordinates are in PLACES.md. Bundle them in code when implementing the catalog.
- S-02: successful registration saves account/session and automatically opens Places.
- S-06: minimum functional areas are access, Places with integrated favorites, and dedicated Compass; Details/Form are supporting screens. No separate Favorites tab is needed.
- Favorite hearts persist before confirmed visual changes. Sort favorites first, preserving base order within each group; removing a favorite restores relative position. Base order is PLACES.md seed order followed by custom creation order.
- S-07: iOS is preferred. The device is confirmed as iPhone 14 Pro; the user reported successful physical step-13 tests on iOS 26.7.1, Expo Go 57.0.9 and SDK 57.0.0. Step 14 was closed by user confirmation with combined evidence and explicit limits in ACEPTACION.md; simulator checks cannot complete compass acceptance.
- S-08: ignore obsolete 2025 assignment dates at the user's instruction; do not require replacement dates to begin.
- S-10: Spanish UI and README; English code and these three specification documents. No Profile/i18n in initial scope.
- Define recoverable behavior for invalid stored data and partial multi-key writes before implementing persistence actions; no silent reset or false success.

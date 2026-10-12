# REQUIREMENTS.md — Integrative Final Project: Tourism App

> **Status:** Specification aligned with the user-confirmed assignment and product decisions; physical-device verification remains pending.
> **Sources:** Assignment/rubric coverage has already been checked and confirmed by the user; no further original-assignment review is required. Formal assignment for *Mobile Application Development* and additional requirements communicated by the instructor: "3 screens + login and sign-up + favorites + a native phone feature."
> **Goal:** Meet all assessable requirements without introducing a backend or unnecessary features.

## 1. Product and scope

A tourism mobile application built with **Expo + React Native + TypeScript**, runnable in **Expo Go**. Users can browse a local catalog of **20 tourist destinations**, view each destination's details, create and manage **their own destinations**, save user-specific favorites within the destination list, and get an approximate direction to a destination using the phone's **location and compass**.

Authentication and data storage are **entirely local**, using **AsyncStorage**. There is no server, remote account, or cross-device synchronization.

## 2. Users and permissions

There is one role: **registered user**. No administrator role is required.

- A person can sign up, sign in, and sign out.
- Every user can see the 20 predefined destinations and **only their own custom destinations**.
- Every user has an independent favorites list, which may include predefined and custom destinations.
- Predefined destinations are **read-only**: they cannot be edited or deleted.
- Only the owner can edit or delete a custom destination. Because data is local, this separation applies to accounts created **within the same device/app installation**, not across different devices.

## 3. Screens and navigation

| Screen | Purpose | Actions |
| --- | --- | --- |
| **Login** | Start a local session | Sign in, validate fields, go to Sign Up |
| **Sign Up** | Create a local account | Register, validate fields, automatically sign in and open Places |
| **Places** | Display catalog and favorites in one `FlatList` | Open details, toggle row hearts, add custom destinations, sign out |
| **Destination Details** | Display destination information | Toggle favorite, open Compass, edit/delete if owned |
| **Compass** | Dedicated native orientation screen for the selected destination | Start/stop orientation, request permission on action, retry, go back |
| **Destination Form** | Create or edit a custom destination | Save, cancel, validate fields |

**Confirmed minimum:** access (Login/Sign Up), Places with integrated favorites, and a dedicated Compass screen. Login and Sign Up may be separate routes. Details and Form are supporting screens. Additional screens are allowed; a separate Favorites or Profile screen is not required.

**Navigation:** actual Stack navigation through Expo Router, already used by the project. Tabs are optional and unnecessary for the initial integrated-list design. Protected screens require a valid local session.

**Favorite ordering:** an outlined heart marks a non-favorite; a red filled heart marks a favorite. Persist the toggle before updating the heart/list, showing a pending state and preventing repeat taps while saving. Favorites come first. Both groups preserve the base order: the PLACES.md order for seeds, followed by custom destinations in creation order. Removing a favorite restores its relative non-favorite position. Color must be accompanied by icon shape and an accessibility label/state.

**Navigation outcomes:** successful create returns to Places; successful edit returns to Details; cancel returns to the originating screen; successful delete returns to Places. Sign Out is available in the Places header.

## 4. Functional requirements (FR)

| ID | Requirement | Verifiable acceptance criterion |
| --- | --- | --- |
| FR-01 | Local sign-up | Create an account with name, email, password, and password confirmation; reject duplicate emails and invalid input. |
| FR-02 | Sign-in and sign-out | Sign in using valid local credentials; reject incorrect credentials; sign out without deleting user data. |
| FR-03 | Persistent session | If the saved session is still valid, reopen the app on Places; otherwise display Login. |
| FR-04 | Initial catalog | Display exactly **20 predefined destinations** with names, descriptions, and valid coordinates, even without an Internet connection. |
| FR-05 | Dynamic list | Display predefined and user-owned destinations in a **FlatList**; update it immediately after create, update, or delete operations. |
| FR-06 | Destination details | Open a destination from Places; display its information and relevant actions. |
| FR-07 | Create custom destination | Allow creation with a valid name, description, latitude, and longitude; automatically assign the owner. |
| FR-08 | Update custom destination | Allow editing only destinations owned by the active user; prefill fields and reflect changes after saving. |
| FR-09 | Delete custom destination | Require confirmation before deleting; remove the destination from lists and its associated favorites. |
| FR-10 | Predefined catalog immutability | Do not display edit/delete actions for predefined destinations and also block them in the data/domain logic. |
| FR-11 | Favorites | Add or remove either type of destination; show favorites first in Places; persist them separately for each user. |
| FR-12 | User isolation | When switching accounts, do not show another account's favorites or custom destinations. |
| FR-13 | Native compass/orientation | From the dedicated Compass screen, on explicit action request location permission, obtain position/heading, and display an **approximate direction toward the destination**; update as the device rotates if sensors are available. |
| FR-14 | Validation and feedback | Show visible validation messages, understandable errors, loading indicators, empty states, and operation confirmation or feedback. |
| FR-15 | Permissions and failures | If permission is denied or location/sensors are unavailable, explain the limitation without crashing or blocking the app. |
| FR-16 | Local persistence | Preserve users, active session, custom destinations, and favorites with AsyncStorage across app restarts. |
| FR-17 | Offline behavior | Once the project is loaded in Expo Go, browsing and managing local data must not depend on a remote API; report actual local read/write failures. |

### 4.1. Minimum validations

- **Sign-up:** non-empty name; basic valid email format; email uniqueness **case-insensitively**; password of at least **8 characters**; matching password confirmation.
- **Login:** required email and password; show a message for invalid credentials.
- **Custom destination:** non-empty name and description; numeric latitude and longitude; latitude between **−90 and 90** and longitude between **−180 and 180**.
- Trim unnecessary whitespace and normalize emails before saving. Do not allow invalid form submissions.
- Coordinates for the 20 predefined destinations must be real and verified before submission; do not fabricate them during implementation.

### 4.2. Business rules

1. The 20 predefined destinations are **bundled in the source code**; do not duplicate them in AsyncStorage on each launch.
2. Custom destinations have an `ownerId` and are visible only to their owner.
3. A favorite is uniquely identified by **user + destination ID**; duplicates are not allowed.
4. Deleting a custom destination also removes its favorites references, preventing orphaned favorites.
5. Users cannot edit or delete predefined destinations through the UI **or** domain functions.
6. Anonymous browsing is not supported: users must sign in to access the app.
7. Signing out only clears the **active session**; accounts, destinations, and favorites remain.
8. An account registered locally on one phone does not automatically exist on another phone.

## 5. Technical and non-functional requirements (NFR)

| ID | Requirement | Verification |
| --- | --- | --- |
| NFR-01 | Expo + React Native + TypeScript | Starts with `npx expo start` and opens in Expo Go on a compatible device. |
| NFR-02 | Functional components and hooks | No class components; use `useState`, `useEffect`, context, or custom hooks as needed. |
| NFR-03 | Stack navigation | Stack routes work, and authenticated screens cannot be accessed without a valid session. |
| NFR-04 | FlatList | The dynamic Places list uses `FlatList` (includes favorites). |
| NFR-05 | Flexbox/responsiveness | Readable layouts on common phone sizes without rigid absolute widths. |
| NFR-06 | Types and structure | Explicit domain types, separated responsibilities, clear names, and no unjustified `any`. |
| NFR-07 | Expo Go compatibility | Dependencies must work in Expo Go without a custom development build or custom native code. |
| NFR-08 | Failure handling | When storage or a sensor fails, explain the problem and offer an alternative/retry; never silently delete data. |
| NFR-09 | Sensor usage | Enable sensors only when orientation is requested and release subscriptions when stopping orientation or leaving the screen. |
| NFR-10 | Documentation | README includes description, installation, `npx expo start`, folder structure, dependencies, reasons for extra libraries, and an AI-use disclosure. |
| NFR-11 | Oral defense | Be able to locate the files implementing navigation, CRUD, FlatList, validations, state, AsyncStorage, and compass. |

**Expected libraries:** `expo-router` (navigation), `@react-native-async-storage/async-storage` (local data), `expo-location` (position and heading), and, if needed for local password verification, `expo-crypto`. Install Expo-managed dependencies with `npx expo install` when applicable, ensuring compatibility with the SDK. Justify the libraries in the README.

## 6. Compass behavior (realistic scope)

- Details opens the dedicated Compass screen with the destination ID; permission and subscriptions start only when the user taps Start Orientation there.

- Use the destination coordinates and current GPS position to calculate the **geographic bearing** to the destination.
- Use the phone's sensor-derived heading to display an arrow relative to the device's current orientation.
- Permissions and a **physical phone** are required for the most reliable demonstration; operation may be unreliable in simulators or indoors.
- This provides **approximate orientation**, **not** AirTag/UWB-like precision, turn-by-turn navigation, or an online map.
- If coordinates or a reliable heading are unavailable, display an informative state; destination details and favorites must remain functional.

## 7. Out of scope (do not implement without approval)

Backend, endpoints, remote database, server-side authentication, cross-device synchronization, online maps, geocoding, transit routes, augmented reality, UWB/AirTag functions, admin panel, image uploads, destination sharing between accounts, and background location tracking.

## 8. Manual acceptance scenarios for the oral defense

1. Register user A and automatically enter Places; verify exactly 20 predefined destinations.
2. Mark a seed favorite using its row heart; after saving it becomes filled red and moves to the favorites group. Remove it and verify its original relative position is restored.
3. Create a valid custom destination; verify it appears immediately after saving and survives restart.
4. Reject missing name/description, blank/non-numeric coordinates, and out-of-range coordinates; preserve form input.
5. Edit an owned destination; verify updated data in Details and Places and after restart. Cancel editing without changes.
6. Mark a custom destination favorite, cancel deletion, then confirm deletion; verify both destination and favorite reference are removed.
7. Verify seeds have no edit/delete actions; domain actions and direct form routes also reject seed or foreign-owned edits/deletes.
8. Sign out A and register B; verify B sees no A favorites/custom destinations. Direct foreign destination routes reveal no private data.
9. Sign back in as A; verify A's remaining data and favorite order are restored.
10. Restart with a valid session; verify session/data restoration. An orphaned session returns to Login; malformed storage/read failure shows an error/retry without overwriting existing data.
11. On a physical iPhone, open Compass for a destination, start orientation, grant foreground permission, rotate the phone, stop and leave; verify heading feedback and subscription cleanup.
12. Deny permission or simulate unavailable location/heading; show explanation/retry and keep the rest of the app usable. Simulator results do not substitute for a physical compass demonstration.
13. Reject duplicate email regardless of case/whitespace, short password and mismatched confirmation; successful registration signs in automatically.
14. Reject incorrect login credentials; sign-out clears only the session and protected routes remain inaccessible.
15. On a storage write failure, show an error without success or confirmed visual changes; allow retry. Cover favorite, CRUD and session writes, including partial-operation recovery.
16. Verify Spanish UI, accessible heart states, keyboard usability and layout on different phone sizes.

## 9. Confirmed decisions and remaining verification

- **S-01 — Geography:** confirmed CABA catalog of 20 historical/cultural landmarks selected in [PLACES.md](./PLACES.md), with source-linked coordinates. Add short Spanish descriptions when implementing the bundled catalog.
- **S-02 — Sign-up:** name, email, password (minimum 8 characters), and confirmation. Save the account and session, then automatically open Places.
- **S-03 — Local accounts:** no password recovery, email verification, or production-grade authentication. Use fictional demonstration credentials.
- **S-04 — Privacy:** custom destinations and favorites are private to the local account that created them.
- **S-05 — Forms:** manually entered coordinates; Use My Location is optional and deferred.
- **S-06 — Screens:** confirmed minimum of access, Places/favorites and dedicated Compass. Details/Form support the required CRUD and navigation.
- **S-07 — Platforms:** iOS is the preferred demonstration platform because the user has a Mac and no Android test device. The device is confirmed as iPhone 14 Pro; installed iOS/Expo Go versions remain to be verified and physical sensors will be tested at step 13. An iOS simulator alone cannot complete compass acceptance.
- **S-08 — Dates:** ignore the stale November 2025 assignment dates at the user's instruction. Do not use them to plan delivery; no replacement date is required to start.
- **S-09 — Local security:** no plaintext passwords. A locally salted/hashed verifier is an educational demonstration only, without claims of protection against device-level attacks.
- **S-10 — Language:** Spanish UI and README; English code/types/function names and AGENTS.md, FLOWS.md, REQUIREMENTS.md. Initial scope excludes Profile and English/Spanish i18n; multilingual support can be reconsidered after completing the core assignment.

## 10. Incremental delivery policy

Build one small verifiable feature per delivery: documentation alignment; Expo Go baseline; minimal navigation; registration; login/logout/session restoration; catalog; details; create; edit; favorites; delete with favorite cleanup; bearing calculations; foreground location; heading/compass; final acceptance/documentation.

Include persistence with each mutable feature from the beginning, rather than adding it after CRUD/favorites. Implement user isolation with each relevant action. Check TypeScript and existing lint commands for code changes, report modified files and manual verification steps, and review each increment with the user before starting the next feature. Review framework/hardware compatibility at baseline; test physical sensors on the user’s iPhone 14 Pro at step 13.

Before implementing storage actions, define recovery for partial writes (account plus session; destination deletion plus favorites) and invalid stored data. Never silently reset/overwrite data, and never announce success before all required persistence completes. A recoverable notice must distinguish an account saved without a session from an account that was not saved, so retry does not create a duplicate registration.

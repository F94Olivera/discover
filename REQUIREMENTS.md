# REQUIREMENTS.md — Integrative Final Project: Tourism App

> **Status:** Initial specification with the functional scope approved and outstanding assumptions identified at the end.  
> **Sources:** Formal assignment for *Mobile Application Development* and additional requirements communicated by the instructor: "3 screens + login and sign-up + favorites + a native phone feature."  
> **Goal:** Meet all assessable requirements without introducing a backend or unnecessary features.

## 1. Product and scope

A tourism mobile application built with **Expo + React Native + TypeScript**, runnable in **Expo Go**. Users can browse a local catalog of **20 tourist destinations**, view each destination's details, create and manage **their own destinations**, save user-specific favorites, and get an approximate direction to a destination using the phone's **location and compass**.

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
| **Sign Up** | Create a local account | Register, validate fields, return to Login |
| **Explore** | Display the combined catalog in a `FlatList` | Open details, add a custom destination |
| **Destination Details** | Display destination information, favorites, and compass | Add/remove favorite, get directions, edit/delete if owned |
| **Favorites** | Show the active user's favorites in a `FlatList` | Open details, remove a favorite |
| **Destination Form** | Create or edit a custom destination | Save, cancel, validate fields |

**Screen-count interpretation:** Explore, Destination Details, and Favorites are the **three main functional screens**, in addition to Login and Sign Up. The form is an auxiliary screen; adding it does not violate a three-screen minimum.

**Navigation:** Use actual Stack and/or Tab navigation. **Expo Router** is recommended (Stack for Login/Sign Up/Details/Form, Tabs for Explore/Favorites), without pinning an Expo SDK version in advance.

## 4. Functional requirements (FR)

| ID | Requirement | Verifiable acceptance criterion |
| --- | --- | --- |
| FR-01 | Local sign-up | Create an account with name, email, password, and password confirmation; reject duplicate emails and invalid input. |
| FR-02 | Sign-in and sign-out | Sign in using valid local credentials; reject incorrect credentials; sign out without deleting user data. |
| FR-03 | Persistent session | If the saved session is still valid, reopen the app on Explore; otherwise display Login. |
| FR-04 | Initial catalog | Display exactly **20 predefined destinations** with names, descriptions, and valid coordinates, even without an Internet connection. |
| FR-05 | Dynamic list | Display predefined and user-owned destinations in a **FlatList**; update it immediately after create, update, or delete operations. |
| FR-06 | Destination details | Open a destination from Explore or Favorites; display its information and relevant actions. |
| FR-07 | Create custom destination | Allow creation with a valid name, description, latitude, and longitude; automatically assign the owner. |
| FR-08 | Update custom destination | Allow editing only destinations owned by the active user; prefill fields and reflect changes after saving. |
| FR-09 | Delete custom destination | Require confirmation before deleting; remove the destination from lists and its associated favorites. |
| FR-10 | Predefined catalog immutability | Do not display edit/delete actions for predefined destinations and also block them in the data/domain logic. |
| FR-11 | Favorites | Add or remove either type of destination; display favorites; persist them separately for each user. |
| FR-12 | User isolation | When switching accounts, do not show another account's favorites or custom destinations. |
| FR-13 | Native compass/orientation | From Details, request location permission, obtain position/heading, and display an **approximate direction toward the destination**; update as the device rotates if sensors are available. |
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
| NFR-03 | Stack/Tab navigation | Routes work, and authenticated screens cannot be accessed without a valid session. |
| NFR-04 | FlatList | The dynamic Explore list uses `FlatList` (also recommended for Favorites). |
| NFR-05 | Flexbox/responsiveness | Readable layouts on common phone sizes without rigid absolute widths. |
| NFR-06 | Types and structure | Explicit domain types, separated responsibilities, clear names, and no unjustified `any`. |
| NFR-07 | Expo Go compatibility | Dependencies must work in Expo Go without a custom development build or custom native code. |
| NFR-08 | Failure handling | When storage or a sensor fails, explain the problem and offer an alternative/retry; never silently delete data. |
| NFR-09 | Sensor usage | Enable sensors only when orientation is requested and release subscriptions when leaving the screen. |
| NFR-10 | Documentation | README includes description, installation, `npx expo start`, folder structure, dependencies, reasons for extra libraries, and an AI-use disclosure. |
| NFR-11 | Oral defense | Be able to locate the files implementing navigation, CRUD, FlatList, validations, state, AsyncStorage, and compass. |

**Expected libraries:** `expo-router` (navigation), `@react-native-async-storage/async-storage` (local data), `expo-location` (position and heading), and, if needed for local password verification, `expo-crypto`. Install Expo-managed dependencies with `npx expo install` when applicable, ensuring compatibility with the SDK. Justify the libraries in the README.

## 6. Compass behavior (realistic scope)

- Use the destination coordinates and current GPS position to calculate the **geographic bearing** to the destination.
- Use the phone's sensor-derived heading to display an arrow relative to the device's current orientation.
- Permissions and a **physical phone** are required for the most reliable demonstration; operation may be unreliable in simulators or indoors.
- This provides **approximate orientation**, **not** AirTag/UWB-like precision, turn-by-turn navigation, or an online map.
- If coordinates or a reliable heading are unavailable, display an informative state; destination details and favorites must remain functional.

## 7. Out of scope (do not implement without approval)

Backend, endpoints, remote database, server-side authentication, cross-device synchronization, online maps, geocoding, transit routes, augmented reality, UWB/AirTag functions, admin panel, image uploads, destination sharing between accounts, and background location tracking.

## 8. Manual acceptance scenarios for the oral defense

1. Register user A, sign in, and see 20 destinations in Explore.
2. Open a predefined destination, add it to Favorites, and verify it appears there.
3. Create a valid custom destination and verify it appears in the FlatList.
4. Try creating a destination without a name or with an out-of-range latitude and observe the error.
5. Edit the custom destination, save, and verify the changes.
6. Confirm deletion of the custom destination and verify it disappears from the list and favorites.
7. Verify that a predefined destination **does not** offer edit or delete actions.
8. Sign out, register user B, and verify B cannot see A's favorites or custom destinations.
9. Sign back in as user A and verify A's local data is preserved.
10. Restart the app and verify that the valid session and data are preserved.
11. Open Details on a physical phone, grant location permission, and test orientation.
12. Deny location permission and verify the app remains usable and explains why orientation is unavailable.

## 9. Assumptions and items awaiting confirmation

**Operational assumptions adopted so implementation can begin:**

- **S-01 — Geography:** the 20 destinations will be **real tourist attractions with verifiable coordinates**, selected for a bundled local catalog. **Pending:** select the city/region/country and the actual list of 20.
- **S-02 — Sign-up:** require name, email, and password (minimum 8 characters). After successful registration, sign in automatically.
- **S-03 — Local accounts:** no password recovery, email verification, or production-grade authentication security is provided. **Use fictional credentials during the demonstration.**
- **S-04 — Privacy:** custom destinations are private to the local account that created them.
- **S-05 — Forms:** coordinates are entered manually. An optional **"Use my location"** button may be added **only as a nice-to-have**.
- **S-06 — Screens:** three primary functional screens (Explore, Details, Favorites) plus Login, Sign Up, and Form. **Pending:** confirm whether the instructor interprets "3 screens + login/sign-up + favorites" differently; this design provides at least three screens beyond authentication.
- **S-07 — Platforms:** target Android/iOS devices compatible with Expo Go. **Pending:** identify the operating system and physical phone model for the demonstration, particularly to test sensors.
- **S-08 — Dates:** the provided assignment lists a code review on **November 13–15, 2025** and oral defense on **November 20, 2025**. These dates have passed; **confirm current dates** before adding them to the README or project plan.
- **S-09 — Local security:** do not store passwords in plain text. A locally salted/hashed password verifier may be used solely as an academic demonstration, with no claim that it protects sensitive data against device-level attacks.

- **S-10 — Language:** **Confirmed:** the application interface and all user-facing text must be in **Spanish** (screen titles, buttons, labels, validations, feedback, errors, and permission explanations). `AGENTS.md`, `FLOWS.md`, and `REQUIREMENTS.md` remain in **English**. **Pending:** confirm the preferred language for `README.md`.

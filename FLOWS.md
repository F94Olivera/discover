# FLOWS.md — Tourism App User Flows and Navigation

> **Purpose:** Describe confirmed user flows and responses to validation, storage and native-feature failures.
> **References:** FR-* and S-* refer to [REQUIREMENTS.md](./REQUIREMENTS.md); the confirmed seed catalog is in [PLACES.md](./PLACES.md).
> **Language:** English labels here describe behavior; all application copy and README content must be in Spanish. Initial scope has no Profile screen or i18n.

## 1. Navigation map

```text
App launch → hydrate/validate local data
  ├─ Loading → loading feedback
  ├─ Read/validation failure → error + Retry (no silent reset)
  ├─ No valid session → Login
  │    ├─ Sign Up → save user + session → Places
  │    └─ Successful Login → save session → Places
  └─ Valid session → Places

Protected Stack area
  └─ Places: one FlatList with favorites first
       ├─ Row heart → persist toggle → update heart/order
       ├─ Destination row → Details
       │    ├─ Toggle favorite → persist → update Places/Details
       │    ├─ Open Compass → Start Orientation → permission/location/heading
       │    └─ Owned destination → Edit Form / Delete confirmation
       ├─ Add Destination → Create Form
       └─ Sign Out → clear session → Login
```

Access, Places/favorites and Compass are the confirmed minimum functional areas. Details and Form support them. Use Expo Router Stack navigation; a separate Favorites tab is not part of the initial design.

## 2. Authentication

### F-01. App launch

1. Display loading while reading and validating stored users, session, custom destinations and favorites.
2. A valid session opens Places; a missing or orphaned session opens Login without exposing protected routes.
3. Invalid stored data or a read failure displays an error with Retry. Do not silently clear/overwrite data.

### F-02. Sign-up

1. Open Sign Up from Login; enter name, email, password and confirmation.
2. Validate required fields, email format, case-insensitive uniqueness, minimum password length of 8 and matching confirmation. Trim name/email; normalize email, preserving the password exactly as entered.
3. Show visible field errors and an accessible summary; retain entered values.
4. Persist the new user with a salted/hashed educational verifier and the session; automatically navigate to Places only after successful persistence.
5. Show pending feedback and prevent duplicate submissions. A failure allows recovery/retry without claiming success or creating duplicate accounts. If the account was saved but session persistence failed, explain that specific outcome and offer sign-in/session retry.

### F-03. Sign-in and sign-out

1. Validate required credentials; mismatches display a generic invalid-credentials message.
2. Save the session before opening Places; a failed save keeps Login usable with retry.
3. Sign Out is in the Places header. Clear the persisted session before returning to Login; on failure, show an error and allow retry.
4. Sign-out preserves accounts, destinations and favorites. Protected routes must not remain accessible after successful sign-out.

## 3. Places and details

### F-04. Integrated list

1. Build the base order from the 20 seed destinations in PLACES.md, followed by the active user's custom destinations in creation order.
2. Use a FlatList with visible catalog/custom origin and an independently tappable heart on each row.
3. Show favorites first; preserve base order inside both favorite and non-favorite groups.
4. An outlined heart means not favorite; filled red means favorite. Include accessible labels/states so color is not the only indication.
5. Row selection opens Details; tapping its heart toggles favorite without opening Details.
6. Add Destination opens Create Form. Seeds remain visible even with no custom destinations or favorites.

### F-05. Details

1. Show name, description, coordinates, origin and favorite state for a visible destination.
2. Allow favorite toggling and opening the dedicated Compass screen with the destination ID.
3. Display Edit/Delete only for owned custom destinations. Domain actions must independently enforce ownership and seed immutability.
4. Back returns to Places. Missing/unauthorized routes show a notice and return to Places without revealing private information.

## 4. Custom destination CRUD

### F-06. Create

1. Open an empty form for name, description, latitude and longitude.
2. Reject blank name/description and blank, non-finite or non-numeric coordinates; latitude must be within −90..90 and longitude within −180..180.
3. Assign a unique custom-prefixed ID and the active user's ownerId; persist before reporting success.
4. Return to Places and append to the user's base order. Cancel returns without changes.
5. On persistence failure retain input, show an error and permit retry.

### F-07. Update

1. Edit opens the shared form prefilled with an owned destination's data.
2. Apply create validations; do not change ID, owner or creation order.
3. Persist, then return to Details; Places and favorite rows show the updated data.
4. Cancel returns to Details unchanged. Reject seed/foreign-owned editing in both direct routes and domain functions.

### F-08. Delete

1. Show a Cancel/Delete confirmation for an owned custom destination.
2. Cancel does nothing. Confirm removes the destination and all its favorite references in one logical update.
3. Complete required persistence before showing success and returning to Places.
4. On failure explain the error and allow safe recovery/retry; never claim deletion succeeded after a failed write.

## 5. Integrated favorites

### F-09. Toggle

1. A row heart or Details button toggles a visible seed/custom destination for the active user only.
2. Uniqueness is (userId, destinationId); reject foreign/invisible targets and duplicates.
3. Show pending feedback and prevent repeated taps while saving. Preserve the confirmed heart/list state until persistence succeeds.
4. On success, update heart and ordering; removing a favorite restores its relative position in the non-favorite group.
5. On failure keep the prior confirmed state, show an error and permit retry.

### F-10. Switch accounts

1. Sign out A and sign in B; only B's favorites/custom destinations affect the visible list and sorting.
2. Sign back in A to restore A's saved data and favorite order.
3. No favorites means all destinations remain in base order; no separate empty Favorites screen is needed.

## 6. Dedicated compass

### F-11. Orientation

1. Open Compass from Details for an authorized destination. Display destination and a Start Orientation action; opening the route alone does not activate sensors or request permission.
2. On Start, request foreground location permission if needed using an Expo Go-compatible expo-location API.
3. Obtain position and a sufficiently reliable heading; calculate geographic bearing and the angle relative to device heading using pure functions.
4. Display an approximate arrow that updates as the device rotates while orientation is active.
5. Stop observers/subscriptions on Stop, leaving the screen or unmounting. Handle a pending async start so it cannot leave subscriptions active after departure.

| Situation | Response |
| --- | --- |
| Permission denied | Explain need for location; offer retry/settings instructions as applicable. |
| GPS unavailable | Explain failure; offer retry. |
| Heading unavailable/inaccurate | Explain limitation or calibration need; do not invent a direction. |
| Simulator without sensors | Explain limitation; Places and Details remain usable. |
| Near destination relative to position accuracy | Explain proximity; do not claim precise direction. |

The demonstration targets iOS and requires a physical iPhone for heading validation. The Mac/iOS simulator does not replace that check. Orientation is approximate GPS/heading guidance, not an online map, turn-by-turn navigation or UWB precision finding.

## 7. Shared states and incremental work

- Use visible loading/pending, error/retry and relevant empty states; preserve input on form failure.
- Local operations require no remote API after the Expo Go bundle is loaded.
- Never silently reset data or report success before required persistence completes; define partial-write recovery before implementing multi-entity operations.
- User isolation applies to selectors, routes and domain actions, not only UI buttons.
- Build persistence with each mutable feature. Deliver one small feature, TypeScript/lint results and manual checks at a time; review with the user before proceeding.

## 8. Remaining verification

Assignment coverage, CABA catalog, minimum screens and Spanish README are confirmed. Ignore stale 2025 assignment dates. The device is confirmed as iPhone 14 Pro; the user reported successful step-13 physical tests on iOS 26.7.1, Expo Go 57.0.9 and SDK 57.0.0 (S-07). The final manual acceptance run after patch alignment remains pending; see ACEPTACION.md. See REQUIREMENTS.md Section 8 for the expanded acceptance checklist.

# FLOWS.md — Tourism App User Flows and Navigation

> **Purpose:** Describe what users see and can do, including the expected responses to validation failures, permission requests, and errors.  
> **References:** Rules and requirements identified as `FR-*` and `S-*` are defined in [REQUIREMENTS.md](./REQUIREMENTS.md).
> **Application language:** All user-facing screens, navigation labels, buttons, form validations, alerts, errors, and permission explanations must be in **Spanish**. English labels in this document describe flows; they are not the required UI copy (see S-10).

## 1. Navigation map

```text
App launch
  ├─ Read session and local data
  ├─ No valid session → Login
  │     ├─ Sign Up → create account → signed in → Explore
  │     └─ Successful Login → Explore
  └─ Valid session → Explore

Authenticated area
  ├─ Tab: Explore (FlatList with 20 predefined + custom destinations)
  │     ├─ Destination → Details
  │     │    ├─ Add/remove favorite
  │     │    ├─ Orient Me → permission → location + compass
  │     │    └─ If owned → Edit / Delete
  │     └─ Add Destination → Form (create)
  ├─ Tab: Favorites (active user's FlatList)
  │     └─ Destination → Details
  └─ Sign Out → Login
```

**Suggested navigation:** Tabs for Explore/Favorites and Stack for Login, Sign Up, Details, and Form. Details counts as the third main functional screen even though it opens in a Stack rather than as a tab.

## 2. Flow: app launch and authentication

### F-01. App launch

1. Display a brief loading state while reading AsyncStorage.
2. Validate the stored session against the locally stored users.
3. If valid, open **Explore**; otherwise open **Login**.
4. If local data cannot be read, display an error with a **Retry** option. Do not silently clear or overwrite data.

### F-02. Sign-up

1. From Login, select **Create Account**.
2. Complete name, email, password, and password confirmation.
3. Validate required fields, email format, minimum password length (8), matching passwords, and whether the email is already registered locally.
4. If invalid, display errors near the relevant fields and retain the entered values.
5. If valid, save the user and automatically sign in; navigate to **Explore**.
6. If AsyncStorage fails, explain that registration could not be completed and allow a retry; do not report success before data is saved.

### F-03. Sign-in and sign-out

1. Sign-in: enter email and password, validate required fields, and check local account credentials.
2. If credentials do not match, show a generic invalid-credentials message and remain on Login.
3. If they match, save the active session and open Explore.
4. Sign-out: select **Sign Out** from the authenticated area; clear the active session and return to Login.
5. Signing out **does not delete** users, favorites, or custom destinations.

## 3. Flow: browse and view destinations

### F-04. Main list

1. On entering **Explore**, combine the **20 predefined destinations** with the active user's custom destinations.
2. Display them in a **FlatList**, visually distinguishing **Catalog Destinations** and **My Destinations**.
3. Selecting a row opens its **Details**.
4. The **Add Destination** button opens the create form.
5. If there are no custom destinations, the 20 predefined destinations remain visible. Do not offer modification actions for predefined destinations.

### F-05. Details

1. Show name, description, coordinates, and origin (predefined catalog or custom).
2. Allow users to **add/remove a favorite**, updating the displayed state immediately.
3. Offer an **Orient Me** action to activate the compass.
4. **Only for a destination owned by the active user:** display **Edit** and **Delete**.
5. Back returns to the previous list. If the destination has been deleted, redirect to Explore or the relevant list rather than displaying nonexistent data.

## 4. Flow: custom destination CRUD

### F-06. Create

1. From Explore, select **Add Destination**.
2. Display an empty form with **name**, **description**, **latitude**, and **longitude**.
3. Require a non-empty name/description, numeric coordinates, and valid ranges (latitude −90 to 90; longitude −180 to 180).
4. If valid, generate a unique ID, assign the signed-in user's `ownerId`, and persist to AsyncStorage.
5. Confirm success and return to **Explore**, where the destination appears without restarting the app.
6. **Cancel** returns without saving. If persistence fails, show an error and keep the form values available for retry.

### F-07. Update

1. From the Details screen of a custom destination, select **Edit**.
2. Open the same form with its fields prefilled.
3. Apply the create validations; save changes and update FlatList/Details/Favorites as appropriate.
4. Do not allow editing if the destination is predefined or belongs to another user, even if someone navigates directly to the route.

### F-08. Delete

1. From the Details screen of an owned destination, select **Delete**.
2. Display a confirmation dialog: **Cancel** / **Delete**.
3. Canceling makes no changes.
4. Confirming removes the destination from local data and all related entries in the user's favorites, then navigates to Explore.
5. If persistence fails, display an error without claiming the destination was deleted and allow a retry.

## 5. Flow: user-specific favorites

### F-09. Add and remove favorites

1. Open Details for either a predefined or a custom destination.
2. Tap the favorite icon/button to **add** it if absent or **remove** it if already saved.
3. Update the button and Favorites list after saving.
4. Prevent duplicates for the same `(userId, destinationId)` pair.
5. If saving fails, roll back the visual change or clearly indicate that the action could not be completed.

### F-10. View favorites and switch accounts

1. Open the **Favorites** tab to see only the active user's favorites in a FlatList.
2. If empty, show an empty-state message encouraging the user to explore destinations.
3. Selecting a favorite opens Details, where it can also be removed.
4. Sign out from user A and sign in as B: B sees B's own favorites/custom destinations (initially empty unless already created), never A's.
5. Signing back in as A restores A's locally saved data.

## 6. Flow: native orientation feature

### F-11. Orient toward a destination

1. On Details, tap **Orient Me**. **Do not** request location permission automatically on app launch.
2. Request foreground location permission through `expo-location` if it has not yet been granted.
3. Once granted, obtain the current position (latitude/longitude) and track the device heading with an Expo Go-compatible compass/heading API.
4. Calculate the geographic **bearing** from the current position to the destination coordinates.
5. Show an arrow relative to the device heading and, optionally, a bearing/destination angle in degrees. Update while the orientation view is active.
6. When orientation is closed or the user leaves Details, stop observers/subscriptions to avoid unnecessary resource usage.

**Required fallbacks:**

| Situation | On-screen response |
| --- | --- |
| Permission denied | Explain that location permission is required for orientation. Offer retry or instructions to enable it in device settings. |
| GPS position unavailable | Explain that the current location could not be retrieved and offer retry. |
| Heading/sensor unavailable or inaccurate | Explain that the compass is unavailable or needs calibration. Do not display a fabricated direction. |
| Emulator without sensors | Explain the limitation; Explore, Details, and Favorites remain usable. |
| User very close to destination | Indicate that the user is near the destination if location accuracy makes direction meaningless; do not claim centimeter-level precision. |

**Physical limitation:** This is approximate GPS- and magnetometer-based orientation, **not** AirTag/UWB precision finding. It may be inaccurate indoors or around magnetic interference.

## 7. Shared states and error handling

- **Loading:** show an indicator while hydrating local data or requesting location; avoid ambiguous blank screens.
- **Offline:** the catalog and local CRUD do not require Internet after the Expo Go bundle has loaded; do not invent a "server is down" error.
- **Empty data:** show empty states for Favorites and for My Destinations if that section is displayed separately.
- **Invalid form:** show errors next to affected fields and an accessible summary message.
- **AsyncStorage failure:** display an error, do not report success before persistence completes, permit retry, and do not automatically discard existing data.
- **Missing or unauthorized destination:** show a notice and return to Explore; never render another user's information.
- **Invalid session:** return to Login without exposing protected screens.

## 8. Pending assumptions

See **Section 9 — Assumptions and items awaiting confirmation** in `REQUIREMENTS.md`. In particular:

- Select **which 20 specific places** and the associated region (S-01).
- Confirm with the instructor the **exact expected screen count** (S-06).
- Confirm the **physical demonstration device** for compass testing (S-07).
- Update delivery and defense dates; the available assignment still contains **2025** dates (S-08).

All other criteria in this file are **proposed implementation decisions**, not extra requirements attributed to the instructor.

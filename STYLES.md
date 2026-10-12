# STYLES.md — App Style Guide

> Status: initial proposal for review with the user. This document does not change functional requirements or authorize dependency changes.
> Priority: instructor's assignment > REQUIREMENTS.md > FLOWS.md > AGENTS.md > this guide.

## Styling tools

The recommendation is to use **React Native StyleSheet and a centralized theme**, building on the existing foundation in `src/constants/theme.ts`.

The goal is to keep styles explicit, dependencies minimal, and code easy to explain during the oral defense. Share colors, spacing, and button, input, and card components when there is actual reuse; avoid duplicated styles and unnecessary layers.

**NativeWind** is an alternative if the user prefers Tailwind syntax. Before adding it, verify compatibility with the installed SDK and Expo Go. It is neither installed nor approved as a dependency by this proposal. Reference: [official documentation](https://www.nativewind.dev/docs/getting-started/installation).

The styling tool does not determine the visual appearance.

## Proposed visual direction

A CABA tourism guide with a clean, readable, and warm appearance:

- Warm white background and light surfaces.
- Dark text with good contrast.
- Deep teal as the primary color for actions and highlighted elements.
- Red hearts for favorites, as required by REQUIREMENTS.md; also use shape and accessible state.
- Destination cards with softly rounded corners, clear hierarchy, and sufficient spacing.
- System typography with sizes that distinguish headings, content, and help text.
- Comfortable touch targets and forms with visible labels.
- A compass with a large arrow, an identifiable destination, and readable orientation status.

Specific colors, sizes, and corner radii will be defined when implementing and reviewing the first screen. This proposal does not require photographs, remote assets, or new features.

## Implementation rules

- Keep the entire interface in Spanish.
- Use Flexbox and adapt content to different phone sizes.
- Maintain consistency across authentication, Places, Details, Form, and Compass screens.
- Display loading states, errors, and validation feedback with visible text; do not rely solely on color.
- Provide accessibility labels and reasonable touch targets for icon-only buttons.
- Preserve the confirmed visual state while storage writes are pending, especially for favorites.
- Prioritize readability and requirement compliance over decoration or additional animations.
- Review each increment with the user according to REQUIREMENTS.md, Section 10.

## Pending confirmation

- Final choice between StyleSheet and NativeWind.
- Approval or adjustment of the proposed visual direction.
- Specific palette and measurements after reviewing the first screen.

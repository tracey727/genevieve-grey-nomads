# Responsive reference Home build

The Home screen is implemented as a presentational component backed by `useTripData()` so visual work remains separated from trip state.

Responsive behaviour uses a scrollable `100dvh` container, CSS safe-area environment insets for notches/home indicators, a flexible three-column/two-row action grid, and sticky existing bottom navigation.

Existing route targets are preserved for Plan Trip, Around Me, Safety, Budget Planner and My Trip.

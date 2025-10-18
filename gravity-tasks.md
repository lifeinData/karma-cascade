# Gravity Logic Implementation Tasks

## Overview
Replace the current "turn grey" system with proper gravity mechanics where gems disappear, existing gems fall down, and new gems fill holes at the top.

## Task 1: Remove Matched Gems (No Grey)
- When gems match, they should **disappear completely** (not turn grey)
- Remove matched gems from the board, leaving holes/empty spaces

## Task 2: Apply Gravity to Existing Gems
- **For each column**, after gems are removed:
  - All remaining gems above the removed gems should **fall down vertically**
  - Gems fall straight down to fill the lowest available space in their column
  - This creates holes at the **top** of each column

## Task 3: Fill Top Holes with New Gems
- Count how many holes exist at the top of each column
- Generate **new random gems** to fill these top holes
- New gems should have random colors (within the game's color set)
- New gems should have unique IDs

## Task 4: Check for New Matches After Gravity
- After existing gems fall down, check if any **new matches** are created
- If matches found → go back to Task 1 (remove these new matches)
- This creates a **gravity loop**

## Task 5: Check for New Matches After New Gems
- After new gems are added to fill holes, check if any **new matches** are created
- If matches found → go back to Task 1 (remove these new matches)
- This continues the **gravity loop**

## Task 6: Loop Until No More Matches
- Keep repeating Tasks 1-5 until no new matches are created
- Only stop when the board is stable (no matches after both gravity and new gem generation)

## Implementation Notes
- **No animations** for now - just instant disappear/appear
- **Linear/vertical falling** - gems fall straight down in their column
- **Top-row special case**: If matches are on the top row, they just leave holes (no gems above to fall)
- **Random new gems**: Use the same color generation logic as initial board creation

## Expected Flow Example
1. Player swaps → 3 red gems match in middle of column
2. Red gems **disappear** (holes created)
3. Gems above fall down to fill holes
4. New gems appear at top to fill remaining holes
5. Check for matches from fallen gems → if found, repeat from step 2
6. Check for matches from new gems → if found, repeat from step 2
7. Continue until no matches exist

## Success Criteria
- No grey gems (they disappear completely)
- Proper vertical gravity (gems fall straight down)
- Holes always filled with new gems at top
- Cascade continues until board is stable
- No empty spaces remain on final board
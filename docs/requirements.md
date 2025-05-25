# Educational Python Content Pipeline

## Placeholder Rules
- {{placeholders}} are rendered as HTML inputs in React
- Students must match exactly to progress
- Strategic placement: variable names, values, operators
- One concept per placeholder

## Visibility System
- Format: "STEP?" or "START:END?" 
- Lines can appear/disappear during lesson progression
- Used to reveal code incrementally

## Pedagogical Principles
- Each JSON file = one core concept
- Break at natural teaching moments:
  - Before new syntax
  - After showing output
  - When students need hands-on practice
- 2-3 sentences per description
- Instructions only for student input steps

## JSON Schema Constraints
- descriptions: all steps (keyed by step number)
- instructions: only steps with student input
- template: array with visibility prefixes

---
name: graphicsprogrammingatlas
description: improve the existing graphicsprogrammingatlas project in place. use when working on the current repo to enhance arabic technical documentation, tooltip quality, json-by-category organization, smart search, lightweight javascript, lazy loading, examples, internal links, and performance while preserving the current layout, current main menu, current distribution, and arabic language. support c++, glsl, vulkan, dear imgui, sdl3, sdl3_image, sdl3_mixer, and sdl3_ttf. prefer incremental phases, backups, work-progress tracking, and resuming from the last stable checkpoint.
---

# graphicsprogrammingatlas

Read `AGENTS.md` first. If present, also read `.codex/work-progress.json` before making changes.

## Core rules
- Modify the existing project only.
- Preserve the current visual identity, main menu, page distribution, and Arabic as the primary language.
- Keep JSON organized by category.
- Improve incrementally in small testable phases.
- Prefer the smallest change that delivers value.
- Create a backup/checkpoint before risky shared changes.
- Update `.codex/work-progress.json` after every meaningful phase.

## Supported libraries
- C++
- CMake
- GLSL
- Vulkan
- Dear ImGui
- SDL3
- SDL3_image
- SDL3_mixer
- SDL3_ttf

## Primary priorities
1. Keep current structure and UI.
2. Keep main menu unchanged in concept and layout.
3. Keep JSON split by category.
4. Reuse and improve existing examples/full projects.
5. Make search fast and exact-match first.
6. Make tooltips beginner-friendly and technically precise.
7. Explain the real programming meaning in Arabic.
8. Add internal links, official references, icons, and SVG only when useful.
9. Keep JavaScript light and page-specific.

## Documentation quality rules
- Explanations must be deep, precise, and beginner-friendly without becoming superficial.
- Explain the real meaning of functions, variables, structs, classes, keywords, and language constructs.
- Do not use vague explanations such as "stores a value" or "used to execute code" without explaining the actual programming meaning.
- Clarify what the term means inside the language model itself, why it exists, and how a beginner should think about it mentally.
- Prefer practical explanation over generic wording.
- Every important concept should include:
  1. what it is
  2. what it means in the language
  3. why it exists
  4. when to use it
  5. when not to use it
  6. common beginner mistakes
  7. multiple examples
  8. related internal links
- Avoid filler text, motivational fluff, and repeated generic definitions.
- Prioritize semantic clarity and conceptual correctness over decorative wording.

## Reference authority rules
- Use the language’s primary references as the source of truth instead of informal or generic explanations.
- When improving C++ explanations, prefer:
  - https://en.cppreference.com/
  - https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- When improving C explanations where relevant, prefer:
  - https://cppreference.com/w/c/index.html
- Base explanations on the actual meaning from the reference, then rewrite them into clear Arabic for beginners.
- Do not invent behavioral claims that are not supported by the referenced language meaning.
- At the end of relevant pages, include a small "official references" section linking to the most relevant primary source pages.

## C++ explanation rules
- Treat C++ as an independent language entity when explaining its concepts.
- Do not explain C++ concepts through external libraries or frameworks unless the page is specifically about integration.
- For language pages, avoid relying on library-specific examples when a pure language example is enough.
- Focus on the actual language meaning of:
  - variables
  - functions
  - references
  - pointers
  - const
  - scope
  - lifetime
  - structs
  - classes
  - constructors
  - destructors
  - keywords
  - expressions
  - statements
  - types

## Tooltip and internal linking rules
- Tooltips must be short, accurate, and useful for beginners.
- Tooltips should clarify the exact meaning of the term, not repeat the same title in different words.
- Add internal links between closely related concepts whenever it improves understanding.
- Prefer linking concepts such as:
  - variable ↔ type
  - function ↔ parameter ↔ return value
  - scope ↔ lifetime
  - reference ↔ pointer
  - struct ↔ class
  - constructor ↔ object lifetime
- Avoid excessive linking noise; only add links that genuinely help navigation and understanding.

## Example rules
- Every important concept should have multiple examples where useful.
- Examples must be practical, readable, and directly tied to the explanation.
- Avoid examples that only repeat syntax without showing meaning.
- After each code example, explain the important lines and why each part exists.
- Prefer progressive examples:
  - simple example
  - clearer real-use example
  - common mistake example when relevant
- Reuse and improve existing examples in the project before creating new ones.

## Code block UX rules
- Add copy button for code blocks where the current UI supports it.
- Add collapse/expand behavior for long examples when useful.
- Keep interactions lightweight and page-specific.
- Do not add heavy JavaScript frameworks or unnecessary global code for simple UI behavior.

## Visual and layout rules
- Preserve the current layout, main menu, and page distribution.
- Keep the interface clean, technical, and easy to scan.
- Use a structured documentation style with clear sections, callouts, and code presentation.
- Improve readability through spacing, hierarchy, and grouping without changing the site identity.
- Use icons or SVG only when they provide real value.

## Current project style memory
Use this as the default style memory for every new addition unless the existing page already imposes a stricter local pattern:

- Reuse the current unified shells such as `parameter-detail-card`, `content-card`, and `prose-card` instead of inventing a new visual system.
- Preserve the current dark visual identity and existing accent colors. Do not introduce white section backgrounds or off-brand palettes.
- New reference pages should usually flow in this order:
  1. core identity/info
  2. real meaning
  3. practical usage
  4. multiple examples
  5. related items
  6. official references
- If an element requires a standard include/header, show the actual include line prominently, e.g. `#include <iostream>`.
- If a symbol requires namespace-qualified spelling such as `std::name`, show the correct spelling explicitly and explain scoped `using std::name;` when helpful. Do not default to `using namespace std;`.
- Important concepts must ship with at least three examples by default unless a documented reason makes that impossible:
  - simple example
  - clearer usage example
  - smarter or mistake-oriented example
- Code examples must reuse the project’s existing code shell and controls, including copy and collapse/expand behavior where supported.
- After each example, explain the meaningful lines in Arabic with emphasis on intent and actual effect, not line-by-line paraphrasing only.
- Related items should be rendered as one cohesive grouped block/card, not visually scattered fragments.
- Analytical sections such as member operations or important properties should prefer a vertical stacked layout when dense explanation is involved.
- Field labels such as “what it does”, “when it helps”, “practical benefit”, and “cost/speed” should be visually distinguished within the current theme, not left as plain undecorated labels.
- When documenting functions, types, or operations, include practical benefit and, when useful, complexity/cost/performance meaning.
- Explanations must stay in precise Arabic and avoid unnecessary English wording inside explanatory prose.
- Treat language references, especially C++, as independent language entities unless the page is explicitly about integration with another library.
- Every new addition should preserve:
  - internal links
  - meaningful tooltips
  - official reference links near the end
  - lightweight loading behavior
  - the existing page rhythm and hierarchy
- For C++ specifically:
  - keep new assets under `data/ui/cpp/`
  - split reference data by category such as `keywords`, `types`, and `standard-library`
  - avoid returning to one monolithic C++ data file except for a tiny manifest/index used for segmented loading

## Page ending rules
- For language-focused pages, end with a short references section.
- This section should point to the most relevant primary documentation pages.
- Prefer direct reference links that match the explained concept.

## Work loop
1. Read `AGENTS.md`.
2. Read `.codex/work-progress.json` if it exists.
3. Inspect the current files related to the target phase.
4. Create a backup/checkpoint for risky changes.
5. Implement one small phase.
6. Test the changed path.
7. Update `.codex/work-progress.json`.
8. Move to the next phase.

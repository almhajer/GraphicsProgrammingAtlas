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

## Work loop
1. Read `AGENTS.md`.
2. Read `.codex/work-progress.json` if it exists.
3. Inspect the current files related to the target phase.
4. Create a backup/checkpoint for risky changes.
5. Implement one small phase.
6. Test the changed path.
7. Update `.codex/work-progress.json`.
8. Move to the next phase.

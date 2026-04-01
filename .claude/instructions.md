# Project Instructions for Claude Code

## Documentation Requirements

**CRITICAL: Always update documentation when making code changes**

Before making any commit, you MUST:

1. ✅ Update `CLAUDE.md` if you:
   - Add/modify functions or components
   - Change architecture or data flow
   - Add new dependencies
   - Update key logic or algorithms
   - Change important configurations

2. ✅ Update `README.md` if you:
   - Add/modify CLI arguments or API endpoints
   - Change installation steps
   - Add new features users need to know about
   - Update usage examples
   - Change configuration options

## Commit Workflow

When the user asks you to commit:

1. Review all code changes made in this session
2. Check if `CLAUDE.md` needs updates (technical/dev context)
3. Check if `README.md` needs updates (user-facing docs)
4. Update both files as needed
5. Include documentation updates in the same commit
6. Commit message should mention doc updates if applicable

## Examples

**Good commit message:**
```
Add new feature X with --flag option

- Implement feature X logic
- Add --flag CLI argument
- Update README.md with usage examples
- Update CLAUDE.md with architecture changes
```

**Bad commit message:**
```
Add feature X
(Missing: documentation updates)
```

## Why This Matters

- Keeps docs in sync with code
- Helps future developers (and AI assistants) understand the project
- Makes onboarding easier
- Prevents documentation drift

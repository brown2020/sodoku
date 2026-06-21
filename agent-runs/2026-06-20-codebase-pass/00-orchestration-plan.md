# Orchestration Plan

## Mode Selection

- Repo: /Users/stephenbrown/Code/OPENSOURCE/sodoku
- Branch: dev
- Work mode: full
- Run folder: /Users/stephenbrown/Code/OPENSOURCE/sodoku/agent-runs/2026-06-20-codebase-pass
- Verifiable gates: `npm run lint`; `npm run build`; Git read access; dry-run push; status/diff inspection.
- Human-decision blockers: product roadmap direction, broad UX/product changes, risky major dependency upgrades, or changes requiring unavailable external services.
- Resume policy: resume from this run folder, `run-state.md`, `task-queue.md`, and Git state. Push any validated local phase commit before new edits.

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Docs match current repo and checks pass | Plan, state, queue, docs, and report pushed |
| Baseline Validation | Baseline Validation Loop | Lint/build results recorded and failures classified | Baseline is clean or failures are classified |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard | Backlog, scorecard, and queue are pushed |
| Execute Fixes and Improvements | Task Queue Loop, Fix Validation Loop, Architecture Fitness Loop, Lean Code Loop | Targeted checks plus lint/build as practical | Highest-priority fixes are done or blocked/deferred |
| Package and Dead-Code Cleanup | Package Cleanup Loop, Dead Code Loop | Package/dead-code changes have evidence and checks | Safe cleanup is pushed or deferred |
| Review | Judge Loop | No actionable P0/P1 or introduced regression remains | Review report is pushed |
| Stabilization Loop | Stabilization Loop, Judge Loop | Completion criteria pass | Repo is clean/synced or a real blocker is recorded |
| Integrator | Final Completion Gate | Remote read, dry-run push, clean tree, branch sync, quality gate evidence | Final report is pushed |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | AGENTS.md, SPEC.md, 00-orchestration-plan.md, run-state.md, task-queue.md, 01-preflight-and-repo-docs.md, skill-improvement-log.md | Startup planning, repo guidance, current-state spec, and resume state |
| T-002 | 02-baseline-validation.md, run-state.md, task-queue.md | Baseline lint/build/dependency validation |
| T-003 | 03-findings-backlog.md, task-queue.md, run-state.md | Evidence-backed findings and architecture scorecard |
| T-004 | src/utils/sudokuUtils.ts, 04-execute-fixes-and-improvements.md, task-queue.md, run-state.md | Candidate bug fix if findings confirm non-unique puzzle generation as in-scope |
| T-005 | package.json, package-lock.json, 05-package-and-dead-code-cleanup.md, task-queue.md, run-state.md | Safe dependency diagnostics and cleanup only when verified |
| T-006 | 06-review.md, 07-stabilization-loop.md, 08-integrator.md, final-report.md, run-state.md, task-queue.md | Review, stabilization, and final completion |

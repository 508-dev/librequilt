# Verification

## Research-stage check

```sh
python3 scripts/check-project.py
```

This validates required files and metadata. It does not judge source permissions,
research completeness, license compatibility, or specification approval authenticity.
Maintainers review the actual content before registration and implementation.

## Research deliverables

For each ticket, identify the question, sources, observations versus inference,
unknowns, and acceptance evidence. A reviewer should be able to follow the evidence.

## Implementation checks

The stack is a web-only TypeScript application ([decisions](decisions.md)). No code exists
yet. With the project skeleton, document executable build, lint/typecheck, test, and
acceptance commands appropriate to the approved scope. Commit the dependency lock, use
frozen installs in CI, and set the package manager's seven-day minimum release age (Bun:
`minimumReleaseAge = 604800`; pnpm: `minimumReleaseAge: 10080`). Never add model runners.

## Release evidence

Before declaring the scope usable, document reproducible checks, limitations, supported
platforms, source/build instructions, license notices, and a private security-reporting route.

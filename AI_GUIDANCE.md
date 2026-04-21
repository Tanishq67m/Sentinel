# AI Guidance and System Architecture Constraints

This document outlines the strict guidelines, constraints, and systemic boundaries used to direct the AI agent during the development of the Sentinel Deployment Governance Gateway.

## 1. Architectural Directives
The AI was strictly instructed to prioritize **simplicity, correctness, and safety** over bloated feature sets.
- **Rule:** "Do not build unnecessary features. Focus strictly on a rock-solid State Machine for deployment requests."
- **Constraint:** "The application must be completely atomic. A deployment request must only exist in strictly defined statuses: `VALIDATING`, `APPROVED`, `REJECTED`, or `MANUAL_REVIEW`."

## 2. Interface Safety Constraints
To ensure the backend never crashes from malformed inputs, the AI was explicitly required to use `Pydantic` as the structural gateway.
- **Directive:** "All incoming JSON payloads must be parsed and verified by a rigid Pydantic model before the data is allowed to touch the Policy Engine or the Database."

## 3. Observability & Audit Trail Requirements 
Instead of relying on ephemeral print statements, the AI was instructed to build a permanent audit trail.
- **Constraint:** "Every transition made by the Deployment Service must be logged to a permanent SQLite table (`audit_telemetry_logs`). Failures must never be silent."
- **Guidance:** "The AI must capture the exact reason for any policy rejection from the Policy Engine and trace it back to the precise Actor and Timestamp."

## 4. UI/UX Restrictions
The AI was heavily constrained from building "generic" or "messy" templates.
- **Directive:** "The frontend must not use Tailwind CSS defaults. It must use a custom, highly strict Editorial Brutalist design. Pure `#000000` backgrounds, precise `1px` dashed borders, and explicit high-contrast interaction states."
- **Rule:** "Prioritize readability and absolute clarity. The telemetry feed must read like an engineering log, not a social media feed."

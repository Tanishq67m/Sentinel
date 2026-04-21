"""
services/policy_engine.py

Pure validation logic. This module has zero knowledge of the database,
Flask, or HTTP. It receives a data object, runs checks, and returns a
structured result. That's it.

Adding a new policy = adding one method + registering it in _get_policies().
"""

from dataclasses import dataclass, field
from app.utils.logger import get_logger

log = get_logger(__name__)


# ── Result types ────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class PolicyViolation:
    """One failed check. Immutable once created."""
    policy_name: str   # machine-readable, e.g. "release_notes_length"
    reason: str        # human-readable, goes into AuditLog.reason


@dataclass
class ValidationResult:
    passed: bool
    violations: list[PolicyViolation] = field(default_factory=list)
    is_manual_review_required: bool = False

    def rejection_summary(self) -> str:
        """
        Multi-line string that goes into DeploymentRequest.rejection_reason
        and into the AuditLog. Each bullet maps to one failed policy.
        """
        if self.passed:
            return "All safety policies passed."
        lines = [f"Failed {len(self.violations)} policy check(s):"]
        for v in self.violations:
            lines.append(f"  • [{v.policy_name}] Reason: {v.reason}")
        return "\n".join(lines)


# ── Engine ──────────────────────────────────────────────────────────────────

class PolicyEngine:
    """
    Evaluates a deployment payload against a sequence of safety policies.

    Accepts a plain dict (already validated by Pydantic at the route layer)
    so this class has no Pydantic or SQLAlchemy imports — fully portable.
    """

    RELEASE_NOTES_MIN_CHARS: int = 20
    BLOCKED_VERSION_SUFFIXES: tuple[str, ...] = ("-dev", "-test", "-wip", "-draft")
    BLOCKED_EMAIL_DOMAINS:    frozenset[str]  = frozenset({
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
    })

    # Each policy is: (self, payload: dict) -> tuple[bool, str]
    # True  = passed,  str = reason logged either way (shown only on failure)
    def _get_policies(self) -> list:
        return [
            self._policy_release_notes_length,
            self._policy_environment_allowed,
            self._policy_version_not_draft,
            self._policy_corporate_email,
        ]

    def evaluate(self, payload: dict) -> ValidationResult:
        """
        Run all policies. Always runs every check (no early exit) so the
        caller gets the full list of violations in one pass.
        """
        log.info(
            f"PolicyEngine.evaluate | env={payload.get('environment')} "
            f"version={payload.get('version_tag')} by={payload.get('requested_by')}"
        )

        violations: list[PolicyViolation] = []

        for policy_fn in self._get_policies():
            passed, reason = policy_fn(payload)
            policy_name = policy_fn.__name__.replace("_policy_", "")

            if passed:
                log.debug(f"  PASS [{policy_name}]")
            else:
                log.warning(f"  FAIL [{policy_name}] — {reason}")
                violations.append(PolicyViolation(
                    policy_name=policy_name,
                    reason=reason,
                ))

        is_manual_review = payload.get("environment", "").lower() == "production"

        result = ValidationResult(
            passed=len(violations) == 0,
            violations=violations,
            is_manual_review_required=is_manual_review,
        )
        log.info(
            f"PolicyEngine.evaluate | result={'PASS' if result.passed else 'FAIL'} "
            f"violations={len(violations)} manual_review={is_manual_review}"
        )
        return result

    # ── Individual policies ──────────────────────────────────────────────────

    def _policy_release_notes_length(
        self, payload: dict
    ) -> tuple[bool, str]:
        """
        Release notes must exceed RELEASE_NOTES_MIN_CHARS.
        Enforces meaningful documentation over placeholder text.
        """
        notes = payload.get("release_notes", "").strip()
        length = len(notes)
        if length <= self.RELEASE_NOTES_MIN_CHARS:
            return False, (
                f"Release notes are {length} chars — "
                f"must be > {self.RELEASE_NOTES_MIN_CHARS}. "
                "Provide a meaningful description of the change."
            )
        return True, f"Release notes length OK ({length} chars)."

    def _policy_environment_allowed(
        self, payload: dict
    ) -> tuple[bool, str]:
        """
        Target environment must be 'staging' or 'production'.
        Rejects misconfigured or unknown deployment targets.
        """
        env = payload.get("environment", "").lower()
        allowed = {"staging", "production"}
        if env not in allowed:
            return False, (
                f"Environment '{env}' is not permitted. "
                f"Allowed values: {sorted(allowed)}."
            )
        return True, f"Environment '{env}' is valid."

    def _policy_version_not_draft(
        self, payload: dict
    ) -> tuple[bool, str]:
        """
        Version tag must not carry a draft/WIP suffix.
        Draft builds must never reach staging or production.
        """
        tag = payload.get("version_tag", "").lower()
        for suffix in self.BLOCKED_VERSION_SUFFIXES:
            if tag.endswith(suffix):
                return False, (
                    f"Version '{payload['version_tag']}' ends with "
                    f"blocked suffix '{suffix}'. Use a finalized release tag."
                )
        return True, f"Version tag '{payload.get('version_tag')}' is clean."

    def _policy_corporate_email(
        self, payload: dict
    ) -> tuple[bool, str]:
        """
        Requester must use a corporate email address.
        Public domains (gmail, yahoo, etc.) indicate non-org submitters.
        """
        email = payload.get("requested_by", "")
        domain = email.split("@")[-1].lower() if "@" in email else ""
        if domain in self.BLOCKED_EMAIL_DOMAINS:
            return False, (
                f"'@{domain}' is a public email provider. "
                "Deployment requests must originate from a corporate account."
            )
        return True, f"Requester domain '@{domain}' is acceptable."
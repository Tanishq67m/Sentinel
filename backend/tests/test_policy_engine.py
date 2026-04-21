import pytest
from app.services.policy_engine import PolicyEngine

def test_corporate_email_policy_pass():
    engine = PolicyEngine()
    result = engine.evaluate({
        "requested_by": "engineer@company.com",
        "environment": "staging",
        "release_notes": "Extensive release notes over 20 characters.",
        "version_tag": "v1.0.0"
    })
    assert result.passed is True
    assert len(result.violations) == 0
    assert result.is_manual_review_required is False

def test_corporate_email_policy_fail():
    engine = PolicyEngine()
    result = engine.evaluate({
        "requested_by": "engineer@gmail.com",
        "environment": "staging",
        "release_notes": "Extensive release notes over 20 characters.",
        "version_tag": "v1.0.0"
    })
    assert result.passed is False
    assert "corporate account" in result.violations[0].reason.lower()

def test_environment_manual_review_flag():
    engine = PolicyEngine()
    result = engine.evaluate({
        "requested_by": "engineer@company.com",
        "environment": "production",
        "release_notes": "Extensive release notes over 20 characters.",
        "version_tag": "v1.0.0"
    })
    assert result.passed is True
    assert result.is_manual_review_required is True

def test_draft_version_rejection():
    engine = PolicyEngine()
    result = engine.evaluate({
        "requested_by": "engineer@company.com",
        "environment": "staging",
        "release_notes": "Extensive release notes over 20 characters.",
        "version_tag": "v1.0.0-draft"
    })
    assert result.passed is False
    assert "draft" in result.violations[0].reason.lower()

def test_short_release_notes_rejection():
    engine = PolicyEngine()
    result = engine.evaluate({
        "requested_by": "engineer@company.com",
        "environment": "staging",
        "release_notes": "fixed bug",
        "version_tag": "v1.0.0"
    })
    assert result.passed is False
    assert "release notes" in result.violations[0].reason.lower()

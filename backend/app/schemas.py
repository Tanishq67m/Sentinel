"""
schemas.py — Pydantic v2 models for every request payload and response shape.

Rule: routes never call request.json.get(). They call Schema.model_validate(request.json).
Rule: every API response is wrapped in ApiResponse[T] — {success, data, error}.
"""

import re
from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel, EmailStr, Field, field_validator

T = TypeVar("T")


# ── Response envelope ────────────────────────────────────────────────────────

class ApiResponse(BaseModel, Generic[T]):
    """
    Universal response wrapper.
      Success:  ApiResponse(success=True,  data=<payload>, error=None)
      Failure:  ApiResponse(success=False, data=None,      error=<ErrorDetail>)
    """
    success: bool
    data:    T | None    = None
    error:   dict | None = None

    @classmethod
    def ok(cls, data: Any) -> "ApiResponse":
        return cls(success=True, data=data, error=None)

    @classmethod
    def fail(cls, message: str, details: list[str] | None = None) -> "ApiResponse":
        return cls(
            success=False,
            data=None,
            error={"message": message, "details": details or []},
        )


# ── Request schemas ──────────────────────────────────────────────────────────

class CreateDeploymentSchema(BaseModel):
    """Validates POST /api/deployments body."""

    title: str = Field(..., min_length=3, max_length=200)
    environment: Literal["staging", "production"] = Field(
        ..., description="Must be 'staging' or 'production'."
    )
    release_notes: str = Field(
        ..., min_length=1, description="Detailed release notes."
    )
    requested_by: EmailStr = Field(..., description="Corporate email of the submitter.")
    version_tag: str = Field(..., description="SemVer tag, e.g. v1.2.3.")

    @field_validator("version_tag")
    @classmethod
    def must_be_semver(cls, v: str) -> str:
        if not re.match(r"^v?\d+\.\d+\.\d+(-[\w.]+)?$", v):
            raise ValueError(
                f"'{v}' is not a valid version tag. Expected: v1.2.3 or v1.2.3-rc1"
            )
        return v

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title must not be blank.")
        return v.strip()

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Deploy Auth Service",
                "environment": "staging",
                "release_notes": "Fixed OAuth token refresh bug and added rate limiting.",
                "requested_by": "alice@company.com",
                "version_tag": "v2.3.1",
            }
        }
    }
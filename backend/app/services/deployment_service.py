"""
services/deployment_service.py

Orchestration layer. The ONLY place that:
  - Reads/writes DeploymentRequest and AuditLog via SQLAlchemy
  - Calls PolicyEngine
  - Drives the state machine: VALIDATING -> APPROVED | MANUAL_REVIEW | REJECTED

Routes call this. This calls models + PolicyEngine. Nothing else does.
"""

from datetime import datetime, timezone
from typing import Optional

from app.models import AuditLog, DeploymentRequest, db
from app.schemas import CreateDeploymentSchema
from app.services.policy_engine import PolicyEngine, ValidationResult
from app.utils.logger import get_logger

log = get_logger(__name__)
_engine = PolicyEngine()


def _transition(
    req: DeploymentRequest,
    old_status: str,
    new_status: str,
    reason: str,
    actor: str = "system",
) -> None:
    """
    Single mutation point for status changes.
    Assigns new status AND writes AuditLog atomically in the same session.
    Status is never assigned anywhere else.
    """
    log.info(f"Transition [{req.id}]: {old_status} -> {new_status}")
    req.status = new_status
    req.updated_at = datetime.now(timezone.utc)
    db.session.add(AuditLog(
        request_id=req.id,
        old_status=old_status,
        new_status=new_status,
        reason=reason,
        actor=actor,
    ))


def create_request(payload: CreateDeploymentSchema) -> DeploymentRequest:
    """
    Full lifecycle:
      1. Persist with VALIDATING status.
      2. Run PolicyEngine (receives plain dict — no ORM coupling).
      3. Transition to APPROVED or REJECTED.
      4. Commit and return the final object.
    """
    log.info(f"Creating request: title='{payload.title}' env={payload.environment}")

    req = DeploymentRequest(
        title=payload.title,
        environment=payload.environment,
        release_notes=payload.release_notes,
        requested_by=payload.requested_by,
        version_tag=payload.version_tag,
        status="VALIDATING",
    )
    db.session.add(req)
    db.session.flush()  # populate req.id without committing

    _transition(req, "NONE", "VALIDATING", "Request submitted.", actor=payload.requested_by)

    result: ValidationResult = _engine.evaluate(payload.model_dump())

    if result.passed:
        if result.is_manual_review_required:
            _transition(
                req, "VALIDATING", "MANUAL_REVIEW",
                reason="Production deployment requires manual review.",
                actor="policy_engine",
            )
        else:
            _transition(
                req, "VALIDATING", "APPROVED",
                reason="All safety policies passed.",
                actor="policy_engine",
            )
    else:
        summary = result.rejection_summary()
        req.rejection_reason = summary
        _transition(
            req, "VALIDATING", "REJECTED",
            reason=summary,
            actor="policy_engine",
        )

    db.session.commit()
    log.info(f"Request {req.id} final status: {req.status}")
    return req


def list_requests() -> list[DeploymentRequest]:
    return DeploymentRequest.query.order_by(DeploymentRequest.created_at.desc()).all()


def get_request(request_id: str) -> Optional[DeploymentRequest]:
    return db.session.get(DeploymentRequest, request_id)


def get_audit_log(request_id: str) -> list[AuditLog]:
    return (
        AuditLog.query
        .filter_by(request_id=request_id)
        .order_by(AuditLog.timestamp.asc())
        .all()
    )
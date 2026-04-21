"""
models.py — SQLAlchemy ORM models. Pure data containers, no business logic.
"""

import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _uuid() -> str:
    return str(uuid.uuid4())


class DeploymentRequest(db.Model):
    __tablename__ = "deployment_requests"

    id:               str      = db.Column(db.String(36), primary_key=True, default=_uuid)
    title:            str      = db.Column(db.String(200), nullable=False)
    environment:      str      = db.Column(db.String(20),  nullable=False)
    release_notes:    str      = db.Column(db.Text,        nullable=False)
    requested_by:     str      = db.Column(db.String(100), nullable=False)
    version_tag:      str      = db.Column(db.String(50),  nullable=False)
    status:           str      = db.Column(db.String(20),  nullable=False, default="PENDING")
    rejection_reason: str|None = db.Column(db.Text,        nullable=True)
    created_at:       datetime = db.Column(db.DateTime,    nullable=False, default=_now)
    updated_at:       datetime = db.Column(db.DateTime,    nullable=False, default=_now, onupdate=_now)

    audit_logs = db.relationship(
        "AuditLog", backref="request", lazy="dynamic", cascade="all, delete-orphan"
    )

    def to_dict(self) -> dict:
        return {
            "id":               self.id,
            "title":            self.title,
            "environment":      self.environment,
            "release_notes":    self.release_notes,
            "requested_by":     self.requested_by,
            "version_tag":      self.version_tag,
            "status":           self.status,
            "rejection_reason": self.rejection_reason,
            "created_at":       self.created_at.isoformat(),
            "updated_at":       self.updated_at.isoformat(),
        }


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id:         str      = db.Column(db.String(36), primary_key=True, default=_uuid)
    request_id: str      = db.Column(db.String(36), db.ForeignKey("deployment_requests.id"), nullable=False, index=True)
    old_status: str      = db.Column(db.String(20), nullable=False)
    new_status: str      = db.Column(db.String(20), nullable=False)
    reason:     str      = db.Column(db.Text,       nullable=False)
    actor:      str      = db.Column(db.String(100),nullable=False, default="system")
    timestamp:  datetime = db.Column(db.DateTime,   nullable=False, default=_now)

    def to_dict(self) -> dict:
        return {
            "id":         self.id,
            "request_id": self.request_id,
            "old_status": self.old_status,
            "new_status": self.new_status,
            "reason":     self.reason,
            "actor":      self.actor,
            "timestamp":  self.timestamp.isoformat(),
        }
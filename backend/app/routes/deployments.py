"""
routes/deployments.py — Thin HTTP handlers.

Each route does exactly four things and nothing else:
  1. Parse JSON with Pydantic (return 400 on failure)
  2. Call a service function
  3. Wrap result in an envelope
  4. Return
"""

import uuid
from flask import Blueprint, g, request
from pydantic import ValidationError

from app.schemas import CreateDeploymentSchema
from app.services import deployment_service as svc
from app.utils.logger import get_logger
from app.utils.response import failure, success

log = get_logger(__name__)
bp = Blueprint("deployments", __name__, url_prefix="/api/deployments")


@bp.before_request
def _attach_request_id() -> None:
    g.request_id = str(uuid.uuid4())


@bp.route("", methods=["POST"])
def submit():
    """POST /api/deployments — validate, run policies, persist."""
    body = request.get_json(silent=True)
    if body is None:
        return failure("Request body must be valid JSON.")

    try:
        payload = CreateDeploymentSchema.model_validate(body)
    except ValidationError as exc:
        details = [
            f"{'.'.join(str(l) for l in e['loc'])}: {e['msg']}"
            for e in exc.errors()
        ]
        return failure("Payload validation failed.", details=details, status=422)

    req = svc.create_request(payload)
    return success(req.to_dict(), status=201)


@bp.route("", methods=["GET"])
def list_all():
    """GET /api/deployments — list all requests, newest first."""
    return success([r.to_dict() for r in svc.list_requests()])


@bp.route("/<string:rid>", methods=["GET"])
def get_one(rid: str):
    """GET /api/deployments/<id> — single request with its audit log."""
    req = svc.get_request(rid)
    if req is None:
        return failure(f"Request '{rid}' not found.", status=404)

    data = {**req.to_dict(), "audit_log": [e.to_dict() for e in svc.get_audit_log(rid)]}
    return success(data)
"""
utils/response.py — JSON envelope factory functions.

Every response from every route must use one of these two functions.
Shape is always: { "success": bool, "data": any|null, "error": obj|null }
"""

from typing import Any
from flask import jsonify, Response


def success(data: Any, status: int = 200) -> Response:
    return jsonify({"success": True, "data": data, "error": None}), status


def failure(message: str, details: list[str] | None = None, status: int = 400) -> Response:
    return jsonify({
        "success": False,
        "data":    None,
        "error":   {"message": message, "details": details or []},
    }), status
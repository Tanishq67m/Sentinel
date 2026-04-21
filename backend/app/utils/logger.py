"""
utils/logger.py — Centralized structured logger with automatic request_id injection.
"""

import logging
import sys
from flask import g


class _RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        try:
            record.request_id = g.get("request_id", "NO_REQ")
        except RuntimeError:
            record.request_id = "STARTUP"
        return True


def _setup() -> None:
    root = logging.getLogger()
    if root.handlers:
        return
    root.setLevel(logging.DEBUG)
    h = logging.StreamHandler(sys.stdout)
    h.setFormatter(logging.Formatter(
        "%(asctime)s | %(levelname)-8s | req=%(request_id)s | %(name)s | %(message)s",
        datefmt="%H:%M:%S",
    ))
    h.addFilter(_RequestIdFilter())
    root.addHandler(h)


_setup()


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not any(isinstance(f, _RequestIdFilter) for f in logger.filters):
        logger.addFilter(_RequestIdFilter())
    return logger
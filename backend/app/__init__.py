"""
app/__init__.py — Flask application factory.
"""

from flask import Flask
from flask_cors import CORS

from app.models import db


def create_app(config_object: str = "config.DevelopmentConfig") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    CORS(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    from app.routes.deployments import bp
    app.register_blueprint(bp)

    return app

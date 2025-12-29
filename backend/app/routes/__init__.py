from flask import Blueprint

def register_routes(app):
    from .health import health_bp
    from .auth import auth_bp 
    from .financial_snapshot import financial_snapshot_bp
    from .financial_plans import financial_plans_bp
    from .calculator import calculator_bp
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(financial_snapshot_bp)
    app.register_blueprint(financial_plans_bp)
    app.register_blueprint(calculator_bp)

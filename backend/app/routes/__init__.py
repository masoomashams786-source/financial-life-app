from flask import Blueprint

def register_routes(app):
    from .health import health_bp
    from .auth import auth_bp 
    from .financial_snapshot import financial_snapshot_bp
    from .financial_plans import financial_plans_bp
    from .calculator import calculator_bp
    from .projections import projections_bp
    from .insights import insights_bp
    from .news import news_bp
    from .sp500 import sp500_bp
    from .wealth_velocity import wealth_velocity_bp
    app.register_blueprint(sp500_bp)    
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(financial_snapshot_bp)
    app.register_blueprint(financial_plans_bp)
    app.register_blueprint(calculator_bp)
    app.register_blueprint(projections_bp)
    app.register_blueprint(insights_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(wealth_velocity_bp)

"""Main application module for the LinkedIn Resume Tailor backend."""
import warnings
from flask import Flask
from flask_cors import CORS

from .config import get_config
from .routes import register_routes

# Suppress warnings which might come from libraries
warnings.filterwarnings('ignore')

def create_app(config_name='default'):
    """
    Create and configure the Flask application.
    
    Args:
        config_name: The configuration to use (default, development, production, testing)
        
    Returns:
        The configured Flask application
    """
    app = Flask(__name__)
    
    # Configure the app
    config = get_config()
    app.config.from_object(config)
    
    # Enable CORS
    CORS(app)
    
    # Register routes
    register_routes(app)
    
    return app

app = create_app()

if __name__ == "__main__":
    """Run the application when executed directly."""
    port = app.config.get('API_PORT', 5001)
    app.run(host="0.0.0.0", port=port) 
"""Entry point for the Flask application."""
from app.app import app

if __name__ == "__main__":
    """Run the application when executed directly."""
    port = app.config.get('API_PORT', 5001)
    app.run(host="0.0.0.0", port=port) 
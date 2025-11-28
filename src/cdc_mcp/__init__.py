"""
CDC MCP Server
Access CDC public health data through the Model Context Protocol.
"""

__version__ = "0.1.0"
__author__ = "Joan Saez-Pons"
__description__ = "MCP server for CDC public health data"

from .cdc_client import CDCAPIClient
from .server import app, main

__all__ = ["CDCAPIClient", "app", "main"]

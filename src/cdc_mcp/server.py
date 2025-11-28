"""
CDC MCP Server
Provides access to CDC public health data through the Model Context Protocol (MCP).
"""

from typing import Any, Dict, Optional
import asyncio
import logging
import json
import os
from mcp.server import Server
from mcp.types import CallToolRequest, ListToolsRequest, Tool, TextContent
from .cdc_client import CDCAPIClient

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize CDC client
app_token = os.getenv("CDC_APP_TOKEN")
if app_token:
    logger.info("Using CDC app token for enhanced rate limits")
else:
    logger.info("No CDC app token found - using shared rate limit pool")

cdc_client = CDCAPIClient(app_token=app_token)

# Tool definition with unified interface
TOOL_DEFINITIONS = [
    Tool(
        name="cdc_health_data",
        description="""Unified tool for CDC public health data operations: access disease prevalence, chronic disease indicators, behavioral risk factors, and health surveillance data from CDC's Socrata Open Data API (SODA).

Available data sources:
- PLACES: Local disease prevalence data at county, place, census tract, and ZIP code levels
- BRFSS: Behavioral Risk Factor Surveillance System for chronic disease risk factors
- Chronic Disease Indicators: Comprehensive chronic disease surveillance data
- Disease-specific datasets: Diabetes, obesity, heart disease, cancer, etc.

Use the method parameter to specify the operation type.""",
        inputSchema={
            "type": "object",
            "properties": {
                "method": {
                    "type": "string",
                    "enum": [
                        "get_places_data",
                        "get_brfss_data",
                        "get_chronic_disease_indicators",
                        "search_dataset",
                        "get_available_measures",
                        "list_datasets"
                    ],
                    "description": """The operation to perform:
- get_places_data: Get PLACES local disease prevalence data
- get_brfss_data: Get BRFSS behavioral risk factor data
- get_chronic_disease_indicators: Get chronic disease surveillance indicators
- search_dataset: Generic search across any CDC dataset
- get_available_measures: List available measures for a dataset
- list_datasets: List all available CDC datasets"""
                },

                # PLACES parameters
                "geography_level": {
                    "type": "string",
                    "enum": ["county", "place", "tract", "zcta"],
                    "description": "For get_places_data: Geographic level (county, place, tract, zcta)"
                },
                "year": {
                    "type": "string",
                    "description": "For get_places_data/get_brfss_data: Data release year (e.g., '2023', '2024', or integer for BRFSS)"
                },
                "state": {
                    "type": "string",
                    "description": "State abbreviation (e.g., 'CA', 'TX', 'NY')"
                },
                "measure_id": {
                    "type": "string",
                    "description": "Disease/condition measure code (e.g., 'DIABETES', 'OBESITY', 'CHD', 'COPD', 'ASTHMA')"
                },
                "location": {
                    "type": "string",
                    "description": "Specific location name (e.g., 'Harris County', 'Los Angeles')"
                },

                # BRFSS parameters
                "dataset_type": {
                    "type": "string",
                    "enum": ["obesity_national", "obesity_state", "diabetes", "asthma"],
                    "description": "For get_brfss_data: Type of BRFSS dataset"
                },

                # Chronic Disease Indicators parameters
                "topic": {
                    "type": "string",
                    "description": "For get_chronic_disease_indicators: Topic area (e.g., 'Diabetes', 'Cardiovascular Disease', 'Cancer')"
                },
                "question": {
                    "type": "string",
                    "description": "For get_chronic_disease_indicators: Specific indicator question (partial match supported)"
                },
                "year_start": {
                    "type": "integer",
                    "description": "For get_chronic_disease_indicators: Start year for data range"
                },
                "year_end": {
                    "type": "integer",
                    "description": "For get_chronic_disease_indicators: End year for data range"
                },
                "stratification": {
                    "type": "string",
                    "description": "For get_chronic_disease_indicators: Stratification level (e.g., 'Overall', 'Gender', 'Race/Ethnicity')"
                },

                # Generic search parameters
                "dataset_name": {
                    "type": "string",
                    "description": "For search_dataset/get_available_measures: Dataset identifier (e.g., 'places_county_2024', 'brfss_diabetes')"
                },
                "select_fields": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "For search_dataset: List of field names to return"
                },
                "where_clause": {
                    "type": "string",
                    "description": "For search_dataset: SoQL WHERE clause (e.g., \"stateabbr='CA' AND year>2020\")"
                },
                "order_by": {
                    "type": "string",
                    "description": "For search_dataset: Field to order results by"
                },

                # Pagination parameters
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of results to return (default: 100, max: 50000)",
                    "default": 100,
                    "minimum": 1,
                    "maximum": 50000
                },
                "offset": {
                    "type": "integer",
                    "description": "Starting record number for pagination (default: 0)",
                    "default": 0,
                    "minimum": 0
                }
            },
            "required": ["method"]
        }
    )
]

# Initialize MCP server
app = Server("cdc-mcp-server")


@app.list_tools()
async def list_tools(request: ListToolsRequest) -> list[Tool]:
    """List available CDC data tools."""
    return TOOL_DEFINITIONS


@app.call_tool()
async def call_tool(request: CallToolRequest) -> list[TextContent]:
    """Handle CDC data tool calls."""
    try:
        method = request.params.get("method")
        logger.info(f"CDC MCP: Calling method {method}")

        if method == "list_datasets":
            result = {
                "available_datasets": list(cdc_client.DATASETS.keys()),
                "dataset_descriptions": {
                    "places_county_2024": "PLACES: County-level disease prevalence (2024)",
                    "places_county_2023": "PLACES: County-level disease prevalence (2023)",
                    "places_place_2024": "PLACES: City/town-level disease prevalence (2024)",
                    "places_tract_2024": "PLACES: Census tract-level disease prevalence (2024)",
                    "places_zcta_2024": "PLACES: ZIP code-level disease prevalence (2024)",
                    "brfss_obesity_national": "BRFSS: National obesity prevalence trends",
                    "brfss_obesity_state": "BRFSS: State-level obesity prevalence",
                    "brfss_diabetes": "BRFSS: Diabetes prevalence data",
                    "brfss_asthma": "BRFSS: Asthma prevalence data",
                    "brfss_asthma_prevalence": "BRFSS: Current asthma prevalence (2011+)",
                    "brfss_tobacco_use": "BRFSS: Tobacco use prevalence trends (1995-2010)",
                    # Note: Some BRFSS datasets require authentication
                    # "brfss_chronic_health_indicators": "BRFSS: Chronic health indicators (requires auth)",
                    # "brfss_demographics": "BRFSS: Demographic breakdowns (requires auth)",
                    # "brfss_cvd_surveillance": "BRFSS: CVD surveillance (requires auth)",
                    # "chronic_disease_indicators": "U.S. Chronic Disease Indicators (requires auth)",
                    "nutrition_obesity": "Nutrition, Physical Activity, and Obesity - Behavioral",
                    "nutrition_policy_environmental": "Nutrition, Physical Activity - Policy/Environmental",
                    "nutrition_commute_patterns": "Nutrition, Physical Activity - Commuting Patterns",
                    "heart_disease_mortality": "Heart Disease Mortality by State",
                    "diabetes_indicators": "Diabetes Surveillance System indicators",
                    "covid_cases": "COVID-19 Case Surveillance (if available)",
                    "cancer_incidence": "Cancer incidence statistics",
                    "vsrr_quarterly_mortality": "VSRR: Quarterly provisional mortality estimates",
                    "vsrr_maternal_mortality": "VSRR: Provisional maternal death counts",
                    "vsrr_infant_mortality": "VSRR: Quarterly provisional infant mortality estimates",
                    "nchs_death_rates_life_expectancy": "NCHS: Death rates and life expectancy at birth (since 1900)",
                    # "nats_adult_tobacco": "NATS: National Adult Tobacco Survey (requires auth)",
                    "adult_tobacco_consumption": "Adult tobacco consumption in the U.S. (2000+)"
                },
                "total_datasets": len(cdc_client.DATASETS)
            }

        elif method == "get_places_data":
            result = cdc_client.get_places_data(
                geography_level=request.params.get("geography_level", "county"),
                year=request.params.get("year", "2024"),
                state=request.params.get("state"),
                measure_id=request.params.get("measure_id"),
                location=request.params.get("location"),
                limit=request.params.get("limit", 100),
                offset=request.params.get("offset", 0)
            )

        elif method == "get_brfss_data":
            result = cdc_client.get_brfss_data(
                dataset_type=request.params.get("dataset_type", "obesity_national"),
                year=request.params.get("year"),
                state=request.params.get("state"),
                limit=request.params.get("limit", 100),
                offset=request.params.get("offset", 0)
            )

        elif method == "get_chronic_disease_indicators":
            result = cdc_client.get_chronic_disease_indicators(
                topic=request.params.get("topic"),
                question=request.params.get("question"),
                year_start=request.params.get("year_start"),
                year_end=request.params.get("year_end"),
                location=request.params.get("state") or request.params.get("location"),
                stratification=request.params.get("stratification"),
                limit=request.params.get("limit", 100),
                offset=request.params.get("offset", 0)
            )

        elif method == "search_dataset":
            if "dataset_name" not in request.params:
                raise ValueError("dataset_name is required for search_dataset")

            result = cdc_client.search_dataset(
                dataset_name=request.params["dataset_name"],
                select_fields=request.params.get("select_fields"),
                where_clause=request.params.get("where_clause"),
                order_by=request.params.get("order_by"),
                limit=request.params.get("limit", 100),
                offset=request.params.get("offset", 0)
            )

        elif method == "get_available_measures":
            if "dataset_name" not in request.params:
                raise ValueError("dataset_name is required for get_available_measures")

            result = cdc_client.get_available_measures(
                dataset_type=request.params["dataset_name"]
            )

        else:
            raise ValueError(f"Unknown method: {method}")

        # Format response
        response_text = json.dumps(result, indent=2)

        return [
            TextContent(
                type="text",
                text=response_text
            )
        ]

    except Exception as e:
        logger.error(f"Error executing CDC tool: {str(e)}")
        return [
            TextContent(
                type="text",
                text=json.dumps({
                    "error": str(e),
                    "method": request.params.get("method", "unknown")
                }, indent=2)
            )
        ]


def main():
    """Main entry point for CDC MCP server."""
    import sys
    from mcp.server.stdio import stdio_server

    logger.info("Starting CDC MCP Server...")

    async def run():
        async with stdio_server() as (read_stream, write_stream):
            await app.run(
                read_stream,
                write_stream,
                app.create_initialization_options()
            )

    asyncio.run(run())


if __name__ == "__main__":
    main()

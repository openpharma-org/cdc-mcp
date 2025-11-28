# CDC MCP Server

An MCP (Model Context Protocol) server providing access to CDC (Centers for Disease Control and Prevention) public health data through the Socrata Open Data API (SODA).

## Features

- **PLACES Data**: Local disease prevalence at county, place, census tract, and ZIP code levels
- **BRFSS Data**: Behavioral Risk Factor Surveillance System for chronic disease risk factors
- **Chronic Disease Indicators**: Comprehensive chronic disease surveillance data
- **Unified Interface**: Single tool with method parameter for all CDC data operations
- **Rate Limiting**: Built-in rate limiting to respect API quotas
- **Flexible Querying**: Support for filtering, pagination, and custom SoQL queries

## Available Data Sources

**Total Public Datasets: 18** (+ 6 require authentication)

### PLACES: Local Data for Better Health (5 datasets)
- County-level data (2023, 2024)
- Place/city-level data (2024)
- Census tract-level data (2024)
- ZIP Code Tabulation Area (ZCTA) data (2024)
- 36+ health measures including diabetes, obesity, heart disease, COPD, asthma, etc.

### BRFSS: Behavioral Risk Factor Surveillance System (4 datasets)
- National obesity trends
- State-level obesity prevalence
- Diabetes prevalence
- Asthma prevalence
- **Note:** Additional BRFSS datasets (demographics, CVD, chronic health indicators) require authentication

### VSRR: Vital Statistics Rapid Release (2 datasets)
- Quarterly provisional mortality estimates (15 leading causes + drug overdose, firearms, etc.)
- Provisional maternal death counts and rates

### Nutrition, Physical Activity & Obesity (3 datasets)
- Behavioral risk factors
- Policy and environmental supports
- Commuting patterns (American Community Survey)

### Other CDC Datasets (4 datasets)
- Heart Disease Mortality statistics
- Diabetes Surveillance System
- COVID-19 Case Surveillance (if available)
- Cancer incidence data

### Datasets Requiring Authentication
Some datasets require a Socrata app token:
- Chronic Disease Indicators
- BRFSS Demographics
- BRFSS CVD Surveillance
- BRFSS Chronic Health Indicators

**To access these:** Register at https://data.cdc.gov/profile/app_tokens

## Installation

```bash
cd cdc-mcp-server
pip install -e .
```

## Configuration

### Optional: Socrata App Token

For higher rate limits (1,000 requests/hour vs shared pool):

1. Register at https://data.cdc.gov/profile/app_tokens
2. Set environment variable:

```bash
export CDC_APP_TOKEN="your_app_token_here"
```

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "cdc": {
      "command": "python",
      "args": ["-m", "cdc_mcp.server"],
      "env": {
        "CDC_APP_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Direct Usage Examples

```python
from cdc_mcp.cdc_client import CDCAPIClient

# Initialize client
client = CDCAPIClient(app_token="your_token")  # app_token is optional

# Get diabetes prevalence in California counties
result = client.get_places_data(
    geography_level="county",
    year="2024",
    state="CA",
    measure_id="DIABETES",
    limit=100
)

# Get national obesity trends
result = client.get_brfss_data(
    dataset_type="obesity_national",
    year=2023
)

# Get chronic disease indicators for heart disease
result = client.get_chronic_disease_indicators(
    topic="Cardiovascular Disease",
    year_start=2020,
    year_end=2024,
    location="US"
)

# Generic search with custom SoQL query
result = client.search_dataset(
    dataset_name="places_county_2024",
    select_fields=["locationname", "measureid", "data_value"],
    where_clause="stateabbr='TX' AND data_value>15.0",
    limit=50
)
```

## MCP Tool Usage

### Method: `list_datasets`

List all available CDC datasets.

```json
{
  "method": "list_datasets"
}
```

**Returns**: Dictionary with available datasets and descriptions.

---

### Method: `get_places_data`

Get PLACES local disease prevalence data.

**Parameters**:
- `geography_level` (string): "county", "place", "tract", or "zcta" (default: "county")
- `year` (string): "2023" or "2024" (default: "2024")
- `state` (string, optional): State abbreviation (e.g., "CA", "TX")
- `measure_id` (string, optional): Disease measure (e.g., "DIABETES", "OBESITY", "CHD")
- `location` (string, optional): Specific location name
- `limit` (integer): Max results (default: 100, max: 50000)
- `offset` (integer): Starting record for pagination (default: 0)

**Examples**:

```json
{
  "method": "get_places_data",
  "geography_level": "county",
  "year": "2024",
  "state": "CA",
  "measure_id": "DIABETES",
  "limit": 50
}
```

```json
{
  "method": "get_places_data",
  "geography_level": "place",
  "year": "2024",
  "state": "TX",
  "measure_id": "OBESITY"
}
```

---

### Method: `get_brfss_data`

Get BRFSS behavioral risk factor data.

**Parameters**:
- `dataset_type` (string): "obesity_national", "obesity_state", "diabetes", or "asthma" (default: "obesity_national")
- `year` (integer, optional): Specific year
- `state` (string, optional): State abbreviation
- `limit` (integer): Max results (default: 100)
- `offset` (integer): Starting record (default: 0)

**Examples**:

```json
{
  "method": "get_brfss_data",
  "dataset_type": "diabetes",
  "year": 2023,
  "state": "NY"
}
```

```json
{
  "method": "get_brfss_data",
  "dataset_type": "obesity_national",
  "limit": 200
}
```

---

### Method: `get_chronic_disease_indicators`

Get chronic disease surveillance indicators.

**Parameters**:
- `topic` (string, optional): Topic area (e.g., "Diabetes", "Cardiovascular Disease")
- `question` (string, optional): Specific indicator (partial match)
- `year_start` (integer, optional): Start year
- `year_end` (integer, optional): End year
- `state` (string, optional): State abbreviation or "US"
- `stratification` (string, optional): "Overall", "Gender", "Race/Ethnicity"
- `limit` (integer): Max results (default: 100)
- `offset` (integer): Starting record (default: 0)

**Examples**:

```json
{
  "method": "get_chronic_disease_indicators",
  "topic": "Diabetes",
  "year_start": 2020,
  "year_end": 2024,
  "state": "US"
}
```

```json
{
  "method": "get_chronic_disease_indicators",
  "question": "mortality",
  "topic": "Cardiovascular Disease",
  "stratification": "Overall"
}
```

---

### Method: `search_dataset`

Generic search across any CDC dataset with custom SoQL queries.

**Parameters**:
- `dataset_name` (string, required): Dataset identifier
- `select_fields` (array, optional): Fields to return
- `where_clause` (string, optional): SoQL WHERE clause
- `order_by` (string, optional): Field to sort by
- `limit` (integer): Max results (default: 100)
- `offset` (integer): Starting record (default: 0)

**Examples**:

```json
{
  "method": "search_dataset",
  "dataset_name": "places_county_2024",
  "select_fields": ["locationname", "measureid", "data_value", "stateabbr"],
  "where_clause": "stateabbr='CA' AND measureid='DIABETES'",
  "order_by": "data_value DESC",
  "limit": 25
}
```

```json
{
  "method": "search_dataset",
  "dataset_name": "heart_disease_mortality",
  "where_clause": "year>=2020",
  "limit": 100
}
```

---

### Method: `get_available_measures`

List all available measures for a dataset.

**Parameters**:
- `dataset_name` (string, required): Dataset identifier

**Example**:

```json
{
  "method": "get_available_measures",
  "dataset_name": "places_county_2024"
}
```

## Common Disease Measure IDs

### PLACES Measures
- `DIABETES`: Diagnosed diabetes
- `OBESITY`: Adult obesity
- `CHD`: Coronary heart disease
- `COPD`: Chronic obstructive pulmonary disease
- `ASTHMA`: Current asthma
- `STROKE`: Stroke
- `BPHIGH`: High blood pressure
- `CHOLSCREEN`: Cholesterol screening
- `CANCER`: Cancer (excluding skin cancer)
- `KIDNEY`: Chronic kidney disease
- `ARTHRITIS`: Arthritis
- `DEPRESSION`: Depression
- `MHLTH`: Mental health not good
- `PHLTH`: Physical health not good

## Rate Limiting

The server implements conservative rate limiting (500ms between requests) to respect CDC API quotas:

- **Without app token**: Shared pool (may be throttled)
- **With app token**: 1,000 requests/hour

To increase limits, register for a free app token at https://data.cdc.gov/profile/app_tokens

## SoQL Query Language

CDC datasets support Socrata Query Language (SoQL) for flexible queries:

### Common Parameters
- `$select`: Choose specific fields
- `$where`: Filter conditions
- `$order`: Sort results
- `$limit`: Max results
- `$offset`: Pagination start

### Example SoQL Clauses

**Filtering**:
```
stateabbr='CA' AND data_value>15.0
year>=2020 AND year<=2024
measureid IN ('DIABETES', 'OBESITY', 'CHD')
```

**Sorting**:
```
data_value DESC
year ASC, data_value DESC
```

## Response Format

All methods return JSON with consistent structure:

```json
{
  "dataset": "places_county_2024",
  "count": 58,
  "data": [
    {
      "year": "2022",
      "stateabbr": "CA",
      "locationname": "Los Angeles County",
      "measureid": "DIABETES",
      "data_value": "11.2",
      "data_value_unit": "%",
      "low_confidence_limit": "10.8",
      "high_confidence_limit": "11.6"
    }
  ]
}
```

## Error Handling

The server handles common errors gracefully:

- **Rate limiting**: Returns clear message if rate limit exceeded
- **Invalid parameters**: Validates dataset names and parameters
- **Network errors**: Retries with exponential backoff
- **Data not found**: Returns empty result set

## Data Sources

All data comes from official CDC sources:
- https://data.cdc.gov
- https://chronicdata.cdc.gov

Data is provided by CDC and is in the public domain.

## Development

### Running Tests

```bash
python -m pytest tests/
```

### Building Package

```bash
python -m build
```

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Please submit issues and pull requests.

## Support

For CDC data questions: https://www.cdc.gov/about/data-policy/
For MCP server issues: https://github.com/uh-joan/cdc-mcp-server/issues

## Acknowledgments

- CDC for providing open data through Socrata
- Anthropic for the Model Context Protocol specification
